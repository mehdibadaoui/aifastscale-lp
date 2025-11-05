import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Video Marketing Blog | Real Estate Tips for Dubai & UAE Agents',
  description:
    'Learn how Dubai real estate agents generate 100+ leads with AI videos. Expert guides, case studies, and strategies for UAE property marketing.',
  keywords:
    'AI video marketing, Dubai real estate blog, UAE property marketing, real estate leads Dubai, AI videos real estate',
}

export default function BlogIndex() {
  const posts = [
    {
      slug: 'ai-video-roi-real-estate-calculator-2025',
      title: 'AI Video ROI Calculator for Real Estate: Is It Worth It? (2025 Analysis)',
      description:
        'Complete ROI analysis of AI video marketing for real estate. Calculate expected returns, see real cost vs revenue data, and determine if AI videos are worth the investment.',
      date: '2025-01-12',
      readTime: '15 min read',
      category: 'ROI Analysis',
    },
    {
      slug: 'tiktok-real-estate-marketing-uae-guide-2025',
      title: 'TikTok Real Estate Marketing: Complete UAE Agent Guide 2025',
      description:
        'Complete TikTok marketing guide for Dubai & UAE real estate agents. Learn content strategies, viral hooks, best posting times, and how agents generate 200+ monthly leads from TikTok.',
      date: '2025-01-12',
      readTime: '16 min read',
      category: 'Marketing Strategy',
    },
    {
      slug: 'instagram-reels-real-estate-content-ideas-2025',
      title: '50 Instagram Reels Ideas for Real Estate Agents in 2025 (Dubai & UAE)',
      description:
        'Complete list of Instagram Reels content ideas for real estate agents. 50 proven video concepts that generate leads, plus templates, hooks, and posting strategies.',
      date: '2025-01-12',
      readTime: '18 min read',
      category: 'Content Ideas',
    },
    {
      slug: 'ai-avatar-real-estate-agents-guide-2025',
      title: 'AI Avatar for Real Estate Agents: Complete 2025 Guide',
      description:
        'Should you use an AI avatar for real estate videos? Complete guide covering best AI avatars for agents, pricing, pros/cons, and which Dubai agents are using them to generate 100+ leads monthly.',
      date: '2025-01-12',
      readTime: '14 min read',
      category: 'Technology Guide',
    },
    {
      slug: 'real-estate-video-marketing-course-dubai-2025',
      title: 'Real Estate Video Marketing Course Dubai 2025 - Learn AI Video Lead Generation',
      description:
        'Complete video marketing course for Dubai & UAE real estate agents. Learn AI video creation, lead generation strategies, and how to generate 100+ monthly leads.',
      date: '2025-01-12',
      readTime: '15 min read',
      category: 'Training Course',
    },
    {
      slug: 'best-ai-tools-real-estate-marketing-2025',
      title: '15 Best AI Tools for Real Estate Marketing in 2025 (Complete Guide)',
      description:
        'Complete guide to the best AI tools for real estate marketing in 2025. Compare pricing, features, and real results from Dubai agents using AI for video, copywriting, and lead generation.',
      date: '2025-01-12',
      readTime: '14 min read',
      category: 'Tools Comparison',
    },
    {
      slug: 'how-to-make-talking-videos-real-estate',
      title: 'How to Make Talking Videos for Real Estate (3 Methods Compared)',
      description:
        'Complete guide to creating talking videos for real estate. Compare AI avatars, self-filming, and hiring talent. Includes costs, pros/cons, and step-by-step tutorials for each method.',
      date: '2025-01-12',
      readTime: '13 min read',
      category: 'Tutorial',
    },
    {
      slug: 'ai-video-generator-real-estate-2025',
      title: '7 Best AI Video Generators for Real Estate Agents in 2025 (Compared)',
      description:
        'Compare the best AI video generators for real estate agents. Detailed analysis of AI FastScale, Synthesia, HeyGen, D-ID, and more. Pricing, features, pros/cons, and real agent results.',
      date: '2025-01-12',
      readTime: '12 min read',
      category: 'Software Review',
    },
    {
      slug: 'dubai-agents-10x-income-ai-videos-2025',
      title: "5 Dubai Real Estate Agents Who 10X'd Their Income Using AI Videos",
      description:
        'Real success stories from Dubai agents who went from AED 8K-18K/month to AED 45K-100K+/month using AI videos. Complete case studies with strategies and exact results.',
      date: '2025-01-10',
      readTime: '13 min read',
      category: 'Case Studies',
    },
    {
      slug: 'dubai-real-estate-agent-income-2025',
      title: 'How Much Money Can Dubai Real Estate Agents Really Make in 2025?',
      description:
        'Complete income breakdown for Dubai agents. Learn average commissions, top earner salaries, and how AI videos are helping agents earn AED 50K+ monthly.',
      date: '2025-01-10',
      readTime: '11 min read',
      category: 'Income Guide',
    },
    {
      slug: 'viral-real-estate-content-uae-2025',
      title: 'How to Create Viral Real Estate Content in 2025 (UAE Agent Playbook)',
      description:
        'Learn the exact viral content formula Dubai & UAE agents use to get 500K+ views. 10 proven content types, 15 hook formulas, and a 7-day viral challenge included.',
      date: '2025-01-09',
      readTime: '12 min read',
      category: 'Content Strategy',
    },
    {
      slug: 'ai-video-real-estate-why-2025',
      title: 'Why Real Estate Agents Who Don\'t Use AI Video Will Struggle in 2025',
      description:
        'Discover why UAE agents ignoring AI video marketing are losing listings, reach, and leads. Learn how to stay ahead and dominate 2025 with AI FastScale.',
      date: '2025-01-09',
      readTime: '11 min read',
      category: 'Industry Trends',
    },
    {
      slug: 'ai-video-marketing-real-estate-guide-2025',
      title: 'AI Video Marketing for Real Estate: Complete Beginner\'s Guide 2025',
      description:
        'Learn how UAE real estate agents generate 100+ leads monthly using AI video marketing—without filming. Step-by-step beginner\'s guide with case studies.',
      date: '2025-01-09',
      readTime: '10 min read',
      category: 'How-To Guide',
    },
    {
      slug: 'ai-videos-dubai-real-estate-leads-2025',
      title: 'How Dubai Real Estate Agents Get 100+ Leads with AI Videos in 2025',
      description:
        'Complete guide: Dubai real estate agents are generating 100+ qualified leads monthly using AI talking videos. Step-by-step tutorial + real results.',
      date: '2025-01-02',
      readTime: '12 min read',
      category: 'Lead Generation',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors hover:text-black"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="border-b bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="mb-4 text-5xl font-black text-gray-900 md:text-6xl">
            AI Video Marketing Blog
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-700">
            Expert guides, case studies, and strategies for Dubai & UAE real estate agents using AI
            videos to generate leads
          </p>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-lg transition-all hover:border-yellow-400 hover:shadow-2xl"
            >
              {/* Category Badge */}
              <div className="border-b border-gray-100 px-6 py-4">
                <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-800">
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="mb-3 text-2xl font-black leading-tight text-gray-900 transition-colors group-hover:text-yellow-600">
                  {post.title}
                </h2>

                <p className="mb-4 text-gray-700">{post.description}</p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Read More */}
                <div className="mt-6 flex items-center gap-2 font-bold text-yellow-600 transition-transform group-hover:translate-x-2">
                  Read Article
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="mt-12 rounded-2xl border-4 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <h3 className="mb-2 text-2xl font-black text-gray-900">More Articles Coming Soon</h3>
          <p className="text-gray-600">
            We publish new real estate AI marketing guides every week. Check back soon!
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-black text-gray-900">
            Ready to Generate 100+ Leads with AI Videos?
          </h2>
          <p className="mb-8 text-lg text-gray-700">
            Join 500+ UAE real estate agents using AI videos to dominate their market
          </p>
          <Link
            href="/"
            className="inline-block rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 px-10 py-5 text-xl font-black text-black shadow-2xl transition-transform hover:scale-105"
          >
            Get Started for $37 →
          </Link>
          <p className="mt-4 text-sm text-gray-600">30-Day Money-Back Guarantee • Unlimited Videos</p>
        </div>
      </div>
    </div>
  )
}
