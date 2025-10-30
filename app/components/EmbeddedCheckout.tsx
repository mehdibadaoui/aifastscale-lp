'use client';

import { useState, useEffect } from 'react';
import { Shield, Lock, CreditCard, CheckCircle, Star, Loader } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !email) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/thank-you-confirmed`,
          receipt_email: email,
        },
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed. Please try again.');
        setIsProcessing(false);
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email Input - Stripe Style */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="your@email.com"
          className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
        />
      </div>

      {/* Stripe Payment Element - MINIMAL for max conversion */}
      <div>
        <PaymentElement
          options={{
            layout: 'tabs',
            paymentMethodOrder: ['card', 'link'],
            fields: {
              billingDetails: {
                address: 'auto', // Only show if needed
              },
            },
            terms: {
              card: 'never', // Remove terms text for cleaner look
            },
          }}
        />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
          <p className="text-red-400 text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Submit Button - Stripe Style */}
      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements || !email}
        className="w-full px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <span>Pay $37.00</span>
        )}
      </button>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-2">
        <Lock className="w-3.5 h-3.5" />
        <span>Powered by <span className="font-semibold">stripe</span></span>
      </div>
    </form>
  );
}

export default function EmbeddedCheckout() {
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Create PaymentIntent on component mount
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'customer@example.com' }), // Placeholder
        });

        const data = await response.json();

        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Error creating payment intent:', err);
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, []);

  return (
    <section id="checkout" className="relative py-12 md:py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-green-500/20 border border-green-500/50 rounded-full mb-3 md:mb-4">
            <span className="text-green-400 font-bold text-xs md:text-sm uppercase tracking-wide">🔒 Secure Checkout</span>
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-2 md:mb-4 px-4">
            Complete Your Order
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-300 px-4">
            Join 500+ agents already using AgentClone™ to generate leads
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
          {/* Left: Order Summary */}
          <div className="space-y-4 md:space-y-6">
            {/* Product Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-yellow-500/30 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl">
              <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg md:rounded-xl flex items-center justify-center">
                  <Star className="w-8 h-8 md:w-10 md:h-10 text-black" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-black text-white mb-1">7-Minute AgentClone™ System</h3>
                  <p className="text-xs md:text-sm text-gray-400">Complete AI Video Course + System Prompts</p>
                </div>
              </div>

              {/* What's Included */}
              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0" />
                  <span>7-minute step-by-step video training</span>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0" />
                  <span>AI system prompts & workflows</span>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0" />
                  <span>Real estate scripts & templates</span>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0" />
                  <span>Lifetime access + free updates</span>
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-gray-700 pt-3 md:pt-4">
                <div className="flex justify-between items-center mb-1.5 md:mb-2">
                  <span className="text-sm md:text-base text-gray-400">Regular Price</span>
                  <span className="text-sm md:text-base text-gray-500 line-through">$97.00</span>
                </div>
                <div className="flex justify-between items-center mb-1.5 md:mb-2">
                  <span className="text-sm md:text-base text-gray-400">Today's Discount</span>
                  <span className="text-sm md:text-base text-green-400 font-bold">-$60.00</span>
                </div>
                <div className="border-t border-gray-700 mt-3 md:mt-4 pt-3 md:pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg md:text-xl font-bold text-white">Total</span>
                    <span className="text-2xl md:text-3xl font-black text-yellow-400">$37.00</span>
                  </div>
                  <p className="text-xs text-gray-500 text-right mt-1">One-time payment • USD</p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg md:rounded-xl p-4 md:p-6">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Shield className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0" />
                  <span className="text-xs md:text-sm text-gray-300">SSL Secured</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Lock className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0" />
                  <span className="text-xs md:text-sm text-gray-300">256-bit Encryption</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0" />
                  <span className="text-xs md:text-sm text-gray-300">30-Day Guarantee</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0" />
                  <span className="text-xs md:text-sm text-gray-300">Secure Payment</span>
                </div>
              </div>
            </div>

            {/* Money-back guarantee */}
            <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/30 rounded-lg md:rounded-xl p-3 md:p-4">
              <div className="flex items-start gap-2 md:gap-3">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-green-400 flex-shrink-0 mt-0.5 md:mt-1" />
                <div>
                  <h4 className="text-sm md:text-base font-bold text-white mb-1">30-Day Money-Back Guarantee</h4>
                  <p className="text-xs md:text-sm text-gray-300">If you don't get 5-15 leads in your first week, we'll refund every penny. No questions asked.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Payment Form */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-green-500/50 rounded-xl md:rounded-2xl p-5 md:p-8 shadow-2xl">
            <div className="mb-5 md:mb-6">
              <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
                <Lock className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                <span className="text-green-400 font-bold text-xs md:text-sm uppercase tracking-wide">Secure Payment</span>
              </div>
              <p className="text-center text-gray-400 text-xs md:text-sm">
                Your payment information is encrypted and secure
              </p>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-blue-500 mb-4" />
                <p className="text-gray-400 text-sm">Loading secure checkout...</p>
              </div>
            ) : clientSecret ? (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'night',
                    variables: {
                      colorPrimary: '#2563eb',
                      colorBackground: '#111827',
                      colorText: '#ffffff',
                      colorDanger: '#ef4444',
                      fontFamily: 'system-ui, sans-serif',
                      borderRadius: '8px',
                    },
                  },
                }}
              >
                <CheckoutForm />
              </Elements>
            ) : (
              <div className="text-center text-red-400 py-12">
                <p>Failed to load checkout. Please refresh the page.</p>
              </div>
            )}

            {/* Testimonial Snippet */}
            <div className="mt-6 md:mt-8 pt-5 md:pt-6 border-t border-gray-700">
              <div className="flex items-center gap-2.5 md:gap-3">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full"></div>
                <div>
                  <div className="flex gap-0.5 md:gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs md:text-sm text-gray-300 italic">"Got 8 leads in my first 3 days!"</p>
                  <p className="text-xs text-gray-500">- Sarah M., Real Estate Agent</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Bar */}
        <div className="mt-8 md:mt-12 text-center px-4">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-6 px-5 md:px-8 py-3 md:py-4 bg-gray-800/50 border border-gray-700 rounded-2xl sm:rounded-full">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
              <span className="text-xs md:text-sm text-gray-300 font-semibold">500+ Happy Customers</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-gray-700"></div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
              <span className="text-xs md:text-sm text-gray-300 font-semibold">100% Secure Payment</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-gray-700"></div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
              <span className="text-xs md:text-sm text-gray-300 font-semibold">256-bit Encryption</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
