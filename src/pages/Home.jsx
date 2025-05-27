import { Link } from 'react-router-dom';
import { AcademicCapIcon, UserGroupIcon, BookOpenIcon } from '@heroicons/react/24/outline';

const roleCards = [
  {
    title: 'Students',
    description: 'Start your learning journey with fun interactive lessons',
    icon: AcademicCapIcon,
    to: '/lessons',
    color: 'bg-blue-500',
  },
  {
    title: 'Parents',
    description: 'Track your child\'s progress and communicate with tutors',
    icon: UserGroupIcon,
    to: '/dashboard',
    color: 'bg-green-500',
  },
  {
    title: 'Tutors',
    description: 'Manage lessons and monitor student progress',
    icon: BookOpenIcon,
    to: '/dashboard',
    color: 'bg-purple-500',
  },
];

export default function Home() {
  return (
    <div className="space-y-8 py-4">
      {/* Hero Section */}
      <div className="text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-gray-900">
          Welcome to TinyLearn
        </h1>
        <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
          An interactive learning platform designed for early learners at Level Up Learning Center.
          Start your educational journey today!
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-6">
        {roleCards.map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className="relative group rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
          >
            <div className={`absolute top-0 right-0 w-20 h-20 ${card.color} opacity-10 rounded-bl-full`} />
            <div className={`inline-flex p-3 rounded-lg ${card.color} bg-opacity-10 self-start`}>
              <card.icon className={`h-6 w-6 ${card.color.replace('bg-', 'text-')}`} />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">{card.title}</h3>
            <p className="mt-2 text-gray-600 flex-grow">{card.description}</p>
            <div className={`mt-4 text-sm font-medium ${card.color.replace('bg-', 'text-')}`}>
              Get Started →
            </div>
          </Link>
        ))}
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 mx-4 sm:mx-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">What We Offer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <h3 className="font-semibold text-indigo-600">Interactive Lessons</h3>
            <p className="text-gray-600">Engaging content designed for early learners</p>
          </div>
          <div className="space-y-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <h3 className="font-semibold text-indigo-600">Educational Games</h3>
            <p className="text-gray-600">Learn through play with fun activities</p>
          </div>
          <div className="space-y-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <h3 className="font-semibold text-indigo-600">Progress Tracking</h3>
            <p className="text-gray-600">Monitor learning achievements visually</p>
          </div>
          <div className="space-y-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <h3 className="font-semibold text-indigo-600">Parent-Tutor Connect</h3>
            <p className="text-gray-600">Stay updated on your child's progress</p>
          </div>
        </div>
      </div>
    </div>
  );
} 