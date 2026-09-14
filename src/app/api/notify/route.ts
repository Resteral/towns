import { NextResponse } from 'next/server';
import { sendOrderPhoneNotification } from '@/lib/notifier';
import { DeliveryOrder, NotificationSettings } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { order, settings } = body as { order: DeliveryOrder; settings: NotificationSettings };

    if (!order) {
      return NextResponse.json({ error: 'Missing order details' }, { status: 400 });
    }

    const defaultSettings: NotificationSettings = settings || {
      phoneNumber: '(603) 555-0199',
      enableSms: true,
      enableTelegram: false,
      enableDiscord: false,
      enableSoundChime: true,
    };

    const result = await sendOrderPhoneNotification(order, defaultSettings);

    return NextResponse.json({
      success: true,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Notification API route error:', error);
    return NextResponse.json({ error: error.message || 'Notification relay failed' }, { status: 500 });
  }
}
