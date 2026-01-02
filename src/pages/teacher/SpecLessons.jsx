import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ArrowLeft, BookOpen, Calendar, Clock, User, Award, Eye, Video, Image as ImageIcon, TrendingUp, Bell, LogOut, Users, MessageCircle, AlertCircle } from 'lucide-react';
import logo from '../../assets/levelup-logo.png';
import { useLessonById } from '../../hooks/teacherHooks';

/**
 * Specific Lesson View Page
 * Allows teachers to view lesson details
 */
function SpecLessons() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Fetch lesson data
  const { data: lessonData, isLoading } = useLessonById(id);
  const lesson = lessonData?.data || {};

  const teacherUser = { name: 'Sarah Johnson', subject: 'Mathematics' };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getCategoryColor = (category) => {
    const colors = {
      math: 'bg-blue-100 text-blue-700',
      reading: 'bg-green-100 text-green-700',
      science: 'bg-purple-100 text-purple-700',
      art: 'bg-pink-100 text-pink-700',
      music: 'bg-yellow-100 text-yellow-700',
      physical: 'bg-orange-100 text-orange-700',
      social: 'bg-indigo-100 text-indigo-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'bg-green-100 text-green-700',
      intermediate: 'bg-yellow-100 text-yellow-700',
      advanced: 'bg-red-100 text-red-700',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Card className="border-none shadow-lg">
            <CardContent className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-indigo-50 rounded-2xl flex items-center justify-center animate-pulse">
                <BookOpen className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Loading lesson...</h3>
              <p className="text-gray-600">Please wait while we fetch the data</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!lesson || !lesson._id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Card className="border-none shadow-lg">
            <CardContent className="text-center py-16">
              <AlertCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lesson not found</h3>
              <p className="text-gray-600 mb-6">The lesson you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => navigate('/teacher/materials')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Materials
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/teacher/dashboard" className="flex items-center gap-3">
                <img src={logo} alt="TinyLearn" className="h-10 w-10 object-contain" />
                <div className="hidden sm:block">
                  <h1 className="text-xl font-black text-gray-900">Teacher Portal</h1>
                  <p className="text-xs text-indigo-600 font-semibold">{teacherUser.subject}</p>
                </div>
              </Link>

              <div className="hidden md:flex items-center gap-1">
                <Link
                  to="/teacher/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
                >
                  <TrendingUp className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/teacher/users"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
                >
                  <Users className="w-4 h-4" />
                  Users
                </Link>
                <Link
                  to="/teacher/materials"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-50 text-indigo-600 transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  Learning Materials
                </Link>
                <Link
                  to="/teacher/messages"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Messages
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">3</span>
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  {teacherUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">{teacherUser.name}</p>
                  <p className="text-xs text-gray-500">Teacher</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Button
          onClick={() => navigate('/teacher/materials')}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Materials
        </Button>

        {/* Lesson Header */}
        <Card className="border-none shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Lesson Image */}
              {lesson.imageUrl ? (
                <div className="w-full md:w-64 h-48 md:h-64 rounded-xl overflow-hidden">
                  <img
                    src={lesson.imageUrl}
                    alt={lesson.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full md:w-64 h-48 md:h-64 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center">
                  <BookOpen className="w-20 h-20 text-indigo-400" />
                </div>
              )}

              {/* Lesson Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">{lesson.title}</h1>
                    {lesson.description && (
                      <p className="text-gray-600 text-lg mb-4">{lesson.description}</p>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getCategoryColor(lesson.category)}`}>
                    {lesson.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getDifficultyColor(lesson.difficulty)}`}>
                    {lesson.difficulty}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
                    {lesson.ageGroup}
                  </span>
                  {lesson.duration && (
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {lesson.duration} min
                    </span>
                  )}
                  {lesson.isActive === false && (
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-700">
                      Archived
                    </span>
                  )}
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {lesson.createdAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Created {new Date(lesson.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  {lesson.updatedAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Updated {new Date(lesson.updatedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  {lesson.teacherId && typeof lesson.teacherId === 'object' && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>By {lesson.teacherId.firstName} {lesson.teacherId.lastName}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Section */}
        {lesson.videoUrl && (
          <Card className="border-none shadow-lg mb-6">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl font-black flex items-center gap-2">
                <Video className="w-5 h-5" />
                Video Content
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                <iframe
                  src={lesson.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={lesson.title}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chapters Section */}
        {lesson.content && lesson.content.length > 0 && (
          <Card className="border-none shadow-lg">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl font-black flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Chapters ({lesson.content.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {lesson.content.map((chapter, index) => (
                  <div key={index} className="border-2 border-gray-200 rounded-xl p-5 hover:border-indigo-200 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-600 font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-2 text-lg">{chapter.chapter}</h3>
                        {chapter.chapterContent && (
                          <p className="text-gray-600 whitespace-pre-wrap">{chapter.chapterContent}</p>
                        )}
                        {chapter.isSeen && (
                          <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                            <Eye className="w-4 h-4" />
                            <span>Viewed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State for Chapters */}
        {(!lesson.content || lesson.content.length === 0) && (
          <Card className="border-none shadow-lg">
            <CardContent className="text-center py-16">
              <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No chapters available</h3>
              <p className="text-gray-600">This lesson doesn't have any chapters yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default SpecLessons;

