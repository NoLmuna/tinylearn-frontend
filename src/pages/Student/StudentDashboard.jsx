import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';
import Confetti from 'react-confetti';
import { 
  BookOpenIcon, 
  CalculatorIcon, 
  PaintBrushIcon, 
  UsersIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

import AnimatedProgressBar from '../../components/AnimatedProgressBar';
import WeatherWidget from '../../components/WeatherWidget';
import PlayfulButton from '../../components/PlayfulButton';

const subjects = {
  math: {
    name: 'Math',
    icon: CalculatorIcon,
    color: 'blue',
    progress: 65,
    lessons: [
      { id: 1, title: 'Counting 1-10', completed: true },
      { id: 2, title: 'Basic Shapes', completed: true },
      { id: 3, title: 'Simple Addition', completed: false }
    ]
  },
  reading: {
    name: 'Reading',
    icon: BookOpenIcon,
    color: 'green',
    progress: 45,
    lessons: [
      { id: 1, title: 'Letter Sounds', completed: true },
      { id: 2, title: 'Simple Words', completed: false },
      { id: 3, title: 'Short Sentences', completed: false }
    ]
  },
  art: {
    name: 'Art & Creativity',
    icon: PaintBrushIcon,
    color: 'purple',
    progress: 80,
    lessons: [
      { id: 1, title: 'Coloring Basics', completed: true },
      { id: 2, title: 'Drawing Shapes', completed: true },
      { id: 3, title: 'Simple Crafts', completed: true }
    ]
  },
  social: {
    name: 'Social Skills',
    icon: UsersIcon,
    color: 'orange',
    progress: 55,
    lessons: [
      { id: 1, title: 'Being Kind', completed: true },
      { id: 2, title: 'Sharing', completed: true },
      { id: 3, title: 'Taking Turns', completed: false }
    ]
  }
};

const badges = [
  { id: 1, name: 'Math Master', icon: '🎯', earned: true },
  { id: 2, name: 'Reading Star', icon: '⭐', earned: true },
  { id: 3, name: 'Art Explorer', icon: '🎨', earned: true },
  { id: 4, name: 'Kind Friend', icon: '🤝', earned: false },
  { id: 5, name: 'Super Helper', icon: '🦸‍♂️', earned: false }
];

const todaysGoals = [
  { id: 1, text: 'Complete Math Lesson', completed: false },
  { id: 2, text: 'Practice Reading', completed: false },
  { id: 3, text: 'Do an Art Project', completed: true }
];

const recentActivities = [
  { id: 1, title: 'Completed "Counting Numbers"', type: 'completion', time: '2h ago', icon: '🎉' },
  { id: 2, title: 'Earned "Math Master" Badge', type: 'achievement', time: '1d ago', icon: '🏆' },
  { id: 3, title: 'Started "Letter Sounds"', type: 'started', time: '2d ago', icon: '📚' }
];

export default function StudentDashboard() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [parentMode, setParentMode] = useState(false);
  // Removed unused selectedSubject state
  const user = JSON.parse(localStorage.getItem('tinylearn_user') || '{"name": "Little Learner"}');

  useEffect(() => {
    // Show confetti animation when a new badge is earned
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleSubjectClick = (id) => {
    // Add any additional logic for subject selection here
    console.log(`Selected subject: ${subjects[id].name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-pink-50 to-purple-50 pb-12">
      {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}
      <motion.div 
        className="p-6 sm:p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-yellow-300"
            >
              <span className="text-4xl">🎓</span>
            </motion.div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2">
                Hello, {user.name}! 
              </h1>
              <p className="text-lg text-gray-600">Ready to learn something amazing?</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <WeatherWidget />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-3 rounded-xl bg-white shadow-lg text-gray-700 hover:bg-gray-50"
              aria-label={soundEnabled ? 'Disable sound' : 'Enable sound'}
            >
              {soundEnabled ? (
                <SpeakerWaveIcon className="w-6 h-6" />
              ) : (
                <SpeakerXMarkIcon className="w-6 h-6" />
              )}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setParentMode(!parentMode)}
              className="p-3 rounded-xl bg-white shadow-lg text-gray-700 hover:bg-gray-50"
              aria-label={parentMode ? 'Switch to kid mode' : 'Switch to parent mode'}
            >
              {parentMode ? (
                <MoonIcon className="w-6 h-6" />
              ) : (
                <SunIcon className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Today's Goals */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Goals 🎯</h2>
          <div className="grid gap-4">
            {todaysGoals.map(goal => (
              <motion.div
                key={goal.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-xl border-2 ${
                  goal.completed 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-yellow-200 bg-yellow-50'
                }`}
              >
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={goal.completed}
                    onChange={() => {/* Handle goal completion */}}
                    className="w-5 h-5 rounded-lg text-green-500 border-gray-300 focus:ring-green-500"
                  />
                  <span className="text-lg font-medium text-gray-700">{goal.text}</span>
                </label>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Subject Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Object.entries(subjects).map(([id, subject]) => {
            const SubjectIcon = subject.icon;
            return (
              <motion.div
                key={id}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`bg-white p-6 rounded-2xl shadow-xl border-b-4 border-${subject.color}-400 cursor-pointer`}
                onClick={() => handleSubjectClick(id)}
              >
                <div className={`w-12 h-12 rounded-full bg-${subject.color}-100 flex items-center justify-center mb-4`}>
                  <SubjectIcon className={`w-6 h-6 text-${subject.color}-500`} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{subject.name}</h3>
                <AnimatedProgressBar
                  progress={subject.progress}
                  color={subject.color}
                  height="h-3"
                />
                <p className="text-sm text-gray-600 mt-2">
                  {subject.lessons.filter(l => l.completed).length} of {subject.lessons.length} completed
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Achievement Badges */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Achievements 🏆</h2>
          <div className="flex flex-wrap gap-4">
            {badges.map(badge => (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-24 h-24 rounded-full flex flex-col items-center justify-center ${
                  badge.earned 
                    ? 'bg-gradient-to-br from-yellow-200 to-orange-200 shadow-lg' 
                    : 'bg-gray-100'
                }`}
              >
                <span className="text-3xl mb-1">{badge.icon}</span>
                <span className="text-xs font-medium text-gray-700 text-center">
                  {badge.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map(activity => (
              <motion.div
                key={activity.id}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-gray-50"
              >
                <span className="text-2xl">{activity.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
