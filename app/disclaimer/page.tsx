import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Disclaimer | AI FastScale',
  description: 'Disclaimer for AI FastScale - 7 Minute AgentClone Course. Important legal notices and disclaimers.',
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
              <p className="mb-2 font-bold text-gray-900">Important Legal Notice</p>
              <p className="mb-0 text-gray-700">
                Please read this disclaimer carefully before using the AI FastScale website or purchasing the 7 Minute AgentClone Course. By accessing or using our service, you acknowledge that you have read, understood, and agree to be bound by this disclaimer and all its terms.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                1. General Information Disclaimer
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                The information provided by AI FastScale ("we," "us," "our") on our website and in the 7 Minute AgentClone Course is for general informational and educational purposes only. All information is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information.
              </p>
              <p className="leading-relaxed text-gray-700">
                Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of our service or reliance on any information provided. Your use of our service and your reliance on any information is solely at your own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                2. No Guarantees of Results
              </h2>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                2.1 Critical Notice
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                <strong>IMPORTANT:</strong> While we provide tools, training, and strategies designed to help real estate agents generate leads and improve their marketing, we make NO GUARANTEES regarding specific results, income, leads, or sales.
              </p>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                2.2 Case Study Disclaimers
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                Any references to lead generation numbers, such as "5-15 leads per week" or "100+ monthly leads," are examples based on case studies and testimonials from specific users. These results are:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>NOT typical and NOT representative of average results</li>
                <li>NOT guarantees or promises of your individual results</li>
                <li>Based on specific users under specific conditions</li>
                <li>Subject to significant variation based on individual effort and circumstances</li>
              </ul>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                2.3 Factors Affecting Your Results
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                Your results will depend on many factors, including but not limited to:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Your level of effort and commitment to implementing the strategies</li>
                <li>Your existing skills, experience, and knowledge in real estate and marketing</li>
                <li>Your local market conditions and competitive landscape</li>
                <li>The quality and consistency of your content creation</li>
                <li>Your adherence to platform policies and best practices</li>
                <li>Economic conditions and external market factors beyond your control</li>
                <li>Your marketing budget and resources</li>
                <li>The timing of your implementation</li>
                <li>Your audience size and engagement rates</li>
              </ul>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                2.4 No Earnings Guarantee
              </h3>
              <p className="leading-relaxed text-gray-700">
                <strong>We do not guarantee that you will achieve any specific level of earnings, leads, sales, or success.</strong> Any earnings or results mentioned are not indicative of future performance or your individual experience.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                3. Educational Purpose Only
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                The 7 Minute AgentClone Course is an educational product designed to teach real estate agents how to create AI-generated talking videos for marketing purposes. It is NOT:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Professional business advice or consulting</li>
                <li>Legal, financial, investment, or tax advice</li>
                <li>A guarantee of leads, sales, income, or business growth</li>
                <li>A substitute for professional real estate training or licensing requirements</li>
                <li>An automated or "done-for-you" service</li>
                <li>Professional marketing services</li>
                <li>A replacement for working with professional real estate brokers</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                The course provides information and tools that require your own effort, time, expertise, and implementation to be effective.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                4. Testimonials & Case Studies
              </h2>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                4.1 Accuracy of Testimonials
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                Testimonials and case studies presented on our website or in our marketing materials reflect the real experiences of actual users. However, these testimonials are:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>NOT representative of all users' experiences</li>
                <li>NOT guarantees of future results</li>
                <li>Based on specific individuals under specific conditions</li>
                <li>Subject to individual variation and interpretation</li>
              </ul>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                4.2 Results Variability
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                Individual results vary significantly based on personal effort, market conditions, skill level, experience, and other factors. The experiences shared by successful users should be considered exceptional rather than typical or guaranteed.
              </p>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                4.3 Testimonial Editing
              </h3>
              <p className="leading-relaxed text-gray-700">
                <strong>Testimonial Disclaimer:</strong> Testimonials may have been edited for clarity, grammar, or length. Some testimonials may be compensated or incentivized. All testimonials are voluntary and reflect genuine user feedback based on individual experiences.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                5. Third-Party Tools & Services
              </h2>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                5.1 Independent Services
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                This course teaches you how to use various third-party AI tools and platforms (such as HeyGen, ElevenLabs, D-ID, Synthesia, and similar AI video generation services). We are NOT affiliated with, endorsed by, or sponsored by these third-party services unless explicitly stated in writing.
              </p>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                5.2 Important Limitations
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                You acknowledge and understand:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Third-party tools may change their features, pricing, or policies at any time without notice</li>
                <li>We have no control over the availability, functionality, or performance of third-party services</li>
                <li>You are responsible for complying with the terms of service of any third-party platforms you use</li>
                <li>Additional costs may be required for third-party tools beyond the $37 course price</li>
                <li>We are not responsible for issues, downtime, outages, or changes to third-party services</li>
                <li>Third-party platforms may discontinue services without notice</li>
                <li>We do not control quality, accuracy, or safety of third-party tools</li>
              </ul>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                5.3 Course Updates for Platform Changes
              </h3>
              <p className="leading-relaxed text-gray-700">
                If AI tools used in the course become unavailable or significantly change, we will update training materials to reflect current best alternatives at no additional cost to you. However, exact functionality may not be replaceable.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                6. Real Estate Compliance Responsibility
              </h2>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                6.1 Your Responsibility
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                As a real estate professional, <strong>YOU are solely responsible</strong> for ensuring your use of AI-generated videos and marketing materials complies with all applicable laws and regulations:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Your state's real estate licensing laws and regulations</li>
                <li>MLS (Multiple Listing Service) rules and policies</li>
                <li>Your broker's requirements and approval processes</li>
                <li>Federal and state fair housing laws</li>
                <li>Truth in advertising and anti-discrimination laws</li>
                <li>Copyright and intellectual property laws</li>
                <li>Privacy and data protection regulations</li>
                <li>FTC guidelines on endorsements and testimonials</li>
              </ul>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                6.2 Not Legal Advice
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                While we provide general compliance guidance and broker overlay templates, <strong>we are not providing legal advice</strong>. You must:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Verify with your broker before posting any marketing content</li>
                <li>Include all required disclosures in your videos</li>
                <li>Obtain proper permissions for property photos and information</li>
                <li>Comply with all applicable laws in your jurisdiction</li>
                <li>Consult with a real estate attorney if you have legal questions</li>
              </ul>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                6.3 No Responsibility for Violations
              </h3>
              <p className="leading-relaxed text-gray-700">
                We are not responsible for any violations, fines, penalties, regulatory actions, or legal issues resulting from your use of the course materials, your videos, or your compliance failures.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                7. AI-Generated Content Disclaimer
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                This course teaches you to create AI-generated talking videos. You acknowledge and understand:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>AI-generated content may not always be 100% accurate or perfect</li>
                <li>You are responsible for reviewing and approving all AI-generated content before publishing</li>
                <li>Some platforms may require disclosure that content is AI-generated</li>
                <li>AI technology is evolving rapidly; features and capabilities may change</li>
                <li>You must ensure AI-generated content does not violate copyright or intellectual property rights</li>
                <li>You are responsible for the factual accuracy of information in your videos</li>
                <li>Some audiences may have concerns about AI-generated content authenticity</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                8. Platform Policy Compliance
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                When using the strategies taught in this course on social media platforms (Facebook, Instagram, TikTok, YouTube, LinkedIn, etc.), you are responsible for:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Complying with each platform's terms of service and community guidelines</li>
                <li>Understanding and following platform-specific rules for AI-generated content</li>
                <li>Maintaining your accounts in good standing</li>
                <li>Accepting the risk of content removal, account suspension, or permanent bans</li>
                <li>Understanding that platform policies change frequently</li>
              </ul>
              <p className="leading-relaxed text-gray-700">
                <strong>Platform Policy Changes:</strong> What is permitted today may not be allowed tomorrow. Platforms update their policies without notice. We are not responsible for any account actions, content removal, policy violations, or enforcement from social media platforms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                9. Professional Advice Disclaimer
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                The information in this course is NOT a substitute for professional advice. For specific situations, you should consult with qualified professionals:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  <strong>Legal advice:</strong> Consult a licensed attorney for legal questions, compliance issues, or regulatory concerns
                </li>
                <li>
                  <strong>Tax advice:</strong> Consult a CPA or tax professional for tax-related questions and income reporting
                </li>
                <li>
                  <strong>Real estate advice:</strong> Consult your broker, MLS, and real estate legal counsel for brokerage-specific policies
                </li>
                <li>
                  <strong>Technical support:</strong> Consult the respective third-party service providers for technical issues with their tools
                </li>
                <li>
                  <strong>Business advice:</strong> Consult with a business consultant for business strategy and planning
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                10. Website & Content Updates
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                We may update the course content, website information, or materials at any time without notice. While we strive to keep information current and accurate, we make no representations that:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>The website or course content is free from errors or omissions</li>
                <li>All information is complete, current, or up-to-date</li>
                <li>The service will be uninterrupted, error-free, or always available</li>
                <li>Any defects will be corrected</li>
                <li>Materials will remain unchanged or available forever</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                11. External Links Disclaimer
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Our website and course materials may contain links to external websites or third-party resources. These links are provided for convenience only. We do not:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Endorse, warrant, or guarantee the content of external sites</li>
                <li>Control the content or policies of external sites</li>
                <li>Accept responsibility for external site content or practices</li>
                <li>Make any representations about external websites</li>
                <li>Monitor external websites for accuracy or legality</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                12. Limitation of Liability
              </h2>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                12.1 Complete Disclaimer
              </h3>
              <p className="mb-4 leading-relaxed text-gray-700">
                To the fullest extent permitted by applicable law, AI FastScale, its owners, employees, agents, and affiliates shall not be liable for:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Any direct, indirect, incidental, consequential, or punitive damages</li>
                <li>Loss of profits, revenue, data, or business opportunities</li>
                <li>Account suspensions, bans, or content removal on third-party platforms</li>
                <li>Results or lack of results from using the course</li>
                <li>Errors, omissions, or inaccuracies in course content</li>
                <li>Issues with third-party tools or services</li>
                <li>Legal or regulatory violations or penalties</li>
                <li>Website downtime or unavailability</li>
                <li>Lost or corrupted data</li>
              </ul>

              <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                12.2 Maximum Liability
              </h3>
              <p className="leading-relaxed text-gray-700">
                Our total liability for any claim shall not exceed the amount you paid for the course ($37 USD), regardless of the nature of the claim.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                13. Changes to This Disclaimer
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                We reserve the right to modify this disclaimer at any time. Changes will be effective immediately upon posting to this page. Your continued use of our service after changes constitutes acceptance of the updated disclaimer.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-black text-gray-900">
                14. Contact Information
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                If you have any questions about this disclaimer:
              </p>
              <div className="rounded-xl border-2 border-yellow-400 bg-yellow-50 p-6">
                <p className="mb-2 font-bold text-gray-900">AI FastScale</p>
                <p className="text-gray-700">Email: support@aifastscale.com</p>
                <p className="text-gray-700">Instagram: @sara.theagent</p>
                <p className="text-gray-700">Address: Miami, FL USA</p>
              </div>
            </section>

            <div className="mt-8 rounded-xl border-2 border-blue-400 bg-gradient-to-r from-blue-100 to-cyan-100 p-6">
              <p className="mb-2 font-bold text-gray-900">Your Acknowledgment</p>
              <p className="mb-0 text-gray-700">
                By purchasing and using the 7 Minute AgentClone Course, you acknowledge that you have read, understood, and fully agree to this disclaimer. You accept full responsibility for your use of the course materials and any results, consequences, or outcomes thereof. You understand that success with this course depends on your own effort, implementation, and market conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
