import { motion } from 'framer-motion'

export default function EmotionChart({ selectedRange }) {
  const emotionData = {
    week: [
      { day: 'Mon', calm: 6, happy: 5, anxious: 3, sad: 2 },
      { day: 'Tue', calm: 7, happy: 6, anxious: 2, sad: 1 },
      { day: 'Wed', calm: 5, happy: 4, anxious: 4, sad: 3 },
      { day: 'Thu', calm: 8, happy: 7, anxious: 1, sad: 1 },
      { day: 'Fri', calm: 8, happy: 8, anxious: 2, sad: 0 },
      { day: 'Sat', calm: 9, happy: 8, anxious: 1, sad: 1 },
      { day: 'Sun', calm: 7, happy: 7, anxious: 3, sad: 2 },
    ],
    month: [
      { day: 'W1', calm: 6, happy: 5, anxious: 3, sad: 2 },
      { day: 'W2', calm: 7, happy: 6, anxious: 2, sad: 1 },
      { day: 'W3', calm: 8, happy: 7, anxious: 1, sad: 1 },
      { day: 'W4', calm: 9, happy: 8, anxious: 2, sad: 0 },
    ],
    year: [
      { day: 'Jan', calm: 6, happy: 5, anxious: 3, sad: 2 },
      { day: 'Feb', calm: 7, happy: 6, anxious: 2, sad: 1 },
      { day: 'Mar', calm: 8, happy: 7, anxious: 1, sad: 1 },
    ],
  }

  const data = emotionData[selectedRange]
  const maxValue = 10
  const colors = {
    calm: 'from-teal-500 to-teal-600',
    happy: 'from-yellow-500 to-yellow-600',
    anxious: 'from-orange-500 to-orange-600',
    sad: 'from-blue-500 to-blue-600',
  }

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex gap-4 flex-wrap">
        {Object.entries(colors).map(([emotion, gradient]) => (
          <div key={emotion} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${gradient}`}></div>
            <span className="text-xs text-slate-400 capitalize">{emotion}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-64 flex items-end justify-around gap-2 bg-slate-700/20 rounded-lg p-4">
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ height: 0 }}
            animate={{ height: '100%' }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            className="flex-1 flex flex-col items-center justify-end gap-0.5 group"
          >
            {/* Bars */}
            <div className="w-full flex flex-col gap-0.5 flex-1 justify-end">
              {/* Calm */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item.calm / maxValue) * 100}%` }}
                transition={{ delay: index * 0.05 + 0.1, duration: 0.5 }}
                className="w-full bg-gradient-to-t from-teal-500 to-teal-600 rounded-t opacity-80 hover:opacity-100 transition-opacity"
              ></motion.div>
              {/* Happy */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item.happy / maxValue) * 100}%` }}
                transition={{ delay: index * 0.05 + 0.15, duration: 0.5 }}
                className="w-full bg-gradient-to-t from-yellow-500 to-yellow-600 rounded opacity-80 hover:opacity-100 transition-opacity"
              ></motion.div>
              {/* Anxious */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item.anxious / maxValue) * 100}%` }}
                transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                className="w-full bg-gradient-to-t from-orange-500 to-orange-600 rounded opacity-80 hover:opacity-100 transition-opacity"
              ></motion.div>
              {/* Sad */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item.sad / maxValue) * 100}%` }}
                transition={{ delay: index * 0.05 + 0.25, duration: 0.5 }}
                className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-b opacity-80 hover:opacity-100 transition-opacity"
              ></motion.div>
            </div>

            {/* Label */}
            <span className="text-xs text-slate-500 mt-2">{item.day}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
