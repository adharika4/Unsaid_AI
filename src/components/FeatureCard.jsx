import { motion } from 'framer-motion'

export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(147, 51, 234, 0.3)' }}
      className="group rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 p-6 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300"
    >
      <motion.div
        whileHover={{ rotate: 10, scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 400 }}
        className="inline-block p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 mb-4 group-hover:from-purple-500/40 group-hover:to-blue-500/40 transition-all duration-300"
      >
        <Icon className="w-6 h-6 text-purple-400 group-hover:text-blue-400 transition-colors" />
      </motion.div>

      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
        {title}
      </h3>
      <p className="text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">
        {description}
      </p>

      <motion.div
        initial={{ width: '0%' }}
        whileHover={{ width: '100%' }}
        className="h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mt-4"
      ></motion.div>
    </motion.div>
  )
}
