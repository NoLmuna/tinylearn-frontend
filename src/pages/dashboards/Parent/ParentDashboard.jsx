import { useState, useEffect } from 'react';
import { 
  HeartIcon, 
  ChartBarIcon, 
  ChatBubbleLeftRightIcon, 
  CalendarDaysIcon,
  TrophyIcon,
  BookOpenIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../hooks/useAuth';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function ParentDashboard() {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);

  useEffect(() => {
    // TODO: Fetch children data from API
    const mockChildren = [
      {
        id: 1,
        name: 'Emma',
        age: 7,
        grade: '2nd Grade',
        profilePicture: null,
        recentProgress: {
          lessonsCompleted: 12,
          averageScore: 87,
          timeSpent: '2.5 hours',
          streak: 5
        },
        recentActivities: [
          { id: 1, lesson: 'Addition Practice', score: 95, date: 'Today' },
          { id: 2, lesson: 'Shape Recognition', score: 88, date: 'Yesterday' },
          { id: 3, lesson: 'Reading Comprehension', score: 92, date: '2 days ago' }
        ],
        upcomingLessons: [
          { id: 1, title: 'Subtraction Basics', scheduledFor: 'Tomorrow 3PM' },
          { id: 2, title: 'Story Writing', scheduledFor: 'Friday 2PM' }
        ]
      }
    ];
    setChildren(mockChildren);
    setSelectedChild(mockChildren[0]);
  }, []);

  const parentActions = [
    {
      title: 'Message Teacher',
      description: 'Send a message to your child\'s teacher',
      icon: ChatBubbleLeftRightIcon,
      action: () => console.log('Message teacher'),
      color: 'blue'
    },
    {
      title: 'Schedule Meeting',
      description: 'Book a parent-teacher conference',
      icon: CalendarDaysIcon,
      action: () => console.log('Schedule meeting'),
      color: 'green'
    },
    {
      title: 'View Full Report',
      description: 'Download detailed progress report',
      icon: ChartBarIcon,
      action: () => console.log('View report'),
      color: 'purple'
    },
    {
      title: 'Learning Goals',
      description: 'Set and track learning objectives',
      icon: TrophyIcon,
      action: () => console.log('Learning goals'),
      color: 'orange'
    }
  ];

  const tips = [
    {
      title: 'Encourage Daily Practice',
      description: 'Just 15 minutes of daily practice can significantly improve learning outcomes.',
      icon: ClockIcon
    },
    {
      title: 'Celebrate Achievements',
      description: 'Acknowledge your child\'s progress, no matter how small. Every step counts!',
      icon: StarIcon
    },
    {
      title: 'Create a Learning Space',
      description: 'A dedicated, quiet space for learning helps maintain focus and routine.',
      icon: BookOpenIcon
    }
  ];

  if (!selectedChild) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Parent Dashboard</h1>
          <p className="text-gray-600">Loading your child's information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full">
              <HeartIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {user?.firstName}!
              </h1>
              <p className="text-lg text-gray-600">
                Track {selectedChild.name}'s learning journey
              </p>
            </div>
          </div>

          {/* Child Selector */}
          {children.length > 1 && (
            <div className="flex gap-4 mt-4">
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChild(child)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedChild.id === child.id
                      ? 'bg-purple-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-purple-50'
                  }`}
                >
                  {child.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Child Info & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="lg:col-span-1 bg-gradient-to-br from-purple-500 to-pink-600 text-white">
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600">
                  {selectedChild.name.charAt(0)}
                </span>
              </div>
              <h2 className="text-xl font-bold mb-1">{selectedChild.name}</h2>
              <p className="text-purple-100">{selectedChild.grade}</p>
              <p className="text-purple-100">Age {selectedChild.age}</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Lessons Completed</p>
                <p className="text-3xl font-bold">{selectedChild.recentProgress.lessonsCompleted}</p>
              </div>
              <BookOpenIcon className="h-12 w-12 text-blue-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Average Score</p>
                <p className="text-3xl font-bold">{selectedChild.recentProgress.averageScore}%</p>
              </div>
              <TrophyIcon className="h-12 w-12 text-green-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Learning Streak</p>
                <p className="text-3xl font-bold">{selectedChild.recentProgress.streak} days</p>
              </div>
              <StarIcon className="h-12 w-12 text-orange-200" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Activities</h2>
                <p className="text-gray-600">{selectedChild.name}'s latest learning sessions</p>
              </div>
              
              <div className="space-y-4">
                {selectedChild.recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <BookOpenIcon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{activity.lesson}</h3>
                        <p className="text-sm text-gray-600">{activity.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        activity.score >= 90 
                          ? 'bg-green-100 text-green-800'
                          : activity.score >= 80
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {activity.score}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button className="w-full mt-6 bg-purple-500 hover:bg-purple-600 text-white">
                View All Activities
              </Button>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Actions</h2>
                <p className="text-gray-600">Stay connected with your child's education</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {parentActions.map((action, index) => (
                  <div
                    key={index}
                    onClick={action.action}
                    className={`p-6 rounded-xl border-2 border-gray-200 hover:border-${action.color}-300 bg-gradient-to-br from-${action.color}-50 to-${action.color}-100 hover:shadow-lg transition-all duration-200 cursor-pointer group`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 bg-${action.color}-500 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold text-${action.color}-900 mb-1`}>
                          {action.title}
                        </h3>
                        <p className={`text-sm text-${action.color}-700`}>
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Upcoming Lessons */}
            <Card>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Upcoming Lessons</h2>
                <p className="text-gray-600">What's next for {selectedChild.name}</p>
              </div>
              
              <div className="space-y-4">
                {selectedChild.upcomingLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="p-4 rounded-lg border-l-4 border-purple-500 bg-purple-50"
                  >
                    <p className="font-medium text-purple-900">{lesson.title}</p>
                    <p className="text-sm text-purple-600">{lesson.scheduledFor}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Parenting Tips */}
            <Card>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Learning Tips</h2>
                <p className="text-gray-600">Help your child succeed</p>
              </div>
              
              <div className="space-y-4">
                {tips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 bg-pink-100 rounded-lg flex-shrink-0">
                      <tip.icon className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">{tip.title}</h3>
                      <p className="text-sm text-gray-600">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
