# 📱 PWA Push Notifications Setup Guide

Get push notifications on your phone when you make a sale - even when the dashboard is closed!

---

## 🎯 What You'll Get

- 📱 **Native mobile notifications** - Just like apps
- 🔔 **Instant sale alerts** - Real-time when sales happen
- 📲 **Works offline** - No need to keep browser open
- 🌐 **Cross-platform** - iOS, Android, Desktop

---

## 🚀 Setup (5 minutes)

### Step 1: Update Service Worker

Your service worker (`public/sw.js`) needs push notification support:

```javascript
// public/sw.js
self.addEventListener('push', function(event) {
  const data = event.data.json()

  const options = {
    body: data.body,
    icon: '/images/logo.png',
    badge: '/images/badge.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/sales-dashboard'
    },
    actions: [
      { action: 'view', title: 'View Dashboard' },
      { action: 'close', title: 'Close' }
    ]
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

self.addEventListener('notificationclick', function(event) {
  event.notification.close()

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    )
  }
})
```

### Step 2: Request Permission

Add to your dashboard (`app/sales-dashboard/page.tsx`):

```typescript
useEffect(() => {
  // Request notification permission on load
  if ('Notification' in window && 'serviceWorker' in navigator) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Push notifications enabled!')
        subscribeToP ushNotifications()
      }
    })
  }
}, [])

const subscribeToushNotifications = async () => {
  try {
    const registration = await navigator.serviceWorker.ready

    // Get VAPID public key (you'll generate this)
    const publicKey = 'YOUR_VAPID_PUBLIC_KEY'

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey)
    })

    // Send subscription to your backend
    await fetch('/api/push-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription)
    })

    console.log('Subscribed to push notifications!')
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error)
  }
}

// Helper function
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
```

### Step 3: Generate VAPID Keys

Install web-push library:

```bash
npm install web-push
```

Generate keys:

```bash
npx web-push generate-vapid-keys
```

You'll get output like:

```
Public Key: BFgF...ABC123
Private Key: xyz789...
```

Add to `.env.local`:

```bash
VAPID_PUBLIC_KEY=BFgF...ABC123
VAPID_PRIVATE_KEY=xyz789...
VAPID_SUBJECT=mailto:your@email.com
```

### Step 4: Create Push Subscribe API

Create `app/api/push-subscribe/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'

// Store subscriptions (in production, use a database)
const subscriptions = new Map<string, any>()

export async function POST(req: NextRequest) {
  try {
    const subscription = await req.json()

    // Save subscription (use database in production)
    const id = JSON.stringify(subscription)
    subscriptions.set(id, subscription)

    console.log('New push subscription:', subscription)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error saving subscription:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Export subscriptions for use in webhook
export { subscriptions }
```

### Step 5: Send Notifications from Stripe Webhook

Update `app/api/stripe-webhook/route.ts`:

```typescript
import webpush from 'web-push'
import { subscriptions } from '../push-subscribe/route'

// Configure web-push
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

// In your webhook handler, after a successful sale:
if (event.type === 'checkout.session.completed') {
  const session = event.data.object as Stripe.Checkout.Session

  // Send push notification to all subscribers
  const payload = JSON.stringify({
    title: '🎉 New Sale!',
    body: `${session.customer_details?.name || 'Customer'} just purchased for $${(session.amount_total! / 100).toFixed(2)}`,
    url: '/sales-dashboard'
  })

  const promises: Promise<any>[] = []

  subscriptions.forEach(subscription => {
    promises.push(
      webpush.sendNotification(subscription, payload)
        .catch(error => {
          console.error('Error sending push notification:', error)
          // Remove invalid subscriptions
          if (error.statusCode === 410) {
            subscriptions.delete(JSON.stringify(subscription))
          }
        })
    )
  })

  await Promise.all(promises)
}
```

---

## 📱 Testing Push Notifications

### Test Locally:

1. Start your server: `npm run dev`
2. Open dashboard in browser
3. Accept notification permission
4. Make a test sale
5. You should see a push notification!

### Test on Mobile:

1. Deploy to Vercel: `vercel --prod`
2. On your phone, visit `https://yourdomain.com/sales-dashboard`
3. Add to Home Screen:
   - **iOS**: Share → Add to Home Screen
   - **Android**: Menu → Add to Home Screen
4. Accept notification permission
5. Close the app
6. Make a test sale from your computer
7. You'll get a push notification on your phone!

---

## 🎨 Customize Notifications

