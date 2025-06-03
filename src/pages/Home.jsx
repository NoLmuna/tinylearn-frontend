import { AcademicCapIcon, UserGroupIcon, BookOpenIcon, SparklesIcon, PuzzlePieceIcon, ChartBarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import PlayfulButton from '../components/PlayfulButton';

const getStartedRoles = [
  {
    label: 'Student',
    icon: AcademicCapIcon,
    color: 'blue',
    to: '/signup?role=student',
  },
  {
    label: 'Parent',
    icon: UserGroupIcon,
    color: 'green',
    to: '/signup?role=parent',
  },
  {
    label: 'Tutor',
    icon: BookOpenIcon,
    color: 'purple',
    to: '/signup?role=tutor',
  },
];

const features = [
  {
    title: 'Interactive Lessons',
    icon: SparklesIcon,
    bg: 'bg-yellow-300',
    text: 'text-yellow-900',
    desc: 'Engaging, playful content for early learners.'
  },
  {
    title: 'Educational Games',
    icon: PuzzlePieceIcon,
    bg: 'bg-pink-200',
    text: 'text-pink-900',
    desc: 'Learn through play with fun activities.'
  },
  {
    title: 'Progress Tracking',
    icon: ChartBarIcon,
    bg: 'bg-sky-200',
    text: 'text-sky-900',
    desc: 'Visualize learning achievements easily.'
  },
  {
    title: 'Parent-Tutor Connect',
    icon: ChatBubbleLeftRightIcon,
    bg: 'bg-green-200',
    text: 'text-green-900',
    desc: 'Stay updated and communicate with ease.'
  },
];

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-pink-50 via-yellow-50 to-sky-50 min-h-screen pb-12">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center pt-16 pb-10 px-4">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-primary mb-4 drop-shadow-sm leading-tight" style={{letterSpacing: '-1px'}}>
          Where Little Minds Begin Big Journeys
        </h1>
        <p className="text-xl sm:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto font-semibold">
          TinyLearn is an early education platform connecting students, parents, and tutors with interactive learning.
        </p>
        <div className="flex justify-center mt-6">
          <img
            src="https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80"
            alt="Happy kids learning"
            className="rounded-3xl shadow-xl w-full max-w-md object-cover border-4 border-white"
            style={{ aspectRatio: '4/3' }}
          />
        </div>
      </section>

      {/* Get Started As... */}
      <section className="max-w-3xl mx-auto mt-12 mb-16 px-4">
        <h2 className="text-3xl font-extrabold text-primary text-center mb-6">Get started as a...</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          {getStartedRoles.map((role) => (
            <PlayfulButton
              key={role.label}
              as="a"
              href={role.to}
              icon={role.icon}
              color={role.color}
              className="w-full sm:w-auto flex-1 py-5 text-xl"
              style={{ minWidth: 140 }}
            >
              {role.label}
            </PlayfulButton>
          ))}
        </div>
      </section>

      {/* What We Offer */}
      <section id="features" className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-primary text-center mb-8">What We Offer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`flex items-center gap-6 p-8 rounded-3xl shadow-xl ${feature.bg} ${feature.text} border-2 border-white`}
              style={{ minHeight: 140 }}
            >
              <span className={`p-5 rounded-full bg-white shadow-lg flex items-center justify-center`}>
                <feature.icon className="h-12 w-12" />
              </span>
              <div>
                <h3 className="text-2xl font-extrabold mb-2 leading-tight" style={{letterSpacing: '-0.5px'}}>{feature.title}</h3>
                <p className="text-lg font-medium opacity-90 leading-snug">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About & Contact (simple placeholders) */}
      <section id="about" className="max-w-3xl mx-auto mt-20 px-4 text-center">
        <h2 className="text-2xl font-extrabold text-primary mb-4">About TinyLearn</h2>
        <p className="text-gray-700 mb-2 text-lg font-medium">TinyLearn is dedicated to making early education engaging, accessible, and fun for every child, parent, and tutor. We believe in playful learning and strong connections between home and school.</p>
      </section>
      <section id="contact" className="max-w-3xl mx-auto mt-12 px-4 text-center">
        <h2 className="text-2xl font-extrabold text-primary mb-4">Contact</h2>
        <p className="text-gray-700 mb-2 text-lg font-medium">Questions? Suggestions? <a href="mailto:info@tinylearn.com" className="text-indigo-600 underline">Email us</a> and we'll get back to you soon!</p>
      </section>
    </div>
  );
} 