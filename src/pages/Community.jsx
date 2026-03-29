import { useState, useContext } from 'react'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext'
import Button from '../components/Button'
import { Heart, Share2, MessageCircle, MapPin, Clock, Users, ArrowLeft, Plus } from 'lucide-react'

export default function Community() {
  const { setCurrentPage } = useContext(AppContext)
  const [stories, setStories] = useState([
    {
      id: 1,
      author: 'Sarah M.',
      avatar: '👩‍🦱',
      title: 'How Meditation Changed My Life',
      content: 'Started with just 5 minutes a day. Now I\'m at 20 minutes and it\'s completely transformed my anxiety management. I\'m sleeping better and feeling more present in my relationships.',
      likes: 342,
      comments: 28,
      date: '2 days ago',
      category: 'meditation'
    },
    {
      id: 2,
      author: 'James K.',
      avatar: '👨‍💼',
      title: 'Breaking Through Work Stress',
      content: 'My job was consuming me. Started journaling daily and doing breathing exercises during lunch breaks. My productivity actually increased and I\'m way less stressed. Highly recommend this approach!',
      likes: 521,
      comments: 45,
      date: '5 days ago',
      category: 'breathing'
    },
    {
      id: 3,
      author: 'Emma L.',
      avatar: '👩‍🎨',
      title: 'Yoga Saved My Mental Health',
      content: 'Was skeptical about yoga but decided to try. The combination of movement and mindfulness is incredible. I\'ve never felt better mentally and physically. Thank you Unsaid AI for guiding me!',
      likes: 687,
      comments: 62,
      date: '1 week ago',
      category: 'yoga'
    },
    {
      id: 4,
      author: 'Michael R.',
      avatar: '👨‍🏫',
      title: 'From Anxiety to Confidence',
      content: 'Struggled with social anxiety for years. Started with small steps and therapy combined with these wellness tools. Now I can attend meetings without panic attacks. Progress is real!',
      likes: 445,
      comments: 38,
      date: '1 week ago',
      category: 'grounding'
    }
  ])

  const [sessions] = useState([
    {
      id: 1,
      type: 'Yoga',
      location: 'Central Park, 2.3 km away',
      time: 'Today, 6:00 PM',
      instructor: 'Priya Singh',
      attendees: 12,
      difficulty: 'Beginner-Friendly',
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 2,
      type: 'Meditation Circle',
      location: 'Riverside Community Center, 3.1 km away',
      time: 'Today, 7:30 PM',
      instructor: 'Dr. Marcus Johnson',
      attendees: 8,
      difficulty: 'All Levels',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 3,
      type: 'Breathing Workshop',
      location: 'Downtown Health Hub, 1.8 km away',
      time: 'Tomorrow, 10:00 AM',
      instructor: 'Lisa Chen',
      attendees: 15,
      difficulty: 'Beginner-Friendly',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 4,
      type: 'Gratitude Sharing Session',
      location: 'Neighborhood Library, 4.2 km away',
      time: 'Tomorrow, 5:00 PM',
      instructor: 'Community Facilitators',
      attendees: 20,
      difficulty: 'All Levels',
      color: 'from-amber-500 to-yellow-500'
    }
  ])

  const [newStory, setNewStory] = useState('')
  const [showStoryForm, setShowStoryForm] = useState(false)

  const handleAddStory = () => {
    if (newStory.trim()) {
      const story = {
        id: stories.length + 1,
        author: 'You',
        avatar: '👤',
        title: 'My Wellness Journey',
        content: newStory,
        likes: 0,
        comments: 0,
        date: 'Just now',
        category: 'journey'
      }
      setStories([story, ...stories])
      setNewStory('')
      setShowStoryForm(false)
    }
  }

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
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Wellness Community
              </span>
            </h1>
            <p className="text-slate-400 mt-2">Share your journey, connect with others, join nearby sessions</p>
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto">
        {/* Nearby Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Wellness Sessions Near You</h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {sessions.map((session) => (
              <motion.div
                key={session.id}
                variants={itemVariants}
                className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 p-6 backdrop-blur-sm hover:border-purple-400/60 transition-all duration-300"
              >
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-4 bg-gradient-to-r ${session.color}`}>
                  {session.type}
                </div>
                <h3 className="text-lg font-bold text-white mb-4">{session.type}</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-slate-300">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    <span className="text-sm">{session.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">{session.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm">{session.attendees} people attending</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-4">Instructor: <span className="text-purple-300 font-semibold">{session.instructor}</span></p>
                  <p className="text-xs text-slate-400 mb-4">Level: <span className="text-teal-300 font-semibold">{session.difficulty}</span></p>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    Join Session
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Inspiring Stories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Inspiring Stories from Our Community</h2>
            <Button
              onClick={() => setShowStoryForm(!showStoryForm)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            >
              <Plus className="w-4 h-4" />
              Share Your Story
            </Button>
          </div>

          {/* Story Form */}
          {showStoryForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 p-6 backdrop-blur-sm mb-8"
            >
              <textarea
                value={newStory}
                onChange={(e) => setNewStory(e.target.value)}
                placeholder="Share your wellness journey, what helped you, your breakthrough moments... Let others know they're not alone!"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
                rows="6"
              />
              <div className="flex gap-4 mt-4">
                <Button
                  onClick={handleAddStory}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                >
                  Post Story
                </Button>
                <Button
                  onClick={() => setShowStoryForm(false)}
                  variant="ghost"
                  className="flex-1 border border-slate-700"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {/* Stories Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {stories.map((story) => (
              <motion.div
                key={story.id}
                variants={itemVariants}
                className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 p-6 backdrop-blur-sm hover:border-purple-400/60 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{story.avatar}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{story.title}</h3>
                    <p className="text-sm text-slate-400">{story.author} • {story.date}</p>
                  </div>
                </div>

                <p className="text-slate-300 mb-6 leading-relaxed">{story.content}</p>

                <div className="flex items-center gap-6 pt-4 border-t border-slate-700/50">
                  <button className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors group">
                    <Heart className="w-5 h-5 group-hover:fill-red-400" />
                    <span className="text-sm font-semibold">{story.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-semibold">{story.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors ml-auto">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm font-semibold">Share</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
