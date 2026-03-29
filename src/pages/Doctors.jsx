import { useState, useContext } from 'react'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext'
import Button from '../components/Button'
import { Phone, MapPin, Star, Clock, Video, MessageCircle, ArrowLeft, AlertCircle } from 'lucide-react'

export default function Doctors() {
  const { setCurrentPage } = useContext(AppContext)
  
  const [doctors] = useState([
    {
      id: 1,
      name: 'Dr. Aisha Patel',
      specialty: 'Clinical Psychologist',
      experience: '15 years',
      rating: 4.9,
      reviews: 287,
      about: 'Specializes in anxiety and depression treatment. Provides evidence-based cognitive behavioral therapy.',
      availability: 'Available Today',
      consultationFee: '$60 per session',
      photo: '👩‍⚕️',
      modes: ['Video Call', 'Phone', 'Chat'],
      nextSlot: '3:00 PM'
    },
    {
      id: 2,
      name: 'Dr. James Mitchell',
      specialty: 'Psychiatrist',
      experience: '20 years',
      rating: 4.8,
      reviews: 342,
      about: 'Expertise in medication management and crisis intervention. Compassionate and patient-centered approach.',
      availability: 'Available in 2 hours',
      consultationFee: '$80 per session',
      photo: '👨‍⚕️',
      modes: ['Video Call', 'Phone'],
      nextSlot: '5:30 PM'
    },
    {
      id: 3,
      name: 'Dr. Maria Rodriguez',
      specialty: 'Therapist (LCSW)',
      experience: '12 years',
      rating: 4.7,
      reviews: 198,
      about: 'Specializes in stress management, life transitions, and relationship counseling. Warm, supportive approach.',
      availability: 'Available Tomorrow',
      consultationFee: '$55 per session',
      photo: '👩‍⚕️',
      modes: ['Video Call', 'Chat'],
      nextSlot: 'Tomorrow 10:00 AM'
    },
    {
      id: 4,
      name: 'Dr. Rajesh Kumar',
      specialty: 'Clinical Counselor',
      experience: '10 years',
      rating: 4.6,
      reviews: 165,
      about: 'Helps with panic attacks, PTSD recovery, and emotional resilience building. Practical, goal-oriented therapy.',
      availability: 'Available Tomorrow',
      consultationFee: '$50 per session',
      photo: '👨‍⚕️',
      modes: ['Video Call', 'Phone', 'Chat'],
      nextSlot: 'Tomorrow 2:00 PM'
    },
    {
      id: 5,
      name: 'Dr. Sophie Laurent',
      specialty: 'Psychiatrist & Coach',
      experience: '18 years',
      rating: 4.9,
      reviews: 412,
      about: 'Combines psychiatric expertise with life coaching for holistic wellness. Focus on prevention and wellness.',
      availability: 'Available in 4 hours',
      consultationFee: '$75 per session',
      photo: '👩‍⚕️',
      modes: ['Video Call', 'Phone'],
      nextSlot: 'Today 7:00 PM'
    },
    {
      id: 6,
      name: 'Dr. David Chen',
      specialty: 'Psychologist & Researcher',
      experience: '16 years',
      rating: 4.8,
      reviews: 203,
      about: 'Specializes in trauma-informed therapy and depression recovery. Innovative treatment approaches.',
      availability: 'Available Today',
      consultationFee: '$70 per session',
      photo: '👨‍⚕️',
      modes: ['Video Call', 'Phone'],
      nextSlot: '6:15 PM'
    }
  ])

  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedMode, setSelectedMode] = useState(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto mb-12"
      >
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => setCurrentPage('dashboard')}
            variant="ghost"
            className="p-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                Professional Help & Support
              </span>
            </h1>
            <p className="text-slate-400 mt-2">Connect with licensed therapists and psychiatrists when you need professional guidance</p>
          </div>
        </div>

        {/* Alert Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/50 p-4 flex gap-4 items-start"
        >
          <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-300 font-semibold">In Crisis?</p>
            <p className="text-red-200 text-sm mt-1">If you're having thoughts of self-harm, please contact emergency services (911 in US) or the National Suicide Prevention Lifeline: 988</p>
          </div>
        </motion.div>
      </motion.div>

      <div className="max-w-6xl mx-auto">
        {!selectedDoctor ? (
          <>
            {/* Filter/Info Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 p-6 backdrop-blur-sm mb-12"
            >
              <h2 className="text-xl font-bold text-white mb-4">Why Talk to a Professional?</h2>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span className="text-slate-300 text-sm">Personalized treatment plans based on your needs</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span className="text-slate-300 text-sm">Medication management when needed</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span className="text-slate-300 text-sm">Evidence-based therapy techniques</span>
                </li>
              </ul>
            </motion.div>

            {/* Doctors Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {doctors.map((doctor) => (
                <motion.div
                  key={doctor.id}
                  variants={itemVariants}
                  onClick={() => setSelectedDoctor(doctor)}
                  className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 p-6 backdrop-blur-sm hover:border-purple-400/60 transition-all duration-300 cursor-pointer hover:scale-105 transform"
                >
                  <div className="text-5xl mb-4">{doctor.photo}</div>
                  
                  <h3 className="text-lg font-bold text-white mb-1">{doctor.name}</h3>
                  <p className="text-purple-300 text-sm font-semibold mb-4">{doctor.specialty}</p>

                  <div className="space-y-3 mb-6 pb-6 border-b border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm text-slate-300">{doctor.rating} ({doctor.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{doctor.experience} experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full">
                        {doctor.availability}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm mb-4 line-clamp-2">{doctor.about}</p>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedDoctor(doctor)
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm"
                  >
                    View Details & Book
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </>
        ) : (
          /* Doctor Detail View */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 p-8 backdrop-blur-sm"
          >
            <Button
              onClick={() => {
                setSelectedDoctor(null)
                setSelectedMode(null)
              }}
              variant="ghost"
              className="mb-6 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Doctor Info */}
              <div>
                <div className="text-7xl mb-6">{selectedDoctor.photo}</div>
                <h2 className="text-3xl font-bold text-white mb-2">{selectedDoctor.name}</h2>
                <p className="text-purple-400 text-lg font-semibold mb-6">{selectedDoctor.specialty}</p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-slate-300">{selectedDoctor.rating} rating ({selectedDoctor.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span className="text-slate-300">{selectedDoctor.experience} experience</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400 font-bold text-lg">₹</span>
                    <span className="text-slate-300">{selectedDoctor.consultationFee}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">About</h3>
                <p className="text-slate-300 leading-relaxed mb-8">{selectedDoctor.about}</p>

                <div>
                  <h3 className="text-lg font-bold text-white mb-3">Available Consultation Modes</h3>
                  <div className="space-y-2">
                    {selectedDoctor.modes.map((mode) => (
                      <div key={mode} className="flex items-center gap-2 text-slate-300">
                        {mode === 'Video Call' && <Video className="w-4 h-4 text-blue-400" />}
                        {mode === 'Phone' && <Phone className="w-4 h-4 text-green-400" />}
                        {mode === 'Chat' && <MessageCircle className="w-4 h-4 text-purple-400" />}
                        <span>{mode}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Booking Section */}
              <div>
                <div className="rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/50 p-6 mb-6">
                  <h3 className="text-xl font-bold text-white mb-4">Book a Session</h3>
                  
                  <div className="mb-6">
                    <p className="text-slate-400 text-sm mb-3">Next Available:</p>
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                      <p className="text-white font-semibold">{selectedDoctor.nextSlot}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-slate-300 text-sm font-semibold mb-3">Choose consultation mode:</p>
                    <div className="space-y-2">
                      {selectedDoctor.modes.map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setSelectedMode(mode)}
                          className={`w-full p-3 rounded-lg font-semibold transition-all text-sm ${
                            selectedMode === mode
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                              : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-purple-500'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3">
                    Confirm Booking
                  </Button>

                  <p className="text-xs text-slate-500 text-center mt-4">
                    Secure payment required. You'll receive confirmation details via email.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-800/50 border border-slate-700 p-6">
                  <h4 className="font-bold text-white mb-3">What to Expect:</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• Session duration: 50-60 minutes</li>
                    <li>• Confidential & private consultation</li>
                    <li>• Customized treatment plan</li>
                    <li>• Follow-up support available</li>
                    <li>• Can prescribe medications if needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
