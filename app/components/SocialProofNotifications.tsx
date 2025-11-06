'use client'

import { useState, useEffect } from 'react'
import { Eye, ShoppingCart, MapPin } from 'lucide-react'

interface Notification {
  id: number
  type: 'viewing' | 'purchase' | 'location'
  message: string
  icon: React.ReactNode
}

interface LocationData {
  country: string
  city: string
  countryCode: string
}

// Country-specific data for social proof
const countryData: Record<
  string,
  { cities: string[]; names: string[]; flag: string }
> = {
  // UAE
  AE: {
    cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah'],
    names: ['Ahmed', 'Mohammed', 'Fatima', 'Sara', 'Ali', 'Noura', 'Omar'],
    flag: '🇦🇪',
  },
  // USA
  US: {
    cities: [
      'New York',
      'Los Angeles',
      'Miami',
      'Chicago',
      'Houston',
      'Dallas',
      'San Francisco',
    ],
    names: ['John', 'Michael', 'Sarah', 'Jennifer', 'David', 'Emily', 'James'],
    flag: '🇺🇸',
  },
  // Morocco
  MA: {
    cities: ['Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Tangier', 'Agadir'],
    names: ['Amine', 'Youssef', 'Fatima', 'Aicha', 'Hassan', 'Salma', 'Mehdi'],
    flag: '🇲🇦',
  },
  // France
  FR: {
    cities: [
      'Paris',
      'Montpellier',
      'Lyon',
      'Marseille',
      'Toulouse',
      'Nice',
      'Bordeaux',
    ],
    names: [
      'Pierre',
      'Jean',
      'Marie',
      'Sophie',
      'Antoine',
      'Camille',
      'Lucas',
    ],
    flag: '🇫🇷',
  },
  // Saudi Arabia
  SA: {
    cities: ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar'],
    names: [
      'Abdullah',
      'Mohammed',
      'Fatima',
      'Nora',
      'Sultan',
      'Layan',
      'Khalid',
    ],
    flag: '🇸🇦',
  },
  // UK
  GB: {
    cities: [
      'London',
      'Manchester',
      'Birmingham',
      'Liverpool',
      'Edinburgh',
      'Bristol',
    ],
    names: [
      'James',
      'Oliver',
      'Emma',
      'Sophie',
      'Harry',
      'Isabella',
      'George',
    ],
    flag: '🇬🇧',
  },
  // Canada
  CA: {
    cities: [
      'Toronto',
      'Vancouver',
      'Montreal',
      'Calgary',
      'Ottawa',
      'Edmonton',
    ],
    names: ['Liam', 'Emma', 'Noah', 'Olivia', 'William', 'Ava', 'James'],
    flag: '🇨🇦',
  },
  // India
  IN: {
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune'],
    names: ['Rahul', 'Priya', 'Amit', 'Neha', 'Rohan', 'Anjali', 'Vikram'],
    flag: '🇮🇳',
  },
  // Australia
  AU: {
    cities: [
      'Sydney',
      'Melbourne',
      'Brisbane',
      'Perth',
      'Adelaide',
      'Gold Coast',
    ],
    names: ['Jack', 'Emily', 'Oliver', 'Charlotte', 'William', 'Mia', 'Noah'],
    flag: '🇦🇺',
  },
  // Germany
  DE: {
    cities: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart'],
    names: [
      'Lukas',
      'Emma',
      'Leon',
      'Mia',
      'Maximilian',
      'Hannah',
      'Felix',
    ],
    flag: '🇩🇪',
  },
  // Turkey
  TR: {
    cities: ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana'],
    names: ['Ahmet', 'Mehmet', 'Ayşe', 'Fatma', 'Mustafa', 'Zeynep', 'Ali'],
    flag: '🇹🇷',
  },
  // Spain
  ES: {
    cities: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Malaga', 'Bilbao'],
    names: ['Carlos', 'Maria', 'Antonio', 'Carmen', 'Jose', 'Ana', 'Manuel'],
    flag: '🇪🇸',
  },
  // Italy
  IT: {
    cities: ['Rome', 'Milan', 'Naples', 'Turin', 'Florence', 'Venice'],
    names: ['Marco', 'Giulia', 'Alessandro', 'Francesca', 'Matteo', 'Sofia', 'Lorenzo'],
    flag: '🇮🇹',
  },
}

