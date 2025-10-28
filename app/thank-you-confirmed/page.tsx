'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { CheckCircle, Mail, Download, Play, ArrowRight, Sparkles } from 'lucide-react';
import { trackPurchase, trackCompleteRegistration } from '../utils/tracking';

export default function ThankYouPage() {
  const [orderTracked, setOrderTracked] = useState(false);

  useEffect(() => {
    // Only track once per page load
    if (!orderTracked) {
      // Get order ID from URL parameters (Stripe will pass this)
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get('session_id') || `order_${Date.now()}`;

      // Fire both Purchase and CompleteRegistration events
      trackPurchase(orderId, 37.00);
      trackCompleteRegistration(orderId);

      setOrderTracked(true);

      // Log for debugging
      console.log('✅ Purchase tracking fired:', orderId);
    }
  }, [orderTracked]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Confetti/Celebration Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl top-1/4 left-1/4 animate-pulse" />
        <div className="absolute w-96 h-96 bg-green-500/20 rounded-full blur-3xl bottom-1/4 right-1/4 animate-pulse" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-12 md:py-20">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
            <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-50 animate-pulse" />
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-black text-center mb-6 bg-gradient-to-r from-yellow-400 via-green-400 to-yellow-400 bg-clip-text text-transparent">
          🎉 Welcome to AI FastScale!
        </h1>

        <p className="text-xl md:text-2xl text-center text-gray-300 mb-12 max-w-2xl mx-auto">
          Your payment was successful! Get ready to create your first <span className="font-black text-yellow-400">7-Minute AgentClone™</span> video.
        </p>

        {/* Order Confirmation */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-green-500/30 rounded-2xl p-8 mb-12 shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Order Confirmed</h2>
              <p className="text-gray-400">Receipt sent to your email</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-gray-700">
              <span className="text-gray-400">Product</span>
              <span className="font-bold text-white">7 Minute AgentClone™ Course</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-700">
              <span className="text-gray-400">Amount Paid</span>
              <span className="font-bold text-green-400">$37.00 USD</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-400">Status</span>
              <span className="font-bold text-green-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Completed
              </span>
            </div>
          </div>
        </div>

        {/* Lifetime Access Notice - PROMINENT */}
        <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-2 border-purple-500/50 rounded-2xl p-8 mb-12 shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
            <h2 className="text-3xl font-black text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              🎁 Lifetime Access + Free Updates!
            </h2>
            <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
          </div>
          <p className="text-xl text-center text-gray-200 mb-4 font-semibold">
            You now have <span className="text-purple-400 font-black">LIFETIME ACCESS</span> to all course materials!
          </p>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 text-center">
            <p className="text-lg text-gray-300 mb-2">
              ✨ <span className="font-bold text-white">Free monthly updates</span> with new templates, prompts, and AI workflows
            </p>
            <p className="text-base text-purple-300 font-semibold">
              📅 Check back every month for the latest updates - Always FREE!
            </p>
          </div>
        </div>

        {/* Download Button - BIG AND PROMINENT */}
        <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-2 border-yellow-500/50 rounded-2xl p-8 mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-yellow-400">
            📥 Download Your Course Materials Now!
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            All templates, system prompts, video workflows, and training materials are ready for instant download.
          </p>
          <a
            href="https://drive.google.com/drive/folders/1YLkKPgtU_q1BV6PVISO4VEru1UkAldw1?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-12 py-6 rounded-2xl font-black text-2xl hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-green-500/50"
          >
            <Download className="w-8 h-8" />
            DOWNLOAD ALL FILES
            <ArrowRight className="w-8 h-8" />
          </a>
          <p className="text-gray-400 text-sm mt-4">
            Opens in Google Drive • All files included
          </p>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/30 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-black text-center mb-8 text-white">
            What Happens Next?
          </h2>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-black text-black text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Download className="w-5 h-5 text-yellow-400" />
                  Download All Course Materials
                </h3>
                <p className="text-gray-300">
                  Click the big green button above to access your Google Drive folder with all templates, prompts, and training videos.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-black text-black text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Play className="w-5 h-5 text-yellow-400" />
                  Create Your First Video (7 Minutes!)
                </h3>
                <p className="text-gray-300">
                  Follow the step-by-step blueprint to turn a photo into your first talking AI video. Takes only 7 minutes!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Reminder */}
        <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-2 border-green-500/50 rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-black text-green-400 mb-4 text-center">
            💚 Protected by Our 30-Day Money-Back Guarantee
          </h3>
          <p className="text-gray-300 text-center max-w-2xl mx-auto">
            If you don't generate quality leads within 30 days, simply email us at <a href="mailto:support@aifastscale.com" className="text-yellow-400 hover:text-yellow-300 font-bold">support@aifastscale.com</a> for a full refund. No questions asked.
          </p>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <a
            href="mailto:support@aifastscale.com?subject=Course%20Access%20-%20Thank%20You%20Page"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-xl font-black text-xl hover:scale-105 transition-transform duration-300 shadow-2xl"
          >
            Need Help? Contact Support
            <ArrowRight className="w-6 h-6" />
          </a>
        </div>

        {/* Footer Message */}
        <p className="text-center text-gray-500 mt-12 text-sm">
          Questions? Email us at <a href="mailto:support@aifastscale.com" className="text-yellow-400 hover:text-yellow-300">support@aifastscale.com</a>
        </p>
      </div>
    </div>
  );
}
