import Link from 'next/link'
import { ArrowLeft, ShieldCheck, Mail, Phone, CheckCircle, XCircle } from 'lucide-react'
import ComplianceFooter from '../components/ComplianceFooter'

export const metadata = {
  title: 'Do Not Sell My Personal Information | AI FastScale',
  description: 'California Consumer Privacy Act (CCPA) - Do Not Sell My Personal Information for Velon LLC',
}

export default function DoNotSellPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-20">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 font-bold text-amber-600 transition-colors hover:text-amber-700"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Home
        </Link>

        <div className="rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-2xl md:p-12">
          <h1 className="mb-4 text-4xl font-black text-gray-900 md:text-5xl">
            Do Not Sell My Personal Information
          </h1>
          <p className="mb-8 text-gray-600">
            Last updated: February 2, 2026
          </p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                California Consumer Privacy Act (CCPA) Notice
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Under the California Consumer Privacy Act (CCPA), California residents have the right to
                opt out of the &quot;sale&quot; of their personal information. The CCPA defines &quot;sale&quot; broadly
                to include sharing personal information for monetary or other valuable consideration.
              </p>
            </section>

            <section className="mb-8">
              <div className="rounded-xl border-2 border-green-400 bg-green-50 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <ShieldCheck className="w-8 h-8 text-green-600" />
                  <h2 className="text-2xl font-black text-gray-900 m-0">Our Policy</h2>
                </div>
                <p className="mb-0 text-gray-700 text-lg">
                  <strong>Velon LLC does NOT sell your personal information to third parties.</strong>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <p className="mb-4 leading-relaxed text-gray-700">
                Since we do not sell personal information, there is no sale to opt out of. We use your
                data solely for the following purposes:
              </p>
              <div className="grid gap-3 mb-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700 m-0">Process your orders and deliver course materials</p>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700 m-0">Provide customer support and respond to inquiries</p>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700 m-0">Send transactional emails (order confirmations, access links, credential reminders)</p>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700 m-0">Send marketing emails (only with your consent, and you can unsubscribe anytime)</p>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700 m-0">Improve our website, products, and services</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                Third-Party Service Providers
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                We share limited data with service providers who help us operate our business. These providers
                are contractually bound to use your data <strong>only</strong> for the services they provide to us:
              </p>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 font-bold text-gray-900">Provider</th>
                      <th className="text-left px-4 py-3 font-bold text-gray-900">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-gray-700">Whop</td>
                      <td className="px-4 py-3 text-gray-600">Payment processing</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-700">Vercel</td>
                      <td className="px-4 py-3 text-gray-600">Website hosting and content delivery</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-700">Resend</td>
                      <td className="px-4 py-3 text-gray-600">Transactional email delivery</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-700">Meta (Facebook)</td>
                      <td className="px-4 py-3 text-gray-600">Advertising analytics (only with cookie consent)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-700">Upstash</td>
                      <td className="px-4 py-3 text-gray-600">Database services</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 leading-relaxed text-gray-700">
                <strong>Note:</strong> Sharing data with service providers to help us operate our business
                is not considered a &quot;sale&quot; under CCPA.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                What We Do NOT Do
              </h2>
              <div className="grid gap-3 mb-4">
                <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700 m-0">We do NOT sell your email address to third-party marketers</p>
                </div>
                <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700 m-0">We do NOT sell your personal information to data brokers</p>
                </div>
                <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700 m-0">We do NOT share your data for third-party advertising (except Meta with consent)</p>
                </div>
                <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700 m-0">We do NOT monetize your personal information in any way</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                Your CCPA Rights
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                As a California resident, you have the right to:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li><strong>Right to Know:</strong> Request what personal information we collect, use, disclose, and sell (we don&apos;t sell any)</li>
                <li><strong>Right to Delete:</strong> Request deletion of your personal information (subject to legal exceptions)</li>
                <li><strong>Right to Opt-Out:</strong> Opt out of the sale of personal information (not applicable as we don&apos;t sell)</li>
                <li><strong>Right to Non-Discrimination:</strong> Exercise your rights without discrimination</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                Contact Us
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                To exercise your CCPA rights or ask questions about our privacy practices:
              </p>
              <div className="rounded-xl border-2 border-amber-400 bg-amber-50 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="w-5 h-5 text-amber-600" />
                  <span className="font-bold text-gray-900">Email:</span>
                  <a href="mailto:support@aifastscale.com" className="text-amber-600 hover:text-amber-700">
                    support@aifastscale.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-amber-600" />
                  <span className="font-bold text-gray-900">Phone:</span>
                  <a href="tel:+13073355058" className="text-amber-600 hover:text-amber-700">
                    +1 (307) 335-5058
                  </a>
                </div>
              </div>
              <p className="mt-4 leading-relaxed text-gray-700">
                We will respond to verified requests within <strong>45 days</strong> as required by CCPA.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                More Information
              </h2>
              <p className="leading-relaxed text-gray-700">
                For complete details about how we collect, use, and protect your personal information,
                please read our full{' '}
                <Link href="/privacy-policy" className="text-amber-600 hover:text-amber-700 underline">
                  Privacy Policy
                </Link>.
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
              <p>Document Version: 1.0</p>
              <p>Last Updated: February 2, 2026</p>
              <p>Previous versions available upon request at support@aifastscale.com</p>
            </div>
          </div>
        </div>
        <ComplianceFooter />
      </div>
    </div>
  )
}
