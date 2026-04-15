import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const reviewSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  title: z.string().min(1, 'Title is required'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  body: z.string().min(1, 'Review body is required'),
});

// TODO: Replace with persistent storage (Shopify Metafields via Admin API,
// or external DB like Supabase/Neon). In-memory storage is lost on server restart.
const reviewsStore = new Map<string, Array<Record<string, unknown>>>();

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

    const review = {
      id: crypto.randomUUID(),
      productId,
      rating,
      title,
      name,
      email,
      body: reviewBody,
      createdAt: new Date().toISOString(),
      approved: false, // requires moderation before showing publicly
    };

    // Store in-memory (lost on restart — replace with persistent storage)
    const existing = reviewsStore.get(productId) ?? [];
    reviewsStore.set(productId, [...existing, review]);

    return NextResponse.json(
      { success: true, message: 'Review submitted successfully, pending moderation' },
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

    const reviews = reviewsStore.get(productId)?.filter((r) => (r as { approved: boolean }).approved) ?? [];

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
