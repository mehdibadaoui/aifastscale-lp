import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Terms & Conditions | AI FastScale',
  description: 'Terms & Conditions for AI FastScale - 7 Minute AgentClone Course. Payment gateway compliance and data protection.',
}

export default function Terms() {
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
            Terms & Conditions
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
            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                1. Agreement to Terms
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                These Terms & Conditions ("Terms") constitute a legally binding agreement between you ("Customer," "User," "you," "your") and AI FastScale ("Company," "we," "us," "our") concerning your access to and use of:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>The AI FastScale website (aifastscale.com)</li>
                <li>The 7 Minute AgentClone Course and all related materials</li>
                <li>Digital downloads, templates, and bonus resources</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                By accessing, browsing, or purchasing from our website, you expressly agree to be bound by these Terms. If you do not agree with any part of these Terms, you must not access or use our service. Your purchase constitutes acceptance of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                2. Payment Gateway Compliance & Processing
              </h2>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                2.1 Payment Processor & Security
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                All payments are processed securely through our PCI-DSS compliant payment processor, which complies with:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Payment Card Industry Data Security Standard (PCI-DSS)</li>
                <li>Industry-standard TLS 1.2+ encryption</li>
                <li>International payment security standards</li>
              </ul>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                2.2 Your Payment Information
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>IMPORTANT:</strong> AI FastScale DOES NOT store, process, or have access to your credit card information. Your payment data is transmitted directly to our payment processor and handled according to PCI-DSS standards. We only receive:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Cardholder name (as provided by you)</li>
                <li>Last 4 digits of your card</li>
                <li>Card brand (Visa, Mastercard, American Express, etc.)</li>
                <li>Transaction ID and confirmation</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                Your CVV, full card number, and expiration date are NEVER transmitted to or stored by AI FastScale.
              </p>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                2.3 One-Time Payment (No Recurring Charges)
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>CRITICAL:</strong> Your purchase is a ONE-TIME PAYMENT ONLY for $37 USD. There are:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>NO recurring monthly charges</li>
                <li>NO automatic renewals</li>
                <li>NO subscription agreements</li>
                <li>NO hidden fees</li>
                <li>NO future billing without your explicit consent</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                You are charged once. You get lifetime access forever. This is guaranteed.
              </p>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                2.4 Payment Authorization
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                By clicking "Complete Purchase" or similar confirmation button, you authorize AI FastScale and its payment processor to charge the full amount displayed at checkout ($37 USD) to your payment method. You represent that:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>You are the authorized cardholder or have permission to use the card</li>
                <li>The information you provide is current and accurate</li>
                <li>You accept responsibility for all charges</li>
                <li>You understand this is a digital product with instant delivery</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                3. Digital Product Delivery
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                The 7 Minute AgentClone Course is a DIGITAL PRODUCT with INSTANT ACCESS:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Instant delivery: Access granted immediately upon payment confirmation</li>
                <li>Delivery method: Email with access link and login credentials</li>
                <li>Delivery timeframe: Within 5 minutes (typically within 60 seconds)</li>
                <li>No physical products: This is entirely digital</li>
                <li>No shipping: All materials accessible online 24/7</li>
              </ul>
              <p className="mb-4 leading-relaxed text-gray-700">
                By purchasing, you acknowledge that you waive any statutory cooling-off or withdrawal periods that would normally apply to digital goods once delivery and use have commenced.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                4. Product Description & Pricing
              </h2>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                4.1 What You're Purchasing
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                The 7 Minute AgentClone Course includes:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Complete step-by-step video training modules</li>
                <li>AI video creation system prompts and workflows</li>
                <li>Real estate-specific scripts and message templates</li>
                <li>Phone editing templates with captions, logos, and CTAs</li>
                <li>Personal branding blueprints and viral hooks</li>
                <li>Bonus materials and case studies</li>
                <li>Lifetime access to course updates</li>
              </ul>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                4.2 Pricing
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>Current Price:</strong> $37 USD<br />
                <strong>Limited Time Offer:</strong> Price subject to increase to $97 USD<br />
                <strong>Price Lock:</strong> Once purchased, you receive lifetime access at your purchase price
              </p>
              <p className="leading-relaxed text-gray-700">
                All prices are displayed in U.S. Dollars (USD). The price shown at checkout is the final price you will pay. We reserve the right to adjust pricing for future customers without affecting existing customer access.
              </p>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                4.3 Currency & Exchange
              </h3>
              <p className="leading-relaxed text-gray-700">
                If your card is issued in a currency other than USD, your payment processor will handle currency conversion at current rates. Any foreign transaction fees are charged by your card issuer, not AI FastScale. International customers are welcome to purchase in any country.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                5. 30-Day Money-Back Guarantee
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                We offer a 30-day money-back guarantee from the date of purchase. If you are not satisfied with the course for any reason, you may request a full refund by emailing support@aifastscale.com within 30 days. See our Refund Policy for complete details.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                6. User Account & Responsibilities
              </h2>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                6.1 Account Information
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                When you create an account, you must provide accurate, current, and complete information. You are responsible for:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of unauthorized access or use</li>
                <li>Not sharing your login credentials with others</li>
              </ul>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                6.2 Account Termination
              </h3>
              <p className="leading-relaxed text-gray-700">
                We reserve the right to terminate or suspend your account immediately, without notice, for violations of these Terms, fraudulent activity, chargebacks, or sharing of course materials.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                7. Intellectual Property Rights
              </h2>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                7.1 Ownership
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                All course materials, including videos, templates, scripts, graphics, and written content, are owned exclusively by AI FastScale and protected by copyright, trademark, and other intellectual property laws.
              </p>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                7.2 Your License
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                Upon purchase, you receive a limited, non-exclusive, non-transferable, revocable license to access and use the course materials for your personal, non-commercial use only.
              </p>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                7.3 Prohibited Uses
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                You may NOT:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Share, distribute, sell, or resell course materials</li>
                <li>Copy, reproduce, or create derivative works</li>
                <li>Remove copyright, trademark, or proprietary notices</li>
                <li>Use materials for commercial purposes without written permission</li>
                <li>Share your account credentials with others</li>
                <li>Post materials on public websites or forums</li>
                <li>Use materials to train AI models or create competing products</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                8. Acceptable Use Policy
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                You agree to use our service only for lawful, legitimate purposes. You may not:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Violate any local, state, federal, or international laws</li>
                <li>Infringe on intellectual property rights</li>
                <li>Distribute malware, viruses, or harmful code</li>
                <li>Engage in fraudulent or deceptive practices</li>
                <li>Harass, abuse, or harm others</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Engage in spam or phishing activities</li>
                <li>Use multiple accounts to circumvent policies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                9. Chargeback & Fraud Prevention
              </h2>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                9.1 Chargebacks
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>IMPORTANT:</strong> Before requesting a chargeback, contact us at support@aifastscale.com. We resolve 95% of issues within 24 hours without chargebacks. Chargebacks are costly for small businesses and damage relationships.
              </p>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                9.2 Chargeback Consequences
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                If you initiate a chargeback without contacting us first:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Your account will be immediately suspended</li>
                <li>You will lose access to all course materials</li>
                <li>We will dispute the chargeback with documentation</li>
                <li>Repeated chargebacks may be reported to payment fraud networks</li>
                <li>You may be permanently banned from future purchases</li>
              </ul>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                9.3 Legitimate Disputes
              </h3>
              <p className="leading-relaxed text-gray-700">
                Legitimate disputes (unauthorized card use, technical issues, etc.) are always honored. Contact us at support@aifastscale.com first for the fastest resolution.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                10. Third-Party Services & Dependencies
              </h2>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                10.1 Third-Party Tools
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                This course teaches you to use third-party AI platforms and tools (HeyGen, ElevenLabs, D-ID, Synthesia, or similar). You acknowledge that:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>These are independent services NOT owned or controlled by AI FastScale</li>
                <li>You are responsible for complying with each platform's Terms of Service</li>
                <li>Third-party platforms may change features, pricing, or policies at any time</li>
                <li>Some platforms may require separate paid subscriptions</li>
                <li>We are not responsible for third-party platform changes or issues</li>
                <li>If a platform discontinues service, we will provide alternatives at no cost</li>
              </ul>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                10.2 Course Updates
              </h3>
              <p className="leading-relaxed text-gray-700">
                If tools referenced in the course become unavailable, we will update materials to reflect current alternatives at no additional charge to you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                11. Real Estate Compliance
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                As a real estate professional, YOU are solely responsible for ensuring your use of AI-generated videos complies with:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Your state's real estate licensing laws and regulations</li>
                <li>MLS (Multiple Listing Service) rules and policies</li>
                <li>Your broker's requirements and approval processes</li>
                <li>Federal and state fair housing laws</li>
                <li>Truth in advertising standards</li>
                <li>Required disclosures in your videos</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                While we provide guidance, we are not providing legal advice. Verify all compliance with your broker before publishing content.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                12. Limitation of Liability & Disclaimers
              </h2>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                12.1 No Guarantees
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                While we provide training and tools, we do NOT guarantee specific results, leads, income, or sales. Your success depends on your effort, market conditions, and other factors beyond our control. The results mentioned (5-15 leads per week, 100+ monthly leads) are examples and not guarantees.
              </p>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                12.2 Limitation of Liability
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                To the maximum extent permitted by law, AI FastScale shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill. Our total liability shall not exceed the amount you paid ($37).
              </p>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                12.3 Service Availability
              </h3>
              <p className="leading-relaxed text-gray-700">
                We strive to maintain 99.9% uptime but do not guarantee uninterrupted access. We may suspend service for maintenance or updates without notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                13. Updates to Terms
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Continued use constitutes acceptance of modified Terms. We will notify you of material changes if you have an active account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                14. Governing Law & Dispute Resolution
              </h2>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                14.1 Governing Law
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                These Terms shall be governed by and construed in accordance with the laws of the State of Florida, United States, without regard to conflict of law provisions.
              </p>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                14.2 Dispute Resolution
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>Contact Us First:</strong> Before filing any dispute, contact support@aifastscale.com and attempt informal resolution (30-day period).
              </p>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>Binding Arbitration:</strong> Any disputes shall be resolved through binding arbitration in Miami-Dade County, Florida under the rules of the American Arbitration Association (AAA).
              </p>
              <p className="leading-relaxed text-gray-700">
                <strong>Class Action Waiver:</strong> You waive any right to participate in class action lawsuits. All disputes are resolved on an individual basis.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                15. Severability & Entire Agreement
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                If any provision is found unenforceable, that provision will be limited or eliminated to the minimum extent necessary, and remaining provisions shall remain in full force and effect.
              </p>
              <p className="leading-relaxed text-gray-700">
                These Terms, together with our Privacy Policy, Refund Policy, and Disclaimer, constitute the entire agreement between you and AI FastScale and supersede all prior agreements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                16. Contact Information
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                For questions about these Terms & Conditions:
              </p>
              <div className="rounded-xl border-2 border-yellow-400 bg-yellow-50 p-6">
                <p className="mb-2 font-bold text-gray-900">AI FastScale</p>
                <p className="text-gray-700">Email: support@aifastscale.com</p>
                <p className="text-gray-700">Instagram: @sara.theagent</p>
                <p className="text-gray-700">Address: Miami, FL USA</p>
              </div>
            </section>

            <div className="mt-8 rounded-xl border-2 border-yellow-400 bg-gradient-to-r from-yellow-100 to-orange-100 p-6">
              <p className="mb-2 font-bold text-gray-900">
                By purchasing the 7 Minute AgentClone Course, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
              </p>
              <p className="text-sm text-gray-700">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
