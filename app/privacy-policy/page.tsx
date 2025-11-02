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
                4. Information Sharing and Disclosure
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                We do not sell your personal information. We may share your
                information with:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  <strong>Payment Processors:</strong> Stripe processes all
                  payments securely. We do not store your full credit card
                  information.
                </li>
                <li>
                  <strong>Service Providers:</strong> Third-party companies that
                  help us operate our business (email services, hosting,
                  analytics).
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law,
                  court order, or government regulation.
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a
                  merger, sale, or acquisition of our business.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                5. Cookies and Tracking Technologies
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                We use cookies and similar tracking technologies to track
                activity on our website and store certain information. You can
                instruct your browser to refuse all cookies or indicate when a
                cookie is being sent. However, if you do not accept cookies, you
                may not be able to use some portions of our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                6. Data Security
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                We implement appropriate technical and organizational security
                measures to protect your personal information. However, no
                method of transmission over the internet or electronic storage
                is 100% secure. While we strive to use commercially acceptable
                means to protect your information, we cannot guarantee absolute
                security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                7. Your Privacy Rights
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  <strong>Access:</strong> Request a copy of the personal
                  information we hold about you
                </li>
                <li>
                  <strong>Correction:</strong> Request correction of inaccurate
                  or incomplete information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal
                  information
                </li>
                <li>
                  <strong>Opt-out:</strong> Unsubscribe from marketing
                  communications at any time
                </li>
                <li>
                  <strong>Data Portability:</strong> Request transfer of your
                  data to another service
                </li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                To exercise these rights, please contact us at
                support@aifastscale.com
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                8. Children's Privacy
              </h2>
              <p className="leading-relaxed text-gray-700">
                Our service is not intended for individuals under the age of 18.
                We do not knowingly collect personal information from children.
                If you believe we have collected information from a child,
                please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                9. International Data Transfers
              </h2>
              <p className="leading-relaxed text-gray-700">
                Your information may be transferred to and maintained on
                computers located outside of your state, province, country, or
                other governmental jurisdiction where data protection laws may
                differ. By using our service, you consent to this transfer.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                10. Changes to This Privacy Policy
              </h2>
              <p className="leading-relaxed text-gray-700">
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date. You are advised
                to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                11. Contact Us
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
