'use client';

import { useState, useEffect } from 'react';
import { Shield, Lock, CreditCard, CheckCircle, Star, Loader } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ email }: { email: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Stripe Payment Element */}
      <div className="bg-gray-900 border-2 border-gray-700 rounded-xl p-4">
        <PaymentElement
          options={{
            layout: 'tabs',
            paymentMethodOrder: ['card'],
          }}
        />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4">
          <p className="text-red-400 text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="group relative w-full"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-green-400 to-green-500 rounded-2xl opacity-75 group-hover:opacity-100 blur-lg transition duration-300"></div>
        <div className="relative px-8 py-5 bg-gradient-to-r from-green-500 via-green-400 to-green-500 text-black rounded-2xl font-black text-xl uppercase tracking-wider transition-transform duration-300 active:scale-95 shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
          {isProcessing ? (
            <>
              <Loader className="w-6 h-6 animate-spin" />
              <span>Processing Payment...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-6 h-6" />
              <span>Complete Purchase $37</span>
            </>
          )}
        </div>
      </button>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <Lock className="w-4 h-4" />
        <span>Secured by Stripe • 256-bit SSL Encryption</span>
      </div>
    </form>
  );
}

export default function EmbeddedCheckout() {
  const [email, setEmail] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [isLoadingIntent, setIsLoadingIntent] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingIntent(true);

    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.error) {
        alert('Something went wrong. Please try again.');
        setIsLoadingIntent(false);
        return;
      }

      setClientSecret(data.clientSecret);
      setEmailSubmitted(true);
      setIsLoadingIntent(false);
    } catch (err) {
      alert('Something went wrong. Please try again.');
      setIsLoadingIntent(false);
    }
  };

  return (
    <section id="checkout" className="relative py-16 md:py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-full mb-4">
            <span className="text-green-400 font-bold text-sm uppercase tracking-wide">🔒 Secure Checkout</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Complete Your Order
          </h2>
          <p className="text-lg md:text-xl text-gray-300">
            Join 500+ agents already using AgentClone™ to generate leads
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left: Order Summary */}
          <div className="space-y-6">
            {/* Product Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-yellow-500/30 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center">
                  <Star className="w-10 h-10 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white mb-1">7-Minute AgentClone™ System</h3>
                  <p className="text-sm text-gray-400">Complete AI Video Course + System Prompts</p>
                </div>
              </div>

              {/* What's Included */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>7-minute step-by-step video training</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>AI system prompts & workflows</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>Real estate scripts & templates</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>Lifetime access + free updates</span>
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Regular Price</span>
                  <span className="text-gray-500 line-through">$97.00</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Today's Discount</span>
                  <span className="text-green-400 font-bold">-$60.00</span>
                </div>
                <div className="border-t border-gray-700 mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-white">Total</span>
                    <span className="text-3xl font-black text-yellow-400">$37.00</span>
                  </div>
                  <p className="text-xs text-gray-500 text-right mt-1">One-time payment • USD</p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-gray-300">SSL Secured</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-gray-300">256-bit Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-gray-300">30-Day Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-gray-300">Secure Payment</span>
                </div>
              </div>
            </div>

            {/* Money-back guarantee */}
            <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white mb-1">30-Day Money-Back Guarantee</h4>
                  <p className="text-sm text-gray-300">If you don't get 5-15 leads in your first week, we'll refund every penny. No questions asked.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Payment Form */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-green-500/50 rounded-2xl p-8 shadow-2xl">
            <div className="mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-bold text-sm uppercase tracking-wide">Secure Payment</span>
              </div>
              <p className="text-center text-gray-400 text-sm">
                Your payment information is encrypted and secure
              </p>
            </div>

            {!emailSubmitted ? (
              /* Email Form */
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-white mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-green-400 focus:outline-none transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">We'll send your course access to this email</p>
                </div>

                <button
                  type="submit"
                  disabled={isLoadingIntent || !email}
                  className="group relative w-full"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl opacity-75 group-hover:opacity-100 blur-lg transition duration-300"></div>
                  <div className="relative px-8 py-5 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-2xl font-black text-xl uppercase tracking-wider transition-transform duration-300 active:scale-95 shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoadingIntent ? (
                      <>
                        <Loader className="w-6 h-6 animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue to Payment</span>
                      </>
                    )}
                  </div>
                </button>
              </form>
            ) : (
              /* Stripe Payment Form */
              <div>
                <div className="mb-6 pb-4 border-b border-gray-700">
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white font-semibold">{email}</p>
                </div>

                {clientSecret && (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: 'night',
                        variables: {
                          colorPrimary: '#10b981',
                          colorBackground: '#111827',
                          colorText: '#ffffff',
                          colorDanger: '#ef4444',
                          fontFamily: 'system-ui, sans-serif',
                          borderRadius: '12px',
                        },
                      },
                    }}
                  >
                    <CheckoutForm email={email} />
                  </Elements>
                )}
              </div>
            )}

            {/* Testimonial Snippet */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full"></div>
                <div>
                  <div className="flex gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-300 italic">"Got 8 leads in my first 3 days!"</p>
                  <p className="text-xs text-gray-500">- Sarah M., Real Estate Agent</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Bar */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-6 px-8 py-4 bg-gray-800/50 border border-gray-700 rounded-full">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-300 font-semibold">500+ Happy Customers</span>
            </div>
            <div className="w-px h-6 bg-gray-700"></div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-300 font-semibold">100% Secure Payment</span>
            </div>
            <div className="w-px h-6 bg-gray-700"></div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-300 font-semibold">256-bit Encryption</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
