import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { shopifyAdminFetch } from '@/lib/shopify/admin-client';

const reviewSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  title: z.string().min(1, 'Title is required'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  body: z.string().min(1, 'Review body is required'),
});

interface Review {
  id: string;
  productId: string;
  rating: number;
  title: string;
  name: string;
  email: string;
  body: string;
  createdAt: string;
}

const GET_REVIEWS_QUERY = `
  query GetProductReviews($productId: ID!) {
    product(id: $productId) {
      metafield(namespace: "custom", key: "reviews") {
        id
        value
      }
    }
  }
`;

const SET_REVIEWS_MUTATION = `
  mutation SetProductReviews($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function getReviews(productId: string): Promise<Review[]> {
  const data = await shopifyAdminFetch<{
    product: { metafield: { id: string; value: string } | null } | null;
  }>({
    query: GET_REVIEWS_QUERY,
    variables: { productId },
  });

  const raw = data?.product?.metafield?.value;
  if (!raw) return [];

  try {
    return JSON.parse(raw) as Review[];
  } catch {
    return [];
  }
}

async function saveReviews(productId: string, reviews: Review[]): Promise<void> {
  await shopifyAdminFetch({
    query: SET_REVIEWS_MUTATION,
    variables: {
      metafields: [
        {
          ownerId: productId,
          namespace: 'custom',
          key: 'reviews',
          type: 'json',
          value: JSON.stringify(reviews),
        },
      ],
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = reviewSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    const { productId, rating, title, name, email, body: reviewBody } = result.data;

    const existing = await getReviews(productId);

    const review: Review = {
      id: crypto.randomUUID(),
      productId,
      rating,
      title,
      name,
      email,
      body: reviewBody,
      createdAt: new Date().toISOString(),
    };

    await saveReviews(productId, [...existing, review]);

    return NextResponse.json(
      { success: true, message: 'Review submitted successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'productId is required' },
        { status: 400 }
      );
    }

    const reviews = await getReviews(productId);

    return NextResponse.json(
      { success: true, data: reviews },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
