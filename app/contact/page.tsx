'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    // For now, open mailto link. You can replace with API call later.
    const mailtoLink = `mailto:support@aifastscale.com?subject=${encodeURIComponent(
      `[${formData.subject}] Contact from ${formData.name}`
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`

    window.location.href = mailtoLink
    setStatus('success')

    // Reset form after delay
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: 'general', message: '' })
      setStatus('idle')
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-20">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 font-bold text-amber-600 transition-colors hover:text-amber-700"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Home
        </Link>

        <div className="rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-2xl md:p-12">
          <h1 className="mb-4 text-4xl font-black text-gray-900 md:text-5xl">Contact Us</h1>
          <p className="mb-8 text-gray-600 text-lg">
            Have questions? We&apos;re here to help.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-200">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Email Support</h3>
                  <a href="mailto:support@aifastscale.com" className="text-amber-600 hover:text-amber-700 font-medium">
                    support@aifastscale.com
                  </a>
                  <p className="text-gray-600 text-sm mt-1">Response time: Within 24 hours (Mon-Fri)</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Phone Support</h3>
                  <a href="tel:+13073355058" className="text-blue-600 hover:text-blue-700 font-medium">
                    +1 (307) 335-5058
                  </a>
                  <p className="text-gray-600 text-sm mt-1">Monday-Friday, 9am-5pm MST</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-200">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Mailing Address</h3>
                  <p className="text-gray-700">
                    Velon LLC<br />
                    30 N Gould St Ste R<br />
                    Sheridan, WY 82801
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Support Hours</h3>
                  <p className="text-gray-700">Monday - Friday</p>
                  <p className="text-gray-600 text-sm">9:00 AM - 5:00 PM MST</p>
                  <p className="text-gray-500 text-xs mt-1">(Excluding US federal holidays)</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="refund">Refund Request</option>
                    <option value="billing">Billing Question</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <>Sending...</>
                  ) : status === 'success' ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Refund Request Info */}
          <div className="rounded-2xl border-2 border-amber-400 bg-gradient-to-r from-amber-50 to-yellow-50 p-6">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              For Refund Requests
            </h3>
            <p className="text-gray-700">
              Email <a href="mailto:support@aifastscale.com" className="text-amber-600 font-medium hover:text-amber-700">support@aifastscale.com</a> with
              subject line &quot;Refund Request&quot; and include your name and purchase email.
              Refunds are processed within 24-48 hours. See our{' '}
              <Link href="/refund-policy" className="text-amber-600 font-medium hover:text-amber-700 underline">
                Refund Policy
              </Link>{' '}
              for details.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
