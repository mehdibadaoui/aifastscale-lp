import { CheckCircle, Mail, Download, Video } from 'lucide-react'
import Link from 'next/link'
import { GOOGLE_DRIVE, SITE_CONFIG } from '../config/constants'

export default function ThankYouConfirmed() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      {/* Success Container */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="mx-auto max-w-3xl">
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-gradient-to-r from-amber-400 to-amber-600 opacity-75"></div>
              <CheckCircle className="relative h-20 w-20 text-amber-400 md:h-24 md:w-24" />
            </div>
          </div>

          {/* Thank You Message */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-4xl font-black text-transparent md:mb-6 md:text-6xl">
              Payment Successful!
            </h1>
            <p className="text-xl font-bold text-gray-300 md:text-2xl">
              Welcome to AI FastScale 🎉
            </p>
          </div>

          {/* Lifetime Access Notice */}
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-6 shadow-2xl backdrop-blur-sm md:p-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-3xl animate-pulse">✨</span>
              <h2 className="text-2xl font-black text-white md:text-3xl">
                LIFETIME ACCESS
              </h2>
              <span className="text-3xl animate-pulse">✨</span>
            </div>
            <p className="text-center text-lg font-semibold text-gray-300">
              You now have lifetime access to all course materials + free monthly updates forever!
            </p>
          </div>

          {/* Download Button */}
          <div className="mb-8 text-center">
            <a
              href={GOOGLE_DRIVE.courseMaterialsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-block"
            >
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-green-400 via-green-500 to-green-600 opacity-75 blur-lg transition duration-300 group-hover:opacity-100"></div>
              <div className="relative flex items-center gap-3 rounded-2xl bg-gradient-to-r from-green-400 via-green-500 to-green-600 px-8 py-5 text-xl font-black uppercase tracking-wider text-black shadow-2xl transition-all duration-300 group-hover:scale-105 md:px-12 md:py-6 md:text-2xl">
                <Download className="h-6 w-6 md:h-8 md:w-8" />
                <span>Download Course Materials</span>
              </div>
            </a>
            <p className="mt-4 text-sm font-semibold text-gray-400">
              Access your complete AI video course now
            </p>
          </div>

          {/* Next Steps */}
          <div className="mb-8 rounded-2xl bg-gray-800/50 p-6 backdrop-blur-sm md:p-8">
            <h3 className="mb-6 text-center text-2xl font-black text-white md:text-3xl">
              What's Next?
            </h3>
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-lg font-black text-black">
                  1
                </div>
                <div>
                  <h4 className="mb-2 text-xl font-bold text-white">
                    <Download className="mb-1 mr-2 inline h-5 w-5" />
                    Download Your Course
                  </h4>
                  <p className="text-gray-300">
                    Click the button above to access all course materials, templates, and resources from Google Drive.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-lg font-black text-black">
                  2
                </div>
                <div>
                  <h4 className="mb-2 text-xl font-bold text-white">
                    <Video className="mb-1 mr-2 inline h-5 w-5" />
                    Create Your First AI Video
                  </h4>
                  <p className="text-gray-300">
                    Follow the step-by-step guide to create your first talking AI video in just 7 minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Money-Back Guarantee */}
          <div className="mb-8 rounded-2xl border-2 border-amber-500/30 bg-gradient-to-r from-amber-900/20 to-amber-800/20 p-6 text-center backdrop-blur-sm">
            <p className="text-lg font-bold text-gray-300">
              🛡️ <span className="text-amber-400">30-Day Money-Back Guarantee</span> 🛡️
            </p>
            <p className="mt-2 text-sm text-gray-400">
              If you're not satisfied, get a full refund within 30 days - no questions asked.
            </p>
          </div>

          {/* Support Section */}
          <div className="rounded-2xl bg-gray-800/50 p-6 text-center backdrop-blur-sm md:p-8">
            <h3 className="mb-4 text-xl font-bold text-white md:text-2xl">
              Need Help?
            </h3>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-amber-400">
                <Mail className="h-5 w-5" />
                <a
                  href={`mailto:${SITE_CONFIG.supportEmail}`}
                  className="text-lg font-semibold hover:underline"
                >
                  {SITE_CONFIG.supportEmail}
                </a>
              </div>
              <p className="text-sm text-gray-400">
                We typically respond within 24 hours
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-block text-lg font-semibold text-amber-400 transition-colors hover:text-amber-300"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
