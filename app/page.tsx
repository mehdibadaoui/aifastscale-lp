'use client';

import React, { useEffect, useState, useRef, ReactNode, memo } from 'react';
import Image from 'next/image';
import {
  Shield, CheckCircle, ArrowRight, Zap, Clock, AlertCircle, Users, Video,
  Wand2, Upload, TrendingUp, X, Sparkles, DollarSign, MessageCircle, Eye, Award,
  Mail, MapPin, Phone, Facebook, Instagram, Linkedin, Twitter, Youtube, Play, Pause,
  Volume2, VolumeX, Maximize
} from 'lucide-react';

// Simple Card component without animations for better performance
interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = memo(({ children, className = '' }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default function AgentLandingPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [showSecurityPopup, setShowSecurityPopup] = useState(false);
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);
  const [priceUnlocked, setPriceUnlocked] = useState(false);
  const [fakeProgress, setFakeProgress] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Security: Light anti-inspect measures - NOTE: This only stops casual users, not developers
    if (typeof window !== 'undefined') {
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        setShowSecurityPopup(true);
        setTimeout(() => setShowSecurityPopup(false), 3000);
        return false;
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
          (e.ctrlKey && e.key === 'U')
        ) {
          e.preventDefault();
          setShowSecurityPopup(true);
          setTimeout(() => setShowSecurityPopup(false), 3000);
          return false;
        }
      };

      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('keydown', handleKeyDown);

      console.log('%c⚠️ Security Notice', 'color: red; font-size: 20px; font-weight: bold;');
      console.log('%cThis site has basic protection enabled. Please respect intellectual property.', 'font-size: 14px;');

      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, []);

  // HTML5 Video Setup - much simpler and faster than Wistia!
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Play event
    const handlePlay = () => {
      console.log('Video playing');
      setVideoPlaying(true);
    };

    // Pause event
    const handlePause = () => {
      console.log('Video paused');
      setVideoPlaying(false);
    };

    // Ended event
    const handleEnded = () => {
      console.log('Video ended');
      setVideoPlaying(false);
    };

    // Time update - track progress with VERY FAST beginning
    const handleTimeUpdate = () => {
      if (!video.duration) return;

      const percent = video.currentTime / video.duration;

      // Unlock price at 80%
      if (percent >= 0.8 && !priceUnlocked) {
        setPriceUnlocked(true);
      }

      // Calculate fake progress - VERY FAST at beginning!
      let fake = 0;
      if (percent <= 0.15) {
        // First 15% of video -> show 0-60% progress (VERY FAST!)
        fake = percent * 4;
      } else if (percent <= 0.5) {
        // Next 35% of video (15-50%) -> show 60-85% progress (medium)
        fake = 0.6 + (percent - 0.15) * 0.714;
      } else if (percent <= 0.8) {
        // Next 30% of video (50-80%) -> show 85-95% progress (slower)
        fake = 0.85 + (percent - 0.5) * 0.333;
      } else {
        // Last 20% of video (80-100%) -> show 95-100% progress (slowest)
        fake = 0.95 + (percent - 0.8) * 0.25;
      }

      setFakeProgress(Math.min(fake * 100, 100));
    };

    // Add event listeners
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('timeupdate', handleTimeUpdate);

    // Cleanup
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [priceUnlocked]);

  // Styles and scroll tracking
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .animate-scroll {
        animation: scroll 8s linear infinite;
      }
      .animate-scroll:hover {
        animation-play-state: paused;
      }
      .animate-scroll-reverse {
        animation: scroll 8s linear infinite reverse;
      }
      .animate-scroll-reverse:hover {
        animation-play-state: paused;
      }
      @keyframes priceReveal {
        0% {
          opacity: 0;
          transform: scale(0.8) translateY(20px);
        }
        50% {
          transform: scale(1.1) translateY(0);
        }
        100% {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
      @keyframes pump {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }
      .price-reveal {
        animation: priceReveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      .pump-animation {
        animation: pump 0.6s ease-in-out 3;
      }

      /* Hide HTML5 video native controls */
      video::-webkit-media-controls {
        display: none !important;
      }
      video::-webkit-media-controls-enclosure {
        display: none !important;
      }
      video::-webkit-media-controls-panel {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    // Throttled scroll handler for better performance on mobile
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const t = document.documentElement.scrollTop;
          const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          setScrollProgress((t / h) * 100);
          setShowStickyCTA(t > 800);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const tilt = 'transition-transform duration-500 will-change-transform hover:-translate-y-1';

  const products = [
    { title: '7min AgentClone Course', value: '547', description: 'Complete step by step blueprint with system prompts and workflows', image: '/images/P1_result.webp' },
    { title: 'Real Estate System Prompt', value: '297', description: 'High converting scripts for listings and DMs', image: '/images/P2_result.webp' },
    { title: 'Photo to Talking Video', value: '217', description: 'Turn photos into natural talking videos in minutes', image: '/images/P3_result.webp' },
    { title: '10 Min Phone Edit Templates', value: '376', description: 'Captions, logos, CTAs ready to export', image: '/images/P4_result.webp' },
  ];

  const bonuses = [
    { title: '2026 Personal Brand Blueprint', value: '197', image: '/images/P5_result.webp' },
    { title: '17 Unskippable Real Estate Hooks', value: '107', image: '/images/P6_result.webp' },
    { title: 'Realtor Canva Pack 100 Templates', value: '147', image: '/images/P7_result.webp' },
  ];

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      location: 'Miami, Florida',
      image: '/images/IMG_3329_result.webp',
      text: 'Honestly thought this was too good to be true. Made my first video on a Monday, by Friday I had 11 serious buyer inquiries. Already closed one $740K listing. This paid for itself 200x over.',
      rating: 5,
      verified: true
    },
    {
      name: 'Marcus Johnson',
      location: 'Houston, Texas',
      image: '/images/IMG_3365_result.webp',
      text: 'Been in real estate 6 years, nothing compares. Posted my AgentClone video at 9am, had 47 DMs by dinner. Three became clients within the week. My wife thinks I hired a marketing agency.',
      rating: 5,
      verified: true
    },
    {
      name: 'Isabella Rodriguez',
      location: 'Los Angeles, California',
      image: '/images/IMG_3360_result.webp',
      text: 'No tech skills, no fancy equipment. Just me, my phone, and 7 minutes. Now I create 3 videos per week and my lead flow is completely transformed. Broker keeps asking for my secret.',
      rating: 5,
      verified: true
    },
    {
      name: 'David Chen',
      location: 'New York, New York',
      image: '/images/IMG_3380_result.webp',
      text: 'Skeptical at first - tried everything from Facebook ads to door knocking. This system brought me from 2-3 monthly leads to 22 last month. ROI is insane. Wish I found this sooner.',
      rating: 5,
      verified: true
    },
    {
      name: 'Aisha Al Mansoori',
      location: 'Dubai, UAE',
      image: '/images/IMG_3200_result.webp',
      text: 'Working in Dubai luxury market, presentation is everything. These AI videos look premium, professional, and took me minutes to create. Closed a 2.3M AED property last week from a video lead.',
      rating: 5,
      verified: true
    },
    {
      name: 'Carlos Mendoza',
      location: 'Madrid, Spain',
      image: '/images/IMG_3367_result.webp',
      text: 'Funcionó mejor de lo que esperaba. My Spanish and English videos both convert like crazy. 15 new leads in 2 weeks, 3 already under contract. This is the future of real estate marketing.',
      rating: 5,
      verified: true
    },
    {
      name: 'Yuki Tanaka',
      location: 'Tokyo, Japan',
      image: '/images/IMG_3424_result.webp',
      text: 'Tokyo market is extremely competitive. This system helped me stand out completely. My videos get shared, my phone doesn\'t stop ringing. Best $37 I ever spent on my business.',
      rating: 5,
      verified: true
    },
    {
      name: 'Mohammed Al Rashid',
      location: 'Riyadh, Saudi Arabia',
      image: '/images/IMG_3379_result.webp',
      text: 'Premium properties need premium marketing. These AI videos deliver both. My Arabic and English content now reaches wider audience. 8 new high-net-worth clients in one month.',
      rating: 5,
      verified: true
    },
    {
      name: 'Priya Patel',
      location: 'London, United Kingdom',
      image: '/images/IMG_3203_result.webp',
      text: 'London property market is brutal. This gave me unfair advantage. My videos get engagement, shares, and most importantly - qualified buyers. 12 deals in pipeline, all from video leads.',
      rating: 5,
      verified: true
    },
    {
      name: 'Tyler Brooks',
      location: 'Austin, Texas',
      image: '/images/IMG_3375_result.webp',
      text: 'Tech capital of Texas, and even here people are blown away. My videos feel personal, authentic, and scale infinitely. Went from cold calling to inbound leads flowing daily. Life changing.',
      rating: 5,
      verified: true
    },
    {
      name: 'DeAndre Carter',
      location: 'Detroit, Michigan',
      image: '/images/IMG_3376_result.webp',
      text: 'From struggling to thriving in 45 days. This system brought consistency I never had. My videos reach people I could never reach door-knocking. 14 active clients now. This changed everything for me.',
      rating: 5,
      verified: true
    },
    {
      name: 'Elena Volkov',
      location: 'Moscow, Russia',
      image: '/images/IMG_3368_result.webp',
      text: 'Москва - огромный рынок. AI videos helped me dominate my neighborhood. Russian buyers love the personal touch. My lead cost dropped 80%, my income tripled. Best investment in my 8-year career.',
      rating: 5,
      verified: true
    }
  ];

  const faqs = [
    {
      q: 'Do I need any technical skills or video experience?',
      a: 'Zero. If you can take a photo with your phone, you can do this. The system guides you step-by-step through everything. Most agents create their first professional video in under 10 minutes on their first try.'
    },
    {
      q: 'Will the AI video look fake or robotic?',
      a: 'Not at all. Our AgentClone technology preserves your natural features, expressions, and speech patterns. Clients consistently tell our users they thought it was a real recording. The pacing is human, the lip-sync is flawless, and the voice sounds authentically you.'
    },
    {
      q: 'Do I need to film myself or record audio?',
      a: 'No filming or recording required. Just upload one clear photo of yourself, and the AI handles everything - script generation, voice synthesis, and video creation. You never have to be on camera or use a microphone.'
    },
    {
      q: 'Is this compliant with MLS rules and broker regulations?',
      a: 'Yes, 100%. We include a comprehensive broker compliance overlay kit with all required disclosures, watermarks, and export templates that meet MLS and NAR guidelines. We worked with real estate attorneys to ensure full compliance.'
    },
    {
      q: 'How long does it actually take to create a video?',
      a: 'The AI generation process takes 3-5 minutes. Adding your personal touches, captions, and exports takes another 2-5 minutes. Total time: 7-10 minutes from start to posting. Most agents batch-create multiple videos in one sitting.'
    },
    {
      q: 'What if I\'m not tech-savvy or hate learning new software?',
      a: 'This was designed for agents who hate tech. The interface is simpler than Instagram. We provide video walkthroughs, templates, and done-for-you prompts. If you can order an Uber, you can master this system.'
    },
    {
      q: 'Can I use this for luxury listings and high-end properties?',
      a: 'Absolutely. Many of our top users specialize in luxury real estate. The professional quality makes it perfect for premium properties. You can customize everything - tone, background, branding - to match your luxury positioning.'
    },
    {
      q: 'Will this work in my specific market or niche?',
      a: 'Yes. Whether you\'re in residential, commercial, luxury, new construction, or rentals - the system adapts. We have successful users in 47 countries selling everything from starter homes to $10M+ estates. The principles of attention and trust work everywhere.'
    },
    {
      q: 'What if I don\'t get any leads or results?',
      a: '30-day full money-back guarantee, no questions asked. You keep all the templates, training, and bonuses even if you refund. We\'re that confident you\'ll see results. Over 500+ agents are currently using this system profitably.'
    },
    {
      q: 'Do I need expensive equipment or subscriptions?',
      a: 'No additional costs. Everything works on your phone or computer. No expensive cameras, lighting, microphones, or ongoing software subscriptions. Just the one-time $37 investment gets you lifetime access to everything.'
    },
    {
      q: 'How is this different from hiring a video editor or production company?',
      a: 'Video production companies charge $500-2000 per video and take days or weeks. With AgentClone, you create unlimited videos yourself in minutes for a one-time $37. You control the content, timing, and messaging. No waiting, no revisions, no ongoing costs.'
    },
    {
      q: 'Can I create videos in multiple languages?',
      a: 'Yes. The AI supports 25+ languages including Spanish, Mandarin, French, Arabic, and more. Perfect if you serve multilingual markets. Create once in English, export in Spanish - same professional quality in both languages.'
    },
    {
      q: 'What kind of results are agents actually getting?',
      a: 'Results vary, but the pattern is consistent: more engagement, more DMs, more qualified leads. Average users report 3-10x increase in inbound inquiries within the first 30 days. Some close deals directly from video leads within the first week.'
    },
    {
      q: 'Is there a limit on how many videos I can create?',
      a: 'Zero limits. Create unlimited videos forever. Daily, weekly, for every listing, for every market update - as many as you want. Your $37 investment never expires and never requires renewal.'
    },
    {
      q: 'What if I need help or get stuck?',
      a: 'Full access to our private support community, video tutorials, and template library. Most questions are answered within 2 hours. Plus the training includes troubleshooting guides for every possible scenario. You\'re never left alone.'
    }
  ];

  const agents1 = [
    { img: '/images/IMG_3197_result.webp', name: 'Iman Al Farsi', loc: 'Dubai' },
    { img: '/images/IMG_3199_result.webp', name: 'Camila Silva', loc: 'Sao Paulo' },
    { img: '/images/IMG_3200_result.webp', name: 'Aisha Al Mansoori', loc: 'Abu Dhabi' },
    { img: '/images/IMG_3203_result.webp', name: 'Noor Al Zahra', loc: 'Dubai' },
    { img: '/images/IMG_3329_result.webp', name: 'Hannah Schmidt', loc: 'Berlin' },
    { img: '/images/IMG_3360_result.webp', name: 'Isabella Martinez', loc: 'Barcelona' },
    { img: '/images/IMG_3364_result.webp', name: 'Chinedu Okafor', loc: 'Lagos' },
    { img: '/images/IMG_3365_result.webp', name: 'James Thompson', loc: 'Miami' },
    { img: '/images/IMG_3366_result.webp', name: 'Tyrone Davis', loc: 'Houston' }
  ];

  const agents2 = [
    { img: '/images/IMG_3367_result.webp', name: 'David Martinez', loc: 'Los Angeles' },
    { img: '/images/IMG_3368_result.webp', name: 'Alexei Volkov', loc: 'Moscow' },
    { img: '/images/IMG_3375_result.webp', name: 'Jamal Washington', loc: 'Chicago' },
    { img: '/images/IMG_3376_result.webp', name: 'DeAndre Carter', loc: 'Detroit' },
    { img: '/images/IMG_3379_result.webp', name: 'Rashid Ahmed', loc: 'Dubai' },
    { img: '/images/IMG_3380_result.webp', name: 'Michael Brown', loc: 'New York' },
    { img: '/images/IMG_3424_result.webp', name: 'Raj Sharma', loc: 'Mumbai' },
    { img: '/images/IMG_3425_result.webp', name: 'Oliver Harris', loc: 'London' }
  ];

  interface FAQItemProps {
    question: string;
    answer: string;
    index: number;
  }

  const FAQItem: React.FC<FAQItemProps> = memo(({ question, answer, index }) => {
    const isOpen = openFAQ === index;
    return (
      <div className={`rounded-2xl border-2 border-gray-300 bg-white hover:border-yellow-400/50 transition-all ${tilt}`}>
        <button onClick={() => setOpenFAQ(isOpen ? null : index)} className="w-full p-4 md:p-6 text-left flex items-start justify-between gap-3">
          <h3 className="text-sm md:text-xl font-bold text-gray-900 leading-tight flex-1">{question}</h3>
          <div className="w-7 h-7 md:w-8 md:h-8 flex-shrink-0 bg-yellow-400/20 border-2 border-yellow-500 rounded-full grid place-items-center">
            <span className="text-yellow-600 font-black text-lg md:text-xl">{isOpen ? '−' : '+'}</span>
          </div>
        </button>
        <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden px-4 md:px-6 pb-4 md:pb-6">
            <p className="text-gray-700 text-xs md:text-lg leading-relaxed">{answer}</p>
          </div>
        </div>
      </div>
    );
  });

  FAQItem.displayName = 'FAQItem';

  const SecureCheckout = memo(() => (
    <div className="mt-6 w-full max-w-4xl px-4">
      <div className="flex flex-nowrap justify-center gap-2 md:gap-4">
        <div className="group flex-1">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg md:rounded-xl opacity-30 group-hover:opacity-50 blur transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-sm border border-yellow-500/30 rounded-lg md:rounded-xl p-2 md:p-4 text-center transform group-hover:scale-105 transition-all duration-300">
              <div className="w-6 h-6 md:w-12 md:h-12 mx-auto mb-1 md:mb-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-yellow-500/50 transition-shadow duration-300">
                <Users className="w-3 h-3 md:w-6 md:h-6 text-black" />
              </div>
              <div className="text-sm md:text-2xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text mb-0.5 md:mb-1">500+</div>
              <div className="text-gray-300 text-[10px] md:text-xs font-semibold">Active Agents</div>
            </div>
          </div>
        </div>

        <div className="group flex-1">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg md:rounded-xl opacity-30 group-hover:opacity-50 blur transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-sm border border-yellow-500/30 rounded-lg md:rounded-xl p-2 md:p-4 text-center transform group-hover:scale-105 transition-all duration-300">
              <div className="w-6 h-6 md:w-12 md:h-12 mx-auto mb-1 md:mb-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-yellow-500/50 transition-shadow duration-300">
                <Video className="w-3 h-3 md:w-6 md:h-6 text-black" />
              </div>
              <div className="text-sm md:text-2xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text mb-0.5 md:mb-1">7 Min</div>
              <div className="text-gray-300 text-[10px] md:text-xs font-semibold">Video Creation</div>
            </div>
          </div>
        </div>

        <div className="group flex-1">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg md:rounded-xl opacity-30 group-hover:opacity-50 blur transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-sm border border-yellow-500/30 rounded-lg md:rounded-xl p-2 md:p-4 text-center transform group-hover:scale-105 transition-all duration-300">
              <div className="w-6 h-6 md:w-12 md:h-12 mx-auto mb-1 md:mb-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-yellow-500/50 transition-shadow duration-300">
                <TrendingUp className="w-3 h-3 md:w-6 md:h-6 text-black" />
              </div>
              <div className="text-sm md:text-2xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text mb-0.5 md:mb-1">100+</div>
              <div className="text-gray-300 text-[10px] md:text-xs font-semibold">Monthly Leads</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

  SecureCheckout.displayName = 'SecureCheckout';

  const GuaranteeSection = memo(() => (
    <section className="relative py-12 md:py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute w-96 h-96 bg-green-500 rounded-full blur-3xl top-1/4 left-1/4 animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute w-96 h-96 bg-yellow-500 rounded-full blur-3xl bottom-1/4 right-1/4 animate-pulse" style={{ animationDuration: '8s' }} />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 md:px-6">
        <div className={`bg-white rounded-3xl shadow-2xl border-2 border-gray-200 p-6 md:p-12 ${tilt}`}>
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="relative">
              <div className="w-24 h-24 md:w-40 md:h-40 bg-gradient-to-br from-green-500 to-green-600 rounded-full grid place-items-center shadow-2xl animate-pulse" style={{ animationDuration: '3s' }}>
                <Shield className="w-12 h-12 md:w-20 md:h-20 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full grid place-items-center shadow-xl border-4 border-white">
                <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
            </div>
          </div>
          <div className="text-center mb-4 md:mb-6">
            <div className="inline-block px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-500/40 rounded-full mb-3 md:mb-4">
              <p className="text-green-700 font-black text-xs md:text-base uppercase tracking-wide">100% Money-Back Guarantee</p>
            </div>
          </div>
          <h2 className="text-2xl md:text-5xl font-black text-gray-900 mb-4 md:mb-6 leading-tight text-center">Zero Risk, All Reward</h2>
          <div className="max-w-3xl mx-auto space-y-4 md:space-y-5 text-sm md:text-lg text-gray-700 leading-relaxed mb-6 md:mb-8">
            <p className="text-center">Try <span className="font-black text-gray-900">7 Min AgentClone</span> risk-free. Get instant access to all templates, system prompts, and training videos.</p>
            <div className="bg-gradient-to-r from-green-50 to-yellow-50 border-2 border-green-500/30 rounded-2xl p-4 md:p-6">
              <p className="text-center text-gray-800 font-semibold">If you don't generate quality leads within <span className="font-black text-green-700">30 days</span>, simply email us for a <span className="font-black text-green-700">full refund</span>. No questions asked. You even keep all the materials.</p>
            </div>
            <div className="flex justify-center gap-4 md:gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full grid place-items-center">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </div>
                <span className="text-gray-700 font-semibold text-xs md:text-sm">30 Day Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full grid place-items-center">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </div>
                <span className="text-gray-700 font-semibold text-xs md:text-sm">Keep All Materials</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full grid place-items-center">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </div>
                <span className="text-gray-700 font-semibold text-xs md:text-sm">No Questions Asked</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <a href="https://buy.stripe.com/fZeaH65v24Ab1wc3ce" target="_blank" rel="noopener noreferrer"
               className="group relative inline-block w-full max-w-3xl">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl opacity-75 group-hover:opacity-100 blur-lg transition duration-300"></div>
              <div className="relative px-6 py-4 md:px-10 md:py-5 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105 font-black text-base md:text-xl uppercase tracking-wider flex items-center justify-center gap-2 md:gap-3">
                <span>Yes, I want the $37 AI Mastery Course</span>
                <ArrowRight className="w-5 h-5 md:w-7 md:h-7" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  ));

  GuaranteeSection.displayName = 'GuaranteeSection';

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden select-none">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-900 z-50">
        <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-300" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* Security Popup */}
      {showSecurityPopup && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] max-w-md w-[90%] animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500/50 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-black text-white mb-1">Content Protected</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    This content is protected. Please respect our intellectual property rights.
                  </p>
                </div>
                <button
                  onClick={() => setShowSecurityPopup(false)}
                  className="flex-shrink-0 w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                <AlertCircle className="w-4 h-4" />
                <span>For authorized use only</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky CTA Bar - Optimized for mobile */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-md border-b border-yellow-500/20 shadow-2xl transition-transform duration-300 ${showStickyCTA ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="max-w-7xl mx-auto px-3 py-2.5 md:py-3 flex items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 flex-shrink-0" />
            <span className="text-white font-bold text-xs md:text-base">7 Min AgentClone - $37</span>
          </div>
          <a href="https://buy.stripe.com/fZeaH65v24Ab1wc3ce" target="_blank" rel="noopener noreferrer"
             className="px-6 py-4 md:px-10 md:py-5 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-2xl font-black text-base md:text-xl uppercase active:scale-95 transition-transform duration-200 whitespace-nowrap">
            Get Access Now
          </a>
        </div>
      </div>

      {/* Top banner */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 border-b-2 border-yellow-400 sticky top-0 z-30 shadow-xl">
        <div className="max-w-7xl mx-auto px-3 py-2 md:py-3 text-center">
          <p className="text-white font-black text-[10px] md:text-sm uppercase tracking-wide">Limited Time {today}</p>
          <p className="text-white/90 text-[9px] md:text-xs font-semibold">Price jumps to $97 at midnight</p>
        </div>
      </div>

      {/* HERO SECTION - DARK */}
      <section className="relative overflow-hidden py-6 md:py-12 bg-black">
        {/* Static background gradient - removed animations for performance */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-full blur-[120px] -top-48 -left-48" />
          <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-full blur-[140px] top-1/4 right-0" />
          <div className="absolute w-[700px] h-[700px] bg-gradient-to-r from-orange-500/15 to-yellow-400/15 rounded-full blur-[160px] bottom-0 left-1/3" />
        </div>

        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(251, 191, 36, 0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6">
          <Card>
            <div className="text-center space-y-6 md:space-y-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.2] tracking-tight uppercase px-2">
                <span className="text-white">Get </span>
                <span className="text-transparent bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 bg-clip-text inline-block animate-pulse">5-15 Leads</span>
                <span className="text-white"> This Week by turning your image to AI Video in </span>
                <span className="text-transparent bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 bg-clip-text inline-block animate-pulse" style={{ animationDelay: '0.5s' }}>7 Minutes</span>
              </h1>

              <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed px-2">
                Zero experience needed, start getting <span className="text-yellow-400 font-bold">100+ Real Buyer Leads Monthly</span>
              </p>

              <div className="max-w-4xl mx-auto">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 rounded-3xl opacity-75 group-hover:opacity-100 blur-xl transition duration-500"></div>
                  <div className="relative">
                    <div className="bg-gradient-to-br from-yellow-400/20 to-orange-400/20 backdrop-blur-sm border-2 border-yellow-400/40 rounded-2xl p-1 shadow-2xl">
                      <div className="bg-yellow-400/5 rounded-xl p-2 text-center">
                        <p className="text-yellow-300 font-bold text-xs md:text-sm mb-2 uppercase tracking-wider">PLAY THIS WITH SOUND ON</p>
                      </div>
                      {/* Professional Video Player */}
                      <div className="rounded-2xl overflow-hidden bg-black shadow-2xl border border-gray-800/50">
                        <div className="relative group" style={{ padding: '56.67% 0 0 0' }}>
                          {/* HTML5 Video - Fast, Reliable, Full Control */}
                          <video
                            ref={videoRef}
                            className="absolute top-0 left-0 w-full h-full object-cover"
                            playsInline
                            preload="auto"
                            muted={videoMuted}
                            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23000000'/%3E%3Cstop offset='100%25' style='stop-color:%231a1a1a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1920' height='1080' fill='url(%23g)'/%3E%3C/svg%3E"
                          >
                            <source src="/videos/Hero-VSL.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>

                          {/* Center Play/Pause Button - Only shows when not playing */}
                          {!videoPlaying && (
                            <div
                              className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/40 via-black/20 to-black/60 cursor-pointer z-40 transition-all duration-500"
                              onClick={() => {
                                if (videoRef.current) {
                                  videoRef.current.play();
                                }
                              }}
                            >
                              <div className="relative group/play">
                                {/* Animated gradient ring */}
                                <div className="absolute -inset-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 rounded-full opacity-60 blur-2xl group-hover/play:opacity-90 transition-all duration-500 animate-pulse"></div>

                                {/* Outer glow ring */}
                                <div className="absolute -inset-3 bg-gradient-to-br from-yellow-300/40 to-orange-400/40 rounded-full blur-lg group-hover/play:scale-110 transition-transform duration-300"></div>

                                {/* Main play button */}
                                <div className="relative bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 rounded-full p-8 md:p-12 shadow-2xl transform group-hover/play:scale-105 transition-all duration-300 border-4 border-white/20">
                                  <Play className="w-12 h-12 md:w-20 md:h-20 text-black fill-black drop-shadow-lg" style={{ marginLeft: '4px' }} />
                                </div>

                                {/* Ripple effect */}
                                <div className="absolute inset-0 rounded-full border-2 border-yellow-400/30 animate-ping"></div>
                              </div>
                            </div>
                          )}

                          {/* Video Controls Overlay - Shows on hover when playing */}
                          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 pointer-events-none ${videoPlaying ? '' : 'hidden'}`}>
                            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 pointer-events-auto">
                              {/* Controls Container */}
                              <div className="flex items-center gap-3 md:gap-4">
                                {/* Play/Pause Toggle */}
                                <button
                                  onClick={() => {
                                    if (videoRef.current) {
                                      if (videoPlaying) {
                                        videoRef.current.pause();
                                      } else {
                                        videoRef.current.play();
                                      }
                                    }
                                  }}
                                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-2 md:p-3 transition-all duration-200 transform hover:scale-110 active:scale-95"
                                >
                                  {videoPlaying ? (
                                    <Pause className="w-5 h-5 md:w-6 md:h-6 text-white fill-white" />
                                  ) : (
                                    <Play className="w-5 h-5 md:w-6 md:h-6 text-white fill-white" />
                                  )}
                                </button>

                                {/* Mute/Unmute */}
                                <button
                                  onClick={() => {
                                    if (videoRef.current) {
                                      const newMuted = !videoMuted;
                                      setVideoMuted(newMuted);
                                      videoRef.current.muted = newMuted;
                                    }
                                  }}
                                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-2 md:p-3 transition-all duration-200 transform hover:scale-110 active:scale-95"
                                >
                                  {videoMuted ? (
                                    <VolumeX className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                  ) : (
                                    <Volume2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                  )}
                                </button>

                                {/* Fullscreen */}
                                <button
                                  onClick={() => {
                                    if (videoRef.current) {
                                      if (videoRef.current.requestFullscreen) {
                                        videoRef.current.requestFullscreen();
                                      }
                                    }
                                  }}
                                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-2 md:p-3 transition-all duration-200 transform hover:scale-110 active:scale-95 ml-auto"
                                >
                                  <Maximize className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Click anywhere to pause when playing */}
                          {videoPlaying && (
                            <div
                              className="absolute inset-0 z-20 cursor-pointer"
                              onClick={() => {
                                if (videoRef.current) {
                                  videoRef.current.pause();
                                }
                              }}
                            />
                          )}
                        </div>

                        {/* Simple Clean Progress Bar */}
                        <div className="relative w-full h-2 bg-gray-900">
                          {/* Simple green progress bar */}
                          <div
                            className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-100 ease-linear"
                            style={{ width: `${fakeProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 md:gap-6 pt-4 px-2">
                <div className="text-center space-y-2 md:space-y-3">
                  {!priceUnlocked ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full backdrop-blur-sm">
                        <Eye className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 animate-pulse" />
                        <span className="text-yellow-400 text-sm md:text-base font-bold">Watch 80% to unlock special price</span>
                      </div>
                      <div className="text-gray-400 text-3xl md:text-5xl font-black tracking-tight blur-sm select-none">US$ ??</div>
                    </div>
                  ) : (
                    <div className="price-reveal">
                      <div className="flex items-center justify-center gap-2 flex-wrap px-2">
                        <span className="text-red-400 text-lg md:text-xl font-black uppercase line-through decoration-2">FROM $97</span>
                        <span className="text-white text-lg md:text-xl font-black uppercase">FOR ONLY</span>
                      </div>
                      <div className="text-green-400 text-5xl md:text-6xl font-black tracking-tight mt-2">US$ 37</div>
                    </div>
                  )}
                </div>

                <a href="https://buy.stripe.com/fZeaH65v24Ab1wc3ce" target="_blank" rel="noopener noreferrer"
                   className="group relative inline-block w-full max-w-3xl px-2">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-green-400 to-green-500 rounded-2xl opacity-75 group-hover:opacity-100 blur-lg transition duration-300"></div>
                  <div className={`relative px-6 py-4 md:px-10 md:py-5 bg-gradient-to-r from-green-500 via-green-400 to-green-500 rounded-2xl font-black text-base md:text-xl text-white uppercase tracking-wider transition-transform duration-300 active:scale-95 shadow-2xl flex items-center justify-center gap-2 md:gap-3 ${priceUnlocked ? 'pump-animation' : ''}`}>
                    <Zap className="w-5 h-5 md:w-7 md:h-7" />
                    <span>{priceUnlocked ? 'Get instant access $37' : 'Watch video to unlock'}</span>
                  </div>
                </a>

                <div className="flex items-center justify-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-red-600/95 to-red-700/95 backdrop-blur-sm border border-red-500/50 rounded-full shadow-lg">
                  <AlertCircle className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  <span className="text-white font-bold text-[10px] md:text-sm uppercase tracking-wide">Price jumps to <span className="text-yellow-300">$97</span> tonight</span>
                  <Clock className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </div>

                <SecureCheckout />

                {/* Guarantee Section - Matching Screenshot Design */}
                <div className="mt-8 md:mt-12 w-full max-w-4xl mx-auto">
                  <div className="bg-gradient-to-br from-green-900 via-green-800 to-green-900 rounded-3xl p-8 md:p-12 border-4 border-green-700/50 shadow-2xl">
                    {/* Gold Badge */}
                    <div className="flex justify-center mb-6 md:mb-8">
                      <div className="relative w-32 h-32 md:w-40 md:h-40">
                        {/* Outer gold ring */}
                        <div className="absolute inset-0 rounded-full border-8 border-yellow-600" style={{ borderStyle: 'double' }}></div>

                        {/* Inner gold circle */}
                        <div className="absolute inset-3 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 flex items-center justify-center shadow-xl">
                          {/* Money text */}
                          <div className="text-center">
                            <div className="text-xs md:text-sm font-black text-black uppercase tracking-wider mb-1">Money</div>
                            <div className="text-3xl md:text-4xl font-black text-black">100%</div>
                            <div className="text-xs md:text-sm font-black text-black uppercase tracking-wider mt-1">Back</div>
                          </div>
                        </div>

                        {/* Stars and text around badge */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-yellow-400 text-xs font-black">★★ GUARANTEED ★★</div>
                      </div>
                    </div>

                    {/* Heading */}
                    <h3 className="text-2xl md:text-4xl font-black text-white text-center mb-6 md:mb-8">
                      No-Questions-Asked Guarantee
                    </h3>

                    {/* Description */}
                    <div className="text-center space-y-4 mb-8 md:mb-10 text-white">
                      <p className="text-base md:text-lg leading-relaxed">
                        Join the VIP experience today and enjoy it all—the exclusive sessions, private Q&As, insane bonuses, and the full 7-day immersion.
                      </p>

                      <p className="text-base md:text-lg leading-relaxed">
                        And if, up to 7 days after the event ends, you feel it wasn't worth every penny, <span className="font-black text-yellow-400">just ask for your money back</span>.
                      </p>

                      <p className="text-base md:text-lg font-bold leading-relaxed">
                        No awkward questions. No hoops to jump through. Just a <span className="font-black text-yellow-400">full refund, straight to your account</span>.
                      </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col gap-4 items-center">
                      {/* Primary CTA - Gold */}
                      <a
                        href="https://buy.stripe.com/fZeaH65v24Ab1wc3ce"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full max-w-xl group relative"
                      >
                        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl opacity-75 group-hover:opacity-100 blur-lg transition duration-300"></div>
                        <div className="relative px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 rounded-2xl font-black text-lg md:text-xl text-black uppercase tracking-wide transition-transform duration-300 active:scale-95 shadow-2xl text-center hover:shadow-yellow-500/50">
                          YES, I WANT THE VIP TICKET FOR $97
                        </div>
                      </a>

                      {/* Secondary CTA - Yellow */}
                      <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="w-full max-w-xl group relative"
                      >
                        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-2xl opacity-60 group-hover:opacity-90 blur transition duration-300"></div>
                        <div className="relative px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 rounded-2xl font-black text-lg md:text-xl text-black uppercase tracking-wide transition-transform duration-300 active:scale-95 shadow-xl text-center border-2 border-yellow-500/50">
                          NO, I WANT TO KEEP MY FREE TICKET
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* HOW IT WORKS - LIGHT */}
      <section className="relative py-10 md:py-16 bg-white text-black">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <Card>
            <div className="text-center mb-6 md:mb-10">
              <div className="inline-flex items-center gap-3 mb-4 md:mb-6 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 border-2 border-yellow-600 rounded-full shadow-lg">
                <span className="text-black font-black text-xs md:text-base uppercase">7 Minute AI Agent System</span>
                <Zap className="w-4 h-4 md:w-5 md:h-5 text-black" />
              </div>
            </div>
            <div className="text-center mb-8 md:mb-10 px-4">
              <h3 className="text-2xl md:text-5xl font-black mb-3 md:mb-4">From Image to Realistic Talking Video <span className="text-transparent bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text">4 Simple Steps</span></h3>
              <p className="text-gray-700 text-sm md:text-xl max-w-2xl mx-auto">No technical skills, no filming, <span className="text-yellow-700 font-black">just copy and paste.</span></p>
            </div>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 px-4 mb-8 md:mb-10">
            {[
              { num: '1', title: 'AI Video Script', desc: 'Paste a ready prompt', icon: Wand2, gradient: 'from-pink-500 to-rose-600', bg: 'bg-pink-500' },
              { num: '2', title: 'Upload Photo', desc: 'Just one image needed', icon: Upload, gradient: 'from-purple-500 to-violet-600', bg: 'bg-purple-500' },
              { num: '3', title: 'Video Created', desc: 'Realistic AI video ready', icon: Video, gradient: 'from-orange-500 to-amber-600', bg: 'bg-orange-500' },
              { num: '4', title: 'Get Leads', desc: 'Watch leads pour in', icon: TrendingUp, gradient: 'from-yellow-500 to-amber-600', bg: 'bg-yellow-500' }
            ].map((s, i) => (
              <Card key={i}>
                <div className={`bg-white border-2 border-gray-200 rounded-3xl p-3 md:p-6 text-center hover:shadow-2xl hover:border-gray-300 ${tilt}`}>
                  <div className={`w-12 h-12 md:w-20 md:h-20 mx-auto mb-3 md:mb-6 rounded-full bg-gradient-to-br ${s.gradient} grid place-items-center shadow-xl`}>
                    <span className="text-white font-black text-lg md:text-3xl">{s.num}</span>
                  </div>
                  <div className={`w-10 h-10 md:w-14 md:h-14 mx-auto mb-2 md:mb-4 ${s.bg} rounded-2xl grid place-items-center shadow-lg`}>
                    <s.icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
                  </div>
                  <h4 className="text-gray-900 font-black text-xs md:text-xl mb-1 md:mb-2">{s.title}</h4>
                  <p className="text-gray-600 font-semibold text-[10px] md:text-sm">{s.desc}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6 px-4 max-w-5xl mx-auto">
            <Card>
              <div className={`bg-gradient-to-br from-red-50 via-pink-50 to-red-50 border-2 border-red-200 rounded-3xl p-4 md:p-8 shadow-lg ${tilt}`}>
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl grid place-items-center shadow-xl"><X className="w-6 h-6 md:w-8 md:h-8 text-white" /></div>
                  <div>
                    <h5 className="text-red-900 font-black text-base md:text-xl mb-2">Unlike traditional methods</h5>
                    <p className="text-gray-700 text-xs md:text-base">You do not need expensive equipment or a film crew.</p>
                  </div>
                </div>
              </div>
            </Card>
            <Card>
              <div className={`bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 border-2 border-yellow-300 rounded-3xl p-4 md:p-8 shadow-lg ${tilt}`}>
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl grid place-items-center shadow-xl"><Sparkles className="w-6 h-6 md:w-8 md:h-8 text-white" /></div>
                  <div>
                    <h5 className="text-yellow-900 font-black text-base md:text-xl mb-2">AI handles everything</h5>
                    <p className="text-gray-700 text-xs md:text-base">Automatic script, voice, and video generation.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* OFFER VALUE STACK - DARK */}
      <section className="relative py-12 md:py-24 bg-gradient-to-b from-black via-gray-950 to-black overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[800px] h-[800px] bg-yellow-500/5 rounded-full blur-[200px] top-0 left-1/2 -translate-x-1/2" />
          <div className="absolute w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[180px] bottom-0 right-1/4" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6">
          <Card>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6 md:mb-8 px-4">
                <span className="text-white block mb-2">You Don't Need More Information.</span>
                <span className="text-white block mb-2">You Need Execution.</span>
                <span className="text-white">That's </span>
                <span className="text-transparent bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 bg-clip-text">What We Deliver.</span>
              </h2>

              <div className="flex items-center justify-center gap-4 md:gap-6 mb-4 md:mb-6">
                <div className="h-px w-12 md:w-16 bg-gradient-to-r from-transparent to-yellow-500/50"></div>
                <span className="text-4xl md:text-6xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text">$37</span>
                <div className="h-px w-12 md:w-16 bg-gradient-to-l from-transparent to-yellow-500/50"></div>
              </div>

              <div className="inline-flex items-center gap-2 md:gap-3 px-4 py-2 md:px-8 md:py-3 bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-orange-500/10 border border-yellow-500/30 rounded-full backdrop-blur-sm">
                <span className="text-gray-400 text-sm md:text-lg line-through">$1,561</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                <span className="text-yellow-400 text-sm md:text-lg font-black">Save $1,524 Today</span>
              </div>
            </div>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-10 mb-12 md:mb-16">
            {products.map((p, i) => (
              <div key={i} className="group bg-gray-900/40 backdrop-blur-sm border-2 border-gray-800 hover:border-yellow-400/40 rounded-2xl overflow-hidden transition-all duration-300">
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-900">
                  {p.image && (
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      priority={i < 2}
                      loading={i < 2 ? undefined : "lazy"}
                    />
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 bg-yellow-400 text-black text-xs md:text-sm font-black rounded-full">Module {i + 1}</span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="px-3 py-1 md:px-4 md:py-2 bg-black/80 backdrop-blur-sm rounded-lg border border-yellow-400/30">
                      <span className="text-yellow-400 font-black text-sm md:text-lg">${p.value}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-black text-white mb-3 leading-tight">{p.title}</h3>
                  <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-4">{p.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Instant Access</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Step-by-Step</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-900/40 backdrop-blur-sm border-2 border-gray-800 rounded-2xl p-8 md:p-12 mb-12 md:mb-16">
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full mb-4">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                <span className="text-yellow-400 font-black text-xs md:text-sm uppercase">Bonus Content</span>
              </div>
              <h3 className="text-2xl md:text-4xl font-black text-white mb-2">3 Premium Add-Ons Included</h3>
              <p className="text-gray-400 text-sm md:text-base">No extra cost • Instant access</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {bonuses.map((b, i) => (
                <div key={i} className="group bg-gray-800/40 border-2 border-gray-700 hover:border-yellow-400/40 rounded-xl overflow-hidden transition-all duration-300">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-900">
                    {b.image && (
                      <Image
                        src={b.image}
                        alt={b.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="inline-block px-3 py-1 bg-yellow-400 text-black text-xs font-black rounded-full">Bonus {i + 1}</span>
                    </div>
                  </div>

                  <div className="p-5 md:p-6">
                    <h4 className="text-base md:text-lg font-black text-white mb-3 leading-tight">{b.title}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-400 font-black text-lg md:text-xl">${b.value} Value</span>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card>
            <div className="flex flex-col items-center gap-4 md:gap-6 px-4 mt-10 md:mt-12">
              <div className="w-full max-w-4xl">
                <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-yellow-500/30 rounded-2xl p-6 md:p-8 mb-4 md:mb-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
                    <div className="space-y-1 md:space-y-2">
                      <div className="text-2xl md:text-4xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text">$1,561</div>
                      <div className="text-xs md:text-sm text-gray-400 font-semibold">Total Value</div>
                    </div>
                    <div className="space-y-1 md:space-y-2">
                      <div className="text-2xl md:text-4xl font-black text-green-400">$37</div>
                      <div className="text-xs md:text-sm text-gray-400 font-semibold">Today's Price</div>
                    </div>
                    <div className="space-y-1 md:space-y-2">
                      <div className="text-2xl md:text-4xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text">98%</div>
                      <div className="text-xs md:text-sm text-gray-400 font-semibold">Discount</div>
                    </div>
                    <div className="space-y-1 md:space-y-2">
                      <div className="text-2xl md:text-4xl font-black text-white">7min</div>
                      <div className="text-xs md:text-sm text-gray-400 font-semibold">To Results</div>
                    </div>
                  </div>
                </div>
              </div>

              <a href="https://buy.stripe.com/fZeaH65v24Ab1wc3ce" target="_blank" rel="noopener noreferrer"
                 className="group relative inline-block w-full max-w-3xl">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 rounded-2xl opacity-75 group-hover:opacity-100 blur-xl transition duration-300"></div>
                <div className="relative px-6 py-4 md:px-10 md:py-5 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 text-black rounded-2xl shadow-2xl transition-all duration-300 group-hover:scale-[1.02] font-black text-base md:text-xl uppercase tracking-wider flex items-center justify-center gap-2 md:gap-3">
                  <Zap className="w-5 h-5 md:w-7 md:h-7" />
                  <span>Get Complete System For $37</span>
                  <ArrowRight className="w-5 h-5 md:w-7 md:h-7" />
                </div>
              </a>

              <div className="flex items-center gap-2 text-gray-400 text-xs md:text-sm">
                <Shield className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                <span className="font-semibold">30-Day Money-Back Guarantee • Instant Access • Secure Checkout</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* GUARANTEE SECTION - LIGHT */}
      <GuaranteeSection />

      {/* CASE STUDY - DARK */}
      <section className="relative py-10 md:py-20 bg-gradient-to-br from-gray-950 via-black to-gray-950 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[150px] top-0 left-1/4 animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[150px] bottom-0 right-1/4 animate-pulse" style={{ animationDuration: '10s' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 mb-4 md:mb-6 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-full">
              <Award className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 animate-pulse" />
              <span className="text-yellow-400 font-black text-xs md:text-sm uppercase tracking-wide">Real Success Story</span>
            </div>
            <h2 className="text-2xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight px-4">
              <span>How Mr. Lucas Sold a </span>
              <span className="text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text">Palm Jumeirah Villa</span>
              <br /><span>with a </span>
              <span className="text-transparent bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text">$1 Video</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 md:gap-10 items-start max-w-7xl mx-auto mb-10 md:mb-14">
            <div className={`relative bg-gradient-to-br from-gray-900/95 to-black rounded-3xl overflow-hidden border border-yellow-400/20 shadow-2xl ${tilt}`}>
              <div className="p-3 md:p-4">
                <div className="rounded-2xl overflow-hidden bg-black/50">
                  <div className="wistia_responsive_padding" style={{ padding: '177.78% 0 0 0', position: 'relative' }}>
                    <div className="wistia_responsive_wrapper" style={{ height: '100%', left: 0, position: 'absolute', top: 0, width: '100%' }}>
                      <iframe
                        src="https://fast.wistia.net/embed/iframe/4o934arsbs?web_component=true&seo=true&videoFoam=true"
                        title="Mr Lucas Video"
                        allow="autoplay; fullscreen"
                        frameBorder="0"
                        scrolling="no"
                        width="100%"
                        height="100%"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 md:px-6 pb-4 md:pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
                  <h3 className="text-lg md:text-xl font-black text-white">Mr. Lucas Actual Video</h3>
                </div>
                <p className="text-gray-400 text-xs md:text-sm">Created in 6 min • Sold for 17.9M AED</p>
              </div>
            </div>

            <div className="space-y-5 md:space-y-6">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-5 md:p-7 hover:border-yellow-400/40 transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Upload className="w-5 h-5 md:w-6 md:h-6 text-black" />
                  </div>
                  <div>
                    <h4 className="text-yellow-400 font-black text-lg md:text-xl mb-2">The Challenge</h4>
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed">6 bedroom beachfront villa in Palm Jumeirah • <span className="text-yellow-400 font-bold">18.5M AED</span> listing price • Needed qualified buyer leads fast</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-5 md:p-7 hover:border-yellow-400/40 transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Video className="w-5 h-5 md:w-6 md:h-6 text-black animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-yellow-400 font-black text-lg md:text-xl mb-2">The Solution</h4>
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed">Used <span className="text-yellow-400 font-bold">7 Min AgentClone</span> to create AI talking video from one photo • Posted with <span className="text-yellow-400 font-bold">$1 boost</span> on Instagram + TikTok</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-900/30 to-amber-900/20 backdrop-blur-sm border-2 border-yellow-400/30 rounded-2xl p-5 md:p-7">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-black" />
                  </div>
                  <div>
                    <h4 className="text-yellow-400 font-black text-lg md:text-xl">The Results</h4>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-5">
                  <div className="bg-black/30 rounded-xl p-3 md:p-4 border border-yellow-400/20 hover:border-yellow-400/40 transition-all">
                    <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 mb-2" />
                    <p className="text-white font-bold text-sm md:text-base">$1 boost</p>
                    <p className="text-gray-400 text-[10px] md:text-xs">Total ad spend</p>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3 md:p-4 border border-yellow-400/20 hover:border-yellow-400/40 transition-all">
                    <Eye className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 mb-2" />
                    <p className="text-white font-bold text-sm md:text-base">400K+ views</p>
                    <p className="text-gray-400 text-[10px] md:text-xs">Organic reach</p>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3 md:p-4 border border-yellow-400/20 hover:border-yellow-400/40 transition-all">
                    <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 mb-2" />
                    <p className="text-white font-bold text-sm md:text-base">11 DMs</p>
                    <p className="text-gray-400 text-[10px] md:text-xs">By morning</p>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3 md:p-4 border border-yellow-400/20 hover:border-yellow-400/40 transition-all">
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 mb-2" />
                    <p className="text-white font-bold text-sm md:text-base">9 days</p>
                    <p className="text-gray-400 text-[10px] md:text-xs">To offer</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-yellow-400/20 to-amber-500/20 rounded-xl p-4 md:p-5 border border-yellow-400/30">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-yellow-400 flex-shrink-0" />
                    <div>
                      <p className="text-yellow-400 font-black text-xl md:text-2xl mb-1">17.9M AED Sold</p>
                      <p className="text-white font-semibold text-sm md:text-base">Offer accepted 9 days after posting</p>
                      <p className="text-gray-300 text-xs md:text-sm mt-1">Closed in 21 days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Card>
            <div className="text-center mt-8 md:mt-12 px-4">
              <a href="https://buy.stripe.com/fZeaH65v24Ab1wc3ce" target="_blank" rel="noopener noreferrer"
                 className="group relative inline-block w-full max-w-3xl">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl opacity-75 group-hover:opacity-100 blur-lg transition duration-300"></div>
                <div className="relative px-6 py-4 md:px-10 md:py-5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black rounded-2xl shadow-2xl transition-all duration-300 group-hover:scale-105 font-black text-base md:text-xl uppercase tracking-wider flex items-center justify-center gap-2 md:gap-3">
                  <Video className="w-5 h-5 md:w-7 md:h-7" />
                  <span>I Want Results Like Mr. Lucas</span>
                </div>
              </a>
            </div>
          </Card>
        </div>
      </section>

      {/* TESTIMONIALS - LIGHT */}
      <section className="relative py-10 md:py-20 bg-white overflow-hidden text-black">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute w-96 h-96 bg-yellow-500 rounded-full blur-3xl top-0 right-0" />
          <div className="absolute w-96 h-96 bg-orange-500 rounded-full blur-3xl bottom-0 left-0" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-10">
            <Card>
              <h2 className="text-2xl md:text-5xl font-black mb-3 md:mb-4">See More <span className="text-transparent bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text">AI Videos</span> in Action</h2>
              <p className="text-gray-700 text-sm md:text-xl max-w-2xl mx-auto">Real agents getting real results with AI powered videos, zero filming required</p>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto mb-8 md:mb-10">
            {[
              { id: 'k1gfuxd7uw', title: 'Agent Steven Video', aspectRatio: '175.83%' },
              { id: 'eilfzivcqu', title: 'Agent Gabriel Video', aspectRatio: '177.22%' },
            ].map((v, i) => (
              <Card key={i}>
                <div className={`bg-white rounded-3xl overflow-hidden border-2 border-gray-200 shadow-xl hover:shadow-2xl hover:border-yellow-400/50 ${tilt}`}>
                  <div className="relative p-3 md:p-4">
                    <div className="absolute top-5 left-5 md:top-6 md:left-6 z-10">
                      <div className="px-3 py-1 md:px-4 md:py-2 bg-black/80 backdrop-blur-sm rounded-full border border-white/20">
                        <span className="text-white text-[10px] md:text-xs font-bold uppercase tracking-wide">Real AI Video</span>
                      </div>
                    </div>
                    <div className="rounded-2xl overflow-hidden bg-black">
                      <div className="wistia_responsive_padding" style={{ padding: i === 0 ? '175.83% 0 0 0' : '177.22% 0 0 0', position: 'relative' }}>
                        <div className="wistia_responsive_wrapper" style={{ height: '100%', left: 0, position: 'absolute', top: 0, width: '100%' }}>
                          <iframe
                            src={`https://fast.wistia.net/embed/iframe/${v.id}?web_component=true&seo=true&videoFoam=true`}
                            title={v.title}
                            allow="autoplay; fullscreen"
                            frameBorder="0"
                            scrolling="no"
                            width="100%"
                            height="100%"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 md:p-6 bg-gradient-to-t from-gray-50 to-white">
                    <div className="flex items-center gap-3 mb-2 md:mb-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full grid place-items-center">
                        <CheckCircle className="w-5 h-5 md:w-7 md:h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base md:text-xl font-black text-gray-900">{v.title.replace(' Video', '')}</h3>
                        <p className="text-gray-600 text-xs md:text-sm font-semibold">Generated in 6,7 minutes</p>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs md:text-sm">AI powered video, no filming, no equipment</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-3 md:space-y-4 mb-8 md:mb-10">
            <Card>
              <div className="relative overflow-hidden">
                <div className="flex animate-scroll">
                  {[...Array(2)].map((_, setIndex) => (
                    <div key={setIndex} className="flex gap-3 md:gap-4 pr-3 md:pr-4">
                      {agents1.map((a, i) => (
                        <div key={i} className="flex-shrink-0 w-32 md:w-48 group">
                          <div className={`relative bg-white rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:scale-105 ${tilt}`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative w-full h-40 md:h-56">
                              <Image src={a.img} alt={a.name} fill sizes="(max-width: 768px) 128px, 192px" className="object-cover" loading="lazy" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 transform translate-y-full group-hover:translate-y-0 transition-transform">
                              <div className="flex items-start gap-2 text-white">
                                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-black text-[10px] md:text-xs mb-0.5">{a.name}</p>
                                  <p className="text-yellow-400 text-[9px] md:text-[10px] font-semibold">{a.loc}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card>
              <div className="relative overflow-hidden">
                <div className="flex animate-scroll-reverse">
                  {[...Array(2)].map((_, setIndex) => (
                    <div key={setIndex} className="flex gap-3 md:gap-4 pr-3 md:pr-4">
                      {agents2.map((a, i) => (
                        <div key={i} className="flex-shrink-0 w-32 md:w-48 group">
                          <div className={`relative bg-white rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:scale-105 ${tilt}`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative w-full h-40 md:h-56">
                              <Image src={a.img} alt={a.name} fill sizes="(max-width: 768px) 128px, 192px" className="object-cover" loading="lazy" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 transform translate-y-full group-hover:translate-y-0 transition-transform">
                              <div className="flex items-start gap-2 text-white">
                                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-black text-[10px] md:text-xs mb-0.5">{a.name}</p>
                                  <p className="text-yellow-400 text-[9px] md:text-[10px] font-semibold">{a.loc}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <Card>
            <div className="text-center">
              <div className="inline-flex flex-col items-center gap-3 px-6 py-4 md:px-8 md:py-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400/30 rounded-2xl">
                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-yellow-600" />
                <p className="text-gray-800 font-bold text-base md:text-lg">Create videos like these in <span className="text-yellow-700 font-black">7 minutes</span></p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="text-center mt-12 md:mt-16 mb-8 md:mb-10">
              <div className="inline-flex items-center gap-2 mb-4 md:mb-6 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400/30 rounded-full">
                <Users className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
                <span className="text-yellow-800 font-black text-xs md:text-sm uppercase tracking-wide">Agent Success Stories</span>
              </div>
              <h2 className="text-2xl md:text-5xl font-black mb-3 md:mb-4">Real Agents, <span className="text-transparent bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text">Real Results</span></h2>
              <p className="text-gray-700 text-sm md:text-xl max-w-2xl mx-auto">Agents just like you are closing more deals with AI videos</p>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-6xl mx-auto mb-8 md:mb-10">
            {(showAllTestimonials ? testimonials : testimonials.slice(0, 6)).map((t, i) => (
              <Card key={i}>
                <div className={`bg-white rounded-3xl overflow-hidden border-2 border-gray-200 shadow-xl hover:shadow-2xl hover:border-yellow-400/50 transition-all duration-300 ${tilt} p-5 md:p-7`}>
                  <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                    <div className="relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0">
                      <Image
                        src={t.image}
                        alt={t.name}
                        fill
                        sizes="64px"
                        className="rounded-full object-cover border-2 border-yellow-400 shadow-lg"
                        loading="lazy"
                      />
                      {t.verified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                          <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-gray-900 font-black text-base md:text-lg">{t.name}</h4>
                      </div>
                      <p className="text-gray-600 text-xs md:text-sm font-semibold mb-2">{t.location}</p>
                      <div className="flex gap-1">
                        {[...Array(t.rating)].map((_, idx) => (
                          <span key={idx} className="text-yellow-500 text-base md:text-lg">★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed italic">"{t.text}"</p>
                </div>
              </Card>
            ))}
          </div>

          {!showAllTestimonials && (
            <div className="text-center">
              <button
                onClick={() => setShowAllTestimonials(true)}
                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <Eye className="w-5 h-5" />
                <span>See More Success Stories</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-gray-500 text-sm mt-3">Discover what other agents are achieving</p>
            </div>
          )}
        </div>
      </section>

      {/* TRIPLE GUARANTEE - DARK */}
      <section className="relative py-12 md:py-20 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute w-96 h-96 bg-green-500 rounded-full blur-3xl top-0 left-1/4 animate-pulse" style={{ animationDuration: '7s' }} />
          <div className="absolute w-96 h-96 bg-yellow-500 rounded-full blur-3xl bottom-0 right-1/4 animate-pulse" style={{ animationDuration: '9s' }} />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 md:px-6 text-center">
          <div className="mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 mb-4 md:mb-6 px-4 py-2 md:px-6 md:py-3 bg-green-500/10 border border-green-500/30 rounded-full">
              <Shield className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
              <span className="text-green-400 font-black text-xs md:text-sm uppercase tracking-wide">Your Protection</span>
            </div>
            <h2 className="text-2xl md:text-5xl font-black text-white mb-3 md:mb-4">Complete Peace of Mind</h2>
            <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto">Three guarantees to ensure your success and satisfaction</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 md:gap-6 max-w-5xl mx-auto">
            {[
              { icon: Shield, title: '30 Day Money Back', desc: 'Full refund if not satisfied. No questions, no hassle, keep all materials.', color: 'from-green-500 to-green-600' },
              { icon: Zap, title: 'Instant Access', desc: 'Start creating AI videos in under 5 minutes. All materials delivered immediately.', color: 'from-yellow-400 to-amber-500' },
              { icon: Award, title: 'Lifetime Updates', desc: 'Free access to all future improvements, templates, and training forever.', color: 'from-yellow-400 to-orange-500' },
            ].map((it, i) => (
              <div key={i}>
                <div className={`bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border-2 border-gray-700/50 hover:border-gray-600/80 rounded-2xl p-5 md:p-7 h-full transition-all duration-300 hover:scale-105 ${tilt}`}>
                  <div className={`w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 md:mb-5 bg-gradient-to-br ${it.color} rounded-xl grid place-items-center shadow-lg`}>
                    <it.icon className="w-7 h-7 md:w-8 md:h-8 text-black" />
                  </div>
                  <h3 className="font-black text-white mb-3 md:mb-4 text-lg md:text-xl">{it.title}</h3>
                  <p className="text-gray-300 text-xs md:text-sm leading-relaxed">{it.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ - LIGHT */}
      <section className="relative py-10 md:py-20 bg-white text-black">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <Card><h2 className="text-2xl md:text-5xl font-black text-center mb-8 md:mb-10">Common Questions</h2></Card>
          <div className="space-y-3 md:space-y-4">
            {faqs.map((f, i) => (
              <Card key={i}>
                <FAQItem question={f.q} answer={f.a} index={i} />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA - DARK */}
      <section className="relative py-10 md:py-20 bg-black">
        <Card>
          <div className="max-w-5xl mx-auto px-4 md:px-6 text-center">
            <h2 className="text-2xl md:text-5xl font-black mb-4 md:mb-6">Enrollment open now</h2>
            <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-10">Price jumps to $97 at midnight</p>
            <a href="https://buy.stripe.com/fZeaH65v24Ab1wc3ce" target="_blank" rel="noopener noreferrer"
               className="group relative inline-block w-full max-w-3xl">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl opacity-75 group-hover:opacity-100 blur-lg transition duration-300"></div>
              <div className="relative px-6 py-4 md:px-10 md:py-5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black rounded-2xl shadow-2xl transition-all duration-300 group-hover:scale-105 font-black text-base md:text-xl uppercase tracking-wider flex items-center justify-center">
                <span>Get instant access $37</span>
              </div>
            </a>
          </div>
        </Card>
      </section>

      {/* FOOTER - LIGHT */}
      <footer className="relative py-10 md:py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50 text-black border-t-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12">
            <div className="md:col-span-2">
              <h3 className="text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text mb-3 md:mb-4">AI FastScale</h3>
              <p className="text-gray-700 text-sm md:text-base mb-4 leading-relaxed">Turn a photo into a realistic talking AI video in 7 minutes, built for real estate agents who want more leads without expensive video production.</p>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, href: '#' },
                  { icon: Instagram, href: '#' },
                  { icon: Twitter, href: '#' },
                  { icon: Youtube, href: '#' },
                  { icon: Linkedin, href: '#' }
                ].map((social, idx) => (
                  <a key={idx} href={social.href} target="_blank" rel="noopener noreferrer"
                     className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full grid place-items-center hover:scale-110 transition-transform shadow-lg">
                    <social.icon className="w-4 h-4 md:w-5 md:h-5 text-black" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-base md:text-lg font-black text-gray-900 mb-3 md:mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="/privacy-policy" className="text-gray-700 hover:text-yellow-600 text-sm md:text-base font-semibold transition-colors">Privacy Policy</a></li>
                <li><a href="/terms-of-service" className="text-gray-700 hover:text-yellow-600 text-sm md:text-base font-semibold transition-colors">Terms of Service</a></li>
                <li><a href="/refund-policy" className="text-gray-700 hover:text-yellow-600 text-sm md:text-base font-semibold transition-colors">Refund Policy</a></li>
                <li><a href="/disclaimer" className="text-gray-700 hover:text-yellow-600 text-sm md:text-base font-semibold transition-colors">Disclaimer</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-base md:text-lg font-black text-gray-900 mb-3 md:mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-gray-700 text-sm md:text-base">
                  <Mail className="w-4 h-4 md:w-5 md:h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span className="font-semibold">support@aifastscale.com</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700 text-sm md:text-base">
                  <Phone className="w-4 h-4 md:w-5 md:h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span className="font-semibold">+1 (555) 123-4567</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700 text-sm md:text-base">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span className="font-semibold">Miami, FL USA</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-6 md:pt-8 text-center">
            <p className="text-gray-600 text-xs md:text-sm font-semibold mb-2">
              © {new Date().getFullYear()} AI FastScale. All rights reserved.
            </p>
            <p className="text-gray-500 text-[10px] md:text-xs">
              <span className="font-bold">Security Notice:</span> This site uses light protection measures (right-click blocking, keyboard shortcuts disabled). These only deter casual users, not experienced developers. We respect that code is never fully protected on the web.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
