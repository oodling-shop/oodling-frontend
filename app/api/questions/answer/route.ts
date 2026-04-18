import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getQuestions, saveQuestions, Answer } from '../route';

const answerSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  questionId: z.string().min(1, 'Question ID is required'),
  body: z.string().min(1, 'Answer is required'),
  by: z.string().min(1, 'Answerer name is required'),
});

// POST /api/questions/answer
// Protected by SHOPIFY_ADMIN_ACCESS_TOKEN used as bearer token.
// Example: Authorization: Bearer <SHOPIFY_ADMIN_ACCESS_TOKEN>
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization') ?? '';
  const token = authHeader.replace('Bearer ', '');
  if (!token || token !== process.env.SHOPIFY_ADMIN_ACCESS_TOKEN) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = answerSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    const { productId, questionId, body: answerBody, by } = result.data;

    const questions = await getQuestions(productId);
    const questionIndex = questions.findIndex((q) => q.id === questionId);

    if (questionIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Question not found' },
        { status: 404 }
      );
    }

    const answer: Answer = {
      id: crypto.randomUUID(),
      body: answerBody,
      by,
      createdAt: new Date().toISOString(),
    };

    questions[questionIndex].answers.push(answer);
    await saveQuestions(productId, questions);

    return NextResponse.json({ success: true, data: answer }, { status: 201 });
  } catch (error) {
    console.error('Error adding answer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add answer' },
      { status: 500 }
    );
  }
}
