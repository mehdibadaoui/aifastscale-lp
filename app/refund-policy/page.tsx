import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Refund Policy | AI FastScale',
  description: '30-Day Money-Back Guarantee for AI FastScale - 7 Minute AgentClone Course',
}

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-20">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 font-bold text-yellow-600 transition-colors hover:text-yellow-700"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Home
        </Link>

        <div className="rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-2xl md:p-12">
          <h1 className="mb-4 text-4xl font-black text-gray-900 md:text-5xl">
            Refund Policy
          </h1>
          <p className="mb-8 text-gray-600">
            Last updated:{' '}
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          <div className="prose prose-lg max-w-none">
            <div className="mb-8 rounded-xl border-2 border-green-400 bg-gradient-to-r from-green-100 to-emerald-100 p-6">
              <h2 className="mt-0 mb-3 text-2xl font-black text-gray-900">
                30-Day Money-Back Guarantee
              </h2>
              <p className="mb-2 font-bold text-gray-900">
                We stand behind our product 100%.
              </p>
              <p className="mb-0 text-gray-700">
                If you're not completely satisfied with the 7 Minute AgentClone Course for any reason within 30 days of your purchase, we'll give you a full refund. No questions asked. No hassle. No hard feelings.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                1. Our Commitment to You
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                At AI FastScale, we're confident that the 7 Minute AgentClone Course will transform your real estate marketing and help you generate more leads with AI-powered videos. However, we understand that every real estate agent's situation is unique.
              </p>
              <p className="mb-4 leading-relaxed text-gray-700">
                That's why we offer a generous 30-day money-back guarantee with absolutely no questions asked. We want you to have plenty of time to:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Go through the complete course materials</li>
                <li>Create your first AI videos</li>
                <li>Test the strategies with your audience</li>
                <li>See real results for yourself</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                If the course isn't the right fit for you—for any reason at all—we'll refund your money completely.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                2. Refund Policy Details
              </h2>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                2.1 Eligibility Period
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>You have 30 days from the date of your purchase to request a refund.</strong> The 30-day clock starts on the date your payment is processed and confirmed. This gives you a full month to evaluate the course and decide if it's right for you.
              </p>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                2.2 No Questions Asked
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                We truly mean it: no questions asked. You do not need to provide:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>A reason for your refund</li>
                <li>An explanation or justification</li>
                <li>Proof that you tried the system</li>
                <li>Feedback or testimonial</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                If you're not satisfied, you get your money back. Period.
              </p>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                2.3 Keep All Course Materials
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>Here's the best part:</strong> Even if you request a refund, you can keep all the course materials forever:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Video training modules</li>
                <li>System prompts and workflows</li>
                <li>Real estate scripts and templates</li>
                <li>Phone editing templates</li>
                <li>Bonus materials and resources</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                We believe in goodwill, and we hope the materials will provide value to you even if the course isn't what you expected.
              </p>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                2.4 Full Refund Amount
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                You'll receive a <strong>100% full refund</strong> of your purchase price:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Full amount: $37 USD</li>
                <li>No partial refunds</li>
                <li>No deductions</li>
                <li>No processing fees</li>
                <li>No restocking fees</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                3. How to Request a Refund
              </h2>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                3.1 Simple Process
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                Requesting a refund is simple and straightforward:
              </p>
              <ol className="mb-4 list-decimal space-y-3 pl-6 text-gray-700">
                <li>
                  <strong>Send an email:</strong> Email{' '}
                  <a
                    href="mailto:support@aifastscale.com"
                    className="font-semibold text-yellow-600 hover:text-yellow-700"
                  >
                    support@aifastscale.com
                  </a>{' '}
                  with the subject line "Refund Request"
                </li>
                <li>
                  <strong>Include your details:</strong> Tell us:
                  <ul className="mt-2 space-y-1 text-gray-700">
                    <li>Your full name</li>
                    <li>The email address used to purchase the course</li>
                    <li>Your order date (if you have it)</li>
                  </ul>
                </li>
                <li>
                  <strong>That's it:</strong> No lengthy forms. No bureaucracy. Just send us a simple email.
                </li>
              </ol>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                3.2 Response Time
              </h3>
              <p className="leading-relaxed text-gray-700">
                Our support team typically responds within 24 hours (Monday-Friday, excluding holidays). We prioritize refund requests and handle them with urgency.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                4. Refund Processing Timeline
              </h2>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                4.1 Processing Steps
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                Once we receive your refund request, here's exactly what happens:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  <strong>Step 1 - Approval:</strong> Your refund is approved immediately. No waiting, no review process, no conditions.
                </li>
                <li>
                  <strong>Step 2 - Processing:</strong> We process the refund within 1-2 business days of your request
                </li>
                <li>
                  <strong>Step 3 - Transmission:</strong> The refund is sent to your payment processor
                </li>
                <li>
                  <strong>Step 4 - Bank/Card Processing:</strong> Your bank or credit card processor handles the credit (typically 5-7 business days)
                </li>
                <li>
                  <strong>Step 5 - Confirmation:</strong> You'll receive an email confirmation once the refund has been processed on our end
                </li>
              </ul>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                4.2 Total Timeline
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                From request to refund in your account:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li><strong>Best case:</strong> 2-3 business days (if your bank processes quickly)</li>
                <li><strong>Typical case:</strong> 5-7 business days</li>
                <li><strong>Worst case:</strong> 10 business days (depending on your financial institution)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                5. Refund Method & Payment
              </h2>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                5.1 Original Payment Method
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                All refunds are issued to your original payment method:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Credit card → Refunded to that credit card</li>
                <li>Debit card → Refunded to that debit card</li>
                <li>Digital wallet (if applicable) → Refunded to your original account</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                All refunds are processed securely through our PCI-DSS compliant payment processor.
              </p>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                5.2 Different Payment Method
              </h3>
              <p className="leading-relaxed text-gray-700">
                We cannot issue refunds to a different payment method or account than the one originally used for purchase. This is a payment processor security requirement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                6. Refunds After 30 Days
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Refund requests made after 30 days from the date of purchase are evaluated on a case-by-case basis. While we honor our 30-day guarantee strictly, we understand that exceptional circumstances may arise.
              </p>
              <p className="mb-4 leading-relaxed text-gray-700">
                If you have a special situation or unique circumstance, please reach out to us at support@aifastscale.com and explain your situation. We're real people who care about our customers, and we'll do our best to find a fair solution.
              </p>
              <p className="leading-relaxed text-gray-700">
                <strong>We've approved late refunds for:</strong> Technical issues, payment problems, family emergencies, or other legitimate concerns. Just ask us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                7. Digital Product & EU Consumer Rights
              </h2>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                7.1 Instant Access Notice
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                The 7 Minute AgentClone Course is a digital product with instant access. Upon purchase, you receive immediate access to all course materials.
              </p>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                7.2 EU Consumer Rights Disclosure
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>For EU Customers:</strong> Under EU Consumer Rights Directive 2011/83/EU, digital products with instant access are exempt from the statutory 14-day cooling-off period once delivery and use have commenced.
              </p>
              <p className="mb-4 leading-relaxed text-gray-700">
                By purchasing and accessing the course, you expressly agree to immediate delivery and acknowledge that you waive your right to the statutory cooling-off period.
              </p>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                7.3 Our Superior Guarantee
              </h3>
              <p className="leading-relaxed text-gray-700">
                <strong>Here's the good news:</strong> Even though we're exempt from the EU cooling-off period, we voluntarily offer a superior 30-day money-back guarantee—giving you 2x more time than the statutory requirement. This is our way of showing confidence in our product and commitment to customer satisfaction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                8. Secure Refund Processing
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                All refunds are processed securely through our PCI-DSS Level 1 certified payment processor:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>We initiate the refund through our payment processor's secure system</li>
                <li>The payment processor reverses the original charge to your payment method</li>
                <li>Your bank or card issuer processes the refund</li>
                <li>The refund appears as a credit on your statement (not a new transaction)</li>
                <li>We cannot expedite your bank's processing time, but we process all refunds on our end within 1-2 business days</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                <strong>Questions about timing?</strong> If your refund hasn't appeared after 10 business days, contact your card issuer. They can check the status on their end.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                9. Prohibited Refund Activities
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                While we offer a generous refund policy, we do not tolerate abuse. The following activities may result in denial of refund and/or account termination:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Requesting multiple refunds across different accounts for the same course</li>
                <li>Sharing course materials with others and then requesting a refund</li>
                <li>Fraudulent purchases using stolen payment methods</li>
                <li>Attempting to exploit our guarantee policy repeatedly</li>
                <li>Violating our Terms of Service or engaging in illegal activities</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                We reserve the right to deny refunds in cases of suspected fraud or abuse, while still honoring legitimate requests.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                10. Chargebacks & Payment Disputes
              </h2>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                10.1 Please Contact Us First
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>IMPORTANT:</strong> Before initiating a chargeback or payment dispute with your bank, please contact us at support@aifastscale.com.
              </p>
              <p className="mb-4 leading-relaxed text-gray-700">
                Chargebacks are costly for small businesses and should be a last resort. <strong>We resolve 95% of issues within 24 hours</strong> through our simple refund process.
              </p>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                10.2 Why Contact Us First?
              </h3>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>We process refunds much faster than chargebacks</li>
                <li>Our support team is responsive and helpful</li>
                <li>We can resolve technical issues or access problems immediately</li>
                <li>Chargebacks cost us money and damage our business</li>
                <li>We'd rather help you than fight a chargeback</li>
              </ul>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                10.3 Chargeback Consequences
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                If a chargeback is initiated without first contacting us:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Your account will be immediately suspended</li>
                <li>You will lose access to all course materials</li>
                <li>We will dispute the chargeback with evidence of our refund policy</li>
                <li>Repeated fraudulent chargebacks may be reported to payment fraud networks</li>
                <li>You may be permanently banned from future purchases</li>
              </ul>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                10.4 Legitimate Disputes
              </h3>
              <p className="leading-relaxed text-gray-700">
                Legitimate disputes (unauthorized card use, card stolen, etc.) are always honored immediately. If your card was used fraudulently, contact your card issuer right away, and contact us as well so we can help.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                11. Before You Request a Refund
              </h2>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                11.1 We're Here to Help
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                If you're having any issues with the course, we may be able to help you without a refund:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li><strong>Access problems?</strong> We can reset your account immediately</li>
                <li><strong>Technical issues?</strong> Our support team can troubleshoot and help</li>
                <li><strong>Questions about the material?</strong> We offer guidance and clarification</li>
                <li><strong>Not getting results?</strong> We can help you implement the strategies better</li>
              </ul>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                11.2 Contact Support First
              </h3>
              <p className="leading-relaxed text-gray-700">
                Before requesting a refund, please reach out to support@aifastscale.com. Tell us what's not working. We genuinely want to help you succeed, and most issues can be resolved with a quick conversation. Our goal is your success, not keeping your $37.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                12. Questions or Concerns?
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                We're here to help! If you have any questions about this refund policy, your purchase, or the course itself, please don't hesitate to reach out.
              </p>
              <div className="rounded-xl border-2 border-yellow-400 bg-yellow-50 p-6">
                <p className="mb-2 font-bold text-gray-900">Contact AI FastScale</p>
                <p className="text-gray-700">Email: support@aifastscale.com</p>
                <p className="text-gray-700">Instagram: @sara.theagent</p>
                <p className="text-gray-700">Address: Miami, FL USA</p>
              </div>
            </section>

            <div className="mt-8 rounded-xl border-2 border-green-400 bg-gradient-to-r from-green-100 to-emerald-100 p-6">
              <p className="mb-2 font-bold text-gray-900">Our Promise</p>
              <p className="mb-0 text-gray-700">
                We built the 7 Minute AgentClone Course to genuinely help real estate agents like you succeed with AI video marketing. If the course doesn't work for you, we don't want your money. Simple as that. Your satisfaction and success are what matter most to us. We believe in our product so much that we're willing to stand behind it 100% with this generous guarantee.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
