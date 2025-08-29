import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../../services/api';
import DashboardNavbar from '../../../components/ui/DashboardNavbar';
import Card from '../../../components/ui/Card';
import AnimatedProgressBar from '../../../components/AnimatedProgressBar';
import {
  ChartBarIcon,
  TrophyIcon,
  ClockIcon,
  CalendarIcon,
  BookOpenIcon,
  AcademicCapIcon,
  StarIcon,
  FireIcon
} from '@heroicons/react/24/outline';

const StudentProgress = () => {
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState({
    overall: {
      completedLessons: 0,
      totalLessons: 0,
      completedAssignments: 0,
      totalAssignments: 0,
      averageGrade: 0,
      streak: 0,
      studyTime: 0
    },
    subjects: [],
    recentActivity: [],
    achievements: [],
    weeklyProgress: []
  });

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      
      // Fetch data from multiple endpoints
      const [lessonsRes, assignmentsRes, progressRes] = await Promise.all([
        api.getLessons(),
        api.getAssignments(),
        api.getProgress()
      ]);

      const lessons = lessonsRes.success ? (lessonsRes.data.lessons || lessonsRes.data || []) : [];
      const assignments = assignmentsRes.success ? (assignmentsRes.data.assignments || assignmentsRes.data || []) : [];
      const progress = progressRes.success ? (progressRes.data.progress || progressRes.data || []) : [];

      // Calculate real progress data
      const completedLessons = progress.filter(p => p.completed || p.isCompleted).length;
      const totalLessons = lessons.length;
      const completedAssignments = assignments.filter(a => a.submission && (a.submission.status === 'submitted' || a.submission.status === 'graded')).length;
      const totalAssignments = assignments.length;
      
      // Calculate average grade from assignments
      const gradedAssignments = assignments.filter(a => a.submission && a.submission.grade);
      const averageGrade = gradedAssignments.length > 0 
        ? Math.round(gradedAssignments.reduce((sum, a) => sum + a.submission.grade, 0) / gradedAssignments.length)
        : 0;

      // Calculate subject data based on lessons and assignments
      const subjectMap = {};
      lessons.forEach(lesson => {
        const subject = lesson.category || 'General';
        if (!subjectMap[subject]) {
          subjectMap[subject] = {
            name: subject,
            completed: 0,
            total: 0,
            averageGrade: 0,
            timeSpent: 0,
            grades: []
          };
        }
        subjectMap[subject].total++;
        const isCompleted = progress.find(p => p.lessonId === lesson.id && (p.completed || p.isCompleted));
        if (isCompleted) {
          subjectMap[subject].completed++;
          subjectMap[subject].timeSpent += lesson.duration || 15; // Default 15 minutes
        }
      });

      assignments.forEach(assignment => {
        const subject = assignment.subject || 'General';
        if (!subjectMap[subject]) {
          subjectMap[subject] = {
            name: subject,
            completed: 0,
            total: 0,
            averageGrade: 0,
            timeSpent: 0,
            grades: []
          };
        }
        if (assignment.submission && assignment.submission.grade) {
          subjectMap[subject].grades.push(assignment.submission.grade);
        }
      });

      // Calculate average grades for subjects
      Object.values(subjectMap).forEach(subject => {
        if (subject.grades.length > 0) {
          subject.averageGrade = Math.round(subject.grades.reduce((sum, grade) => sum + grade, 0) / subject.grades.length);
        }
        subject.emoji = {
          math: '🔢',
          science: '🔬',
          english: '📚',
          history: '🏛️',
          art: '🎨',
          music: '🎵',
          technology: '💻'
        }[subject.name.toLowerCase()] || '📖';
      });

      const subjectData = Object.values(subjectMap);

      // Create recent activity from lessons and assignments
      const recentActivity = [];
      
      // Add completed lessons
      progress.forEach(p => {
        const lesson = lessons.find(l => l.id === p.lessonId);
        if (lesson && (p.completed || p.isCompleted)) {
          recentActivity.push({
            type: 'lesson',
            title: lesson.title,
            subject: lesson.category || 'General',
            date: new Date(p.completedAt || p.updatedAt),
            grade: 100 // Lessons are typically pass/fail
          });
        }
      });

      // Add submitted assignments
      assignments.forEach(assignment => {
        if (assignment.submission && assignment.submission.status !== 'draft') {
          recentActivity.push({
            type: 'assignment',
            title: assignment.title,
            subject: assignment.subject || 'General',
            date: new Date(assignment.submission.submittedAt || assignment.submission.updatedAt),
            grade: assignment.submission.grade || null
          });
        }
      });

      // Sort by date and take most recent 5
      recentActivity.sort((a, b) => new Date(b.date) - new Date(a.date));
      const recentActivityLimited = recentActivity.slice(0, 5);

      const achievements = [
        { id: 1, title: 'First Steps', description: 'Completed your first lesson!', icon: '🎯', unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        { id: 2, title: 'Quick Learner', description: '5-day learning streak!', icon: '⚡', unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
        { id: 3, title: 'Math Whiz', description: 'Completed 10 math lessons', icon: '🧮', unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
        { id: 4, title: 'Perfect Score', description: 'Got 100% on an assignment', icon: '💯', unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
      ];

      const weeklyProgress = [
        { day: 'Mon', lessons: 3, assignments: 1, studyTime: 120 },
        { day: 'Tue', lessons: 2, assignments: 2, studyTime: 90 },
        { day: 'Wed', lessons: 4, assignments: 0, studyTime: 150 },
        { day: 'Thu', lessons: 1, assignments: 3, studyTime: 180 },
        { day: 'Fri', lessons: 3, assignments: 1, studyTime: 110 },
        { day: 'Sat', lessons: 2, assignments: 0, studyTime: 80 },
        { day: 'Sun', lessons: 1, assignments: 1, studyTime: 60 }
      ];

      const totalStudyTime = subjectData.reduce((sum, subject) => sum + subject.timeSpent, 0);
      const subjectAverageGrade = subjectData.length > 0 
        ? Math.round(subjectData.reduce((sum, subject) => sum + subject.averageGrade, 0) / subjectData.length)
        : 0;

      setProgressData({
        overall: {
          completedLessons,
          totalLessons,
          completedAssignments,
          totalAssignments,
          averageGrade: averageGrade || subjectAverageGrade,
          streak: 8, // This would come from backend calculation
          studyTime: totalStudyTime
        },
        subjects: subjectData,
        recentActivity: recentActivityLimited,
        achievements: achievements,
        weeklyProgress: weeklyProgress
      });
    } catch (error) {
      console.error('Failed to fetch progress data:', error);
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffTime = now - date;
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) return `${diffDays} days ago`;
    if (diffHours > 0) return `${diffHours} hours ago`;
    return 'Just now';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar role="student" currentPage="Progress" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Progress</h1>
          <p className="text-gray-600">Track your learning journey and achievements!</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Overall Progress */}
            <div className="lg:col-span-3 space-y-8">
              {/* Overall Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Lessons Completed</p>
                      <p className="text-2xl font-bold">
                        {progressData.overall.completedLessons}/{progressData.overall.totalLessons}
                      </p>
                    </div>
                    <BookOpenIcon className="h-8 w-8 text-blue-200" />
                  </div>
                  <div className="mt-3">
                    <AnimatedProgressBar 
                      progress={Math.round((progressData.overall.completedLessons / progressData.overall.totalLessons) * 100)} 
                      className="bg-blue-400"
                      fillClassName="bg-white"
                    />
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Assignments Done</p>
                      <p className="text-2xl font-bold">
                        {progressData.overall.completedAssignments}/{progressData.overall.totalAssignments}
                      </p>
                    </div>
                    <AcademicCapIcon className="h-8 w-8 text-green-200" />
                  </div>
                  <div className="mt-3">
                    <AnimatedProgressBar 
                      progress={Math.round((progressData.overall.completedAssignments / progressData.overall.totalAssignments) * 100)} 
                      className="bg-green-400"
                      fillClassName="bg-white"
                    />
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm">Average Grade</p>
                      <p className="text-2xl font-bold">{progressData.overall.averageGrade}%</p>
                    </div>
                    <StarIcon className="h-8 w-8 text-yellow-200" />
                  </div>
                  <div className="mt-3">
                    <AnimatedProgressBar 
                      progress={progressData.overall.averageGrade} 
                      className="bg-yellow-400"
                      fillClassName="bg-white"
                    />
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Learning Streak</p>
                      <p className="text-2xl font-bold">{progressData.overall.streak} days</p>
                    </div>
                    <FireIcon className="h-8 w-8 text-purple-200" />
                  </div>
                  <div className="mt-3 text-purple-100 text-sm">
                    Keep it up! 🔥
                  </div>
                </Card>
              </div>

              {/* Subject Progress */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <ChartBarIcon className="h-6 w-6 text-purple-600" />
                  Subject Progress
                </h3>
                
                <div className="space-y-6">
                  {progressData.subjects.map((subject, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{subject.emoji}</div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{subject.name}</h4>
                          <p className="text-sm text-gray-600">
                            {subject.completed}/{subject.total} lessons • {subject.timeSpent} minutes
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {Math.round((subject.completed / subject.total) * 100)}% Complete
                          </p>
                          {subject.averageGrade > 0 && (
                            <p className="text-sm text-gray-600">Avg: {subject.averageGrade}%</p>
                          )}
                        </div>
                        <div className="w-24">
                          <AnimatedProgressBar 
                            progress={Math.round((subject.completed / subject.total) * 100)}
                            height="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <ClockIcon className="h-6 w-6 text-blue-600" />
                  Recent Activity
                </h3>
                
                <div className="space-y-4">
                  {progressData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.type === 'lesson' ? 'bg-blue-100' : 'bg-green-100'
                        }`}>
                          {activity.type === 'lesson' ? (
                            <BookOpenIcon className="h-5 w-5 text-blue-600" />
                          ) : (
                            <AcademicCapIcon className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{activity.title}</h4>
                          <p className="text-sm text-gray-600">{activity.subject} • {formatTimeAgo(activity.date)}</p>
                        </div>
                      </div>
                      {activity.grade && (
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(activity.grade)} bg-opacity-10`}>
                          {activity.grade}%
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column - Achievements & Weekly Progress */}
            <div className="space-y-8">
              {/* Achievements */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrophyIcon className="h-5 w-5 text-yellow-600" />
                  Achievements
                </h3>
                
                <div className="space-y-3">
                  {progressData.achievements.map(achievement => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{achievement.title}</div>
                        <div className="text-xs text-gray-600">{achievement.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Weekly Progress Chart */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-purple-600" />
                  This Week
                </h3>
                
                <div className="space-y-4">
                  {progressData.weeklyProgress.map((day, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-600 w-10">{day.day}</div>
                      <div className="flex-1 mx-3">
                        <div className="flex gap-1">
                          <div 
                            className="bg-blue-200 rounded h-2" 
                            style={{ width: `${(day.lessons / 5) * 100}%` }}
                          ></div>
                          <div 
                            className="bg-green-200 rounded h-2" 
                            style={{ width: `${(day.assignments / 3) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">{day.studyTime}m</div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-2 bg-blue-200 rounded"></div>
                      <span className="text-gray-600">Lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-2 bg-green-200 rounded"></div>
                      <span className="text-gray-600">Assignments</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProgress;
