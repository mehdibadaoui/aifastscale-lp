import Link from 'next/link'

interface ComplianceFooterProps {
  variant?: 'light' | 'dark'
  className?: string
}

export default function ComplianceFooter({ variant = 'dark', className = '' }: ComplianceFooterProps) {
  const isDark = variant === 'dark'

  return (
    <footer className={`${isDark ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'} ${className}`}>
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-16">
        {/* Contact Info */}
        <div className="text-center mb-8">
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Questions?{' '}
            <a
              href="mailto:support@aifastscale.com"
              className={`${isDark ? 'text-amber-400 hover:text-amber-300' : 'text-amber-600 hover:text-amber-700'}`}
            >
              support@aifastscale.com
            </a>
            {' | '}
            <a
              href="tel:+13073355058"
              className={`${isDark ? 'text-amber-400 hover:text-amber-300' : 'text-amber-600 hover:text-amber-700'}`}
            >
              +1 (307) 335-5058
            </a>
          </p>
          <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Support Hours: Mon-Fri, 9am-5pm MST
          </p>
        </div>

        {/* Company Info */}
        <div className="text-center mb-6">
          <p className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Velon LLC, a Wyoming Limited Liability Company
          </p>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            30 N Gould St Ste R, Sheridan, WY 82801
          </p>
          <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            © {new Date().getFullYear()} Velon LLC. All rights reserved.
          </p>
        </div>

        {/* Legal Links */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm mb-8">
          <Link
            href="/privacy-policy"
            className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
          >
            Privacy Policy
          </Link>
          <span className={`${isDark ? 'text-gray-600' : 'text-gray-400'}`}>•</span>
          <Link
            href="/terms-of-service"
            className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
          >
            Terms of Service
          </Link>
          <span className={`${isDark ? 'text-gray-600' : 'text-gray-400'}`}>•</span>
          <Link
            href="/refund-policy"
            className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
          >
            Refund Policy
          </Link>
          <span className={`${isDark ? 'text-gray-600' : 'text-gray-400'}`}>•</span>
          <Link
            href="/disclaimer"
            className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
          >
            Disclaimer
          </Link>
          <span className={`${isDark ? 'text-gray-600' : 'text-gray-400'} hidden sm:inline`}>•</span>
          <Link
            href="/contact"
            className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
          >
            Contact
          </Link>
          <span className={`${isDark ? 'text-gray-600' : 'text-gray-400'} hidden sm:inline`}>•</span>
          <Link
            href="/accessibility"
            className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
          >
            Accessibility
          </Link>
          <span className={`${isDark ? 'text-gray-600' : 'text-gray-400'} hidden sm:inline`}>•</span>
          <Link
            href="/do-not-sell"
            className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
          >
            Do Not Sell My Info
          </Link>
        </div>

        {/* Earnings Disclaimer */}
        <div className={`max-w-4xl mx-auto text-center mb-6 p-4 rounded-xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-200/50 border border-gray-300'}`}>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <strong className={isDark ? 'text-gray-300' : 'text-gray-700'}>EARNINGS DISCLAIMER:</strong>{' '}
            Results shown are not typical. Income and results vary based on effort, experience, and market
            conditions. We make no guarantees regarding income or results. See our{' '}
            <Link href="/disclaimer" className={`underline ${isDark ? 'text-amber-400 hover:text-amber-300' : 'text-amber-600 hover:text-amber-700'}`}>
              full disclaimer
            </Link>{' '}
            for details.
          </p>
        </div>

        {/* Professional Compliance Notice */}
        <div className={`max-w-4xl mx-auto text-center p-4 rounded-xl ${isDark ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-purple-50 border border-purple-200'}`}>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <strong className={isDark ? 'text-purple-300' : 'text-purple-700'}>PROFESSIONAL COMPLIANCE NOTICE:</strong>{' '}
            This product is for educational purposes only. Licensed professionals (attorneys, physicians, dentists,
            psychologists, etc.) must ensure compliance with their state licensing board regulations, professional
            association rules, HIPAA requirements (where applicable), and advertising guidelines. Velon LLC does
            not provide legal, medical, or compliance advice.
          </p>
        </div>
      </div>
    </footer>
  )
}
