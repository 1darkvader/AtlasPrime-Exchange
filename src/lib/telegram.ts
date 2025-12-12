const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

interface TelegramNotification {
  userId: string;
  userName: string;
  userEmail: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  asset: string;
  transactionId: string;
}

export const telegramService = {
  /**
   * Send deposit notification to admin
   */
  async sendDepositNotification(data: TelegramNotification): Promise<boolean> {
    try {
      const message = `
🔔 *NEW DEPOSIT REQUEST*

👤 *User Info:*
• ID: \`${data.userId}\`
• Name: ${data.userName}
• Email: ${data.userEmail}

💰 *Transaction Details:*
• Amount: *${data.amount} ${data.asset}*
• Type: Deposit
• Transaction ID: \`${data.transactionId}\`

⏰ Time: ${new Date().toLocaleString()}

✅ Please review and approve in the admin panel.
      `.trim();

      return await this.sendMessage(message);
    } catch (error) {
      console.error('Failed to send Telegram deposit notification:', error);
      return false;
    }
  },

  /**
   * Send withdrawal notification to admin
   */
  async sendWithdrawalNotification(data: TelegramNotification): Promise<boolean> {
    try {
      const message = `
🔔 *NEW WITHDRAWAL REQUEST*

👤 *User Info:*
• ID: \`${data.userId}\`
• Name: ${data.userName}
• Email: ${data.userEmail}

💸 *Transaction Details:*
• Amount: *${data.amount} ${data.asset}*
• Type: Withdrawal
• Transaction ID: \`${data.transactionId}\`

⏰ Time: ${new Date().toLocaleString()}

⚠️ Please review and approve in the admin panel.
      `.trim();

      return await this.sendMessage(message);
    } catch (error) {
      console.error('Failed to send Telegram withdrawal notification:', error);
      return false;
    }
  },

  /**
   * Send approval notification to user (optional)
   */
  async sendApprovalNotification(chatId: string, data: TelegramNotification): Promise<boolean> {
    try {
      const message = `
✅ *TRANSACTION APPROVED*

💰 Your ${data.type} request of *${data.amount} ${data.asset}* has been approved.

Transaction ID: \`${data.transactionId}\`

Thank you for using AtlasPrime Exchange!
      `.trim();

      return await this.sendMessage(message, chatId);
    } catch (error) {
      console.error('Failed to send Telegram approval notification:', error);
      return false;
    }
  },

  /**
   * Core method to send Telegram message
   */
  async sendMessage(text: string, chatId: string = TELEGRAM_CHAT_ID || ''): Promise<boolean> {
    if (!TELEGRAM_BOT_TOKEN || !chatId) {
      console.warn('Telegram bot token or chat ID not configured. Please set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID environment variables.');
      return false;
    }

    try {
      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'Markdown',
        }),
      });

      const data = await response.json();

      if (!data.ok) {
        console.error('Telegram API error:', data);
        return false;
      }

      console.log('✅ Telegram notification sent successfully');
      return true;
    } catch (error) {
      console.error('Failed to send Telegram message:', error);
      return false;
    }
  },

  /**
   * Test Telegram bot connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const message = '🧪 *Test Message*\n\nAtlasPrime Telegram Bot is connected successfully!';
      return await this.sendMessage(message);
    } catch (error) {
      console.error('Telegram connection test failed:', error);
      return false;
    }
  },
};