### Change Icon:

```javascript
icon: '/logo192.png', // Your app icon
badge: '/badge.png',  // Small badge icon
```

### Add Sound (Android only):

```javascript
vibrate: [200, 100, 200, 100, 200], // Vibration pattern
sound: '/notification.mp3', // Custom sound
```

### Add Actions:

```javascript
actions: [
  { action: 'view', title: 'View Dashboard', icon: '/icons/view.png' },
  { action: 'share', title: 'Share', icon: '/icons/share.png' },
  { action: 'close', title: 'Dismiss', icon: '/icons/close.png' }
]
```

### Different Notifications for Different Events:

```typescript
// New sale
const saleNotification = {
  title: '💰 New Sale!',
  body: `$${amount} from ${customer}`,
  icon: '/icons/sale.png',
  tag: 'sale' // Only one sale notification at a time
}

// Goal reached
const goalNotification = {
  title: '🎯 Goal Reached!',
  body: 'You hit your $500 daily goal!',
  icon: '/icons/trophy.png',
  tag: 'goal'
}

// Refund
const refundNotification = {
  title: '⚠️ Refund Processed',
  body: `$${amount} refunded to ${customer}`,
  icon: '/icons/refund.png',
  tag: 'refund'
}
```

---

## 🔧 Production Deployment

### Step 1: Add to Vercel

```bash
vercel env add VAPID_PUBLIC_KEY production
# Paste your public key

vercel env add VAPID_PRIVATE_KEY production
# Paste your private key

vercel env add VAPID_SUBJECT production
# Enter: mailto:your@email.com

vercel --prod
```

### Step 2: Test on Real Domain

1. Visit `https://yourdomain.com/sales-dashboard`
2. Accept notifications
3. Make a test sale
4. Should receive push notification!

---

## 🌟 Advanced Features

### 1. **Scheduled Notifications**

Send daily summary at 9 PM:

```typescript
// Create a cron job or use Vercel Cron
export async function sendDailySummary() {
  const today = await fetchTodaysSales()

  const payload = JSON.stringify({
    title: '📊 Daily Summary',
    body: `Today: ${today.sales} sales, $${today.revenue.toFixed(2)} revenue`,
    url: '/sales-dashboard'
  })

  subscriptions.forEach(subscription => {
    webpush.sendNotification(subscription, payload)
  })
}
```

### 2. **Smart Notifications**

Only notify for sales > $50:

```typescript
if (session.amount_total! >= 5000) { // $50 in cents
  // Send notification
}
```

### 3. **Per-User Subscriptions**

Store subscriptions in database with user ID:

```typescript
// Database schema
{
  userId: 'user_123',
  subscription: {...},
  preferences: {
    notifySales: true,
    notifyRefunds: false,
    minimumAmount: 10
  }
}
```

---

## 📱 iOS Considerations

**Important:** iOS Safari has limited PWA support:

- ✅ Works: Add to Home Screen
- ✅ Works: Service Workers
- ❌ Limited: Push Notifications (requires iOS 16.4+)

**Workaround for iOS:**
- Use Telegram notifications (already set up!)
- Or use email notifications
- Or use native app wrapper (like Capacitor)

---

## 🎯 Best Practices

1. **Don't spam** - Only send important notifications
2. **Allow opt-out** - Give users control
3. **Be specific** - "John just bought for $37" > "New sale"
4. **Test thoroughly** - Different browsers behave differently
5. **Handle errors** - Remove invalid subscriptions
6. **Respect timezone** - Don't notify users at 3 AM

---

## 📊 Analytics

Track notification performance:

```typescript
// Track notification clicks
self.addEventListener('notificationclick', function(event) {
  // Send analytics event
  fetch('/api/analytics/notification-click', {
    method: 'POST',
    body: JSON.stringify({
      action: event.action,
      timestamp: Date.now()
    })
  })
})
```

---

## ✅ Checklist

- [ ] Service worker updated with push handlers
- [ ] VAPID keys generated
- [ ] Environment variables added
- [ ] Push subscribe API created
- [ ] Stripe webhook sends notifications
- [ ] Tested locally
- [ ] Deployed to production
- [ ] Tested on mobile
- [ ] Added to home screen
- [ ] Receiving notifications!

---

## 🎉 Done!

You now have a **professional PWA** with push notifications!

This is the same technology used by:
- Twitter/X
- Instagram
- WhatsApp Web
- Spotify Web
- And many more!

**Enjoy your notifications! 📱🔔**
