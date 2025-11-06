'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Phone, MapPin, X, Navigation } from 'lucide-react'

interface Hospital {
  name: string
  phone: string
  distance: number
  address: string
  coordinates: { lat: number; lng: number }
}

export default function EmergencyAlert() {
  const [isActive, setIsActive] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [isCalling, setIsCalling] = useState(false)
  const [isSharingLocation, setIsSharingLocation] = useState(false)

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return null
    }

    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error('Error getting location:', error)
          alert('Unable to get your location. Please enable location services.')
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      )
    })
  }

  const findNearestHospitals = async (userLat: number, userLng: number) => {
    // Simulate finding nearest hospitals
    // In production, use Google Places API or similar service
    const mockHospitals: Hospital[] = [
      {
        name: 'City General Hospital',
        phone: '+91-80-1234-5678',
        distance: 2.5,
        address: '123 Medical Street, City',
        coordinates: { lat: userLat + 0.01, lng: userLng + 0.01 },
      },
      {
        name: 'Emergency Care Center',
        phone: '+91-80-2345-6789',
        distance: 5.2,
        address: '456 Health Avenue, City',
        coordinates: { lat: userLat - 0.015, lng: userLng + 0.02 },
      },
      {
        name: 'Regional Medical Hospital',
        phone: '+91-80-3456-7890',
        distance: 8.7,
        address: '789 Hospital Road, City',
        coordinates: { lat: userLat + 0.02, lng: userLng - 0.01 },
      },
    ]

    // Sort by distance
    mockHospitals.sort((a, b) => a.distance - b.distance)
    return mockHospitals
  }

  const handleEmergency = async () => {
    setIsActive(true)
    setIsSharingLocation(true)

    try {
      // Get user location
      const userLocation = await getCurrentLocation()
      if (userLocation) {
        setLocation(userLocation)

        // Find nearest hospitals
        const nearestHospitals = await findNearestHospitals(
          userLocation.lat,
          userLocation.lng
        )
        setHospitals(nearestHospitals)

        // Share location with nearest hospital (simulated)
        if (nearestHospitals.length > 0) {
          const nearestHospital = nearestHospitals[0]
          console.log('Sharing location with:', nearestHospital.name)
          console.log('Location:', userLocation)
          
          // In production, send this to your backend API
          // await fetch('/api/emergency/share-location', {
          //   method: 'POST',
          //   body: JSON.stringify({
          //     hospital: nearestHospital,
          //     userLocation: userLocation,
          //   }),
          // })
        }
      }
    } catch (error) {
      console.error('Error in emergency handler:', error)
    } finally {
      setIsSharingLocation(false)
    }
  }

  const callHospital = (phone: string) => {
    setIsCalling(true)
    // Open phone dialer
    window.location.href = `tel:${phone}`
    
    // Also call 108 emergency number
    setTimeout(() => {
      window.location.href = 'tel:108'
    }, 1000)
    
    setTimeout(() => {
      setIsCalling(false)
    }, 2000)
  }

  const call108 = () => {
    setIsCalling(true)
    window.location.href = 'tel:108'
    setTimeout(() => {
      setIsCalling(false)
    }, 2000)
  }

  return (
    <>
      {/* Emergency Button - Mobile optimized */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleEmergency}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-red-600 hover:bg-red-700 text-white p-4 sm:p-6 rounded-full shadow-2xl flex items-center justify-center group"
        style={{
          boxShadow: '0 10px 40px rgba(220, 38, 38, 0.5)',
        }}
        aria-label="Emergency Alert"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-red-600 rounded-full opacity-50"
        />
        <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 relative z-10" />
      </motion.button>

      {/* Emergency Modal */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
            onClick={() => setIsActive(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-3 rounded-full">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Emergency Alert</h2>
                </div>
                <button
                  onClick={() => setIsActive(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isSharingLocation ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-700 font-semibold">Getting your location...</p>
                  <p className="text-sm text-gray-500 mt-2">Sharing with nearest hospital</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {location && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-blue-900">Location Shared</span>
                      </div>
                      <p className="text-sm text-blue-800">
                        Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
                      </p>
                    </div>
                  )}

                  {/* Call 108 Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={call108}
                    disabled={isCalling}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg disabled:opacity-50"
                  >
                    <Phone className="w-6 h-6" />
                    {isCalling ? 'Calling...' : 'Call 108 Emergency'}
                  </motion.button>

                  {/* Nearest Hospitals */}
                  {hospitals.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Navigation className="w-5 h-5 text-primary" />
                        Nearest Hospitals
                      </h3>
                      <div className="space-y-3">
                        {hospitals.slice(0, 3).map((hospital, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {hospital.name}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {hospital.address}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {hospital.distance.toFixed(1)} km away
                                </p>
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => callHospital(hospital.phone)}
                              disabled={isCalling}
                              className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                            >
                              <Phone className="w-4 h-4" />
                              Call {hospital.phone}
                            </motion.button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mt-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> In a real emergency, always call 108 or your local
                      emergency number immediately.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

