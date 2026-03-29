import { useContext } from 'react'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext'
import Button from '../components/Button'
import Hero from '../components/Hero'
import FeatureCard from '../components/FeatureCard'
import { Mic, BookOpen, Brain, Shield, Heart, Zap } from 'lucide-react'

export default function Landing() {
  const { setCurrentPage } = useContext(AppContext)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  const features = [
    {
      icon: Mic,
      title: 'Voice Recognition',
      description: 'Share your thoughts through voice - AI understands your emotions',
    },
    {
      icon: Brain,
      title: 'Emotion Detection',
      description: 'Real-time emotion recognition to provide targeted support',
    },
    {
      icon: BookOpen,
      title: 'Smart Journal',
      description: 'Document your feelings with AI-powered insights and patterns',
    },
    {
      icon: Heart,
      title: 'Wellness Tools',
      description: 'Breathing exercises, meditation guides, and coping strategies',
    },
    {
      icon: Zap,
      title: 'Insights Dashboard',
      description: 'Track your mental health journey with beautiful visualizations',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is encrypted and secure. Anonymity guaranteed.',
    },
  ]

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-950/50 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
          >
            Unsaid
          </motion.div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setCurrentPage('dashboard')}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
          >
            Begin Your Journey
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Mental Health Support{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Reimagined
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Unsaid AI combines cutting-edge AI technology with compassionate design to provide mental health support whenever you need it
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 p-12 backdrop-blur-sm">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            </div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative z-10"
            >
              <h3 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to be heard?
              </h3>
              <p className="text-lg text-slate-300 mb-8">
                Start your journey to better mental health. No judgment. No pressure. Just support.
              </p>
              <Button
                onClick={() => setCurrentPage('voice')}
                size="lg"
                className="mx-auto"
              >
                Get Started Now
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-slate-500 text-sm">
          <p>Unsaid AI - Mental Health Support Powered by AI. Built with care for your wellbeing.</p>
        </div>
      </footer>
    </div>
  )
}
