import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, CheckCircle, Clock, AlertCircle, Award, ChevronDown, ChevronUp } from 'lucide-react';
import logo from '../../assets/levelup-logo.png';

/**
 * Student Progress Page
 * Detailed read-only view of lessons and assignments
 */
function StudentProgress() {
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState(0);
  const [expandedLesson, setExpandedLesson] = useState(null);

  // Mock children data
  const children = [
    {
      id: 1,
      name: 'Emma Johnson',
      grade: '5th Grade',
      avatar: '👧',
      lessons: [
        { 
          id: 1, 
          subject: 'Mathematics', 
          completed: 8, 
          total: 10, 
          progress: 80, 
          teacher: 'Ms. Smith', 
          color: 'bg-blue-500',
          recentTopics: ['Fractions', 'Decimals', 'Percentages'],
          nextLesson: 'Algebra Basics'
        },
        { 
          id: 2, 
          subject: 'Reading', 
          completed: 6, 
          total: 8, 
          progress: 75, 
          teacher: 'Mr. Davis', 
          color: 'bg-green-500',
          recentTopics: ['Chapter Analysis', 'Character Development', 'Story Structure'],
          nextLesson: 'Poetry Introduction'
        },
        { 
          id: 3, 
          subject: 'Science', 
          completed: 5, 
          total: 12, 
          progress: 42, 
          teacher: 'Ms. Brown', 
          color: 'bg-purple-500',
          recentTopics: ['Plant Biology', 'Photosynthesis', 'Ecosystems'],
          nextLesson: 'Animal Classification'
        },
        { 
          id: 4, 
          subject: 'Art', 
          completed: 4, 
          total: 5, 
          progress: 80, 
          teacher: 'Ms. Taylor', 
          color: 'bg-pink-500',
          recentTopics: ['Color Theory', 'Watercolors', 'Perspective Drawing'],
          nextLesson: 'Abstract Art'
        },
      ],
      assignments: [
        { id: 1, title: 'Math Practice Problems', subject: 'Mathematics', status: 'completed', dueDate: 'Dec 15, 2025', completedDate: 'Dec 14, 2025', score: 95, feedback: 'Excellent work! Great understanding of fractions.' },
        { id: 2, title: 'Book Report: Chapter 5', subject: 'Reading', status: 'pending', dueDate: 'Dec 22, 2025', score: null, description: 'Write a summary and analysis of Chapter 5' },
        { id: 3, title: 'Science Experiment: Plant Growth', subject: 'Science', status: 'pending', dueDate: 'Dec 25, 2025', score: null, description: 'Document plant growth over 2 weeks' },
        { id: 4, title: 'Art Project: Watercolor Landscape', subject: 'Art', status: 'completed', dueDate: 'Dec 18, 2025', completedDate: 'Dec 17, 2025', score: 88, feedback: 'Beautiful use of colors!' },
        { id: 5, title: 'Reading Comprehension Quiz', subject: 'Reading', status: 'completed', dueDate: 'Dec 12, 2025', completedDate: 'Dec 11, 2025', score: 92, feedback: 'Good analysis of the text.' },
        { id: 6, title: 'Math Homework: Decimals', subject: 'Mathematics', status: 'completed', dueDate: 'Dec 10, 2025', completedDate: 'Dec 10, 2025', score: 98, feedback: 'Perfect score! Keep it up!' },
      ],
      overallProgress: 69
    },
    {
      id: 2,
      name: 'Noah Johnson',
      grade: '3rd Grade',
      avatar: '👦',
      lessons: [
        { 
          id: 1, 
          subject: 'Mathematics', 
          completed: 9, 
          total: 10, 
          progress: 90, 
          teacher: 'Ms. Smith', 
          color: 'bg-blue-500',
          recentTopics: ['Addition', 'Subtraction', 'Word Problems'],
          nextLesson: 'Multiplication Basics'
        },
        { 
          id: 2, 
          subject: 'Reading', 
          completed: 7, 
          total: 8, 
          progress: 88, 
          teacher: 'Mr. Davis', 
          color: 'bg-green-500',
          recentTopics: ['Short Stories', 'Vocabulary', 'Reading Fluency'],
          nextLesson: 'Story Writing'
        },
        { 
          id: 3, 
          subject: 'Science', 
          completed: 8, 
          total: 10, 
          progress: 80, 
          teacher: 'Ms. Brown', 
          color: 'bg-purple-500',
          recentTopics: ['Weather', 'Seasons', 'Water Cycle'],
          nextLesson: 'Simple Machines'
        },
      ],
      assignments: [
        { id: 1, title: 'Addition Worksheet', subject: 'Mathematics', status: 'completed', dueDate: 'Dec 16, 2025', completedDate: 'Dec 15, 2025', score: 100, feedback: 'Perfect! Amazing work!' },
        { id: 2, title: 'Reading Comprehension', subject: 'Reading', status: 'completed', dueDate: 'Dec 19, 2025', completedDate: 'Dec 18, 2025', score: 92, feedback: 'Great understanding!' },
        { id: 3, title: 'Plant Growth Journal', subject: 'Science', status: 'pending', dueDate: 'Dec 28, 2025', score: null, description: 'Draw and describe plant observations' },
        { id: 4, title: 'Spelling Test', subject: 'Reading', status: 'completed', dueDate: 'Dec 13, 2025', completedDate: 'Dec 13, 2025', score: 85, feedback: 'Good job!' },
      ],
      overallProgress: 86
    }
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const currentChild = children[selectedChild];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50/30">
      {/* Top Navigation */}
      <nav className="bg-white border-b-2 border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/parent/dashboard" className="flex items-center gap-3 group">
              <img src={logo} alt="TinyLearn" className="h-14 w-14 object-contain transition-transform group-hover:scale-110" />
              <div>
                <h1 className="text-2xl font-black text-gray-900">TinyLearn</h1>
                <p className="text-xs text-gray-600 font-semibold">Parent Portal</p>
              </div>
            </Link>
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-1">
                <Link
                  to="/parent/dashboard"
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-semibold transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/parent/progress"
                  className="px-4 py-2 bg-[#F4C21A] text-gray-900 rounded-lg font-semibold"
                >
                  Student Progress
                </Link>
                <Link
                  to="/parent/messages"
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-semibold transition-colors"
                >
                  Messages
                </Link>
              </div>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Student Progress</h2>
          <p className="text-lg text-gray-600">
            Track your child's learning journey and view completed assignments
          </p>
        </div>

        {/* Child Selector */}
        <div className="flex gap-4 mb-8">
          {children.map((child, index) => (
            <button
              key={child.id}
              onClick={() => setSelectedChild(index)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all shadow-md ${
                selectedChild === index
                  ? 'bg-[#F4C21A] text-gray-900 shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-3xl">{child.avatar}</span>
              <div className="text-left">
                <p className="font-bold">{child.name}</p>
                <p className="text-xs opacity-80">{child.grade}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Overall Progress Summary */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Overall Progress</h3>
              <p className="text-gray-600">All subjects combined</p>
            </div>
            <div className="text-right">
              <p className="text-5xl font-black text-blue-600 mb-1">{currentChild.overallProgress}%</p>
              <p className="text-sm text-gray-600">Complete</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${currentChild.overallProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Lessons Progress Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900">Lessons by Subject</h3>
          </div>

          <div className="space-y-4">
            {currentChild.lessons.map((lesson) => (
              <div key={lesson.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
                  className="w-full p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-4 h-4 ${lesson.color} rounded-full`}></div>
                      <div className="text-left flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-xl font-bold text-gray-900">{lesson.subject}</h4>
                          <span className="text-sm font-semibold text-gray-600">Teacher: {lesson.teacher}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex-1 max-w-md">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-gray-700">Progress</span>
                              <span className="text-sm font-bold text-gray-900">{lesson.completed}/{lesson.total} lessons</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className={`${lesson.color} h-2.5 rounded-full transition-all duration-500`}
                                style={{ width: `${lesson.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="text-2xl font-black text-gray-900">{lesson.progress}%</div>
                        </div>
                      </div>
                    </div>
                    {expandedLesson === lesson.id ? (
                      <ChevronUp className="w-6 h-6 text-gray-600 ml-4" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-600 ml-4" />
                    )}
                  </div>
                </button>
                
                {expandedLesson === lesson.id && (
                  <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          Recent Topics Covered
                        </h5>
                        <ul className="space-y-2">
                          {lesson.recentTopics.map((topic, idx) => (
                            <li key={idx} className="text-gray-700 pl-7 relative">
                              <span className="absolute left-0 top-1.5 w-2 h-2 bg-green-500 rounded-full"></span>
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Clock className="w-5 h-5 text-blue-500" />
                          Coming Up Next
                        </h5>
                        <p className="text-gray-700 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                          {lesson.nextLesson}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Assignments Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Award className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900">All Assignments</h3>
          </div>

          {/* Assignment Filters */}
          <div className="flex gap-3 mb-6">
            <button className="px-5 py-2 bg-[#F4C21A] text-gray-900 rounded-xl font-semibold">
              All ({currentChild.assignments.length})
            </button>
            <button className="px-5 py-2 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 border border-gray-200">
              Completed ({currentChild.assignments.filter(a => a.status === 'completed').length})
            </button>
            <button className="px-5 py-2 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 border border-gray-200">
              Pending ({currentChild.assignments.filter(a => a.status === 'pending').length})
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {currentChild.assignments.map((assignment) => (
              <div
                key={assignment.id}
                className={`bg-white rounded-2xl shadow-lg border-2 p-6 ${
                  assignment.status === 'completed' 
                    ? 'border-green-300' 
                    : 'border-orange-300'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 mb-1">{assignment.title}</h4>
                    <p className="text-sm text-gray-600 font-medium">{assignment.subject}</p>
                  </div>
                  {assignment.status === 'completed' ? (
                    <div className="bg-green-500 rounded-full p-2 shadow-md">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  ) : (
                    <div className="bg-orange-500 rounded-full p-2 shadow-md">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>

                {assignment.status === 'completed' ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-semibold text-gray-700">Score:</span>
                      <span className="text-2xl font-bold text-green-600">{assignment.score}/100</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs font-semibold text-gray-600 mb-1">Teacher Feedback:</p>
                      <p className="text-sm text-gray-800">{assignment.feedback}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Due: {assignment.dueDate}</span>
                      <span>Completed: {assignment.completedDate}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                      <p className="text-sm font-semibold text-orange-800 mb-1">Due Date: {assignment.dueDate}</p>
                      <p className="text-sm text-gray-700">{assignment.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-orange-700">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-xs font-semibold">Awaiting submission</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProgress;
