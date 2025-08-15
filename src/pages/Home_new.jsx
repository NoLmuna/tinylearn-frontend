// Home page with hero section, features and call-to-actions for students, parents and tutors
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AcademicCapIcon, UserGroupIcon, BookOpenIcon, SparklesIcon, PuzzlePieceIcon, ChartBarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import Hero from '../components/Hero';
import Card from '../components/ui/Card';

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
    bg: 'bg-yellow-100',
    text: 'text-yellow-900',
    desc: 'Engaging, playful content for early learners with interactive activities.'
  },
  {
    title: 'Educational Games',
    icon: PuzzlePieceIcon,
    bg: 'bg-pink-100',
    text: 'text-pink-900', 
    desc: 'Learn through play with fun activities and gamified lessons.'
  },
  {
    title: 'Progress Tracking',
    icon: ChartBarIcon,
    bg: 'bg-blue-100',
    text: 'text-blue-900',
    desc: 'Visualize learning achievements and monitor growth easily.'
  },
  {
    title: 'Parent-Tutor Connect',
    icon: ChatBubbleLeftRightIcon,
    bg: 'bg-green-100',
    text: 'text-green-900',
    desc: 'Stay updated and communicate with seamless messaging.'
  },
];

export default function Home() {
  const navigate = useNavigate();

  const heroButtons = getStartedRoles.map(role => ({
    label: `Get started as a ${role.label}`,
    icon: role.icon,
    variant: 'primary',
    size: 'lg',
    onClick: () => navigate(role.to),
    className: role.color === 'blue' ? 'from-blue-400 to-purple-400' : 
              role.color === 'green' ? 'from-green-400 to-teal-400' :
              'from-purple-400 to-pink-400'
  }));

  return (
    <div className="bg-gradient-to-b from-pink-50 via-yellow-50 to-blue-50 min-h-screen">
      {/* Hero Section */}
      <Hero
        title="Where Little Minds Begin Big Journeys"
        subtitle="TinyLearn is an early education platform connecting students, parents, and tutors with interactive learning experiences designed for young learners."
        image="https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80"
        imageAlt="Happy children learning together"
        buttons={heroButtons}
      />

      {/* What We Offer */}
      <section id="features" className="max-w-6xl mx-auto px-4 pb-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading font-extrabold text-primary mb-4">What We Offer</h2>
          <p className="text-xl text-gray-600 font-body max-w-2xl mx-auto">
            Discover our comprehensive suite of tools designed to make learning fun and effective for everyone.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <Card
              key={feature.title}
              elevate={true}
              className={`${feature.bg} ${feature.text} border-white shadow-card`}
            >
              <div className="flex items-start gap-6">
                <div className="p-4 bg-white rounded-2xl shadow-soft">
                  <feature.icon className="h-8 w-8 text-gray-700" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-heading font-bold mb-3 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-lg font-body font-medium opacity-90 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* About & Contact Sections */}
      <section id="about" className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Card className="bg-white/80 backdrop-blur-sm">
          <h2 className="text-3xl font-heading font-bold text-primary mb-6">About TinyLearn</h2>
          <p className="text-lg font-body text-gray-700 leading-relaxed">
            TinyLearn is dedicated to making early education engaging, accessible, and fun for every child, parent, and tutor. 
            We believe in playful learning and strong connections between home and school, fostering growth through interactive 
            experiences that adapt to each child's unique learning style.
          </p>
        </Card>
      </section>

      <section id="contact" className="max-w-4xl mx-auto px-4 pb-20 text-center">
        <Card className="bg-gradient-to-r from-pink-50 to-yellow-50">
          <h2 className="text-3xl font-heading font-bold text-primary mb-6">Get In Touch</h2>
          <p className="text-lg font-body text-gray-700 mb-6 leading-relaxed">
            Questions? Suggestions? We'd love to hear from you and help make learning even more magical!
          </p>
          <a
            href="mailto:info@tinylearn.com"
            className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-pink-400 to-yellow-400 text-white font-heading font-bold rounded-full shadow-button button-lift transition-all duration-150 hover:from-pink-500 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:ring-offset-2"
          >
            Email Us
          </a>
        </Card>
      </section>
    </div>
  );
}
