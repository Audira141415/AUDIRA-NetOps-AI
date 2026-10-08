// Telegram & Discord Human-in-the-Loop Bot Approval Gate Service
// Formats and dispatches interactive approval requests with 2-way callbacks

import { RiskLevel } from '@audira/types';

export interface BotApprovalRequest {
  requestId: string;
  deviceId: string;
  deviceName: string;
  vendor: string;
  riskLevel: RiskLevel;
  proposedCommands: string[];
  reason: string;
  operatorTarget?: string;
  createdAt: string;
}

export interface BotDispatchResult {
  channel: 'telegram' | 'discord';
  success: boolean;
  messageId?: string | number;
  error?: string;
  timestamp: string;
}

export class BotApprovalService {
  /**
   * Formats message payload for Telegram Bot API with Inline Keyboard buttons
   */
  public static formatTelegramPayload(req: BotApprovalRequest) {
    const riskEmoji = req.riskLevel === 'CRITICAL' ? '🚨' : '⚠️';
    const commandsFormatted = req.proposedCommands.map((c) => `  ❯ ${c}`).join('\n');

    const text = `
${riskEmoji} *AUDIRA NetOps AI — Human-in-the-Loop Gate*

📌 *Request ID:* \`${req.requestId}\`
📡 *Device:* \`${req.deviceName}\` (${req.vendor})
🛡️ *Risk Level:* *${req.riskLevel}*
📝 *Reason:* ${req.reason}

📋 *Proposed Commands:*
\`\`\`
${commandsFormatted}
\`\`\`

Silakan klik tombol di bawah untuk menyetujui atau menolak perubahan:
    `.trim();

    const reply_markup = {
      inline_keyboard: [
        [
          { text: '✅ Setujui & Terapkan', callback_data: `approve:${req.requestId}` },
          { text: '❌ Tolak Perubahan', callback_data: `reject:${req.requestId}` },
        ],
      ],
    };

    return { text, reply_markup, parse_mode: 'Markdown' };
  }

  /**
   * Formats Discord Webhook Rich Embed with Action Buttons
   */
  public static formatDiscordPayload(req: BotApprovalRequest) {
    const color = req.riskLevel === 'CRITICAL' ? 0xf43f5e : 0xf59e0b; // Rose or Amber
    const commandsFormatted = req.proposedCommands.map((c) => `> ${c}`).join('\n');

    return {
      username: 'AUDIRA NetOps AI Copilot',
      avatar_url: 'https://cdn-icons-png.flaticon.com/512/2092/2092663.png',
      embeds: [
        {
          title: `🛡️ Human-in-the-Loop Sign-off Required [${req.riskLevel}]`,
          description: `AI Copilot telah mengusulkan perubahan konfigurasi yang memerlukan persetujuan operator.`,
          color,
          fields: [
            { name: 'Request ID', value: `\`${req.requestId}\``, inline: true },
            { name: 'Target Device', value: `\`${req.deviceName}\` (${req.vendor})`, inline: true },
            { name: 'Risk Assessment', value: `**${req.riskLevel}**`, inline: true },
            { name: 'Justification / Reason', value: req.reason },
            {
              name: 'Proposed Commands',
              value: `\`\`\`bash\n${commandsFormatted}\n\`\`\``,
            },
          ],
          footer: {
            text: `AUDIRA NetOps AI • ${new Date().toLocaleTimeString()} WIB`,
          },
        },
      ],
      components: [
        {
          type: 1, // Action Row
          components: [
            {
              type: 2, // Button
              style: 3, // Success (Green)
              label: '✅ Approve & Execute',
              custom_id: `approve:${req.requestId}`,
            },
            {
              type: 2,
              style: 4, // Danger (Red)
              label: '❌ Reject Change',
              custom_id: `reject:${req.requestId}`,
            },
          ],
        },
      ],
    };
  }

  /**
   * Dispatches approval notification to Telegram Bot API
   */
  public static async dispatchTelegram(
    botToken: string,
    chatId: string,
    req: BotApprovalRequest
  ): Promise<BotDispatchResult> {
    const payload = this.formatTelegramPayload(req);

    // If mock or offline token, simulate successful delivery
    if (!botToken || botToken.includes('AAHq_m9vK28') || !chatId) {
      return {
        channel: 'telegram',
        success: true,
        messageId: `mock-tg-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
    }

    try {
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          ...payload,
        }),
      });

      const data = await res.json();
      return {
        channel: 'telegram',
        success: res.ok,
        messageId: data.result?.message_id,
        error: !res.ok ? data.description : undefined,
        timestamp: new Date().toISOString(),
      };
    } catch (err: unknown) {
      return {
        channel: 'telegram',
        success: false,
        error: err instanceof Error ? err.message : String(err),
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Dispatches approval notification to Discord Webhook
   */
  public static async dispatchDiscord(
    webhookUrl: string,
    req: BotApprovalRequest
  ): Promise<BotDispatchResult> {
    const payload = this.formatDiscordPayload(req);

    // If mock or placeholder webhook URL, simulate successful delivery
    if (!webhookUrl || webhookUrl.includes('xxxxxxxx')) {
      return {
        channel: 'discord',
        success: true,
        messageId: `mock-dsc-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
    }

    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      return {
        channel: 'discord',
        success: res.ok,
        timestamp: new Date().toISOString(),
      };
    } catch (err: unknown) {
      return {
        channel: 'discord',
        success: false,
        error: err instanceof Error ? err.message : String(err),
        timestamp: new Date().toISOString(),
      };
    }
  }
}
