import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | AI FastScale',
  description: 'Privacy Policy for AI FastScale - 7 Minute AgentClone Course',
}

export default function PrivacyPolicy() {
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
            Privacy Policy
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
                1. Introduction
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Welcome to AI FastScale ("we," "our," or "us"). We are committed
                to protecting your personal information and your right to
                privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you visit our
                website and purchase our 7 Minute AgentClone Course.
              </p>
              <p className="leading-relaxed text-gray-700">
                By using our service, you agree to the collection and use of
                information in accordance with this policy. If you do not agree
                with our policies and practices, please do not use our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                2. Information We Collect
              </h2>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Personal Information
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                We collect personal information that you voluntarily provide to
                us when you:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Purchase our course or services</li>
                <li>Register for an account</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact us for customer support</li>
                <li>Participate in surveys or promotions</li>
              </ul>
              <p className="mb-4 leading-relaxed text-gray-700">
                This information may include:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  Name and contact information (email address, phone number)
                </li>
                <li>
                  Billing and payment information (processed securely through
                  Stripe)
                </li>
                <li>Account credentials (username, password)</li>
                <li>
                  Professional information (real estate license, brokerage
                  affiliation)
                </li>
                <li>Communication preferences</li>
              </ul>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                Automatically Collected Information
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                When you visit our website, we automatically collect certain
                information about your device, including:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>IP address and browser type</li>
                <li>Operating system and device information</li>
                <li>Pages viewed and time spent on pages</li>
                <li>Referring website addresses</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                3. How We Use Your Information
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                We use the information we collect to:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Process your orders and deliver the course materials</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>
                  Send you updates, course materials, and educational content
                </li>
                <li>Improve our website, products, and services</li>
                <li>Detect and prevent fraud and security issues</li>
                <li>Comply with legal obligations</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Analyze usage patterns and optimize user experience</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                4. Payment Processing & PCI-DSS Compliance
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>Important:</strong> We do NOT store, process, or have access to your full credit card information. All payment processing is handled by our PCI-DSS Level 1 certified payment processor.
              </p>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Stripe Payment Processing
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                All payments are processed through Stripe, Inc., a PCI-DSS Level 1 Service Provider. When you make a purchase:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Your payment card information is transmitted directly to Stripe using industry-standard TLS encryption</li>
                <li>We NEVER receive or store your full credit card number, CVV, or card expiration date</li>
                <li>Stripe stores your payment information securely in compliance with PCI-DSS standards</li>
                <li>We only receive limited information such as: cardholder name, last 4 digits of card, card brand (Visa, Mastercard, etc.)</li>
                <li>All transactions are protected by Stripe's advanced fraud detection systems</li>
              </ul>
              <p className="mb-4 leading-relaxed text-gray-700">
                For more information about how Stripe protects your payment data, please visit:{' '}
                <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="font-bold text-yellow-600 hover:text-yellow-700 underline">
                  https://stripe.com/privacy
                </a>
              </p>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                Chargeback & Dispute Process
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                If you dispute a charge or initiate a chargeback:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Your payment processor (Stripe) will handle the dispute investigation</li>
                <li>We may share transaction details and communication records to resolve the dispute</li>
                <li>Fraudulent chargebacks may result in permanent account termination and reporting to fraud prevention networks</li>
                <li>For legitimate issues, please contact support@aifastscale.com first - we resolve 95% of issues without chargebacks</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                5. Information Sharing and Disclosure
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                We do not sell your personal information. We may share your
                information with:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  <strong>Payment Processors:</strong> Stripe, Inc. for payment processing (see Section 4 for details)
                </li>
                <li>
                  <strong>Email Service Providers:</strong> To send course materials, updates, and transactional emails
                </li>
                <li>
                  <strong>Analytics Providers:</strong> Google Analytics, Meta Pixel (Facebook), TikTok Pixel, Microsoft Clarity for website analytics and advertising
                </li>
                <li>
                  <strong>Hosting Providers:</strong> Vercel, Inc. for website hosting and content delivery
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law,
                  court order, or government regulation
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a
                  merger, sale, or acquisition of our business
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                6. Cookies and Tracking Technologies
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                We use cookies, pixels, and similar tracking technologies to enhance your experience and analyze website performance. By using our website, you consent to our use of these technologies.
              </p>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Tracking Technologies We Use:
              </h3>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  <strong>Google Analytics (GA4):</strong> Tracks website usage, traffic sources, and user behavior. Data is anonymized and used for analytics purposes.{' '}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:text-yellow-700 underline">Privacy Policy</a>
                </li>
                <li>
                  <strong>Meta Pixel (Facebook):</strong> Tracks conversions and enables retargeting advertising on Facebook and Instagram.{' '}
                  <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:text-yellow-700 underline">Privacy Policy</a>
                </li>
                <li>
                  <strong>TikTok Pixel:</strong> Tracks conversions and enables advertising on TikTok platform.{' '}
                  <a href="https://www.tiktok.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:text-yellow-700 underline">Privacy Policy</a>
                </li>
                <li>
                  <strong>Microsoft Clarity:</strong> Records session replays and heatmaps to improve user experience.{' '}
                  <a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:text-yellow-700 underline">Privacy Policy</a>
                </li>
                <li>
                  <strong>Essential Cookies:</strong> Required for website functionality, including shopping cart, checkout, and user authentication.
                </li>
              </ul>

              <h3 className="mt-4 mb-3 text-xl font-bold text-gray-900">
                Managing Cookies:
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                You can control cookies through your browser settings. However, disabling cookies may affect website functionality. Most browsers allow you to:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>View and delete existing cookies</li>
                <li>Block third-party cookies</li>
                <li>Block all cookies from specific websites</li>
                <li>Delete all cookies when you close your browser</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                7. Data Retention
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                We retain your personal information only as long as necessary to fulfill the purposes outlined in this Privacy Policy:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li><strong>Transaction Data:</strong> 7 years (tax and legal compliance)</li>
                <li><strong>Course Access:</strong> Lifetime (as promised in your purchase)</li>
                <li><strong>Email Communications:</strong> Until you unsubscribe or request deletion</li>
                <li><strong>Support Tickets:</strong> 3 years for quality assurance</li>
                <li><strong>Analytics Data:</strong> 26 months (Google Analytics default)</li>
                <li><strong>Deleted Accounts:</strong> Permanently deleted within 30 days (except transaction records required by law)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                8. Data Security
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                We implement appropriate technical and organizational security
                measures to protect your personal information:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>SSL/TLS encryption for all data transmission</li>
                <li>PCI-DSS compliant payment processing (Stripe)</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication requirements</li>
                <li>Secure backup and disaster recovery procedures</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                However, no method of transmission over the internet or electronic storage
                is 100% secure. While we strive to use commercially acceptable
                means to protect your information, we cannot guarantee absolute
                security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                9. Your Privacy Rights (GDPR & CCPA)
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Depending on your location, you may have the following rights under GDPR (European Union) and CCPA (California):
              </p>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                General Privacy Rights:
              </h3>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  <strong>Right to Access:</strong> Request a copy of the personal
                  information we hold about you
                </li>
                <li>
                  <strong>Right to Correction:</strong> Request correction of inaccurate
                  or incomplete information
                </li>
                <li>
                  <strong>Right to Deletion:</strong> Request deletion of your personal
                  information (subject to legal retention requirements)
                </li>
                <li>
                  <strong>Right to Opt-Out:</strong> Unsubscribe from marketing
                  communications at any time
                </li>
                <li>
                  <strong>Right to Data Portability:</strong> Request transfer of your
                  data to another service in a machine-readable format
                </li>
                <li>
                  <strong>Right to Object:</strong> Object to processing of your data for direct marketing
                </li>
              </ul>

              <h3 className="mt-4 mb-3 text-xl font-bold text-gray-900">
                California Residents (CCPA):
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Right to know what personal information is collected, used, shared, or sold</li>
                <li>Right to delete personal information (with certain exceptions)</li>
                <li>Right to opt-out of the sale of personal information (Note: We do NOT sell your information)</li>
                <li>Right to non-discrimination for exercising your privacy rights</li>
              </ul>

              <h3 className="mt-4 mb-3 text-xl font-bold text-gray-900">
                EU Residents (GDPR):
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                If you are in the European Economic Area (EEA), you have additional rights under the General Data Protection Regulation (GDPR):
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Right to withdraw consent at any time</li>
                <li>Right to restrict processing of your data</li>
                <li>Right to lodge a complaint with your local data protection authority</li>
                <li>Right to object to automated decision-making and profiling</li>
              </ul>

              <p className="mt-4 leading-relaxed text-gray-700">
                <strong>To exercise any of these rights, please contact us at support@aifastscale.com</strong>
                <br />
                We will respond to your request within 30 days (GDPR) or 45 days (CCPA).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                10. Children's Privacy
              </h2>
              <p className="leading-relaxed text-gray-700">
                Our service is not intended for individuals under the age of 18.
                We do not knowingly collect personal information from children.
                If you believe we have collected information from a child,
                please contact us immediately at support@aifastscale.com and we will take immediate action to delete such information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                11. International Data Transfers
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Your information may be transferred to and maintained on
                computers located outside of your state, province, country, or
                other governmental jurisdiction where data protection laws may
                differ. If you are located in the European Economic Area (EEA) or other regions with data protection laws, please note that:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>We process data in the United States and other countries</li>
                <li>We implement appropriate safeguards including Standard Contractual Clauses (SCCs) where required</li>
                <li>Our payment processor Stripe complies with international data transfer regulations</li>
                <li>By using our service, you consent to this transfer and processing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                12. Changes to This Privacy Policy
              </h2>
              <p className="leading-relaxed text-gray-700">
                We may update our Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will
                notify you of any material changes by:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Posting the new Privacy Policy on this page</li>
                <li>Updating the "Last updated" date at the top</li>
                <li>Sending an email notification for significant changes (if you have an account)</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                You are advised to review this Privacy Policy periodically. Continued use of our service after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                13. Contact Us & Data Protection Officer
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                If you have any questions about this Privacy Policy, please
                contact us:
              </p>
              <div className="rounded-xl border-2 border-yellow-400 bg-yellow-50 p-6">
                <p className="mb-2 font-bold text-gray-900">AI FastScale</p>
                <p className="text-gray-700">Email: support@aifastscale.com</p>
                <p className="text-gray-700">Phone: +1 (555) 123-4567</p>
                <p className="text-gray-700">Address: Miami, FL USA</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
