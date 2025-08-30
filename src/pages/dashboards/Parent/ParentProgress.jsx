import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import {
  ChartBarIcon,
  TrophyIcon,
  BookOpenIcon,
  ClockIcon,
  StarIcon,
  CheckCircleIcon,
  CalendarIcon,
  UserIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import Card from '../../../components/ui/Card';
import DashboardNavbar from '../../../components/ui/DashboardNavbar';
import api from '../../../services/api';

const ParentProgress = () => {
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [progressData, setProgressData] = useState({
    overview: {
      totalLessons: 0,
      completedLessons: 0,
      totalAssignments: 0,
      completedAssignments: 0,
      averageGrade: 0,
      totalTimeSpent: 0
    },
    recentProgress: [],
    subjects: [],
    achievements: []
  });

  const calculateProgressData = useCallback((child) => {
    if (!child || !child.id) {
      console.log('⚠️ No valid child data provided to calculateProgressData');
      return;
    }

    // Use the recentProgress data directly from the API
    const recentProgressData = child.recentProgress || {
      lessonsCompleted: 0,
      averageScore: 0,
      timeSpent: '0 hours',
      streak: 0
    };

    // Use recentActivities from the API
    const recentActivities = child.recentActivities || [];
    
    // Use upcomingAssignments from the API
    const upcomingAssignments = child.upcomingAssignments || [];

    // Generate subject breakdown from recent activities
    const subjectMap = {};
    recentActivities.forEach(activity => {
      const subject = activity.category || 'General';
      if (!subjectMap[subject]) {
        subjectMap[subject] = {
          name: subject.charAt(0).toUpperCase() + subject.slice(1),
          totalLessons: 0,
          completedLessons: 0,
          progress: 0,
          averageScore: 0,
          scores: []
        };
      }
      subjectMap[subject].totalLessons++;
      subjectMap[subject].completedLessons++;
      if (activity.score) {
        subjectMap[subject].scores.push(activity.score);
      }
    });

    // Calculate averages for each subject
    Object.values(subjectMap).forEach(subject => {
      if (subject.scores.length > 0) {
        subject.averageScore = Math.round(
          subject.scores.reduce((sum, score) => sum + score, 0) / subject.scores.length
        );
      }
      subject.progress = subject.totalLessons > 0 
        ? Math.round((subject.completedLessons / subject.totalLessons) * 100)
        : 0;
    });

    // Format recent progress for display
    const formattedRecentProgress = recentActivities.map(activity => ({
      type: 'lesson',
      title: activity.lesson || 'Unknown Lesson',
      completed: true,
      date: activity.date,
      score: activity.score,
      category: activity.category
    }));

    // Add upcoming assignments to recent progress
    upcomingAssignments.forEach(assignment => {
      formattedRecentProgress.push({
        type: 'assignment',
        title: assignment.title,
        completed: false,
        date: assignment.dueDate,
        status: assignment.status || 'pending',
        maxPoints: assignment.maxPoints
      });
    });

    // Sort by date (most recent first)
    formattedRecentProgress.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Generate achievements based on progress
    const achievements = [];
    if (recentProgressData.lessonsCompleted >= 5) {
      achievements.push({ 
        title: 'Learning Star', 
        icon: '⭐', 
        date: new Date().toISOString().split('T')[0],
        description: `Completed ${recentProgressData.lessonsCompleted} lessons!`
      });
    }
    if (recentProgressData.averageScore >= 80) {
      achievements.push({ 
        title: 'High Achiever', 
        icon: '🏆', 
        date: new Date().toISOString().split('T')[0],
        description: `Maintained ${recentProgressData.averageScore}% average score!`
      });
    }
    if (recentProgressData.streak >= 3) {
      achievements.push({ 
        title: 'Consistent Learner', 
        icon: '🔥', 
        date: new Date().toISOString().split('T')[0],
        description: `${recentProgressData.streak} day learning streak!`
      });
    }

    setProgressData({
      overview: {
        totalLessons: recentActivities.length + upcomingAssignments.length,
        completedLessons: recentProgressData.lessonsCompleted,
        totalAssignments: upcomingAssignments.length,
        completedAssignments: upcomingAssignments.filter(a => a.status === 'completed').length,
        averageGrade: recentProgressData.averageScore,
        totalTimeSpent: parseInt(recentProgressData.timeSpent) || 0
      },
      recentProgress: formattedRecentProgress.slice(0, 10),
      subjects: Object.values(subjectMap),
      achievements
    });
  }, []);

  const fetchChildrenData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching parent children data...');
      
      const response = await api.getParentChildren();
      console.log('👨‍👩‍👧‍👦 Children response:', response);
      
      if (response.success) {
        const childrenData = response.data || [];
        console.log('✅ Children loaded:', childrenData);
        setChildren(childrenData);
        
        // Select first child by default
        if (childrenData.length > 0) {
          setSelectedChild(childrenData[0]);
          calculateProgressData(childrenData[0]);
        }
      } else {
        console.error('❌ Failed to fetch children:', response);
        toast.error('Failed to load children data');
      }
    } catch (error) {
      console.error('💥 Failed to fetch children:', error);
      toast.error('Failed to load children data');
    } finally {
      setLoading(false);
    }
  }, [calculateProgressData]);

  useEffect(() => {
    fetchChildrenData();
  }, [fetchChildrenData]);

  const handleChildSelect = (child) => {
    setSelectedChild(child);
    calculateProgressData(child);
  };

  const getSubjectIcon = (subject) => {
    switch (subject.toLowerCase()) {
      case 'mathematics':
      case 'math':
        return <span className="text-2xl">🔢</span>;
      case 'science':
        return <span className="text-2xl">🧪</span>;
      case 'english':
      case 'reading':
        return <span className="text-2xl">📚</span>;
      case 'history':
        return <span className="text-2xl">🏛️</span>;
      case 'art':
        return <span className="text-2xl">🎨</span>;
      default:
        return <AcademicCapIcon className="h-8 w-8 text-purple-600" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        <DashboardNavbar role="parent" currentPage="Progress" />
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        <DashboardNavbar role="parent" currentPage="Progress" />
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center py-12">
            <UserIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Children Found</h3>
            <p className="text-gray-600">No children are linked to your parent account.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <DashboardNavbar role="parent" currentPage="Progress" />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Children's Progress</h1>
          <p className="text-gray-600">Monitor your children's learning progress and achievements</p>
        </div>

        {/* Child Selector */}
        {children.length > 1 && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Child</h3>
            <div className="flex flex-wrap gap-4">
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => handleChildSelect(child)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedChild?.id === child.id
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-purple-600">
                        {child.firstName?.charAt(0) || 'S'}
                      </span>
                    </div>
                    <span className="font-medium">{child.firstName} {child.lastName}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        )}

        {selectedChild && (
          <>
            {/* Selected Child Info */}
            <Card className="p-6 mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-purple-600">
                    {selectedChild.firstName?.charAt(0) || 'S'}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedChild.firstName} {selectedChild.lastName}
                  </h2>
                  <p className="text-gray-600">
                    Age: {selectedChild.age || 'N/A'} • Grade: {selectedChild.grade || 'N/A'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Progress Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Lessons Completed</p>
                    <p className="text-3xl font-bold">{progressData.overview.completedLessons}</p>
                    <p className="text-blue-100 text-xs">of {progressData.overview.totalLessons} total</p>
                  </div>
                  <BookOpenIcon className="h-8 w-8 text-blue-200" />
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Average Score</p>
                    <p className="text-3xl font-bold">{progressData.overview.averageGrade}%</p>
                  </div>
                  <TrophyIcon className="h-8 w-8 text-green-200" />
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Assignments</p>
                    <p className="text-3xl font-bold">{progressData.overview.completedAssignments}</p>
                    <p className="text-purple-100 text-xs">of {progressData.overview.totalAssignments} total</p>
                  </div>
                  <CheckCircleIcon className="h-8 w-8 text-purple-200" />
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Time Spent</p>
                    <p className="text-3xl font-bold">{progressData.overview.totalTimeSpent}h</p>
                  </div>
                  <ClockIcon className="h-8 w-8 text-orange-200" />
                </div>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Subject Progress */}
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">Subject Progress</h3>
                  
                  {progressData.subjects.length === 0 ? (
                    <div className="text-center py-8">
                      <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No subject data available yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {progressData.subjects.map((subject, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              {getSubjectIcon(subject.name)}
                              <div>
                                <h4 className="font-medium text-gray-800">{subject.name}</h4>
                                <p className="text-sm text-gray-600">
                                  {subject.completedLessons} of {subject.totalLessons} lessons
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-gray-800">{subject.progress}%</p>
                              {subject.averageScore > 0 && (
                                <p className="text-sm text-gray-600">Avg: {subject.averageScore}%</p>
                              )}
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${subject.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Recent Activity */}
                <Card className="p-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">Recent Activity</h3>
                  
                  {progressData.recentProgress.length === 0 ? (
                    <div className="text-center py-8">
                      <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No recent activity</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {progressData.recentProgress.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <div className={`w-3 h-3 rounded-full ${
                            item.type === 'lesson' ? 'bg-blue-500' : 'bg-orange-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{item.title}</p>
                            <p className="text-sm text-gray-600">
                              {item.type === 'lesson' ? 'Lesson' : 'Assignment'} • {formatDate(item.date)}
                            </p>
                          </div>
                          <div className="text-right">
                            {item.type === 'lesson' && item.score && (
                              <span className="text-sm font-medium text-green-600">{item.score}%</span>
                            )}
                            {item.type === 'assignment' && (
                              <span className={`text-sm font-medium ${
                                item.completed ? 'text-green-600' : 'text-orange-600'
                              }`}>
                                {item.completed ? 'Completed' : 'Pending'}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>

              {/* Achievements Sidebar */}
              <div>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">Achievements</h3>
                  
                  {progressData.achievements.length === 0 ? (
                    <div className="text-center py-8">
                      <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No achievements yet</p>
                      <p className="text-gray-400 text-xs mt-1">Keep learning to unlock achievements!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {progressData.achievements.map((achievement, index) => (
                        <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{achievement.icon}</span>
                            <div>
                              <h4 className="font-medium text-gray-800">{achievement.title}</h4>
                              <p className="text-sm text-gray-600">{achievement.description}</p>
                              <p className="text-xs text-gray-500 mt-1">{formatDate(achievement.date)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Quick Stats */}
                <Card className="p-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Learning Streak</span>
                      <span className="font-medium text-gray-800">
                        {selectedChild.recentProgress?.streak || 0} days 🔥
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Time Spent</span>
                      <span className="font-medium text-gray-800">
                        {selectedChild.recentProgress?.timeSpent || '0 hours'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Favorite Subject</span>
                      <span className="font-medium text-gray-800">
                        {progressData.subjects.length > 0 
                          ? progressData.subjects.reduce((prev, current) => 
                              (prev.progress > current.progress) ? prev : current
                            ).name
                          : 'N/A'
                        }
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ParentProgress;
