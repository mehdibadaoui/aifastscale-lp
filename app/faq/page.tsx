import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Plus, Minus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FAQ - CloneYourself Video System | Common Questions',
  description:
    'Frequently asked questions about the CloneYourself Video System: pricing, features, AI video creation, professional lead generation. Get answers to all your questions.',
  keywords:
    'CloneYourself FAQ, AI video questions, professional AI video help, AI video pricing, how AI videos work',
  openGraph: {
    title: 'Frequently Asked Questions - CloneYourself Video System',
    description:
      'Get answers to common questions about creating AI videos for professionals. Pricing, features, results, and more.',
    url: 'https://aifastscale.com/faq',
    type: 'website',
  },
  alternates: {
    canonical: 'https://aifastscale.com/faq',
  },
}

export default function FAQPage() {
  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'What is the CloneYourself Video System?',
          a: 'The CloneYourself Video System is a training course that teaches professionals (lawyers, dentists, psychologists, plastic surgeons, and other service professionals) how to create AI-powered talking videos. Upload your photo, provide your script, and AI generates a professional video of you speaking—without filming.',
        },
        {
          q: 'Do I need video editing experience?',
          a: 'No. The system is designed for complete beginners. If you can upload a photo and paste text, you can create professional videos. No filming, no editing, no technical skills required.',
        },
        {
          q: 'How long does it take to create a video?',
          a: 'About 7-20 minutes from start to finish. Upload photo (1 min), write script (3-10 min), generate video (3-5 min). Most professionals batch-create multiple videos in one session.',
        },
        {
          q: 'Do AI videos look realistic?',
          a: 'Yes. The AI produces videos where the vast majority of viewers believe the person is actually speaking. The lip-sync is natural, facial movements are realistic, and the quality is high enough for Instagram Reels, TikTok, YouTube, and professional use.',
        },
      ],
    },
    {
      category: 'Pricing & Payment',
      questions: [
        {
          q: 'How much does the CloneYourself Video System cost?',
          a: '$47.82 USD one-time payment for lifetime access. This is NOT a subscription—you pay once and get access forever. No monthly fees, no hidden costs, no recurring charges.',
        },
        {
          q: 'Is this a subscription?',
          a: 'NO. This is a ONE-TIME payment of $47.82. You pay once and get lifetime access to all course materials and future updates. There are NO recurring charges or monthly fees.',
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards (Visa, MasterCard, American Express) and debit cards via our secure PCI-DSS Level 1 certified payment processor (Whop). Payments are secure and processed instantly.',
        },
        {
          q: 'Do you offer refunds?',
          a: 'Yes. We offer a 30-day money-back guarantee. If the CloneYourself Video System doesn\'t work for you within the first 30 days, email support@aifastscale.com for a full refund. No questions asked.',
        },
        {
          q: 'Are there any additional costs?',
          a: 'The course teaches you to use third-party AI tools (like HeyGen, ElevenLabs, etc.). These tools may have their own pricing. The course itself is a one-time $47.82 payment with no additional fees from us.',
        },
      ],
    },
    {
      category: 'Course Content & Features',
      questions: [
        {
          q: 'What do I get with my purchase?',
          a: 'You get lifetime access to: Step-by-step video training modules, AI prompts and workflows, industry-specific scripts and templates, phone editing templates with captions, bonus content calendars and marketing resources, plus all future updates.',
        },
        {
          q: 'How many videos can I create?',
          a: 'Unlimited. The course teaches you the techniques—you can create as many videos as you want using the third-party AI tools covered in the training.',
        },
        {
          q: 'Can I use my own photo?',
          a: 'Yes. The course teaches you how to upload your own professional photo to create AI videos of yourself speaking. Best results with clear, well-lit headshots looking at the camera.',
        },
        {
          q: 'What industries is this for?',
          a: 'The CloneYourself Video System is designed for service professionals including lawyers, dentists, psychologists, plastic surgeons, and other professionals who want to leverage AI video for marketing.',
        },
        {
          q: 'Is the content updated?',
          a: 'Yes. AI technology evolves rapidly, and we update the course materials to reflect current best practices. All updates are included free with your one-time purchase.',
        },
      ],
    },
    {
      category: 'Results & Expectations',
      questions: [
        {
          q: 'What results can I expect?',
          a: 'Results vary significantly based on your effort, market conditions, content quality, and implementation. Some users have reported generating new leads and clients, but these results are NOT typical and NOT guaranteed. See our disclaimer for details.',
        },
        {
          q: 'How quickly will I see results?',
          a: 'This depends entirely on you. Some users create their first video within hours of purchasing. Getting clients from those videos depends on many factors including your market, content quality, and audience. We make no guarantees about timeline or results.',
        },
        {
          q: 'Do you guarantee leads or clients?',
          a: 'NO. We do not guarantee any specific results, leads, clients, or income. The course provides educational content and tools—your results depend on your implementation, effort, market conditions, and many other factors beyond our control.',
        },
      ],
    },
    {
      category: 'Technical & Support',
      questions: [
        {
          q: 'How do I access the course?',
          a: 'After purchase, you\'ll receive an email with login credentials to access the members area. You can also access it through Whop.com. Access is instant—within 5 minutes of payment.',
        },
        {
          q: 'What if I have technical issues?',
          a: 'Email support@aifastscale.com and we\'ll help you resolve any access or technical issues. We typically respond within 24-48 hours.',
        },
        {
          q: 'Can I share my login with others?',
          a: 'No. Your account is for personal use only. Sharing login credentials violates our Terms of Service and may result in account termination without refund.',
        },
      ],
    },
    {
      category: 'Legal & Compliance',
      questions: [
        {
          q: 'Who operates this website?',
          a: 'This website is operated by Velon LLC, a Wyoming Limited Liability Company. Address: 30 N Gould St Ste R, Sheridan, WY 82801. Email: support@aifastscale.com',
        },
        {
          q: 'Are there professional compliance requirements?',
          a: 'Yes. As a licensed professional (lawyer, doctor, etc.), YOU are responsible for ensuring your AI-generated videos comply with your state\'s licensing laws, professional association rules, and advertising regulations. We provide educational content only—not legal or compliance advice.',
        },
        {
          q: 'What about attorney advertising rules?',
          a: 'If you\'re an attorney, you must ensure your AI videos comply with your state bar\'s Rules of Professional Conduct regarding advertising and client solicitation. The course does not provide legal advice on bar compliance.',
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 text-lg">
            Everything you need to know about the CloneYourself Video System
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {faqs.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <h2 className="bg-gray-50 px-6 py-4 text-lg font-bold text-gray-900 border-b border-gray-200">
                {section.category}
              </h2>
              <div className="divide-y divide-gray-100">
                {section.questions.map((faq, faqIndex) => (
                  <details key={faqIndex} className="group">
                    <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none hover:bg-gray-50 transition-colors">
                      <span className="font-medium text-gray-900 pr-4">{faq.q}</span>
                      <Plus className="w-5 h-5 text-gray-400 group-open:hidden flex-shrink-0" />
                      <Minus className="w-5 h-5 text-gray-400 hidden group-open:block flex-shrink-0" />
                    </summary>
                    <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Still have questions?</h2>
          <p className="text-gray-600 mb-4">
            We're here to help. Contact our support team.
          </p>
          <a
            href="mailto:support@aifastscale.com"
            className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-amber-600 transition-colors"
          >
            Email Support
          </a>
        </div>

        {/* Legal Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p className="mb-2">Velon LLC, a Wyoming Limited Liability Company</p>
          <p className="mb-4">30 N Gould St Ste R, Sheridan, WY 82801</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/privacy-policy" className="hover:text-gray-700">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms-of-service" className="hover:text-gray-700">Terms of Service</Link>
            <span>•</span>
            <Link href="/refund-policy" className="hover:text-gray-700">Refund Policy</Link>
            <span>•</span>
            <Link href="/disclaimer" className="hover:text-gray-700">Disclaimer</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
