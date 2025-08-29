import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../hooks/useAuth';
import DashboardNavbar from '../../../components/ui/DashboardNavbar';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import {
  UserIcon,
  CameraIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  TrophyIcon,
  CalendarIcon,
  StarIcon,
  BookOpenIcon,
  ChartBarIcon,
  DocumentTextIcon,
  FireIcon
} from '@heroicons/react/24/outline';

const StudentProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    grade: '',
    bio: '',
    favoriteSubjects: [],
    learningGoals: []
  });
  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [stats, setStats] = useState({
    totalLessons: 0,
    completedLessons: 0,
    totalAssignments: 0,
    completedAssignments: 0,
    averageGrade: 0,
    streak: 0,
    joinDate: null,
    achievements: []
  });

  const subjects = ['Math', 'Science', 'English', 'History', 'Art', 'Music', 'Technology', 'Physical Education'];
  const goals = [
    'Improve math skills',
    'Read more books',
    'Learn coding',
    'Better at writing',
    'Understand science',
    'Learn history',
    'Practice art',
    'Play music'
  ];

  // Initialize profile from user data
  useEffect(() => {
    if (user) {
      const userProfile = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        age: user.age || '',
        grade: user.grade || '',
        bio: user.bio || 'I love learning new things!',
        favoriteSubjects: user.favoriteSubjects || ['Math', 'Science'],
        learningGoals: user.learningGoals || ['Improve math skills', 'Read more books']
      };
      setProfile(userProfile);
      setEditedProfile(userProfile);
    }
  }, [user]);

  const fetchStats = useCallback(async () => {
    try {
      // Generate mock stats
      const mockStats = {
        totalLessons: 45,
        completedLessons: 32,
        totalAssignments: 18,
        completedAssignments: 15,
        averageGrade: 87,
        streak: 8,
        joinDate: new Date('2024-09-01'),
        achievements: [
          { id: 1, title: 'First Steps', icon: '🎯', description: 'Completed first lesson' },
          { id: 2, title: 'Quick Learner', icon: '⚡', description: '7-day streak' },
          { id: 3, title: 'Math Star', icon: '🌟', description: '10 math lessons completed' },
          { id: 4, title: 'Perfect Score', icon: '💯', description: 'Got 100% on assignment' }
        ]
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile({ ...profile });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would update the profile via API
      // const response = await api.updateProfile(editedProfile);
      
      setProfile({ ...editedProfile });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSubject = (subject) => {
    setEditedProfile(prev => ({
      ...prev,
      favoriteSubjects: prev.favoriteSubjects.includes(subject)
        ? prev.favoriteSubjects.filter(s => s !== subject)
        : [...prev.favoriteSubjects, subject]
    }));
  };

  const toggleGoal = (goal) => {
    setEditedProfile(prev => ({
      ...prev,
      learningGoals: prev.learningGoals.includes(goal)
        ? prev.learningGoals.filter(g => g !== goal)
        : [...prev.learningGoals, goal]
    }));
  };

  const getSubjectEmoji = (subject) => {
    const emojis = {
      Math: '🔢',
      Science: '🔬',
      English: '📚',
      History: '🏛️',
      Art: '🎨',
      Music: '🎵',
      Technology: '💻',
      'Physical Education': '⚽'
    };
    return emojis[subject] || '📖';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar role="student" currentPage="Profile" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your profile and track your learning journey!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                {!isEditing ? (
                  <Button
                    onClick={handleEdit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm flex items-center gap-2"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm flex items-center gap-2"
                    >
                      <CheckIcon className="h-4 w-4" />
                      Save
                    </Button>
                    <Button
                      onClick={handleCancel}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 text-sm flex items-center gap-2"
                    >
                      <XMarkIcon className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              {/* Profile Picture */}
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <UserIcon className="h-12 w-12 text-white" />
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700">
                      <CameraIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="text-gray-600">Grade {profile.grade} Student</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="py-2 text-gray-900">{profile.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="py-2 text-gray-900">{profile.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedProfile.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="py-2 text-gray-900">{profile.age} years old</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                  {isEditing ? (
                    <select
                      value={editedProfile.grade}
                      onChange={(e) => handleInputChange('grade', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(grade => (
                        <option key={grade} value={grade}>Grade {grade}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="py-2 text-gray-900">Grade {profile.grade}</p>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">About Me</label>
                {isEditing ? (
                  <textarea
                    value={editedProfile.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="py-2 text-gray-900">{profile.bio}</p>
                )}
              </div>
            </Card>

            {/* Favorite Subjects */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Favorite Subjects</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {subjects.map(subject => (
                  <button
                    key={subject}
                    onClick={() => isEditing && toggleSubject(subject)}
                    disabled={!isEditing}
                    className={`p-3 rounded-lg border-2 text-center transition-colors ${
                      (isEditing ? editedProfile.favoriteSubjects : profile.favoriteSubjects).includes(subject)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    } ${!isEditing ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <div className="text-2xl mb-1">{getSubjectEmoji(subject)}</div>
                    <div className="text-sm font-medium">{subject}</div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Learning Goals */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Goals</h3>
              <div className="space-y-2">
                {goals.map(goal => (
                  <label
                    key={goal}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 ${
                      (isEditing ? editedProfile.learningGoals : profile.learningGoals).includes(goal)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={(isEditing ? editedProfile.learningGoals : profile.learningGoals).includes(goal)}
                      onChange={() => isEditing && toggleGoal(goal)}
                      disabled={!isEditing}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{goal}</span>
                  </label>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Stats & Achievements */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ChartBarIcon className="h-5 w-5 text-blue-600" />
                Learning Stats
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpenIcon className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Lessons</span>
                  </div>
                  <span className="font-medium">{stats.completedLessons}/{stats.totalLessons}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DocumentTextIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Assignments</span>
                  </div>
                  <span className="font-medium">{stats.completedAssignments}/{stats.totalAssignments}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StarIcon className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-gray-600">Average Grade</span>
                  </div>
                  <span className="font-medium">{stats.averageGrade}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FireIcon className="h-4 w-4 text-orange-600" />
                    <span className="text-sm text-gray-600">Streak</span>
                  </div>
                  <span className="font-medium">{stats.streak} days</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Member since</span>
                  </div>
                  <span className="font-medium">
                    {stats.joinDate && stats.joinDate.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>

            {/* Achievements */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrophyIcon className="h-5 w-5 text-yellow-600" />
                Achievements
              </h3>
              
              <div className="space-y-3">
                {stats.achievements.map(achievement => (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
