import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Refund Policy | AI FastScale',
  description: 'Refund Policy for AI FastScale - 30-Day Money-Back Guarantee',
};

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-bold mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Refund Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="prose prose-lg max-w-none">
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-3 mt-0">30-Day Money-Back Guarantee</h2>
              <p className="text-gray-900 font-bold mb-2">We stand behind our product 100%.</p>
              <p className="text-gray-700 mb-0">
                If you're not completely satisfied with the 7 Minute AgentClone Course for any reason within 30 days of your purchase, we'll give you a full refund. No questions asked. No hassle. No hard feelings.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-4">1. Our Commitment to You</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                At AI FastScale, we're confident that the 7 Minute AgentClone Course will transform your real estate marketing. However, we understand that every agent's situation is unique. That's why we offer a simple, straightforward 30-day money-back guarantee.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We want you to have plenty of time to go through the course, implement the strategies, and see results for yourself—completely risk-free.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-4">2. How Our Refund Policy Works</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Eligibility Period:</strong> You have 30 days from the date of purchase to request a refund.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>No Questions Asked:</strong> We truly mean it. You don't need to provide a reason, explanation, or justification. If you're not satisfied, you get your money back. Period.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Keep Everything:</strong> Even if you request a refund, you can keep all the course materials, templates, prompts, and bonus materials. We believe in goodwill, and we hope the materials will still provide some value to you.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>100% Refund:</strong> You'll receive a full refund of your purchase price ($37). No partial refunds, no deductions, no fees.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-4">3. How to Request a Refund</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Requesting a refund is simple and straightforward:
              </p>
              <ol className="list-decimal pl-6 mb-4 text-gray-700 space-y-3">
                <li>
                  <strong>Email us:</strong> Send an email to <a href="mailto:support@aifastscale.com" className="text-yellow-600 hover:text-yellow-700 font-semibold">support@aifastscale.com</a> with the subject line "Refund Request"
                </li>
                <li>
                  <strong>Include your details:</strong> Provide your name and the email address you used to purchase the course (this helps us locate your order quickly)
                </li>
                <li>
                  <strong>That's it:</strong> You don't need to provide a reason or fill out lengthy forms. Just a simple email is all we need.
                </li>
              </ol>
              <p className="text-gray-700 leading-relaxed">
                Our support team typically responds within 24 hours (Monday-Friday, excluding holidays).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-4">4. Refund Processing Timeline</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Once we receive your refund request:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li><strong>Approval:</strong> Your refund is approved immediately—no waiting, no review process</li>
                <li><strong>Processing:</strong> Refunds are processed within 1-2 business days of your request</li>
                <li><strong>Bank/Card Processing:</strong> Once processed on our end, it typically takes 5-7 business days for the refund to appear in your account, depending on your bank or credit card provider</li>
                <li><strong>Confirmation:</strong> You'll receive an email confirmation once the refund has been processed</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-4">5. Refund Method</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Refunds are issued to the original payment method used for purchase:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>If you paid with a credit card, the refund goes back to that card</li>
                <li>If you paid with a debit card, the refund goes back to that card</li>
                <li>All refunds are processed securely through Stripe, our payment processor</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                We cannot issue refunds to a different payment method or account than the one originally used.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-4">6. After the 30-Day Period</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Refund requests made after 30 days from the date of purchase are evaluated on a case-by-case basis. While we generally honor our 30-day guarantee strictly, we understand that exceptional circumstances may arise.
              </p>
              <p className="text-gray-700 leading-relaxed">
                If you have a special situation, please reach out to us at support@aifastscale.com and explain your circumstances. We're real people who care about our customers, and we'll do our best to find a fair solution.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-4">7. Prohibited Activities</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                While we offer a generous refund policy, we do not tolerate abuse. The following activities may result in denial of refund and/or account termination:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Requesting multiple refunds across different accounts</li>
                <li>Sharing course materials with others and then requesting a refund</li>
                <li>Fraudulent purchases or chargebacks</li>
                <li>Violating our Terms of Service or engaging in illegal activities</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to deny refunds in cases of suspected fraud or abuse.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-4">8. Chargebacks</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Please contact us before initiating a chargeback.</strong> Chargebacks are costly for small businesses and should be a last resort.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any issues with your purchase, our support team is here to help. We respond quickly and will resolve any legitimate concerns immediately.
              </p>
              <p className="text-gray-700 leading-relaxed">
                If a chargeback is initiated without first contacting us, we reserve the right to dispute the chargeback and provide evidence of our refund policy to your bank.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-4">9. Questions or Concerns?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We're here to help! If you have any questions about this refund policy, your purchase, or the course itself, please don't hesitate to reach out.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our goal is your success. If something isn't working for you or you're having trouble with the course, let us know—we may be able to help before you decide to request a refund.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-4">10. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To request a refund or ask questions about this policy:
              </p>
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6">
                <p className="text-gray-900 font-bold mb-2">AI FastScale</p>
                <p className="text-gray-700">Email: support@aifastscale.com</p>
                <p className="text-gray-700">Phone: +1 (555) 123-4567</p>
                <p className="text-gray-700">Address: Miami, FL USA</p>
              </div>
            </section>

            <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400 rounded-xl p-6 mt-8">
              <p className="text-gray-900 font-bold mb-2">Our Promise</p>
              <p className="text-gray-700 mb-0">
                We built this course to genuinely help real estate agents succeed with AI video marketing. If it doesn't work for you, we don't want your money. Simple as that. Your satisfaction and success are what matter most to us.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