export default function SocialProofNotifications() {
  const [currentNotification, setCurrentNotification] =
    useState<Notification | null>(null)
  const [viewerCount, setViewerCount] = useState(0)
  const [userLocation, setUserLocation] = useState<LocationData | null>(null)
  const [notifications, setNotifications] = useState<
    Omit<Notification, 'id'>[]
  >([])

  // Fetch user location via IP - OPTIMIZED with localStorage cache
  useEffect(() => {
    // Check localStorage cache first (cache for 24 hours)
    const cachedLocation = localStorage.getItem('userLocation')
    const cacheTimestamp = localStorage.getItem('userLocationTimestamp')
    const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

    if (cachedLocation && cacheTimestamp) {
      const age = Date.now() - parseInt(cacheTimestamp)
      if (age < CACHE_DURATION) {
        // Use cached location immediately - NO API CALL!
        setUserLocation(JSON.parse(cachedLocation))
        return
      }
    }

    // Default to US immediately (non-blocking)
    const defaultLocation = {
      country: 'United States',
      city: 'New York',
      countryCode: 'US',
    }
    setUserLocation(defaultLocation)

    // Fetch real location in background (non-blocking)
    const fetchLocation = async () => {
      try {
        // Using ipapi.co free API (no API key needed, 30k req/month)
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()

        const location = {
          country: data.country_name || 'Unknown',
          city: data.city || 'Unknown',
          countryCode: data.country_code || 'US',
        }

        // Cache in localStorage
        localStorage.setItem('userLocation', JSON.stringify(location))
        localStorage.setItem('userLocationTimestamp', Date.now().toString())

        setUserLocation(location)
      } catch (error) {
        console.log('Location detection failed, using default (US)')
        // Already set to default above
      }
    }

    // Delay API call to not block initial render
    setTimeout(fetchLocation, 2000)
  }, [])

  // Generate notifications based on user location
  useEffect(() => {
    if (!userLocation) return

    const getRandomItem = <T,>(arr: T[]): T =>
      arr[Math.floor(Math.random() * arr.length)]
    const getRandomTime = () => Math.floor(Math.random() * 15) + 2 // 2-16 min

    const generateNotifications = () => {
      const countryCode = userLocation.countryCode
      const userCountryData = countryData[countryCode] || countryData['US']
      const usaData = countryData['US']

      const newNotifications: Omit<Notification, 'id'>[] = []

      // Always start with viewer count
      newNotifications.push({
        type: 'viewing',
        message: `${viewerCount} people viewing this page right now`,
        icon: <Eye className="h-4 w-4" />,
      })

      // 1-2 purchases from USER'S country (if not US)
      const userPurchaseCount = countryCode === 'US' ? 0 : 2
      for (let i = 0; i < userPurchaseCount; i++) {
        const city = getRandomItem(userCountryData.cities)
        const name = getRandomItem(userCountryData.names)
        const time = getRandomTime()
        newNotifications.push({
          type: 'purchase',
          message: `${name} from ${city} ${userCountryData.flag} just purchased (${time} min ago)`,
          icon: <ShoppingCart className="h-4 w-4" />,
        })
      }

      // ALWAYS add 1-2 USA purchases (people trust US buyers)
      for (let i = 0; i < 2; i++) {
        const city = getRandomItem(usaData.cities)
        const name = getRandomItem(usaData.names)
        const time = getRandomTime()
        newNotifications.push({
          type: 'purchase',
          message: `${name} from ${city} ${usaData.flag} just purchased (${time} min ago)`,
          icon: <ShoppingCart className="h-4 w-4" />,
        })
      }

      // Add 1 purchase from FAMOUS countries (Dubai, UK, Germany, Turkey, etc.)
      const famousCountries = ['AE', 'GB', 'DE', 'FR', 'CA', 'AU', 'TR', 'ES', 'IT']
        .filter(code => code !== countryCode) // Don't repeat user's country
      const randomFamousCountry = getRandomItem(famousCountries)
      const famousCountryData = countryData[randomFamousCountry]

      const city = getRandomItem(famousCountryData.cities)
      const name = getRandomItem(famousCountryData.names)
      const time = getRandomTime()
      newNotifications.push({
        type: 'purchase',
        message: `${name} from ${city} ${famousCountryData.flag} just purchased (${time} min ago)`,
        icon: <ShoppingCart className="h-4 w-4" />,
      })

      // Add location viewing notifications
      newNotifications.push({
        type: 'location',
        message: `Someone from ${getRandomItem(userCountryData.cities)} is viewing this page`,
        icon: <MapPin className="h-4 w-4" />,
      })

      newNotifications.push({
        type: 'location',
        message: `Someone from ${getRandomItem(usaData.cities)} is viewing this page`,
        icon: <MapPin className="h-4 w-4" />,
      })

      // Shuffle for variety
      return newNotifications.sort(() => Math.random() - 0.5)
    }

    setNotifications(generateNotifications())
  }, [userLocation, viewerCount])

  // Viewer count that fluctuates realistically
  useEffect(() => {
    // Initial count between 15-35
    const initialCount = Math.floor(Math.random() * 20) + 15
    setViewerCount(initialCount)

    // Update viewer count every 10-20 seconds with small changes
    const interval = setInterval(() => {
      setViewerCount((prev) => {
        const change = Math.floor(Math.random() * 7) - 3 // -3 to +3
        const newCount = prev + change
        // Keep between 10-40
        return Math.max(10, Math.min(40, newCount))
      })
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  // Cycle through notifications
  useEffect(() => {
    if (notifications.length === 0) return

    let currentIndex = 0

    // Show first notification after 3 seconds
    const initialTimeout = setTimeout(() => {
      setCurrentNotification({ ...notifications[0], id: Date.now() })
      currentIndex = 1
    }, 3000)

    // Show subsequent notifications every 12 seconds
    const interval = setInterval(() => {
      setCurrentNotification({ ...notifications[currentIndex], id: Date.now() })
      currentIndex = (currentIndex + 1) % notifications.length
    }, 12000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [notifications])

  if (!currentNotification) return null

  return (
    <div className="pointer-events-none fixed bottom-6 left-6 z-50 max-w-sm">
      <div
        key={currentNotification.id}
        className="pointer-events-auto animate-in slide-in-from-left-5 fade-in duration-500"
      >
        <div className="flex items-center gap-3 rounded-2xl border-2 border-amber-400/50 bg-white p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl">
          {/* Icon */}
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg">
            {currentNotification.icon}
          </div>

          {/* Message */}
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">
              {currentNotification.message}
            </p>
          </div>

          {/* Pulse indicator */}
          {currentNotification.type === 'viewing' && (
            <div className="relative flex h-3 w-3 flex-shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
