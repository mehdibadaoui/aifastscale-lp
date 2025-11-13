import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Plus, Minus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FAQ - AI FastScale | Common Questions About AI Video Marketing for Real Estate',
  description:
    'Frequently asked questions about AI FastScale: pricing, features, AI video creation, lead generation for UAE real estate agents. Get answers to all your questions.',
  keywords:
    'AI FastScale FAQ, AI video questions, real estate AI help, Dubai agent questions, AI video pricing, how AI videos work',
  openGraph: {
    title: 'Frequently Asked Questions - AI FastScale',
    description:
      'Get answers to common questions about creating AI videos for real estate. Pricing, features, results, and more.',
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
          q: 'What is AI FastScale?',
          a: 'AI FastScale is a platform that helps real estate agents create AI-powered talking videos in 7 minutes. Upload your photo, paste your script, and our AI generates a professional video of you speaking—without filming.',
        },
        {
          q: 'Do I need video editing experience?',
          a: 'No. AI FastScale is designed for complete beginners. If you can upload a photo and paste text, you can create professional videos. No filming, no editing, no technical skills required.',
        },
        {
          q: 'How long does it take to create a video?',
          a: 'About 7 minutes from start to finish. Upload photo (1 min), write script (3 min), generate video (3 min). Most agents batch-create 10 videos in one hour.',
        },
        {
          q: 'Do AI videos look realistic?',
          a: 'Yes. Our AI produces videos where 90% of viewers believe the person is actually speaking. The lip-sync is natural, facial movements are realistic, and the quality is high enough for Instagram Reels, TikTok, and professional use.',
        },
      ],
    },
    {
      category: 'Pricing & Plans',
      questions: [
        {
          q: 'How much does AI FastScale cost?',
          a: '$37 per month for unlimited videos. No per-video fees, no hidden costs, no watermarks. Cancel anytime.',
        },
        {
          q: 'Is there a free trial?',
          a: 'We offer a 30-day money-back guarantee instead of a free trial. Try AI FastScale for a full month—if you don\'t love it or don\'t see results, get a complete refund. No questions asked.',
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards (Visa, MasterCard, American Express) via our secure payment processor. Payments are secure and processed instantly.',
        },
        {
          q: 'Can I cancel anytime?',
          a: 'Yes. Cancel anytime from your account dashboard. No contracts, no cancellation fees. Your access continues until the end of your billing period.',
        },
        {
          q: 'Do you offer refunds?',
          a: 'Yes. 30-day money-back guarantee. If AI FastScale doesn\'t work for you within the first 30 days, email us for a full refund. We\'ll process it within 24-48 hours.',
        },
      ],
    },
    {
      category: 'Features & Capabilities',
      questions: [
        {
          q: 'How many videos can I create?',
          a: 'Unlimited. Create 10 videos per day, 100 videos per week, 1,000 videos per month—there are no limits with your $37/month subscription.',
        },
        {
          q: 'Can I use my own photo?',
          a: 'Yes. Upload any photo of yourself (or use stock photos/AI avatars). Best results with clear, well-lit headshots looking at the camera.',
        },
        {
          q: 'What languages are supported?',
          a: 'Currently English and Arabic. More languages coming soon. Many UAE agents create both English and Arabic versions to reach wider audiences.',
        },
        {
          q: 'Can I add music and captions?',
          a: 'Yes. You can download your video and add music/captions using free tools like CapCut, or we can add them during video generation (feature coming soon).',
        },
        {
          q: 'What video formats do you support?',
          a: 'We export MP4 videos optimized for Instagram Reels (9:16), TikTok (9:16), YouTube (16:9), and Facebook. Choose your format during export.',
        },
        {
          q: 'Do videos have watermarks?',
          a: 'No watermarks. Your videos are 100% clean and professional. Use them anywhere—Instagram, TikTok, YouTube, website, ads.',
        },
      ],
    },
    {
      category: 'Results & Effectiveness',
      questions: [
        {
          q: 'How many leads can I expect?',
          a: 'Dubai agents using AI FastScale generate 100-200 leads monthly by posting 5-10 videos per week. Results vary based on consistency, quality of content, and your market. Most agents see their first leads within 1-2 weeks.',
        },
        {
          q: 'How long until I see results?',
          a: 'Most agents get their first leads within 1-2 weeks of posting consistently. By week 4-6, you should be generating 20-50 leads per month. By month 3, many agents hit 100+ leads monthly.',
        },
        {
          q: 'Will AI videos work in my market?',
          a: 'Yes. AI videos work in Dubai, Abu Dhabi, Sharjah, and internationally. The Instagram and TikTok algorithms prioritize video content regardless of location.',
        },
        {
          q: 'Do AI videos perform as well as real videos?',
          a: 'Yes. In our tests, AI videos and self-filmed videos generate similar lead volumes. The key is consistency—posting 5-10 videos per week. AI makes consistency easier because it\'s faster.',
        },
        {
          q: 'Can I use AI videos for paid ads?',
          a: 'Yes. AI videos work great for Facebook ads, Instagram ads, and TikTok ads. Many agents report lower cost-per-lead with video ads vs photo ads.',
        },
      ],
    },
    {
      category: 'Technical & Platform',
      questions: [
        {
          q: 'What devices can I use?',
          a: 'AI FastScale works on desktop (Mac/Windows), tablets, and mobile phones (iPhone/Android). Access from any device with internet.',
        },
        {
          q: 'Do I need to download software?',
          a: 'No. AI FastScale is 100% web-based. Access from your browser—no downloads, no installations required.',
        },
        {
          q: 'Is my data secure?',
          a: 'Yes. We use bank-level encryption for all data. Your photos and videos are stored securely and never shared with third parties. Delete your data anytime from your account.',
        },
        {
          q: 'What if I have technical issues?',
          a: 'Email support@aifastscale.com and we\'ll respond within 24 hours (usually faster). We also have video tutorials and a knowledge base for common issues.',
        },
      ],
    },
    {
      category: 'Use Cases & Best Practices',
      questions: [
        {
          q: 'What should I create videos about?',
          a: 'Property listings, market updates, neighborhood guides, buying/selling tips, client success stories, open house announcements. Check our blog for 100+ content ideas.',
        },
        {
          q: 'How often should I post?',
          a: 'Aim for 5-10 videos per week for best results. Batch-create content on Mondays (create 10 videos in 1 hour), then post 1-2 daily throughout the week.',
        },
        {
          q: 'Can I use AI videos for personal branding?',
          a: 'Yes. Many agents use AI videos for daily market updates, tips, and thought leadership content to position themselves as local experts.',
        },
        {
          q: 'Should I use my photo or an avatar?',
          a: 'Use your own photo for best results. Buyers want to see YOU. Using your real photo builds trust and personal connection.',
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="border-b bg-white py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="mb-4 text-center text-5xl font-black text-gray-900">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto max-w-2xl text-center text-xl text-gray-700">
            Everything you need to know about AI FastScale, AI video creation, and generating leads
            for your real estate business.
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="mx-auto max-w-4xl px-4 py-16">
        {faqs.map((category, idx) => (
          <div key={idx} className="mb-12">
            <h2 className="mb-6 text-3xl font-black text-gray-900">{category.category}</h2>
            <div className="space-y-4">
              {category.questions.map((faq, qIdx) => (
                <details
                  key={qIdx}
                  className="group rounded-xl border-2 border-gray-200 bg-white p-6 transition-all hover:border-yellow-400"
                >
                  <summary className="flex cursor-pointer items-start justify-between font-bold text-gray-900">
                    <span className="pr-4 text-lg">{faq.q}</span>
                    <Plus className="h-6 w-6 flex-shrink-0 text-yellow-600 group-open:hidden" />
                    <Minus className="hidden h-6 w-6 flex-shrink-0 text-yellow-600 group-open:block" />
                  </summary>
                  <p className="mt-4 text-gray-700 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        ))}

        {/* Still have questions CTA */}
        <div className="mt-16 rounded-2xl border-4 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 p-12 text-center">
          <h3 className="mb-4 text-3xl font-black text-gray-900">Still Have Questions?</h3>
          <p className="mb-6 text-lg text-gray-700">
            Can't find the answer you're looking for? Email us and we'll respond within 24 hours.
          </p>
          <a
            href="mailto:support@aifastscale.com"
            className="inline-block rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-4 font-black text-black transition-transform hover:scale-105"
          >
            Email Support
          </a>
        </div>

        {/* Ready to start CTA */}
        <div className="mt-12 rounded-2xl border-2 border-gray-200 bg-white p-12 text-center">
          <h3 className="mb-4 text-3xl font-black text-gray-900">Ready to Get Started?</h3>
          <p className="mb-6 text-lg text-gray-700">
            Create unlimited AI talking videos for just $37/month. 30-day money-back guarantee.
          </p>
          <Link
            href="/"
            className="inline-block rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 px-10 py-5 text-xl font-black text-black transition-transform hover:scale-105"
          >
            Start Creating Videos →
          </Link>
          <p className="mt-4 text-sm text-gray-600">
            No credit card required for 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  )
}
