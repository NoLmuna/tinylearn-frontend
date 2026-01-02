import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, ArrowRight, CheckCircle2, Clock, Award, User, ChevronLeft, ChevronRight } from 'lucide-react';
import logo from '../../assets/levelup-logo.png';
import { useStudentLessonById, useMarkChapterAsSeen } from '../../hooks/studentHooks';

/**
 * Student Lesson View Page
 * Displays lesson content with chapter pagination
 */
function SpecLesson() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [hasMarkedFirstChapter, setHasMarkedFirstChapter] = useState(false);
  
  // Fetch lesson data
  const { data: lessonData, isLoading } = useStudentLessonById(id);
  const lesson = lessonData?.data || {};
  const chapters = lesson.content || [];
  const markChapterAsSeen = useMarkChapterAsSeen();

  // Mark first chapter as seen when lesson loads (if not already seen)
  useEffect(() => {
    if (chapters.length > 0 && !hasMarkedFirstChapter && id && currentChapterIndex === 0) {
      const firstChapter = chapters[0];
      if (firstChapter && !firstChapter.isSeen) {
        markChapterAsSeen.mutate({
          lessonId: id,
          chapterIndex: 0
        });
        setHasMarkedFirstChapter(true);
      } else if (firstChapter && firstChapter.isSeen) {
        // Already seen, just mark as processed
        setHasMarkedFirstChapter(true);
      }
    }
  }, [chapters, id, hasMarkedFirstChapter, currentChapterIndex, markChapterAsSeen]);

  const handleNext = () => {
    if (currentChapterIndex < chapters.length - 1) {
      const nextIndex = currentChapterIndex + 1;
      setCurrentChapterIndex(nextIndex);
      
      // Mark next chapter as seen when navigating to it
      if (chapters[nextIndex] && !chapters[nextIndex].isSeen && id) {
        markChapterAsSeen.mutate({
          lessonId: id,
          chapterIndex: nextIndex
        });
      }
      
      // Scroll to top of content
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
      // Scroll to top of content
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleChapterClick = (index) => {
    setCurrentChapterIndex(index);
    
    // Mark clicked chapter as seen if not already seen
    if (chapters[index] && !chapters[index].isSeen && id) {
      markChapterAsSeen.mutate({
        lessonId: id,
        chapterIndex: index
      });
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      math: '🔢',
      reading: '📚',
      science: '🔬',
      art: '🎨',
      music: '🎵',
      physical: '⚽',
      social: '🌍',
    };
    return icons[category] || '📖';
  };

  const getCategoryColor = (category) => {
    const colors = {
      math: 'bg-blue-500',
      reading: 'bg-green-500',
      science: 'bg-purple-500',
      art: 'bg-pink-500',
      music: 'bg-yellow-500',
      physical: 'bg-orange-500',
      social: 'bg-indigo-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  const completedChapters = chapters.filter(ch => ch.isSeen === true).length;
  const progress = chapters.length > 0 ? Math.round(((currentChapterIndex + 1) / chapters.length) * 100) : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-[#F4C21A] rounded-2xl flex items-center justify-center animate-pulse">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <div className="text-2xl text-gray-600 font-semibold">Loading lesson...</div>
          <p className="text-gray-500 mt-2">Getting ready for you!</p>
        </div>
      </div>
    );
  }

  if (!lesson || !lesson._id || chapters.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Lesson not found</h3>
            <p className="text-gray-600 mb-6">This lesson doesn't exist or has no chapters yet.</p>
            <button
              onClick={() => navigate('/student/dashboard')}
              className="bg-[#F4C21A] hover:bg-[#d4a617] text-black font-bold py-3 px-6 rounded-xl transition-all shadow-md"
            >
              <ArrowLeft className="w-4 h-4 inline mr-2" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentChapter = chapters[currentChapterIndex];
  const teacherName = lesson.teacherId && typeof lesson.teacherId === 'object'
    ? `${lesson.teacherId.firstName} ${lesson.teacherId.lastName}`
    : 'Your Teacher';

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50 border-b-4 border-[#F4C21A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/student/dashboard" className="flex items-center gap-3 group">
              <img 
                src={logo}
                alt="TinyLearn" 
                className="h-14 w-14 object-contain transition-transform group-hover:scale-110"
              />
              <span className="text-2xl font-black text-gray-900">TinyLearn</span>
            </Link>
            <button
              onClick={() => navigate('/student/dashboard')}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-md"
            >
              <ArrowLeft className="w-4 h-4 inline mr-2" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Lesson Header */}
        <div className="bg-gradient-to-r from-[#F4C21A] to-[#FFD700] rounded-3xl shadow-2xl p-8 mb-8">
          <div className="flex items-start gap-6">
            {lesson.imageUrl ? (
              <img 
                src={lesson.imageUrl} 
                alt={lesson.title}
                className="w-32 h-32 rounded-2xl object-cover shadow-lg"
              />
            ) : (
              <div className={`w-32 h-32 ${getCategoryColor(lesson.category)} rounded-2xl flex items-center justify-center text-6xl shadow-lg`}>
                {getCategoryIcon(lesson.category)}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-black text-gray-900 mb-2">{lesson.title}</h1>
              {lesson.description && (
                <p className="text-lg text-gray-800 font-semibold mb-4">{lesson.description}</p>
              )}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white/90 rounded-full text-sm font-bold text-gray-900 capitalize">
                  {lesson.category}
                </span>
                <span className="px-3 py-1 bg-white/90 rounded-full text-sm font-bold text-gray-900 capitalize">
                  {lesson.difficulty}
                </span>
                <span className="px-3 py-1 bg-white/90 rounded-full text-sm font-bold text-gray-900">
                  {lesson.ageGroup}
                </span>
                {lesson.duration && (
                  <span className="px-3 py-1 bg-white/90 rounded-full text-sm font-bold text-gray-900 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {lesson.duration} min
                  </span>
                )}
              </div>
              <p className="mt-3 text-gray-800 font-medium">
                <User className="w-4 h-4 inline mr-1" />
                By {teacherName}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900">Your Progress</h3>
            <span className="text-sm font-bold text-gray-700">
              Chapter {currentChapterIndex + 1} of {chapters.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div
              className={`${getCategoryColor(lesson.category)} h-4 rounded-full transition-all duration-500`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            {completedChapters} of {chapters.length} chapters completed
          </p>
        </div>

        {/* Chapter Navigation (Sidebar) */}
        {chapters.length > 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Chapters</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {chapters.map((chapter, index) => (
                <button
                  key={index}
                  onClick={() => handleChapterClick(index)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl font-bold transition-all ${
                    index === currentChapterIndex
                      ? 'bg-[#F4C21A] text-black shadow-md'
                      : chapter.isSeen
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {chapter.isSeen && index !== currentChapterIndex && (
                    <CheckCircle2 className="w-4 h-4 inline mr-1" />
                  )}
                  Chapter {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Current Chapter Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white mb-1">
                  {currentChapter.chapter}
                </h2>
                <p className="text-indigo-100">
                  Chapter {currentChapterIndex + 1} of {chapters.length}
                </p>
              </div>
              {currentChapter.isSeen && (
                <div className="bg-white/20 rounded-full p-3">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
          </div>

          <div className="p-8">
            {currentChapter.chapterContent ? (
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                  {currentChapter.chapterContent}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No content available for this chapter yet.</p>
              </div>
            )}

            {/* Video if available and on first chapter */}
            {lesson.videoUrl && currentChapterIndex === 0 && (
              <div className="mt-8 rounded-xl overflow-hidden">
                <div className="aspect-video bg-gray-100">
                  <iframe
                    src={lesson.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={lesson.title}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentChapterIndex === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-md ${
              currentChapterIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous Chapter
          </button>

          <div className="flex items-center gap-2">
            {chapters.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentChapterIndex
                    ? 'bg-[#F4C21A] w-8'
                    : index < currentChapterIndex
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {currentChapterIndex < chapters.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-[#F4C21A] hover:bg-[#d4a617] text-black rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
            >
              Next Chapter
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => navigate('/student/dashboard')}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
            >
              <Award className="w-5 h-5" />
              Complete Lesson!
            </button>
          )}
        </div>

        {/* Encouragement Section */}
        {currentChapterIndex === chapters.length - 1 && (
          <div className="mt-8 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl shadow-xl p-8 text-center">
            <Award className="w-16 h-16 mx-auto text-white mb-4" />
            <h3 className="text-2xl font-black text-white mb-2">Amazing work! 🎉</h3>
            <p className="text-lg text-white font-semibold">
              You've completed all chapters! You're a super learner! 🌟
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SpecLesson;

