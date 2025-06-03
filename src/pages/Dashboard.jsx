import { ChartBarIcon, BookOpenIcon, ClockIcon } from '@heroicons/react/24/outline';
import PlayfulButton from '../components/PlayfulButton';

const stats = [
  { name: 'Lessons Completed', value: '12', icon: BookOpenIcon, color: 'blue' },
  { name: 'Current Progress', value: '75%', icon: ChartBarIcon, color: 'green' },
  { name: 'Learning Hours', value: '24', icon: ClockIcon, color: 'purple' },
];

const recentActivities = [
  { id: 1, title: 'Completed "Colors and Shapes"', date: '2 days ago', type: 'lesson' },
  { id: 2, title: 'Mastered "Numbers 1-10"', date: '4 days ago', type: 'achievement' },
  { id: 3, title: 'Started "Basic Letters"', date: '1 week ago', type: 'lesson' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Student Dashboard</h1>
        <PlayfulButton className="w-full sm:w-auto text-base py-3" color="orange">
          View All Lessons
        </PlayfulButton>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className={`relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow-xl rounded-2xl overflow-hidden border-b-4 border-${stat.color}-400`}
          >
            <dt>
              <div className={`absolute ${stat.color === 'blue' ? 'bg-blue-500' : stat.color === 'green' ? 'bg-green-500' : 'bg-purple-500'} rounded-md p-3`}>
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 text-base font-medium text-gray-600 truncate">{stat.name}</p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline">
              <p className="text-3xl font-semibold text-gray-900">{stat.value}</p>
            </dd>
          </div>
        ))}
      </div>

      {/* Progress Section */}
      <div className="bg-white shadow-xl rounded-2xl border border-pink-100">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4">Learning Progress</h3>
          <div className="mt-4">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                    Current Level
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-indigo-600">75%</span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                <div
                  style={{ width: '75%' }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow-xl rounded-2xl border border-yellow-100">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4">Recent Activity</h3>
          <div className="flow-root">
            <ul className="-mb-8">
              {recentActivities.map((activity, activityIdx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {activityIdx !== recentActivities.length - 1 ? (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center ring-8 ring-white">
                          <BookOpenIcon className="h-4 w-4 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">{activity.title}</p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          <time>{activity.date}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 