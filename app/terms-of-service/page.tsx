import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service | AI FastScale',
  description: 'Terms of Service for AI FastScale - 7 Minute AgentClone Course',
}

export default function TermsOfService() {
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
            Terms of Service
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
                These Terms of Service ("Terms") constitute a legally binding
                agreement between you and AI FastScale ("Company," "we," "us,"
                or "our") concerning your access to and use of the AI FastScale
                website and the 7 Minute AgentClone Course.
              </p>
              <p className="leading-relaxed text-gray-700">
                By accessing or using our service, you agree to be bound by
                these Terms. If you disagree with any part of these Terms, you
                may not access our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                2. Product Description
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                The 7 Minute AgentClone Course is a digital educational product
                designed for real estate agents. The course includes:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  Step-by-step video training on creating AI-generated talking
                  videos
                </li>
                <li>System prompts and workflows for AI video creation</li>
                <li>Real estate-specific scripts and templates</li>
                <li>Phone editing templates with captions, logos, and CTAs</li>
                <li>
                  Bonus materials including personal branding blueprints and
                  hooks
                </li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                Current price: $37 USD (subject to change, limited time offer,
                may increase to $97).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                3. Purchase and Payment
              </h2>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                One-Time Payment (No Recurring Charges)
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>IMPORTANT:</strong> This is a ONE-TIME PAYMENT ONLY. You will be charged only ONCE for $37 USD (or current pricing). There are NO recurring charges, NO monthly subscriptions, NO hidden fees. You pay once and get lifetime access forever.
              </p>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Payment Processing
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                All payments are processed securely through our PCI-DSS Level 1 certified payment processor. By making a purchase, you agree to:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Provide current, complete, and accurate purchase and account information</li>
                <li>Comply with our payment processor's terms of service</li>
                <li>Your payment card information is transmitted directly to our payment processor (we NEVER see your full card details)</li>
                <li>You authorize us to charge the amount displayed at checkout to your provided payment method</li>
              </ul>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Instant Digital Delivery
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                This is a DIGITAL PRODUCT with instant delivery. Upon successful payment confirmation:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>You receive immediate access to all course materials (within 5 minutes)</li>
                <li>Access link sent to your email address</li>
                <li>Login credentials created automatically</li>
                <li>No physical products will be shipped</li>
                <li>No waiting period - start learning immediately</li>
              </ul>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Pricing & Currency
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>Current Price:</strong> $37 USD (limited time offer, may increase to $97 USD). All prices are in U.S. Dollars (USD). The price applicable to your purchase is the price displayed at the time of checkout completion. We reserve the right to change pricing at any time without prior notice (existing customers are grandfathered at their purchase price).
              </p>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Failed Payments & Declined Cards
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                If your payment fails or is declined:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>You will NOT be charged</li>
                <li>You will NOT receive access to the course</li>
                <li>Please contact your card issuer or try a different payment method</li>
                <li>Contact support@aifastscale.com if you continue experiencing issues</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                4. 30-Day Money-Back Guarantee
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                We offer a 30-day money-back guarantee from the date of
                purchase. If you are not satisfied with the course for any
                reason within 30 days of purchase, you may request a full refund
                by emailing support@aifastscale.com.
              </p>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>Refund Process:</strong>
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>No questions asked, full refund within 30 days</li>
                <li>You keep all course materials and bonuses</li>
                <li>Refunds are processed within 5-7 business days</li>
                <li>Refund will be issued to the original payment method</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                5. User Account
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                When you create an account with us, you must provide accurate,
                complete, and current information. You are responsible for:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  Maintaining the confidentiality of your account credentials
                </li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                We reserve the right to terminate accounts that violate these
                Terms or engage in fraudulent activity.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                6. Intellectual Property Rights
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                All course materials, including videos, templates, prompts,
                graphics, and written content, are owned by AI FastScale and
                protected by copyright, trademark, and other intellectual
                property laws.
              </p>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>License Grant:</strong> Upon purchase, you are granted a
                limited, non-exclusive, non-transferable license to access and
                use the course materials for your personal, non-commercial use.
              </p>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>Restrictions:</strong> You may NOT:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Share, distribute, or resell course materials</li>
                <li>Copy, reproduce, or create derivative works</li>
                <li>Remove copyright or proprietary notices</li>
                <li>
                  Use materials for commercial purposes without permission
                </li>
                <li>Share your account credentials with others</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                7. Acceptable Use
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                You agree to use our service only for lawful purposes. You may
                not:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Distribute malware or harmful code</li>
                <li>Engage in fraudulent activities</li>
                <li>Harass, abuse, or harm others</li>
                <li>Attempt to gain unauthorized access to our systems</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                8. Disclaimers and Limitations
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>No Guarantees:</strong> While we provide tools and
                training, we do not guarantee specific results, leads, or
                income. Your success depends on your effort, market conditions,
                and other factors beyond our control.
              </p>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>Educational Purpose:</strong> This course is for
                educational purposes only. Results mentioned (such as "5-15
                leads per week" or "100+ monthly leads") are examples and not
                guarantees of your individual results.
              </p>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>Service Availability:</strong> We strive to maintain
                99.9% uptime but do not guarantee uninterrupted access. We may
                suspend service for maintenance or updates.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                9. Limitation of Liability
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                To the maximum extent permitted by law, AI FastScale shall not
                be liable for any indirect, incidental, special, consequential,
                or punitive damages, including loss of profits, data, or
                goodwill.
              </p>
              <p className="leading-relaxed text-gray-700">
                Our total liability shall not exceed the amount you paid for the
                course ($37).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                10. Compliance with Real Estate Regulations
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                As a real estate professional, you are responsible for ensuring
                your use of AI-generated videos complies with:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>MLS (Multiple Listing Service) rules and regulations</li>
                <li>Your broker's policies and requirements</li>
                <li>State and federal fair housing laws</li>
                <li>Truth in advertising standards</li>
                <li>Any required disclosures in your videos</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                We provide broker compliance overlay kits, but you are
                ultimately responsible for compliance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                11. Updates and Modifications
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>Course Updates:</strong> We may update course content to
                improve quality and relevance. All updates are provided free to
                existing customers.
              </p>
              <p className="leading-relaxed text-gray-700">
                <strong>Terms Updates:</strong> We reserve the right to modify
                these Terms at any time. Changes will be effective immediately
                upon posting. Continued use constitutes acceptance of modified
                Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                12. Third-Party Dependencies & AI Tools
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>Important Notice:</strong> This course teaches you to use third-party AI platforms and tools (such as HeyGen, ElevenLabs, D-ID, Synthesia, or similar services). You acknowledge and agree that:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>These AI platforms are independent third-party services NOT owned or controlled by AI FastScale</li>
                <li>You are responsible for complying with each AI platform's Terms of Service and pricing</li>
                <li>AI platforms may change their features, pricing, or terms at any time</li>
                <li>If an AI platform discontinues service, we will provide alternative solutions but cannot guarantee identical functionality</li>
                <li>You may need separate subscriptions to AI platforms (which are not included in the $37 course price)</li>
                <li>We are not responsible for any costs, changes, or issues with third-party AI platforms</li>
              </ul>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>Course Updates:</strong> If AI tools used in the course become unavailable, we will update training materials to reflect current best alternatives at no additional cost to you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                13. Termination
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                We may terminate or suspend your account immediately, without
                prior notice, for:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Breach of these Terms</li>
                <li>Fraudulent or illegal activity</li>
                <li>Sharing course materials without permission</li>
                <li>Abusive behavior toward staff or other users</li>
                <li>Chargeback abuse or payment fraud</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                Upon termination, your right to access course materials ceases
                immediately. Lifetime access is contingent on compliance with these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                14. Force Majeure
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                We shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control, including but not limited to:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Acts of God (natural disasters, pandemics, extreme weather)</li>
                <li>War, terrorism, riots, or civil unrest</li>
                <li>Government actions, regulations, or restrictions</li>
                <li>Internet service provider failures or network outages</li>
                <li>Third-party platform outages (payment processors, hosting providers, AI tools)</li>
                <li>Cyberattacks, DDoS attacks, or hacking attempts</li>
                <li>Power failures or telecommunications failures</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                In such events, we will make reasonable efforts to restore service and notify affected users. Performance obligations will be suspended for the duration of the force majeure event.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                15. Governing Law
              </h2>
              <p className="leading-relaxed text-gray-700">
                These Terms shall be governed by and construed in accordance
                with the laws of the State of Florida, United States, without
                regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                16. Dispute Resolution & Arbitration
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>Informal Resolution First:</strong> Before filing any formal dispute, you agree to contact us at support@aifastscale.com and attempt to resolve the issue informally. We resolve 95% of disputes this way.
              </p>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>Binding Arbitration:</strong> If informal resolution fails, any disputes arising from these Terms or your use of our service shall be resolved through:
              </p>
              <ol className="mb-4 list-decimal space-y-2 pl-6 text-gray-700">
                <li>Good faith negotiation between the parties (30-day period)</li>
                <li>Mediation if negotiation fails (optional)</li>
                <li>Binding arbitration in Miami-Dade County, Florida under the rules of the American Arbitration Association (AAA)</li>
              </ol>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>Class Action Waiver:</strong> You agree that disputes will be resolved on an individual basis only. You waive any right to participate in class action lawsuits or class-wide arbitration.
              </p>
              <p className="leading-relaxed text-gray-700">
                <strong>Small Claims Court:</strong> Either party may pursue a claim in small claims court instead of arbitration if the claim qualifies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                17. Severability & Entire Agreement
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.
              </p>
              <p className="leading-relaxed text-gray-700">
                These Terms, together with our Privacy Policy and Refund Policy, constitute the entire agreement between you and AI FastScale regarding the 7 Minute AgentClone Course and supersede all prior agreements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                18. Contact Information
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="rounded-xl border-2 border-yellow-400 bg-yellow-50 p-6">
                <p className="mb-2 font-bold text-gray-900">AI FastScale</p>
                <p className="text-gray-700">Email: support@aifastscale.com</p>
                <p className="text-gray-700">Phone: +1 (555) 123-4567</p>
                <p className="text-gray-700">Address: Miami, FL USA</p>
              </div>
            </section>

            <div className="mt-8 rounded-xl border-2 border-yellow-400 bg-gradient-to-r from-yellow-100 to-orange-100 p-6">
              <p className="mb-2 font-bold text-gray-900">
                By purchasing and using the 7 Minute AgentClone Course, you
                acknowledge that you have read, understood, and agree to be
                bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
