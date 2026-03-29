import { motion } from 'framer-motion'

export default function StatCard({ label, value, trend, icon: Icon }) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(147, 51, 234, 0.2)' }}
      className="rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 p-6 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-slate-400 text-sm mb-1">{label}</p>
          <motion.h3
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold text-white"
          >
            {value}
          </motion.h3>
        </div>
        <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 group-hover:from-purple-500/40 group-hover:to-blue-500/40 transition-all">
          <Icon className="w-5 h-5 text-purple-400" />
        </div>
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xs text-green-400 font-semibold"
      >
        {trend}
      </motion.p>
    </motion.div>
  )
}
