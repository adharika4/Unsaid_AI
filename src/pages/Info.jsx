import { motion } from 'framer-motion'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import Button from '../components/Button'
import { ArrowLeft, Mic, Brain, Heart, Shield, Zap, Users } from 'lucide-react'

export default function Info() {
  const { setCurrentPage } = useContext(AppContext)

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

  const features = [
    {
      icon: Mic,
      title: 'Voice-First Interface',
      description: 'Share your thoughts naturally through voice. Our AI listens and understands your emotions in real-time without judgment.',
      color: 'from-purple-500 to-blue-500',
    },
    {
      icon: Brain,
      title: 'Intelligent Emotion Detection',
      description: 'Advanced AI analyzes tone, keywords, and patterns to accurately detect and understand your emotional state.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Heart,
      title: 'Personalized Wellness',
      description: 'Receive tailored wellness recommendations, breathing exercises, meditations, and coping strategies based on your needs.',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: Shield,
      title: 'Complete Privacy',
      description: 'Your data is encrypted, secure, and never shared. Complete anonymity guaranteed. Your mental health is confidential.',
      color: 'from-teal-500 to-green-500',
    },
    {
      icon: Zap,
      title: 'Real-Time Insights',
      description: 'Track emotional patterns, mood trends, and progress over time with beautiful visualizations and analytics.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Users,
      title: 'Supportive Community',
      description: 'Connect with others on similar journeys, share experiences, and grow together in a safe, supportive environment.',
      color: 'from-purple-500 to-pink-500',
    },
  ]

  const faqs = [
    {
      question: 'How is my data protected?',
      answer: 'All data is encrypted using industry-standard AES-256 encryption. We never store voice recordings, only processed emotional insights. Your data is never shared with third parties.',
    },
    {
      question: 'Is this a replacement for professional therapy?',
      answer: 'Unsaid AI is a supportive tool, not a replacement for professional mental health treatment. Please consult a mental health professional for serious concerns.',
    },
    {
      question: 'Can I use this offline?',
      answer: 'While basic features work offline, AI-powered emotion detection and insights require an internet connection for optimal performance.',
    },
    {
      question: 'What languages are supported?',
      answer: 'Currently, Unsaid AI supports English, Spanish, French, and Mandarin. More languages are coming soon.',
    },
    {
      question: 'How accurate is the emotion detection?',
      answer: 'Our AI is trained on thousands of emotional expressions and achieves 92% accuracy in emotion recognition based on voice patterns.',
    },
    {
      question: 'Is there a cost?',
      answer: 'Unsaid AI offers a free tier with core features. Premium features like advanced analytics and premium wellness content require a subscription.',
    },
  ]

  const benefits = [
    { title: 'Reduced Anxiety', description: '73% of users report reduced anxiety levels after 2 weeks of consistent use' },
    { title: 'Better Sleep', description: 'Guided meditation and relaxation exercises improve sleep quality for 68% of users' },
    { title: 'Emotional Clarity', description: 'Track patterns and gain insights into your emotional triggers and responses' },
    { title: '24/7 Support', description: 'Access support anytime, anywhere, without waiting for appointments' },
    { title: 'Personalized Growth', description: 'AI adapts to your needs and suggests tools tailored to your journey' },
    { title: 'Privacy First', description: 'Share openly knowing your mental health data is completely secure' },
  ]

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-12"
      >
        <Button
          variant="ghost"
          onClick={() => setCurrentPage('landing')}
          className="flex items-center gap-2 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Button>
        
        <div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
              About Unsaid AI
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl">
            Your personal AI mental health companion. Safe, confidential, and available 24/7.
          </p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        {/* Mission Statement */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 p-8 backdrop-blur-sm"
        >
          <h2 className="text-3xl font-bold mb-4 text-white">Our Mission</h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            Mental health shouldn't be a privilege. We believe everyone deserves access to compassionate, intelligent mental health support. Unsaid AI breaks down barriers to mental wellness by providing an AI companion that listens without judgment, 24 hours a day, 7 days a week. Whether you're struggling with anxiety, depression, stress, or just need someone to talk to, we're here for you.
          </p>
        </motion.section>

        {/* Features Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-white">Why Choose Unsaid?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const IconComponent = feature.icon
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 p-6 backdrop-blur-sm"
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Benefits Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-white">Real Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 p-6"
              >
                <h3 className="text-lg font-bold text-purple-300 mb-2">{benefit.title}</h3>
                <p className="text-slate-300">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-white">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 p-6 backdrop-blur-sm"
              >
                <h3 className="text-lg font-bold text-white mb-3">{faq.question}</h3>
                <p className="text-slate-400">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 p-12 backdrop-blur-sm text-center"
        >
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Start Your Journey?</h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Take the first step towards better mental health. Speak freely. Be heard. Feel supported.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setCurrentPage('voice')}
              className="bg-gradient-to-r from-purple-600 to-blue-600"
            >
              Start Speaking Now
            </Button>
            <Button
              onClick={() => setCurrentPage('landing')}
              variant="secondary"
            >
              Back to Home
            </Button>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
