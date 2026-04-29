import { NextResponse } from 'next/server';
import { z } from 'zod';
import { dispatchNotification } from '@/lib/notifications/dispatcher';
import { NotificationType } from '@/lib/notifications/types';

const contactSchema = z.object({
  customerId: z.string().optional(), // If logged in
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    const { customerId, firstName, lastName, email, message } = result.data;

    if (customerId) {
      // Use Shopify Messaging for logged-in customers
      await dispatchNotification(
        NotificationType.CONTACT_CUSTOMER,
        customerId,
        email,
        {
          subject: `New contact message from ${firstName} ${lastName}`,
          body: message,
        }
      );
    } else {
      /**
       * For guests, Shopify Messaging isn't available via Admin API without a Customer ID.
       * You might want to create a guest customer record or use a different service.
       * For now, we'll log it or assume guest contact is handled differently.
       */
      console.log(`Guest contact message from ${email}: ${message}`);
    }

    return NextResponse.json(
      { success: true, message: 'Message processed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

