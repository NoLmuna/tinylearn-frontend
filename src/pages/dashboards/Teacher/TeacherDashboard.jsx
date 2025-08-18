import { useState, useEffect } from 'react';
import { 
  BookOpenIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  PlusIcon,
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../hooks/useAuth';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalLessons: 0,
    completedAssignments: 0,
    pendingReviews: 0
  });

  useEffect(() => {
    // TODO: Fetch teacher stats from API
    setStats({
      totalStudents: 24,
      totalLessons: 12,
      completedAssignments: 89,
      pendingReviews: 7
    });
  }, []);

  const quickActions = [
    {
      title: 'Create New Lesson',
      description: 'Design interactive lessons for your students',
      icon: PlusIcon,
      action: () => console.log('Create lesson'),
      color: 'blue'
    },
    {
      title: 'Add Student',
      description: 'Create a new student account',
      icon: UserGroupIcon,
      action: () => console.log('Add student'),
      color: 'green'
    },
    {
      title: 'View Progress',
      description: 'Check student progress and performance',
      icon: ChartBarIcon,
      action: () => console.log('View progress'),
      color: 'purple'
    },
    {
      title: 'Grade Assignments',
      description: 'Review and grade pending assignments',
      icon: CheckCircleIcon,
      action: () => console.log('Grade assignments'),
      color: 'orange'
    }
  ];

  const recentLessons = [
    { id: 1, title: 'Introduction to Numbers', students: 18, completion: 85 },
    { id: 2, title: 'Basic Addition', students: 22, completion: 92 },
    { id: 3, title: 'Shape Recognition', students: 15, completion: 78 }
  ];

  const upcomingTasks = [
    { id: 1, task: 'Review Math Quiz submissions', due: '2 hours', urgent: true },
    { id: 2, task: 'Parent-teacher meeting with Johnson family', due: 'Tomorrow 2PM', urgent: false },
    { id: 3, task: 'Prepare Reading comprehension lesson', due: 'Friday', urgent: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full">
              <AcademicCapIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-lg text-gray-600">
                Teacher Dashboard - Ready to inspire young minds today?
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold">{stats.totalStudents}</p>
              </div>
              <UserGroupIcon className="h-12 w-12 text-blue-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Active Lessons</p>
                <p className="text-3xl font-bold">{stats.totalLessons}</p>
              </div>
              <BookOpenIcon className="h-12 w-12 text-green-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Completed Tasks</p>
                <p className="text-3xl font-bold">{stats.completedAssignments}</p>
              </div>
              <CheckCircleIcon className="h-12 w-12 text-purple-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Pending Reviews</p>
                <p className="text-3xl font-bold">{stats.pendingReviews}</p>
              </div>
              <ClockIcon className="h-12 w-12 text-orange-200" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Actions</h2>
                <p className="text-gray-600">Common tasks to help you manage your classroom</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
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

          {/* Upcoming Tasks */}
          <div>
            <Card>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Upcoming Tasks</h2>
                <p className="text-gray-600">Your schedule for today</p>
              </div>
              
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      task.urgent 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-blue-500 bg-blue-50'
                    }`}
                  >
                    <p className={`font-medium ${
                      task.urgent ? 'text-red-900' : 'text-blue-900'
                    }`}>
                      {task.task}
                    </p>
                    <p className={`text-sm ${
                      task.urgent ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      Due: {task.due}
                    </p>
                  </div>
                ))}
              </div>
              
              <Button className="w-full mt-6 bg-gray-100 text-gray-700 hover:bg-gray-200">
                View All Tasks
              </Button>
            </Card>
          </div>
        </div>

        {/* Recent Lessons */}
        <div className="mt-8">
          <Card>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Lessons</h2>
              <p className="text-gray-600">Track student engagement and completion rates</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Lesson</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Students</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Completion</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLessons.map((lesson) => (
                    <tr key={lesson.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{lesson.title}</div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{lesson.students}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${lesson.completion}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{lesson.completion}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
