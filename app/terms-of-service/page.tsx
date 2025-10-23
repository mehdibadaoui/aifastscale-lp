import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | AI FastScale',
  description: 'Terms of Service for AI FastScale - 7 Minute AgentClone Course',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-bold mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms of Service ("Terms") constitute a legally binding agreement between you and AI FastScale ("Company," "we," "us," or "our") concerning your access to and use of the AI FastScale website and the 7 Minute AgentClone Course.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-4">2. Product Description</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The 7 Minute AgentClone Course is a digital educational product designed for real estate agents. The course includes:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Step-by-step video training on creating AI-generated talking videos</li>
                <li>System prompts and workflows for AI video creation</li>
                <li>Real estate-specific scripts and templates</li>
                <li>Phone editing templates with captions, logos, and CTAs</li>
                <li>Bonus materials including personal branding blueprints and hooks</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Current price: $37 USD (subject to change, limited time offer, may increase to $97).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-4">3. Purchase and Payment</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Payment Processing:</strong> All payments are processed securely through Stripe. By making a purchase, you agree to provide current, complete, and accurate purchase and account information.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Pricing:</strong> Prices are subject to change without notice. The price applicable to your purchase is the price displayed at the time of checkout.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Access:</strong> Upon successful payment, you will receive immediate access to the course materials via email and your account dashboard.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-4">4. 30-Day Money-Back Guarantee</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We offer a 30-day money-back guarantee from the date of purchase. If you are not satisfied with the course for any reason within 30 days of purchase, you may request a full refund by emailing support@aifastscale.com.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Refund Process:</strong>
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>No questions asked, full refund within 30 days</li>
                <li>You keep all course materials and bonuses</li>
                <li>Refunds are processed within 5-7 business days</li>
                <li>Refund will be issued to the original payment method</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-4">5. User Account</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                When you create an account with us, you must provide accurate, complete, and current information. You are responsible for:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to terminate accounts that violate these Terms or engage in fraudulent activity.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-4">6. Intellectual Property Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                All course materials, including videos, templates, prompts, graphics, and written content, are owned by AI FastScale and protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>License Grant:</strong> Upon purchase, you are granted a limited, non-exclusive, non-transferable license to access and use the course materials for your personal, non-commercial use.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Restrictions:</strong> You may NOT:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Share, distribute, or resell course materials</li>
                <li>Copy, reproduce, or create derivative works</li>
                <li>Remove copyright or proprietary notices</li>
                <li>Use materials for commercial purposes without permission</li>
                <li>Share your account credentials with others</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-4">7. Acceptable Use</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree to use our service only for lawful purposes. You may not:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Distribute malware or harmful code</li>
                <li>Engage in fraudulent activities</li>
                <li>Harass, abuse, or harm others</li>
                <li>Attempt to gain unauthorized access to our systems</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-4">8. Disclaimers and Limitations</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>No Guarantees:</strong> While we provide tools and training, we do not guarantee specific results, leads, or income. Your success depends on your effort, market conditions, and other factors beyond our control.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Educational Purpose:</strong> This course is for educational purposes only. Results mentioned (such as "5-15 leads per week" or "100+ monthly leads") are examples and not guarantees of your individual results.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Service Availability:</strong> We strive to maintain 99.9% uptime but do not guarantee uninterrupted access. We may suspend service for maintenance or updates.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To the maximum extent permitted by law, AI FastScale shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our total liability shall not exceed the amount you paid for the course ($37).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-4">10. Compliance with Real Estate Regulations</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                As a real estate professional, you are responsible for ensuring your use of AI-generated videos complies with:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>MLS (Multiple Listing Service) rules and regulations</li>
                <li>Your broker's policies and requirements</li>
                <li>State and federal fair housing laws</li>
                <li>Truth in advertising standards</li>
                <li>Any required disclosures in your videos</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                We provide broker compliance overlay kits, but you are ultimately responsible for compliance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-4">11. Updates and Modifications</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Course Updates:</strong> We may update course content to improve quality and relevance. All updates are provided free to existing customers.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Terms Updates:</strong> We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Continued use constitutes acceptance of modified Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-4">12. Termination</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may terminate or suspend your account immediately, without prior notice, for:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Breach of these Terms</li>
                <li>Fraudulent or illegal activity</li>
                <li>Sharing course materials without permission</li>
                <li>Abusive behavior toward staff or other users</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Upon termination, your right to access course materials ceases immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-4">13. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the State of Florida, United States, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-4">14. Dispute Resolution</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Any disputes arising from these Terms or your use of our service shall be resolved through:
              </p>
              <ol className="list-decimal pl-6 mb-4 text-gray-700 space-y-2">
                <li>Good faith negotiation between the parties</li>
                <li>Mediation if negotiation fails</li>
                <li>Binding arbitration in Miami, Florida if mediation fails</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 mb-4">15. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6">
                <p className="text-gray-900 font-bold mb-2">AI FastScale</p>
                <p className="text-gray-700">Email: support@aifastscale.com</p>
                <p className="text-gray-700">Phone: +1 (555) 123-4567</p>
                <p className="text-gray-700">Address: Miami, FL USA</p>
              </div>
            </section>

            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400 rounded-xl p-6 mt-8">
              <p className="text-gray-900 font-bold mb-2">By purchasing and using the 7 Minute AgentClone Course, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
