'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Stethoscope, MapPin, Phone, Clock, Search, Navigation } from 'lucide-react'

interface Clinic {
  id: string
  name: string
  specialty: string
  village: string
  distance: string
  phone: string
  hours: string
  lat?: number
  lng?: number
}

const mockClinics: Clinic[] = [
  {
    id: '1',
    name: 'City General Hospital',
    specialty: 'General Medicine, Emergency',
    village: 'City Center',
    distance: '2.5 km',
    phone: '+91-9876543210',
    hours: '24/7',
    lat: 12.9716,
    lng: 77.5946,
  },
  {
    id: '2',
    name: 'HealthCare Clinic',
    specialty: 'General Practice',
    village: 'Suburban Area',
    distance: '5.1 km',
    phone: '+91-9876543211',
    hours: '9 AM - 8 PM',
    lat: 12.9352,
    lng: 77.6245,
  },
  {
    id: '3',
    name: 'Community Medical Center',
    specialty: 'Pediatrics, General Medicine',
    village: 'Rural Area',
    distance: '8.3 km',
    phone: '+91-9876543212',
    hours: '8 AM - 6 PM',
    lat: 12.9000,
    lng: 77.6500,
  },
  {
    id: '4',
    name: 'Wellness Clinic',
    specialty: 'Cardiology, Internal Medicine',
    village: 'Near City',
    distance: '3.7 km',
    phone: '+91-9876543213',
    hours: '10 AM - 7 PM',
    lat: 12.9600,
    lng: 77.6000,
  },
]

export default function DoctorDirectory() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')

  const filteredClinics = mockClinics.filter((clinic) => {
    const matchesSearch =
      clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSpecialty =
      selectedSpecialty === 'all' ||
      clinic.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
    return matchesSearch && matchesSpecialty
  })

  const specialties = ['all', 'General Medicine', 'Cardiology', 'Pediatrics', 'Emergency']

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Stethoscope className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">Doctor Directory</h1>
          </div>
          <p className="text-gray-600">Find nearby clinics and healthcare providers</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by clinic name, location, or specialty..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <label htmlFor="specialty-select" className="sr-only">Filter by specialty</label>
            <select
              id="specialty-select"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              aria-label="Filter by specialty"
              className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {specialties.map((spec) => (
                <option key={spec} value={spec}>
                  {spec === 'all' ? 'All Specialties' : spec}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Clinics List */}
        <div className="space-y-4">
          {filteredClinics.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <Stethoscope className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">No clinics found matching your search</p>
            </div>
          ) : (
            filteredClinics.map((clinic, idx) => (
              <motion.div
                key={clinic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{clinic.name}</h3>
                    <p className="text-gray-600 mb-3">{clinic.specialty}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{clinic.village}</span>
                        <span className="text-primary font-medium">• {clinic.distance}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{clinic.hours}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{clinic.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={`tel:${clinic.phone.replace(/-/g, '')}`}
                      className="bg-primary text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <Phone className="w-5 h-5" />
                      Call
                    </motion.a>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (clinic.lat && clinic.lng) {
                          window.open(
                            `https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lng}`,
                            '_blank'
                          )
                        }
                      }}
                      className="bg-accent text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <Navigation className="w-5 h-5" />
                      Directions
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Teleconsultation Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Teleconsultation Available
          </h3>
          <p className="text-gray-700 mb-4">
            Many clinics offer video consultations. Contact them directly to schedule a
            teleconsultation appointment.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold"
            onClick={() => {
              // In a real app, this would open a video consultation interface
              alert('Teleconsultation feature - Link to video consultation platform')
            }}
          >
            Schedule Video Consultation
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

