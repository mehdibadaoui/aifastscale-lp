import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Disclaimer | AI FastScale',
  description: 'Disclaimer for AI FastScale - 7 Minute AgentClone Course',
}

export default function Disclaimer() {
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
            Disclaimer
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
            <div className="mb-8 rounded-xl border-2 border-blue-400 bg-blue-50 p-6">
              <p className="mb-2 font-bold text-gray-900">Important Notice</p>
              <p className="mb-0 text-gray-700">
                Please read this disclaimer carefully before using the AI
                FastScale website or purchasing the 7 Minute AgentClone Course.
                By accessing or using our service, you acknowledge that you have
                read, understood, and agree to be bound by this disclaimer.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                1. General Information
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                The information provided by AI FastScale ("we," "us," or "our")
                on our website and in the 7 Minute AgentClone Course is for
                general informational and educational purposes only. All
                information is provided in good faith; however, we make no
                representation or warranty of any kind, express or implied,
                regarding the accuracy, adequacy, validity, reliability,
                availability, or completeness of any information.
              </p>
              <p className="leading-relaxed text-gray-700">
                Under no circumstance shall we have any liability to you for any
                loss or damage of any kind incurred as a result of the use of
                our service or reliance on any information provided. Your use of
                our service and your reliance on any information is solely at
                your own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                2. No Guarantees of Results
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>IMPORTANT:</strong> While we provide tools, training,
                and strategies designed to help real estate agents generate
                leads and improve their marketing, we make NO GUARANTEES
                regarding specific results, income, leads, or sales.
              </p>
              <p className="mb-4 leading-relaxed text-gray-700">
                Any references to lead generation numbers, such as "5-15 leads
                per week" or "100+ monthly leads," are examples based on case
                studies and testimonials from specific users. These results are
                NOT typical and should NOT be interpreted as a guarantee or
                promise of your individual results.
              </p>
              <p className="mb-4 leading-relaxed text-gray-700">
                Your results will depend on many factors, including but not
                limited to:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  Your level of effort and commitment to implementing the
                  strategies
                </li>
                <li>
                  Your existing skills, experience, and knowledge in real estate
                  and marketing
                </li>
                <li>Your local market conditions and competition</li>
                <li>The quality and consistency of your content creation</li>
                <li>Your adherence to platform policies and best practices</li>
                <li>
                  Economic conditions and external factors beyond your control
                </li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                <strong>
                  We do not guarantee that you will achieve any specific level
                  of earnings, leads, sales, or success.
                </strong>{' '}
                Any earnings or results mentioned are not indicative of future
                performance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                3. Educational Purpose Only
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                The 7 Minute AgentClone Course is an educational product
                designed to teach real estate agents how to create AI-generated
                talking videos for marketing purposes. It is NOT:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Professional business advice or consulting</li>
                <li>Legal, financial, or tax advice</li>
                <li>A guarantee of leads, sales, or income</li>
                <li>
                  A substitute for professional real estate training or
                  licensing
                </li>
                <li>An automated or "done-for-you" service</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                The course provides information and tools that require your own
                effort, time, and expertise to implement successfully.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                4. Testimonials and Case Studies
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Testimonials and case studies presented on our website or in our
                marketing materials reflect the real experiences of actual
                users. However, these testimonials are not representative of all
                users' experiences and are not guarantees of future results.
              </p>
              <p className="mb-4 leading-relaxed text-gray-700">
                Individual results vary significantly based on personal effort,
                market conditions, skill level, and other factors. The
                experiences shared by successful users should be considered
                exceptional rather than typical.
              </p>
              <p className="leading-relaxed text-gray-700">
                <strong>Testimonial Disclaimer:</strong> Testimonials may have
                been edited for clarity, grammar, or length. Some testimonials
                may be compensated or incentivized. All testimonials are
                voluntary and reflect genuine user feedback.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                5. Third-Party Tools and Services
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                The course teaches you how to use various third-party AI tools
                and platforms (such as AI video generation services, social
                media platforms, etc.). We are NOT affiliated with, endorsed by,
                or sponsored by these third-party services unless explicitly
                stated.
              </p>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>Important Limitations:</strong>
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  Third-party tools may change their features, pricing, or
                  policies at any time without notice
                </li>
                <li>
                  We have no control over the availability, functionality, or
                  performance of third-party services
                </li>
                <li>
                  You are responsible for complying with the terms of service of
                  any third-party platforms you use
                </li>
                <li>
                  Additional costs may be required for third-party tools beyond
                  the course price
                </li>
                <li>
                  We are not responsible for issues, downtime, or changes to
                  third-party services
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                6. Real Estate Compliance
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                As a real estate professional,{' '}
                <strong>YOU are solely responsible</strong> for ensuring your
                use of AI-generated videos and marketing materials complies
                with:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Your state's real estate licensing laws and regulations</li>
                <li>MLS (Multiple Listing Service) rules and policies</li>
                <li>Your broker's requirements and approval processes</li>
                <li>Federal and state fair housing laws</li>
                <li>Truth in advertising and anti-discrimination laws</li>
                <li>Copyright and intellectual property laws</li>
                <li>Privacy and data protection regulations</li>
              </ul>
              <p className="mb-4 leading-relaxed text-gray-700">
                While we provide general compliance guidance and broker overlay
                templates, <strong>we are not providing legal advice</strong>.
                You must:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  Verify with your broker before posting any marketing content
                </li>
                <li>Include all required disclosures in your videos</li>
                <li>
                  Obtain proper permissions for property photos and information
                </li>
                <li>Comply with all applicable laws in your jurisdiction</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                We are not responsible for any violations, fines, penalties, or
                legal issues resulting from your use of the course materials.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                7. AI-Generated Content Disclaimer
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                This course teaches you to create AI-generated talking videos.
                You acknowledge and understand that:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  AI-generated content may not always be 100% accurate or
                  perfect
                </li>
                <li>
                  You are responsible for reviewing and approving all
                  AI-generated content before publishing
                </li>
                <li>
                  Some platforms may require disclosure that content is
                  AI-generated
                </li>
                <li>
                  AI technology is evolving rapidly; features and capabilities
                  may change
                </li>
                <li>
                  You must ensure AI-generated content does not violate
                  copyright or intellectual property rights
                </li>
                <li>
                  You are responsible for the factual accuracy of information in
                  your videos
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                8. Platform Policy Compliance
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                When using the strategies taught in this course on social media
                platforms (Facebook, Instagram, TikTok, YouTube, etc.), you are
                responsible for:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  Complying with each platform's terms of service and community
                  guidelines
                </li>
                <li>
                  Understanding and following platform-specific rules for
                  AI-generated content
                </li>
                <li>Maintaining your accounts in good standing</li>
                <li>
                  Accepting the risk of content removal, account suspension, or
                  other enforcement actions
                </li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                Platform policies change frequently. What is permitted today may
                not be allowed tomorrow. We are not responsible for any account
                actions, content removal, or policy violations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                9. Professional Advice Disclaimer
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                The information in this course is NOT a substitute for
                professional advice. For specific situations, you should
                consult:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  <strong>Legal advice:</strong> Consult an attorney for legal
                  questions or compliance issues
                </li>
                <li>
                  <strong>Tax advice:</strong> Consult a CPA or tax professional
                  for tax-related questions
                </li>
                <li>
                  <strong>Real estate broker:</strong> Consult your broker for
                  brokerage-specific policies and requirements
                </li>
                <li>
                  <strong>Technical support:</strong> Consult the respective
                  third-party service providers for technical issues with their
                  tools
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                10. Website and Content Updates
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                We may update the course content, website information, or
                materials at any time without notice. While we strive to keep
                information current and accurate, we make no representations
                that:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  The website or course content is free from errors or omissions
                </li>
                <li>All information is complete, current, or up-to-date</li>
                <li>The service will be uninterrupted or error-free</li>
                <li>Any defects will be corrected</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                11. External Links Disclaimer
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Our website and course materials may contain links to external
                websites or third-party resources. These links are provided for
                convenience only. We do not:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  Endorse, warrant, or guarantee the content of external sites
                </li>
                <li>Control the content or policies of external sites</li>
                <li>
                  Accept responsibility for external site content or practices
                </li>
                <li>Make any representations about external websites</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                12. Limitation of Liability
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                To the fullest extent permitted by applicable law, AI FastScale,
                its owners, employees, agents, and affiliates shall not be
                liable for:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  Any direct, indirect, incidental, consequential, or punitive
                  damages
                </li>
                <li>
                  Loss of profits, revenue, data, or business opportunities
                </li>
                <li>
                  Account suspensions, bans, or content removal on third-party
                  platforms
                </li>
                <li>Results or lack of results from using the course</li>
                <li>Errors, omissions, or inaccuracies in course content</li>
                <li>Issues with third-party tools or services</li>
                <li>Legal or regulatory violations or penalties</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                Our total liability shall not exceed the amount you paid for the
                course ($37).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                13. Changes to This Disclaimer
              </h2>
              <p className="leading-relaxed text-gray-700">
                We reserve the right to modify this disclaimer at any time.
                Changes will be effective immediately upon posting to this page.
                Your continued use of our service after changes constitutes
                acceptance of the updated disclaimer.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                14. Contact Information
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                If you have any questions about this disclaimer, please contact
                us:
              </p>
              <div className="rounded-xl border-2 border-yellow-400 bg-yellow-50 p-6">
                <p className="mb-2 font-bold text-gray-900">AI FastScale</p>
                <p className="text-gray-700">Email: support@aifastscale.com</p>
                <p className="text-gray-700">Phone: +1 (555) 123-4567</p>
                <p className="text-gray-700">Address: Miami, FL USA</p>
              </div>
            </section>

            <div className="mt-8 rounded-xl border-2 border-blue-400 bg-gradient-to-r from-blue-100 to-cyan-100 p-6">
              <p className="mb-2 font-bold text-gray-900">Final Note</p>
              <p className="mb-0 text-gray-700">
                By purchasing and using the 7 Minute AgentClone Course, you
                acknowledge that you have read, understood, and agree to this
                disclaimer. You accept full responsibility for your use of the
                course materials and any results or consequences thereof.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
