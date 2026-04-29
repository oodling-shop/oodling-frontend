import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { NotificationType } from '@/lib/notifications/types';
import { dispatchNotification } from '@/lib/notifications/dispatcher';

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;

async function verifyWebhook(request: Request) {
  const hmac = request.headers.get('x-shopify-hmac-sha256');
  const body = await request.text();

  if (!hmac || !SHOPIFY_WEBHOOK_SECRET) return { verified: false, body };

  const hash = crypto
    .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
    .update(body, 'utf8')
    .digest('base64');

  return { verified: hash === hmac, body };
}

export async function POST(request: Request) {
  const { verified, body } = await verifyWebhook(request);

  if (!verified) {
    console.error('Webhook verification failed');
    return new NextResponse('Invalid signature', { status: 401 });
  }

  const topic = request.headers.get('x-shopify-topic');
  const payload = JSON.parse(body);

  console.log(`Received webhook topic: ${topic}`);

  try {
    /**
     * NOTE: For standard events like 'orders/create' or 'orders/fulfilled', 
     * Shopify already sends the native notifications (Order Confirmation, 
     * Shipping Confirmation) automatically.
     * 
     * We only use webhooks here if we need to perform additional actions 
     * (e.g., syncing external databases, custom analytics, or triggering 
     * non-native notifications).
     */
    switch (topic) {
      case 'orders/create':
        console.log(`Order ${payload.order_number} created. Shopify is sending the confirmation email.`);
        break;

      case 'orders/fulfilled':
        console.log(`Order ${payload.order_number} fulfilled. Shopify is sending the shipping notification.`);
        break;

      case 'customers/create':
        console.log(`Customer ${payload.email} created. Shopify handles welcome/invite if configured.`);
        break;

      // Add more cases for other topics
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error(`Error processing webhook ${topic}:`, error);
    return new NextResponse('Error', { status: 500 });
  }
}
