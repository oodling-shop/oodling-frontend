import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { shopifyAdminFetch } from '@/lib/shopify/admin-client';

const questionSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  question: z.string().min(1, 'Question is required'),
});

export interface Answer {
  id: string;
  body: string;
  by: string;
  createdAt: string;
}

export interface Question {
  id: string;
  productId: string;
  question: string;
  name: string;
  email: string;
  createdAt: string;
  answers: Answer[];
}

const GET_QUESTIONS_QUERY = `
  query GetProductQuestions($productId: ID!) {
    product(id: $productId) {
      metafield(namespace: "custom", key: "questions") {
        id
        value
      }
    }
  }
`;

const SET_QUESTIONS_MUTATION = `
  mutation SetProductQuestions($metafields: [MetafieldsSetInput!]!) {
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

export async function getQuestions(productId: string): Promise<Question[]> {
  const data = await shopifyAdminFetch<{
    product: { metafield: { id: string; value: string } | null } | null;
  }>({
    query: GET_QUESTIONS_QUERY,
    variables: { productId },
  });

  const raw = data?.product?.metafield?.value;
  if (!raw) return [];

  try {
    return JSON.parse(raw) as Question[];
  } catch {
    return [];
  }
}

export async function saveQuestions(productId: string, questions: Question[]): Promise<void> {
  await shopifyAdminFetch({
    query: SET_QUESTIONS_MUTATION,
    variables: {
      metafields: [
        {
          ownerId: productId,
          namespace: 'custom',
          key: 'questions',
          type: 'json',
          value: JSON.stringify(questions),
        },
      ],
    },
  });
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

    const questions = await getQuestions(productId);

    return NextResponse.json({ success: true, data: questions }, { status: 200 });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = questionSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    const { productId, name, email, question } = result.data;

    const existing = await getQuestions(productId);

    const newQuestion: Question = {
      id: crypto.randomUUID(),
      productId,
      question,
      name,
      email,
      createdAt: new Date().toISOString(),
      answers: [],
    };

    await saveQuestions(productId, [...existing, newQuestion]);

    return NextResponse.json(
      { success: true, message: 'Question submitted successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit question' },
      { status: 500 }
    );
  }
}
