import TelegramBot from 'node-telegram-bot-api';
import { config } from '../config';

export class TelegramService {
  private bot: TelegramBot | null = null;
  private chatId: string;

  constructor() {
    this.chatId = config.telegram.chatId;
    if (config.telegram.botToken) {
      this.bot = new TelegramBot(config.telegram.botToken, { polling: false });
    } else {
      console.warn('TELEGRAM_BOT_TOKEN is not set. Telegram notifications will be disabled.');
    }
  }

  async sendFulfillmentTask(orderId: string, amount: number, packId: string, userId: string, zoneId: string) {
    if (!this.bot || !this.chatId) {
      console.warn('Telegram bot not configured. Cannot send fulfillment task.', { orderId });
      return false;
    }

    const message = `
🚨 *NEW RECHARGE ORDER* 🚨

*Order ID*: \`${orderId}\`
*User ID*: \`${userId}\`
*Zone ID*: \`${zoneId}\`
*Pack ID*: ${packId}
*Customer Paid*: ₹${amount}

⚠️ *ACTION REQUIRED*:
1. Open GameGems on your phone.
2. Enter the User details.
3. Complete the purchase manually.

[Open GameGems MLBB](https://gamegems.store/pages/mlbb.php)
`;

    try {
      await this.bot.sendMessage(this.chatId, message, { parse_mode: 'Markdown' });
      return true;
    } catch (err) {
      console.error('Failed to send Telegram message:', err);
      return false;
    }
  }
}

export const telegramService = new TelegramService();
