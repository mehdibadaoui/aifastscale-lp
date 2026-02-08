import Link from 'next/link'
import { ArrowLeft, CheckCircle, Mail, Phone } from 'lucide-react'
import ComplianceFooter from '../components/ComplianceFooter'

export const metadata = {
  title: 'Accessibility Statement | AI FastScale',
  description: 'Accessibility commitment and statement for Partnearn LLC - CloneYourself Video System',
}

export default function AccessibilityPage() {
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
            Accessibility Statement
          </h1>
          <p className="mb-8 text-gray-600">
            Last updated: February 2, 2026
          </p>

          <div className="prose prose-lg max-w-none">
            <div className="mb-8 rounded-xl border-2 border-blue-400 bg-blue-50 p-6">
              <p className="mb-0 text-gray-700">
                Partnearn LLC is committed to ensuring digital accessibility for people with disabilities.
                We continually improve the user experience for everyone and apply relevant accessibility standards.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                Our Commitment
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                We aim to conform to Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
                These guidelines explain how to make web content more accessible for people with disabilities
                and more user-friendly for everyone.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                Measures We Take
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Partnearn LLC takes the following measures to ensure accessibility:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Semantic HTML Structure</p>
                    <p className="text-sm text-gray-600">Proper heading hierarchy and landmark regions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Text Alternatives</p>
                    <p className="text-sm text-gray-600">Alt text for meaningful images</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Color Contrast</p>
                    <p className="text-sm text-gray-600">Sufficient contrast for readability</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Keyboard Navigation</p>
                    <p className="text-sm text-gray-600">All interactive elements accessible via keyboard</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Consistent Navigation</p>
                    <p className="text-sm text-gray-600">Predictable layout and navigation patterns</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Clear Link Text</p>
                    <p className="text-sm text-gray-600">Descriptive link text for screen readers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Focus Indicators</p>
                    <p className="text-sm text-gray-600">Visible focus states for interactive elements</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Responsive Design</p>
                    <p className="text-sm text-gray-600">Content adapts to different screen sizes</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                Compatibility
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Our website is designed to be compatible with:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Recent versions of popular screen readers (NVDA, JAWS, VoiceOver)</li>
                <li>Modern web browsers (Chrome, Firefox, Safari, Edge)</li>
                <li>Desktop and mobile devices</li>
                <li>Operating systems (Windows, macOS, iOS, Android)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                Known Limitations
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Despite our best efforts, some content may not yet be fully accessible:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li><strong>Third-party content:</strong> Some embedded videos from third-party platforms may not have captions or audio descriptions.</li>
                <li><strong>PDF documents:</strong> Some downloadable resources may not be fully screen-reader compatible.</li>
                <li><strong>Legacy content:</strong> Older content may not meet current accessibility standards.</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                We are actively working to address these limitations and improve accessibility across all our content.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                Feedback
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                We welcome your feedback on the accessibility of our website. Please let us know if you
                encounter accessibility barriers:
              </p>
              <div className="rounded-xl border-2 border-amber-400 bg-amber-50 p-6 mb-4">
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
              <p className="leading-relaxed text-gray-700">
                We will respond to accessibility feedback within <strong>5 business days</strong>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                Formal Complaints
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                If you are not satisfied with our response to your accessibility concern, you may escalate
                your complaint to the appropriate regulatory body in your jurisdiction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                Assessment Approach
              </h2>
              <p className="leading-relaxed text-gray-700">
                Partnearn LLC assesses the accessibility of our website through self-evaluation, automated
                testing tools, and user feedback. We conduct regular accessibility reviews and are
                committed to continuous improvement.
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
