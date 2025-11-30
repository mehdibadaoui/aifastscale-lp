import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | AI FastScale',
  description: 'Privacy Policy for AI FastScale - 7 Minute AgentClone Course. Payment gateway compliance and data protection.',
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
                1. Introduction & Commitment
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Welcome to AI FastScale ("Company," "we," "us," or "our"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and purchase our 7 Minute AgentClone Course.
              </p>
              <p className="leading-relaxed text-gray-700">
                By using our service, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                2. Information We Collect
              </h2>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                2.1 Personal Information You Provide
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                We collect personal information that you voluntarily provide when you:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Purchase our course or services</li>
                <li>Register for an account</li>
                <li>Subscribe to our newsletter or email list</li>
                <li>Contact us for customer support</li>
                <li>Participate in surveys, contests, or promotions</li>
              </ul>
              <p className="mb-4 leading-relaxed text-gray-700">
                This information may include:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Full name and contact information (email, phone number)</li>
                <li>Billing address and shipping address (if applicable)</li>
                <li>Account credentials (username, password)</li>
                <li>Professional information (real estate license, brokerage)</li>
                <li>Communication preferences and interests</li>
              </ul>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                2.2 Automatically Collected Information
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                When you visit our website, we automatically collect certain information:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>IP address and geolocation data</li>
                <li>Browser type and version</li>
                <li>Operating system and device type</li>
                <li>Pages visited and time spent on each page</li>
                <li>Referral website addresses</li>
                <li>Click stream data and interaction patterns</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                2.3 Payment Information - CRITICAL
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>IMPORTANT:</strong> AI FastScale DOES NOT collect, store, process, or have access to your payment card information. Your payment data is handled exclusively by our PCI-DSS compliant payment processor. We only receive:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Cardholder name</li>
                <li>Last 4 digits of card</li>
                <li>Card brand (Visa, Mastercard, etc.)</li>
                <li>Transaction ID and confirmation status</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                Your full card number, CVV, and expiration date are NEVER transmitted to, stored by, or accessible to AI FastScale. Your payment security is guaranteed by industry-leading encryption and compliance standards.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                3. How We Use Your Information
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                We use the information we collect for the following purposes:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Process your purchase orders and deliver course materials</li>
                <li>Create and manage your customer account</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send you course materials, updates, and educational content</li>
                <li>Send transactional emails (confirmations, receipts, access links)</li>
                <li>Improve our website, products, and customer experience</li>
                <li>Detect and prevent fraud, security breaches, and abuse</li>
                <li>Comply with legal obligations and payment processor requirements</li>
                <li>Send marketing communications (only with your consent)</li>
                <li>Analyze usage patterns and optimize user experience</li>
                <li>Conduct research and develop new products/services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                4. Payment Processing & PCI-DSS Compliance
              </h2>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                4.1 Secure Payment Processing
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                All payments are processed through our PCI-DSS Level 1 certified payment processor. When you make a purchase:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Your payment card information is encrypted using TLS 1.2+</li>
                <li>Payment data is transmitted directly to the payment processor</li>
                <li>AI FastScale servers NEVER handle your full card information</li>
                <li>Your payment processor stores card data securely in compliance with PCI-DSS</li>
                <li>All transactions are protected by advanced fraud detection systems</li>
              </ul>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                4.2 Payment Processor Integration
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                Our payment processor complies with:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>PCI-DSS Level 1 Compliance</li>
                <li>SOC 2 Type II Certification</li>
                <li>GDPR and international data protection standards</li>
                <li>Advanced fraud prevention and security protocols</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                For details about how our payment processor handles your data, please review their privacy policy.
              </p>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                4.3 Chargeback & Dispute Handling
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                If you initiate a chargeback or payment dispute:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Your payment processor handles the dispute investigation</li>
                <li>We may share transaction details and communication records to resolve the dispute</li>
                <li>Fraudulent chargebacks may be reported to fraud prevention networks</li>
                <li>Your account may be suspended or terminated</li>
                <li>For legitimate issues, contact support@aifastscale.com first - we resolve 95% of issues without chargebacks</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                5. Information Sharing & Third-Party Services
              </h2>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                5.1 We Do Not Sell Your Data
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>CRITICAL:</strong> AI FastScale DOES NOT sell, rent, or trade your personal information to third parties for marketing purposes. Your data is used exclusively for the purposes stated in this policy.
              </p>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                5.2 Third Parties We Share Information With
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                We may share your information with the following service providers only as necessary to provide our service:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  <strong>Payment Processors:</strong> For secure payment processing
                </li>
                <li>
                  <strong>Email Service Providers:</strong> For sending course materials, updates, and transactional emails
                </li>
                <li>
                  <strong>Hosting Providers:</strong> Vercel for website hosting and content delivery
                </li>
                <li>
                  <strong>Analytics Providers:</strong> Meta Pixel for analytics and advertising
                </li>
                <li>
                  <strong>Legal/Compliance:</strong> When required by law, court order, or regulation
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with merger, sale, or acquisition
                </li>
              </ul>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                5.3 Data Processor Agreements
              </h3>
              <p className="leading-relaxed text-gray-700">
                All third-party service providers are contractually required to protect your data and use it only for the stated purposes. We verify that all processors comply with data protection standards including GDPR, CCPA, and PCI-DSS.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                6. Cookies & Tracking Technologies
              </h2>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                6.1 What Are Cookies?
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                Cookies are small text files stored on your device that help us recognize you and enhance your experience. We use essential cookies for functionality and optional cookies for analytics and advertising.
              </p>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                6.2 Tracking Technologies We Use
              </h3>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  <strong>Meta Pixel (Facebook):</strong> Tracks conversions and enables retargeting on Facebook/Instagram.
                  <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:text-yellow-700 underline ml-1">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <strong>Essential Cookies:</strong> Required for website functionality (checkout, authentication, shopping cart)
                </li>
              </ul>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                6.3 Managing Your Cookies
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                You can control cookies through your browser settings:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>View and delete existing cookies</li>
                <li>Block third-party cookies</li>
                <li>Block all cookies from specific websites</li>
                <li>Receive notifications when cookies are sent</li>
                <li>Delete all cookies when closing your browser</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                Note: Disabling cookies may affect website functionality, including checkout and account access.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                7. Data Retention
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                We retain your personal information only as long as necessary:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li><strong>Transaction Data:</strong> 7 years (tax and legal compliance requirements)</li>
                <li><strong>Course Access:</strong> Lifetime (as promised in your purchase)</li>
                <li><strong>Email Communications:</strong> Until you unsubscribe or request deletion</li>
                <li><strong>Support Tickets:</strong> 3 years (quality assurance and dispute resolution)</li>
                <li><strong>Analytics Data:</strong> 26 months</li>
                <li><strong>Deleted Accounts:</strong> Permanently deleted within 30 days (except records required by law)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                8. Data Security
              </h2>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                8.1 Security Measures
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                We implement industry-leading technical and organizational security measures:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>SSL/TLS encryption for all data transmission</li>
                <li>PCI-DSS Level 1 compliant payment processing</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Multi-factor authentication for user accounts</li>
                <li>Secure backup and disaster recovery procedures</li>
                <li>Access controls and role-based permissions</li>
                <li>Intrusion detection and prevention systems</li>
              </ul>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                8.2 Security Limitations
              </h3>
              <p className="leading-relaxed text-gray-700">
                While we strive to use commercially acceptable means to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security, but we maintain the highest industry standards. You are responsible for maintaining the confidentiality of your account credentials.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                9. Your Privacy Rights
              </h2>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                9.1 Universal Privacy Rights
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li><strong>Right to Access:</strong> Request a copy of your personal information</li>
                <li><strong>Right to Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Right to Deletion:</strong> Request deletion of your data (subject to legal requirements)</li>
                <li><strong>Right to Opt-Out:</strong> Unsubscribe from marketing communications anytime</li>
                <li><strong>Right to Data Portability:</strong> Request transfer of your data in a machine-readable format</li>
                <li><strong>Right to Object:</strong> Object to processing for direct marketing</li>
              </ul>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                9.2 EU Residents (GDPR)
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                If you are in the European Economic Area (EEA), you have additional rights under the General Data Protection Regulation (GDPR):
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Right to withdraw consent at any time</li>
                <li>Right to restrict processing of your data</li>
                <li>Right to lodge a complaint with your local data protection authority</li>
                <li>Right to object to automated decision-making</li>
              </ul>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                9.3 California Residents (CCPA)
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                If you are a California resident, you have rights under the California Consumer Privacy Act (CCPA):
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Right to know what personal information is collected, used, and shared</li>
                <li>Right to delete personal information (with certain exceptions)</li>
                <li>Right to opt-out of the sale of personal information (We do NOT sell your data)</li>
                <li>Right to non-discrimination for exercising your privacy rights</li>
              </ul>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                9.4 Exercising Your Rights
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>To exercise any privacy rights, contact us at:</strong>
              </p>
              <p className="mb-4 leading-relaxed text-gray-700">
                Email: support@aifastscale.com<br />
                Include your name, email address, and the specific right you are requesting.
              </p>
              <p className="leading-relaxed text-gray-700">
                <strong>Response Timeframe:</strong> We will respond within 30 days (GDPR) or 45 days (CCPA) of receiving your request.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                10. Children's Privacy
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Our service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected information from a child under 18, we will immediately delete such information and terminate the child's account.
              </p>
              <p className="leading-relaxed text-gray-700">
                If you believe we have collected information from a child under 18, please contact us immediately at support@aifastscale.com.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                11. International Data Transfers
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Your information may be transferred to, stored in, and processed in the United States and other countries where our service providers operate. Data protection laws in these countries may differ from your home country.
              </p>
              <p className="mb-4 leading-relaxed text-gray-700">
                If you are located in the European Economic Area (EEA) or other regions with data protection regulations, please note:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>We process data in the United States and other countries</li>
                <li>We implement appropriate safeguards including Standard Contractual Clauses (SCCs)</li>
                <li>Our payment processor complies with international data transfer requirements</li>
                <li>By using our service, you consent to this transfer</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                12. Changes to This Privacy Policy
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of material changes by:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Posting the new Privacy Policy on this page</li>
                <li>Updating the "Last updated" date at the top</li>
                <li>Sending an email notification for significant changes (if applicable)</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                Your continued use of our service after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                13. Contact Us
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                If you have questions about this Privacy Policy or how we handle your data:
              </p>
              <div className="rounded-xl border-2 border-yellow-400 bg-yellow-50 p-6">
                <p className="mb-2 font-bold text-gray-900">AI FastScale</p>
                <p className="text-gray-700">Email: support@aifastscale.com</p>
                <p className="text-gray-700">Instagram: @sara.theagent</p>
                <p className="text-gray-700">Address: Miami, FL USA</p>
              </div>
            </section>

            <div className="mt-8 rounded-xl border-2 border-yellow-400 bg-gradient-to-r from-yellow-100 to-orange-100 p-6">
              <p className="mb-2 font-bold text-gray-900">Your Privacy Matters</p>
              <p className="mb-0 text-gray-700">
                We take data privacy seriously. Your personal information is protected with the highest industry standards, and we never sell your data to third parties. Your trust is our most valuable asset.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
