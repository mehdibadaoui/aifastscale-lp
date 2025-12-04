require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function check() {
  const sessions = await stripe.checkout.sessions.list({
    limit: 15,
    expand: ['data.line_items']
  });

  console.log('=== RECENT STRIPE PAYMENTS ===\n');
  let paidCount = 0;
  for (const s of sessions.data) {
    if (s.payment_status === 'paid') {
      paidCount++;
      const created = new Date(s.created * 1000).toLocaleString();
      const items = s.line_items?.data?.map(i => i.description).join(', ') || 'N/A';
      console.log(`[${paidCount}] Date: ${created}`);
      console.log(`    Amount: $${(s.amount_total/100).toFixed(2)}`);
      console.log(`    Email: ${s.customer_email || 'N/A'}`);
      console.log(`    Product: ${items}`);
      console.log('');
    }
  }
  console.log(`Total paid sessions: ${paidCount}`);
}
check();
