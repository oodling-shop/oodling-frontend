import { NextResponse } from 'next/server';
import { getCustomerPreferences, updateCustomerPreferences } from '@/lib/notifications/preferences';
import { NotificationType } from '@/lib/notifications/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return new NextResponse('Invalid token', { status: 400 });
  }

  try {
    // Decode token (In a real app, verify signature)
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    const { customerId } = decoded;

    if (!customerId) {
      return new NextResponse('Invalid token data', { status: 400 });
    }

    // Unsubscribe from all notifications (or a specific one if provided in token)
    const preferences = await getCustomerPreferences(customerId);
    const updatedPreferences = {
      preferences: preferences.preferences.map((p) => ({
        ...p,
        enabled: false,
      })),
    };

    const success = await updateCustomerPreferences(customerId, updatedPreferences);

    if (success) {
      return new NextResponse(`
        <html>
          <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #f9fafb;">
            <div style="text-align: center; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <h1 style="color: #111827;">Unsubscribed Successfully</h1>
              <p style="color: #6b7280;">You have been unsubscribed from all marketing and transactional notifications.</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/my-account/notifications" style="display: inline-block; margin-top: 20px; color: #111827; text-decoration: underline;">Manage preferences</a>
            </div>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' },
      });
    } else {
      return new NextResponse('Failed to unsubscribe', { status: 500 });
    }
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return new NextResponse('Error processing request', { status: 500 });
  }
}
