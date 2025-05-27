import { useState } from 'react';
import { PlayIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const categories = [
  { id: 'all', name: 'All Lessons' },
  { id: 'numbers', name: 'Numbers' },
  { id: 'letters', name: 'Letters' },
  { id: 'shapes', name: 'Shapes & Colors' },
];

const lessons = [
  {
    id: 1,
    title: 'Numbers 1-10',
    description: 'Learn to count and recognize numbers from 1 to 10',
    category: 'numbers',
    duration: '20 min',
    progress: 100,
    thumbnail: 'https://placehold.co/400x300/4F46E5/ffffff?text=Numbers+1-10',
  },
  {
    id: 2,
    title: 'Basic Letters A-E',
    description: 'Introduction to the first five letters of the alphabet',
    category: 'letters',
    duration: '25 min',
    progress: 60,
    thumbnail: 'https://placehold.co/400x300/4F46E5/ffffff?text=Letters+A-E',
  },
  {
    id: 3,
    title: 'Colors and Shapes',
    description: 'Learn primary colors and basic shapes',
    category: 'shapes',
    duration: '15 min',
    progress: 0,
    thumbnail: 'https://placehold.co/400x300/4F46E5/ffffff?text=Colors+and+Shapes',
  },
];

export default function Lessons() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredLessons = selectedCategory === 'all'
    ? lessons
    : lessons.filter(lesson => lesson.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">Interactive Lessons</h1>
      </div>

      {/* Category Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm overflow-x-auto">
        <div className="flex flex-nowrap sm:flex-wrap gap-2 sm:gap-4 min-w-max sm:min-w-0">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`${
                selectedCategory === category.id
                  ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                  : 'text-gray-500 hover:text-gray-700 border-gray-200 hover:border-gray-300'
              } px-4 py-2 rounded-md text-sm font-medium border whitespace-nowrap transition-colors`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="relative aspect-video">
              <img
                src={lesson.thumbnail}
                alt={lesson.title}
                className="w-full h-full object-cover"
              />
              {lesson.progress === 100 && (
                <div className="absolute top-2 right-2 bg-green-500 text-white p-1.5 rounded-full">
                  <CheckCircleIcon className="h-5 w-5" />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{lesson.title}</h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">{lesson.description}</p>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{lesson.duration}</span>
                  {lesson.progress > 0 && (
                    <span className="text-indigo-600 font-medium">
                      {lesson.progress}% Complete
                    </span>
                  )}
                </div>
                {lesson.progress > 0 && (
                  <div className="mt-2 relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-indigo-200">
                      <div
                        style={{ width: `${lesson.progress}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-300"
                      ></div>
                    </div>
                  </div>
                )}
                <button className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                  <PlayIcon className="h-5 w-5 mr-2" />
                  {lesson.progress === 0 ? 'Start Lesson' : 'Continue Learning'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No lessons found in this category.</p>
        </div>
      )}
    </div>
  );
} 