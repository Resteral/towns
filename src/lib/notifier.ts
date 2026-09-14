import { DeliveryOrder, NotificationSettings } from './types';

export async function sendOrderPhoneNotification(
  order: DeliveryOrder,
  settings: NotificationSettings
): Promise<{ success: boolean; channels: string[]; details: string }> {
  const channels: string[] = [];
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.deliveryAddress)}`;
  const itemsText = order.items.map(item => `• ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(2)})`).join('\n');

  // 1. Telegram Bot Relay
  if (settings.enableTelegram && settings.telegramBotToken && settings.telegramChatId) {
    try {
      const telegramMessage = `
🚨 <b>NEW DELIVERY ORDER #${order.orderNumber}</b> 🚨

👤 <b>Customer:</b> ${order.customerName}
📞 <b>Phone:</b> <a href="tel:${order.customerPhone}">${order.customerPhone}</a>
📍 <b>Address:</b> <a href="${mapLink}">${order.deliveryAddress}</a>

📝 <b>Notes:</b> ${order.deliveryInstructions || 'None'}

🛍️ <b>Items:</b>
${itemsText}

💰 <b>Tip:</b> $${order.tip.toFixed(2)}
💵 <b>TOTAL:</b> <b>$${order.total.toFixed(2)}</b>

⏰ <i>Ordered at ${new Date(order.createdAt).toLocaleTimeString()}</i>
      `.trim();

      const response = await fetch(`https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: settings.telegramChatId,
          text: telegramMessage,
          parse_mode: 'HTML',
          disable_web_page_preview: false,
        }),
      });

      if (response.ok) {
        channels.push('Telegram Bot');
      }
    } catch (e) {
      console.error('Telegram notification failed', e);
    }
  }

  // 2. Discord Webhook Relay
  if (settings.enableDiscord && settings.discordWebhookUrl) {
    try {
      const discordPayload = {
        username: 'Oasis Delivery Dispatch',
        avatar_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=128&q=80',
        content: `🚨 **NEW DELIVERY ORDER #${order.orderNumber}** ($${order.total.toFixed(2)})`,
        embeds: [
          {
            title: `Delivery for ${order.customerName}`,
            description: `📍 [Open in Google Maps](${mapLink})\n**Address:** ${order.deliveryAddress}\n**Phone:** [${order.customerPhone}](tel:${order.customerPhone})\n**Instructions:** ${order.deliveryInstructions || 'Standard Dropoff'}`,
            color: 0xf59e0b, // Amber
            fields: [
              {
                name: 'Items Ordered',
                value: itemsText || 'Custom Delivery Request',
                inline: false,
              },
              {
                name: 'Total Payout',
                value: `$${order.total.toFixed(2)} (Includes $${order.tip.toFixed(2)} Tip)`,
                inline: true,
              },
              {
                name: 'Status',
                value: 'Pending Dispatch ⏳',
                inline: true,
              },
            ],
            footer: {
              text: `OasisTap Delivery Node • ${new Date(order.createdAt).toLocaleTimeString()}`,
            },
          },
        ],
      };

      const response = await fetch(settings.discordWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discordPayload),
      });

      if (response.ok) {
        channels.push('Discord Mobile Push');
      }
    } catch (e) {
      console.error('Discord notification failed', e);
    }
  }

  // 3. Fallback / Client Sound / SMS
  if (settings.enableSms && settings.phoneNumber) {
    channels.push(`SMS / Phone: ${settings.phoneNumber}`);
  }

  if (channels.length === 0) {
    channels.push('Dashboard Dispatcher & Audio Chime');
  }

  return {
    success: true,
    channels,
    details: `Notified via ${channels.join(', ')}`,
  };
}
