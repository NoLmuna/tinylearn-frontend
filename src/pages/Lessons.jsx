import { useState } from 'react';
import PlayfulButton from '../components/PlayfulButton';
import { BookOpenIcon } from '@heroicons/react/24/outline';

const lessonCategories = [
  { id: 'colors', name: 'Colors & Shapes' },
  { id: 'numbers', name: 'Numbers & Counting' },
  { id: 'letters', name: 'Alphabet' },
  { id: 'animals', name: 'Animals' },
  { id: 'science', name: 'Basic Science' },
  { id: 'arts', name: 'Arts & Crafts' },
];

const lessons = [
  { id: 1, category: 'colors', title: 'Primary Colors', progress: 100, color: 'pink' },
  { id: 2, category: 'colors', title: 'Basic Shapes', progress: 75, color: 'yellow' },
  { id: 3, category: 'numbers', title: 'Numbers 1-10', progress: 100, color: 'green' },
  { id: 4, category: 'numbers', title: 'Counting Fun', progress: 50, color: 'blue' },
  { id: 5, category: 'letters', title: 'ABC\'s', progress: 25, color: 'purple' },
  { id: 6, category: 'letters', title: 'Phonics', progress: 0, color: 'orange' },
  { id: 7, category: 'animals', title: 'Farm Animals', progress: 0, color: 'pink' },
  { id: 8, category: 'animals', title: 'Jungle Animals', progress: 0, color: 'yellow' },
];

const getColorClasses = (color) => {
  const colorMap = {
    pink: {
      bg: 'bg-pink-500',
      border: 'border-pink-400',
      progress: 'bg-pink-400',
      hover: 'bg-pink-100'
    },
    yellow: {
      bg: 'bg-yellow-500',
      border: 'border-yellow-400',
      progress: 'bg-yellow-400',
      hover: 'bg-yellow-100'
    },
    green: {
      bg: 'bg-green-500',
      border: 'border-green-400',
      progress: 'bg-green-400',
      hover: 'bg-green-100'
    },
    blue: {
      bg: 'bg-blue-500',
      border: 'border-blue-400',
      progress: 'bg-blue-400',
      hover: 'bg-blue-100'
    },
    purple: {
      bg: 'bg-purple-500',
      border: 'border-purple-400',
      progress: 'bg-purple-400',
      hover: 'bg-purple-100'
    },
    orange: {
      bg: 'bg-orange-500',
      border: 'border-orange-400',
      progress: 'bg-orange-400',
      hover: 'bg-orange-100'
    }
  };
  return colorMap[color] || colorMap.pink;
};

export default function Lessons() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredLessons = selectedCategory
    ? lessons.filter(lesson => lesson.category === selectedCategory)
    : lessons;

  return (
    <div className="space-y-8 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Browse Lessons</h1>
        {/* Maybe add a search bar or filter options here later */}
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex space-x-3 overflow-x-auto pb-2 no-scrollbar">
          <PlayfulButton
            key="all"
            color="gray"
            className={`flex-shrink-0 ${selectedCategory === null ? 'bg-gray-400 text-white' : 'bg-white text-gray-700'}`}
            onClick={() => setSelectedCategory(null)}
          >
            All Categories
          </PlayfulButton>
          {lessonCategories.map(category => (
            <PlayfulButton
              key={category.id}
              color="gray"
              className={`flex-shrink-0 ${selectedCategory === category.id ? 'bg-gray-400 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </PlayfulButton>
          ))}
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredLessons.map(lesson => {
          const colorClasses = getColorClasses(lesson.color);
          return (
            <div key={lesson.id} className={`relative bg-white shadow-xl rounded-2xl overflow-hidden border-b-4 ${colorClasses.border} group`}>
              <div className="p-5">
                <div className={`flex items-center justify-center h-12 w-12 rounded-full ${colorClasses.bg} mb-4`}>
                  <BookOpenIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{lesson.title}</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${colorClasses.progress}`}
                    style={{ width: `${lesson.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Progress: {lesson.progress}%</p>
              </div>
              <div className={`absolute bottom-0 inset-x-0 px-5 py-3 transition-all duration-300 transform translate-y-full group-hover:translate-y-0 ${colorClasses.hover}`}>
                <PlayfulButton color={lesson.color} className="w-full text-sm py-2">
                  Start Lesson
                </PlayfulButton>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 