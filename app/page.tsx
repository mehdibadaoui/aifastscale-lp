'use client';

import React, { useEffect, useRef, useState, ReactNode, memo } from 'react';
import Image from 'next/image';
import {
  Shield, CheckCircle, ArrowRight, Zap, Clock, AlertCircle, Users, Video,
  Wand2, Upload, TrendingUp, X, Sparkles, DollarSign, MessageCircle, Eye, Award,
  Mail, MapPin, Phone, Facebook, Instagram, Linkedin, Twitter, Youtube, Play
} from 'lucide-react';

// Simple Card component without animations for better performance
interface CardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const Card: React.FC<CardProps> = memo(({ children, className = '' }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';

// Lazy video component with click-to-play facade for performance
interface LazyVideoProps {
  videoId: string;
  title: string;
  aspectRatio: string;
  posterImage?: string;
  className?: string;
}

const LazyVideo: React.FC<LazyVideoProps> = memo(({ videoId, title, aspectRatio, posterImage, className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const loadWistiaScript = () => {
    if (!scriptLoaded && !document.querySelector('script[src="https://fast.wistia.net/player.js"]')) {
      const s = document.createElement('script');
      s.src = 'https://fast.wistia.net/player.js';
      s.async = true;
      document.body.appendChild(s);
      setScriptLoaded(true);
    }
  };

  const handlePlay = () => {
    loadWistiaScript();
    setIsPlaying(true);
  };

  if (isPlaying) {
    return (
      <div className={className}>
        <div className="wistia_responsive_padding" style={{ padding: aspectRatio, position: 'relative' }}>
          <div className="wistia_responsive_wrapper" style={{ height: '100%', left: 0, position: 'absolute', top: 0, width: '100%' }}>
            <iframe
              src={`https://fast.wistia.net/embed/iframe/${videoId}?web_component=true&seo=true&autoPlay=true`}
              title={title}
              allow="autoplay; fullscreen"
              frameBorder="0"
              scrolling="no"
              width="100%"
              height="100%"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <button
        onClick={handlePlay}
        className="relative w-full group cursor-pointer"
        style={{ paddingTop: aspectRatio }}
        aria-label={`Play ${title}`}
      >
        <div className="absolute inset-0 bg-black rounded-xl overflow-hidden">
          {posterImage && (
            <Image
              src={posterImage}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              loading="lazy"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-yellow-500 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 md:w-10 md:h-10 text-black ml-1" fill="currentColor" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-xs md:text-sm font-bold bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg inline-block">
              Click to play video
            </p>
          </div>
        </div>
      </button>
    </div>
  );
});

LazyVideo.displayName = 'LazyVideo';

export default function AgentLandingPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [showSecurityPopup, setShowSecurityPopup] = useState(false);

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

  useEffect(() => {
    // Wistia script now loads on-demand when videos are played (lazy loading for performance)

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
      location: 'Miami, FL',
      image: '/images/IMG_3329_result.webp',
      text: 'Got 8 qualified leads in my first week, closed 2 deals in 30 days, this system is unreal.',
      rating: 5
    },
    {
      name: 'Marcus Johnson',
      location: 'Houston, TX',
      image: '/images/IMG_3365_result.webp',
      text: 'I was skeptical about AI videos, but after posting my first one I got 23 DMs overnight, never going back.',
      rating: 5
    },
    {
      name: 'Isabella Rodriguez',
      location: 'Los Angeles, CA',
      image: '/images/IMG_3360_result.webp',
      text: 'No more expensive video crews, I create everything from my phone in under 10 minutes, total game changer.',
      rating: 5
    },
    {
      name: 'David Chen',
      location: 'New York, NY',
      image: '/images/IMG_3380_result.webp',
      text: 'Went from 2 leads per month to 15, my broker asked me what I am doing differently, love this course.',
      rating: 5
    }
  ];

  const faqs = [
    { q: 'Do I need to film or record audio?', a: 'No, you only need one good image, the system generates the script and the AI creates the speech.' },
    { q: 'Is this legal with MLS and broker rules?', a: 'Yes, we include a broker compliance overlay kit and export templates.' },
    { q: 'Will it look fake?', a: 'Videos are human paced and preserve your natural features.' },
    { q: 'How long does it take?', a: '7 minutes for the full workflow, phone editing takes under 10 minutes total.' },
    { q: 'What if I do not get leads?', a: '30 day full refund, you keep everything.' },
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
      <div className="flex flex-wrap justify-center gap-3 md:gap-4">
        <div className="group flex-1 min-w-[140px] max-w-[180px]">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl opacity-30 group-hover:opacity-50 blur transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-3 md:p-4 text-center transform group-hover:scale-105 transition-all duration-300">
              <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-yellow-500/50 transition-shadow duration-300">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-black" />
              </div>
              <div className="text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text mb-1">500+</div>
              <div className="text-gray-300 text-[10px] md:text-xs font-semibold">Active Agents</div>
            </div>
          </div>
        </div>

        <div className="group flex-1 min-w-[140px] max-w-[180px]">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl opacity-30 group-hover:opacity-50 blur transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-3 md:p-4 text-center transform group-hover:scale-105 transition-all duration-300">
              <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-yellow-500/50 transition-shadow duration-300">
                <Video className="w-5 h-5 md:w-6 md:h-6 text-black" />
              </div>
              <div className="text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text mb-1">7 Min</div>
              <div className="text-gray-300 text-[10px] md:text-xs font-semibold">Video Creation</div>
            </div>
          </div>
        </div>

        <div className="group flex-1 min-w-[140px] max-w-[180px]">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl opacity-30 group-hover:opacity-50 blur transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-3 md:p-4 text-center transform group-hover:scale-105 transition-all duration-300">
              <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-yellow-500/50 transition-shadow duration-300">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-black" />
              </div>
              <div className="text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text mb-1">100+</div>
              <div className="text-gray-300 text-[10px] md:text-xs font-semibold">Monthly Leads</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

  SecureCheckout.displayName = 'SecureCheckout';

  const GuaranteeSection = memo(() => (
    <section className="relative py-12 md:py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="relative max-w-4xl mx-auto px-4 md:px-6">
        <div className={`bg-white rounded-3xl shadow-2xl border-2 border-gray-200 p-6 md:p-12 ${tilt}`}>
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="relative">
              <div className="w-24 h-24 md:w-40 md:h-40 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 rounded-full grid place-items-center shadow-2xl">
                <Shield className="w-12 h-12 md:w-20 md:h-20 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 md:w-16 md:h-16 bg-green-500 rounded-full grid place-items-center shadow-xl border-4 border-white">
                <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
            </div>
          </div>
          <div className="text-center mb-4 md:mb-6">
            <div className="inline-block px-4 py-2 md:px-6 md:py-2 bg-yellow-100 border-2 border-yellow-400 rounded-full mb-3 md:mb-4">
              <p className="text-yellow-800 font-black text-xs md:text-base uppercase tracking-wide">30 Day Money Back</p>
            </div>
          </div>
          <h2 className="text-2xl md:text-5xl font-black text-gray-900 mb-4 md:mb-6 leading-tight text-center">No Questions Asked Guarantee</h2>
          <div className="max-w-3xl mx-auto space-y-3 md:space-y-5 text-sm md:text-lg text-gray-700 leading-relaxed mb-6 md:mb-8">
            <p className="text-center">Try <span className="font-black text-yellow-600">7 Min AgentClone</span> today, enjoy templates, prompts, trainings, and the quick start plan.</p>
            <p className="text-center">If within <span className="font-black text-yellow-600">30 days</span> you do not feel it is worth every dollar, <span className="font-black text-yellow-600">email us for a full refund.</span></p>
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-400/50 rounded-full px-4 py-2 md:px-8 md:py-3 shadow-lg">
                <p className="text-yellow-700 font-black text-xs md:text-lg">30 Day Money Back, 100% Risk Free</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <a href="https://buy.stripe.com/fZeaH65v24Ab1wc3ce" target="_blank" rel="noopener noreferrer"
               className="group relative inline-block w-full max-w-4xl">
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
             className="px-4 py-2 md:px-6 md:py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-lg font-black text-xs md:text-sm uppercase active:scale-95 transition-transform duration-200 whitespace-nowrap">
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
                      <div className="rounded-xl overflow-hidden bg-black/50">
                        <LazyVideo
                          videoId="skseake2i0"
                          title="VSL - 7 Minute AgentClone Course"
                          aspectRatio="56.67% 0 0 0"
                          posterImage="/images/P1_result.webp"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 md:gap-6 pt-4 px-2">
                <div className="text-center space-y-2 md:space-y-3">
                  <div className="flex items-center justify-center gap-2 flex-wrap px-2">
                    <span className="text-red-400 text-lg md:text-xl font-black uppercase line-through decoration-2">FROM $97</span>
                    <span className="text-white text-lg md:text-xl font-black uppercase">FOR ONLY</span>
                  </div>
                  <div className="text-green-400 text-5xl md:text-6xl font-black tracking-tight">US$ 37</div>
                </div>

                <a href="https://buy.stripe.com/fZeaH65v24Ab1wc3ce" target="_blank" rel="noopener noreferrer"
                   className="group relative inline-block w-full max-w-3xl px-2">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-green-400 to-green-500 rounded-2xl opacity-75 group-hover:opacity-100 blur-lg transition duration-300"></div>
                  <div className="relative px-6 py-4 md:px-10 md:py-5 bg-gradient-to-r from-green-500 via-green-400 to-green-500 rounded-2xl font-black text-base md:text-xl text-white uppercase tracking-wider transition-transform duration-300 active:scale-95 shadow-2xl flex items-center justify-center gap-2 md:gap-3">
                    <Zap className="w-5 h-5 md:w-7 md:h-7" />
                    <span>Get instant access $37</span>
                  </div>
                </a>

                <div className="flex items-center justify-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-red-600/95 to-red-700/95 backdrop-blur-sm border border-red-500/50 rounded-full shadow-lg">
                  <AlertCircle className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  <span className="text-white font-bold text-[10px] md:text-sm uppercase tracking-wide">Price jumps to <span className="text-yellow-300">$97</span> tonight</span>
                  <Clock className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </div>

                <SecureCheckout />
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
              <Card key={i} delay={i * 0.1}>
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
            <Card delay={0.2}>
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

          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-12">
            {products.map((p, i) => (
              <Card key={i} delay={i * 0.1}>
                <div className="group relative bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl overflow-hidden border border-yellow-500/10 hover:border-yellow-500/30 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative p-6 md:p-8">
                    <div className="flex items-start justify-between mb-4 md:mb-6">
                      <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full mb-3 md:mb-4">
                          <Award className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
                          <span className="text-yellow-400 font-bold text-[10px] md:text-sm uppercase tracking-wider">Core Module {i + 1}</span>
                        </div>
                        <h3 className="text-xl md:text-3xl font-black text-white mb-2 md:mb-3 leading-tight">{p.title}</h3>
                        <p className="text-gray-400 text-xs md:text-base leading-relaxed">{p.description}</p>
                      </div>

                      <div className="ml-4 md:ml-6 flex-shrink-0">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                          <div className="relative px-4 py-2 md:px-6 md:py-3 bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500 rounded-2xl shadow-2xl">
                            <div className="text-center">
                              <div className="text-[8px] md:text-xs font-bold text-black/70 uppercase tracking-wider mb-0.5">Value</div>
                              <div className="text-lg md:text-2xl font-black text-black">${p.value}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-500/20 shadow-2xl">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                      {p.image && (
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                      )}
                      <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 z-20">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full grid place-items-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                          <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-black" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-6 grid grid-cols-3 gap-2">
                      {[
                        { label: 'Instant Access' },
                        { label: 'Step by Step' },
                        { label: 'Ready to Use' }
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 px-2 py-1.5 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                          <CheckCircle className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                          <span className="text-[10px] font-semibold text-gray-300 leading-tight">{feature.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card>
            <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl overflow-hidden border border-yellow-500/20 p-6 md:p-12">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5"></div>

              <div className="relative text-center mb-8 md:mb-10">
                <div className="inline-flex items-center gap-2 md:gap-3 px-4 py-2 md:px-8 md:py-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl mb-4 md:mb-6 shadow-2xl">
                  <Sparkles className="w-5 h-5 md:w-7 md:h-7 text-black" />
                  <span className="text-black font-black text-base md:text-xl uppercase tracking-wider">Exclusive Bonuses</span>
                </div>
                <h3 className="text-2xl md:text-4xl font-black text-white mb-2">3 Premium Add-Ons</h3>
                <p className="text-gray-400 text-sm md:text-lg">Included at no extra cost</p>
              </div>

              <div className="relative grid md:grid-cols-3 gap-4 md:gap-6">
                {bonuses.map((b, i) => (
                  <Card key={i} delay={i * 0.1}>
                    <div className="group relative bg-gradient-to-br from-gray-800 to-black rounded-2xl overflow-hidden border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-500">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl"></div>

                      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-900 to-black">
                        {b.image && (
                          <Image
                            src={b.image}
                            alt={b.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                        <div className="absolute top-3 left-3 md:top-4 md:left-4">
                          <div className="px-3 py-1 md:px-4 md:py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-xl">
                            <span className="text-black font-black text-xs md:text-sm uppercase tracking-wide">Bonus {i + 1}</span>
                          </div>
                        </div>
                      </div>

                      <div className="relative p-4 md:p-6">
                        <h4 className="text-base md:text-xl font-black text-white mb-3 md:mb-4 leading-tight">{b.title}</h4>
                        <div className="flex items-center justify-between">
                          <div className="inline-flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                            <span className="text-yellow-400 font-black text-xl md:text-2xl">${b.value}</span>
                            <span className="text-gray-400 text-[10px] md:text-xs font-semibold uppercase">Value</span>
                          </div>
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full grid place-items-center shadow-lg group-hover:scale-110 transition-transform">
                            <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-black" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>

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
                 className="group relative inline-block w-full max-w-4xl">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 rounded-2xl opacity-75 group-hover:opacity-100 blur-xl transition duration-300"></div>
                <div className="relative px-6 py-4 md:px-10 md:py-6 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 text-black rounded-2xl shadow-2xl transition-all duration-300 group-hover:scale-[1.02] font-black text-base md:text-2xl uppercase tracking-wider flex items-center justify-center gap-3 md:gap-4">
                  <Zap className="w-6 h-6 md:w-8 md:h-8" />
                  <span>Get Complete System For $37</span>
                  <ArrowRight className="w-6 h-6 md:w-8 md:h-8" />
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
          <Card>
            <div className="text-center mb-8 md:mb-10">
              <div className="inline-flex items-center gap-2 mb-4 md:mb-6 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-full">
                <span className="text-yellow-400 font-black text-xs md:text-sm uppercase tracking-wide">Real Success Story</span>
              </div>
              <h2 className="text-2xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight px-4">
                <span>How Mr. Lucas Sold a </span>
                <span className="text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text">Palm Jumeirah Villa</span>
                <br /><span>with a </span>
                <span className="text-transparent bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text">$1 Video</span>
              </h2>
            </div>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-start max-w-7xl mx-auto mb-8 md:mb-10">
            <Card>
              <div className={`relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl ${tilt}`}>
                <div className="p-2 md:p-3">
                  <div className="rounded-2xl overflow-hidden bg-black/50 border border-white/5">
                    <LazyVideo
                      videoId="4o934arsbs"
                      title="Mr Lucas Actual Video"
                      aspectRatio="177.78% 0 0 0"
                      posterImage="/images/P3_result.webp"
                    />
                  </div>
                </div>
                <div className="p-4 md:p-6 bg-gradient-to-t from-black to-transparent">
                  <div className="flex items-center gap-3 mb-2 md:mb-3">
                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
                    <h3 className="text-xl md:text-2xl font-black">Mr. Lucas Actual Video</h3>
                  </div>
                  <p className="text-gray-400 text-xs md:text-sm">Created in 6 min, Edited in 12 min, Sold for 17.9M AED</p>
                </div>
              </div>
            </Card>

            <div className="space-y-4 md:space-y-6">
              <Card>
                <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-950/20 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-4 md:p-8 hover:border-yellow-400/50 transition-all duration-300">
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full grid place-items-center shadow-xl"><span className="text-black text-xl md:text-2xl font-black">1</span></div>
                    <h4 className="text-yellow-400 font-black text-xl md:text-2xl">The Challenge</h4>
                  </div>
                  <p className="text-gray-200 text-sm md:text-lg">Mr. Lucas listed a 6 bedroom beachfront villa in Palm Jumeirah priced at <span className="text-yellow-400 font-bold">18.5M AED</span>, posted a simple phone video for $1 on Instagram and TikTok.</p>
                </div>
              </Card>
              <Card delay={0.2}>
                <div className="bg-gradient-to-br from-purple-900/30 to-blue-950/20 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-4 md:p-8 hover:border-purple-400/50 transition-all duration-300">
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full grid place-items-center shadow-xl"><span className="text-white text-xl md:text-2xl font-black">2</span></div>
                    <h4 className="text-purple-400 font-black text-xl md:text-2xl">What He Did</h4>
                  </div>
                  <p className="text-gray-200 text-sm md:text-lg">Used the <span className="text-purple-400 font-bold">7 Min AgentClone System</span> to turn one photo into an AI talking video, posted with a <span className="text-purple-400 font-bold">$1 boost</span>.</p>
                </div>
              </Card>
              <Card delay={0.4}>
                <div className="bg-gradient-to-br from-yellow-900/40 to-amber-950/30 backdrop-blur-sm border-2 border-yellow-400/40 rounded-2xl p-4 md:p-8">
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full grid place-items-center shadow-xl"><span className="text-black text-xl md:text-2xl font-black">3</span></div>
                    <h4 className="text-yellow-400 font-black text-xl md:text-2xl">The Result</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                    <div className="bg-black/40 rounded-xl p-3 md:p-4 border border-yellow-400/20">
                      <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 mb-2" />
                      <p className="text-white font-bold text-base md:text-lg">$1 boost</p>
                      <p className="text-gray-400 text-[10px] md:text-xs">Instagram + TikTok</p>
                    </div>
                    <div className="bg-black/40 rounded-xl p-3 md:p-4 border border-yellow-400/20">
                      <MessageCircle className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 mb-2" />
                      <p className="text-white font-bold text-base md:text-lg">11 DMs</p>
                      <p className="text-gray-400 text-[10px] md:text-xs">By morning</p>
                    </div>
                    <div className="bg-black/40 rounded-xl p-3 md:p-4 border border-yellow-400/20">
                      <Eye className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 mb-2" />
                      <p className="text-white font-bold text-base md:text-lg">400K+ views</p>
                      <p className="text-gray-400 text-[10px] md:text-xs">37 inquiries</p>
                    </div>
                    <div className="bg-black/40 rounded-xl p-3 md:p-4 border border-yellow-400/20">
                      <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 mb-2" />
                      <p className="text-white font-bold text-base md:text-lg">9 days</p>
                      <p className="text-gray-400 text-[10px] md:text-xs">To acceptance</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-900/60 to-amber-900/60 rounded-xl p-4 md:p-6 border-2 border-yellow-400/60">
                    <div className="flex items-start gap-3 md:gap-4">
                      <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-yellow-400" />
                      <div>
                        <p className="text-yellow-400 font-black text-2xl md:text-3xl mb-2">17.9M AED Offer</p>
                        <p className="text-white font-bold text-base md:text-lg">Accepted 9 days after first viewing</p>
                        <p className="text-gray-300 text-xs md:text-sm mt-1">Title transfer completed in 21 days</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <Card>
            <div className="text-center mt-8 md:mt-12 px-4">
              <a href="https://buy.stripe.com/fZeaH65v24Ab1wc3ce" target="_blank" rel="noopener noreferrer"
                 className="group relative inline-block w-full max-w-4xl">
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
          <Card>
            <div className="text-center mb-8 md:mb-10">
              <div className="inline-flex items-center gap-2 mb-4 md:mb-6 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400/30 rounded-full">
                <Users className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
                <span className="text-yellow-800 font-black text-xs md:text-sm uppercase tracking-wide">Agent Success Stories</span>
              </div>
              <h2 className="text-2xl md:text-5xl font-black mb-3 md:mb-4">Real Agents, <span className="text-transparent bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text">Real Results</span></h2>
              <p className="text-gray-700 text-sm md:text-xl max-w-2xl mx-auto">Agents just like you are closing more deals with AI videos</p>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-6xl mx-auto mb-8 md:mb-10">
            {testimonials.map((t, i) => (
              <Card key={i} delay={i * 0.1}>
                <div className={`bg-white rounded-3xl overflow-hidden border-2 border-gray-200 shadow-xl hover:shadow-2xl hover:border-yellow-400/50 ${tilt} p-4 md:p-6`}>
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
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-900 font-black text-base md:text-lg mb-1">{t.name}</h4>
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

          <div className="text-center mb-8 md:mb-10">
            <Card>
              <h2 className="text-2xl md:text-5xl font-black mb-3 md:mb-4">See More <span className="text-transparent bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text">AI Videos</span> in Action</h2>
              <p className="text-gray-700 text-sm md:text-xl max-w-2xl mx-auto">Real agents getting real results with AI powered videos, zero filming required</p>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto mb-8 md:mb-10">
            {[
              { id: 'k1gfuxd7uw', title: 'Agent Steven Video', aspectRatio: '175.83% 0 0 0', poster: '/images/IMG_3365_result.webp' },
              { id: 'eilfzivcqu', title: 'Agent Gabriel Video', aspectRatio: '177.22% 0 0 0', poster: '/images/IMG_3367_result.webp' },
            ].map((v, i) => (
              <Card key={i} delay={i * 0.2}>
                <div className={`bg-white rounded-3xl overflow-hidden border-2 border-gray-200 shadow-xl hover:shadow-2xl hover:border-yellow-400/50 ${tilt}`}>
                  <div className="relative p-3 md:p-4">
                    <div className="absolute top-5 left-5 md:top-6 md:left-6 z-10">
                      <div className="px-3 py-1 md:px-4 md:py-2 bg-black/80 backdrop-blur-sm rounded-full border border-white/20">
                        <span className="text-white text-[10px] md:text-xs font-bold uppercase tracking-wide">Real AI Video</span>
                      </div>
                    </div>
                    <div className="rounded-2xl overflow-hidden bg-black">
                      <LazyVideo
                        videoId={v.id}
                        title={v.title}
                        aspectRatio={v.aspectRatio}
                        posterImage={v.poster}
                      />
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
        </div>
      </section>

      {/* TRIPLE GUARANTEE - DARK */}
      <section className="relative py-10 md:py-20 bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
          <Card>
            <h2 className="text-2xl md:text-5xl font-black mb-6 md:mb-8">Triple Guarantee Protection</h2>
            <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
              {[
                { icon: Shield, title: '30 Day Money Back', desc: 'Full refund if you do not get leads' },
                { icon: Zap, title: 'Instant Access', desc: 'Start in 5 minutes' },
                { icon: TrendingUp, title: 'Free Updates for Life', desc: 'All improvements included' },
              ].map((it, i) => (
                <Card key={i} delay={i * 0.1}>
                  <div className={`bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-400/30 rounded-2xl p-4 md:p-6 ${tilt}`}>
                    <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl grid place-items-center">
                      <it.icon className="w-7 h-7 md:w-8 md:h-8 text-black" />
                    </div>
                    <h3 className="font-black text-white mb-2 md:mb-3 text-base md:text-xl">{it.title}</h3>
                    <p className="text-gray-400 text-xs md:text-sm">{it.desc}</p>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ - LIGHT */}
      <section className="relative py-10 md:py-20 bg-white text-black">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <Card><h2 className="text-2xl md:text-5xl font-black text-center mb-8 md:mb-10">Common Questions</h2></Card>
          <div className="space-y-3 md:space-y-4">
            {faqs.map((f, i) => (
              <Card key={i} delay={i * 0.05}>
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
               className="group relative inline-block w-full max-w-4xl">
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
