import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || '').trim();
    const phone = String(body.phone || '').trim();
    const pickupStore = String(body.pickupStore || '').trim();
    const dropoffAddress = String(body.dropoffAddress || '').trim();
    const message = String(body.message || '').trim();
    const customTopic = String(body.ntfyTopic || '').trim();

    if (!name || !phone || !message) {
      return NextResponse.json(
        { success: false, error: 'Please enter your name, phone number, and message.' },
        { status: 400 }
      );
    }

    const ntfyTopic = customTopic || process.env.NTFY_TOPIC || 'townraise-sean-0305';
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const mapLink = dropoffAddress
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dropoffAddress)}`
      : '';

    const pushBody = [
      `From: ${name}`,
      `Phone: ${phone}`,
      pickupStore ? `Pickup: ${pickupStore}` : '',
      dropoffAddress ? `Dropoff: ${dropoffAddress}` : '',
      `Message: ${message}`,
    ]
      .filter(Boolean)
      .join('\n');

    const channels: string[] = [];

    // 1. Instant Phone Push Notification via ntfy (iOS & Android)
    try {
      const headers: Record<string, string> = {
        Title: `Delivery Message from ${name}`,
        Priority: 'high',
        Tags: 'truck,incoming_envelope',
      };
      if (mapLink) {
        headers['Click'] = mapLink;
      } else if (cleanPhone) {
        headers['Click'] = `tel:${cleanPhone}`;
      }

      const ntfyRes = await fetch(`https://ntfy.sh/${encodeURIComponent(ntfyTopic)}`, {
        method: 'POST',
        headers,
        body: pushBody,
      });

      if (ntfyRes.ok) {
        channels.push(`ntfy:${ntfyTopic}`);
      }
    } catch (err) {
      console.error('ntfy delivery message push failed:', err);
    }

    // 2. Optional Discord Webhook Backup (if configured in Vercel)
    if (process.env.DISCORD_WEBHOOK_URL) {
      try {
        const discordRes = await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `🚚 **NEW DELIVERY MESSAGE FROM ${name}**\n📞 **Phone:** ${phone}${
              pickupStore ? `\n🏪 **Pickup:** ${pickupStore}` : ''
            }${dropoffAddress ? `\n📍 **Dropoff:** ${dropoffAddress}` : ''}\n💬 **Message:** ${message}`,
          }),
        });
        if (discordRes.ok) channels.push('discord');
      } catch (err) {
        console.error('Discord backup relay failed:', err);
      }
    }

    return NextResponse.json({
      success: true,
      channels,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to send delivery message';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
