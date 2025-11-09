# 📱 Telegram Sales Notification Setup Guide

Get instant push notifications on your phone every time you make a sale! 🚀💰

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Your Telegram Bot

1. Open Telegram app
2. Search for **@BotFather** (the official bot creation bot)
3. Send `/newbot` command
4. Follow the instructions:
   - Choose a name for your bot (e.g., "My Sales Notifier")
   - Choose a username (must end in 'bot', e.g., "mysales_notify_bot")
5. **SAVE THE BOT TOKEN** - It looks like this:
   ```
   123456789:ABCdefGHIjklMNOpqrsTUVwxyz-1234567890
   ```

### Step 2: Get Your Chat ID

1. Search for **@userinfobot** on Telegram
2. Send any message to it (like "hello")
3. It will reply with your Chat ID
4. **SAVE YOUR CHAT ID** - It looks like this:
   ```
   123456789
   ```

### Step 3: Configure the Dashboard

1. Open your Sales Dashboard at `http://localhost:3000/sales-dashboard`
2. Login with your credentials
3. Click the **🔔 Alerts** button in the top right
4. Enable **Telegram notifications**
5. Paste your **Bot Token** and **Chat ID**
6. Click **💾 Save Telegram Settings**

### Step 4: Add Environment Variables (For Production)

Add these to your `.env.local` file:

```bash
# Telegram Notifications
TELEGRAM_NOTIFICATIONS_ENABLED=true
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### Step 5: Deploy & Test!

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Make a test sale through Stripe

3. You should receive a Telegram message like this:
   ```
   🎉 NEW SALE! 🎉

   💰 Amount: $37.00
   👤 Customer: John Doe
   📧 Email: john@example.com
   🆔 Session ID: cs_test_...

   Keep crushing it! 🚀
   ```

## 📝 Additional Setup for Production (Vercel)

If you're deploying to Vercel:

```bash
# Add environment variables to Vercel
vercel env add TELEGRAM_NOTIFICATIONS_ENABLED
# Enter: true

vercel env add TELEGRAM_BOT_TOKEN
# Paste your bot token

vercel env add TELEGRAM_CHAT_ID
# Paste your chat ID

vercel env add NEXT_PUBLIC_BASE_URL
# Enter your production URL (e.g., https://aifastscale.vercel.app)
```

Then redeploy:
```bash
vercel --prod
```

## 🔧 Troubleshooting

### Not receiving notifications?

1. **Check bot token**: Make sure you copied the FULL token from BotFather
2. **Check chat ID**: It should be a number (e.g., 123456789), not a username
3. **Start your bot**: Send `/start` to your bot on Telegram
4. **Check environment variables**: Make sure they're set correctly
5. **Check webhook**: Your Stripe webhook should be configured and working

### How to test without a real sale?

You can test the Telegram API directly:

```bash
curl -X POST http://localhost:3000/api/send-telegram \
  -H "Content-Type: application/json" \
  -d '{
    "botToken": "YOUR_BOT_TOKEN",
    "chatId": "YOUR_CHAT_ID",
    "message": "🎉 Test notification! This is working! 🚀"
  }'
```

## 💡 Pro Tips

1. **Pin important messages**: Long-press the notification in Telegram and select "Pin"
2. **Mute during sleep**: Set "Mute for..." on your bot chat if you don't want night notifications
3. **Multiple devices**: Telegram syncs across all your devices - phone, desktop, web!
4. **Customize the message**: Edit the message format in `app/api/stripe-webhook/route.ts`

## 🎯 What's Next?

You can customize the notification message by editing:
`/app/api/stripe-webhook/route.ts` (lines 47-56)

Example customizations:
- Add product name
- Add customer country
- Add revenue for the day
- Add celebration emojis based on amount 🎉

---

**Need help?** Check the Telegram Bot API docs: https://core.telegram.org/bots/api
