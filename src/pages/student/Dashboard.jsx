/* eslint-disable */
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "../../contexts/adminContext";
import {
  BookOpen,
  FileCheck,
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calculator,
  Book,
  FlaskConical,
  Palette,
  Music,
  Activity,
  Globe,
  FileText,
  ClipboardList,
  PenTool,
} from "lucide-react";
import logo from "../../assets/levelup-logo.png";
import {
  useStudentLessons,
  useStudentAssignments,
} from "../../hooks/studentHooks";

/**
 * Student Dashboard Component
 * Simple, child-friendly dashboard focused on Lessons and Assignments
 */
function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "Alex",
    email: "student@example.com",
  });

  // Fetch lessons and assignments from API
  const { data: lessonsData, isLoading: isLoadingLessons } =
    useStudentLessons();
  const { data: assignmentsData, isLoading: isLoadingAssignments } =
    useStudentAssignments();
  const rawLessons = lessonsData?.data?.lessons || [];
  const rawAssignments = assignmentsData?.data?.assignments || [];

  // Transform lessons for display
  const getCategoryIcon = (category) => {
    const icons = {
      math: <Calculator className="w-6 h-6" />,
      reading: <Book className="w-6 h-6" />,
      science: <FlaskConical className="w-6 h-6" />,
      art: <Palette className="w-6 h-6" />,
      music: <Music className="w-6 h-6" />,
      physical: <Activity className="w-6 h-6" />,
      social: <Globe className="w-6 h-6" />,
    };
    return icons[category] || <BookOpen className="w-6 h-6" />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      math: "bg-blue-500",
      reading: "bg-green-500",
      science: "bg-purple-500",
      art: "bg-pink-500",
      music: "bg-yellow-500",
      physical: "bg-orange-500",
      social: "bg-indigo-500",
    };
    return colors[category] || "bg-gray-500";
  };

  const lessons = rawLessons.map((lesson) => {
    const chapters = lesson.content || [];
    const completedChapters = chapters.filter(
      (ch) => ch.isSeen === true,
    ).length;
    const totalChapters = chapters.length;
    const progress =
      totalChapters > 0
        ? Math.round((completedChapters / totalChapters) * 100)
        : 0;

    const teacherName =
      lesson.teacherId && typeof lesson.teacherId === "object"
        ? `${lesson.teacherId.firstName} ${lesson.teacherId.lastName}`
        : "Teacher";

    return {
      id: lesson._id || lesson.id,
      title: lesson.title,
      teacher: teacherName,
      progress: progress,
      icon: getCategoryIcon(lesson.category),
      color: getCategoryColor(lesson.category),
      lessons: totalChapters,
      completed: completedChapters,
      category: lesson.category,
      difficulty: lesson.difficulty,
      ageGroup: lesson.ageGroup,
      _raw: lesson,
    };
  });

  // Transform assignments for display
  const getAssignmentIcon = (type) => {
    const icons = {
      homework: <FileText className="w-6 h-6" />,
      quiz: <ClipboardList className="w-6 h-6" />,
      project: <Palette className="w-6 h-6" />,
      reading: <Book className="w-6 h-6" />,
      practice: <PenTool className="w-6 h-6" />,
    };
    return icons[type] || <FileText className="w-6 h-6" />;
  };

  const formatDueDate = (dueDate, isOverdue) => {
    if (!dueDate) return "No due date";
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (isOverdue) return "Overdue";
    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays <= 7) return `In ${diffDays} days`;
    return date.toLocaleDateString();
  };

  const assignments = rawAssignments.map((assignment) => {
    const assignmentId = assignment._id || assignment.id;
    const submission = assignment.submission;
    const isOverdue = assignment.isOverdue || false;
    const dueDate = formatDueDate(assignment.dueDate, isOverdue);
    const status = submission?.status || "pending";
    const isCompleted = status === "graded" || status === "submitted";
    const lessonTitle = assignment.lessonId?.title || "No lesson linked";

    return {
      id: assignmentId,
      title: assignment.title,
      subject: lessonTitle,
      dueDate: dueDate,
      status: isCompleted ? "completed" : "pending",
      icon: getAssignmentIcon(assignment.assignmentType),
      urgent:
        isOverdue ||
        (assignment.daysUntilDue !== undefined &&
          assignment.daysUntilDue <= 1 &&
          assignment.daysUntilDue >= 0),
      _raw: assignment,
      submission: submission,
    };
  });

  const { logout } = useAdmin();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (isLoadingLessons || isLoadingAssignments) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="text-center bg-white/80 p-10 rounded-[3rem] shadow-xl backdrop-blur-sm">
          <div className="w-24 h-24 mx-auto mb-6 bg-[#F4C21A] rounded-full flex items-center justify-center animate-bounce shadow-lg border-4 border-white">
            <BookOpen className="w-12 h-12 text-white" />
          </div>
          <div className="text-3xl text-indigo-700 font-semibold tracking-wide">
            Loading your adventure...
          </div>
          <p className="text-indigo-500 mt-3 font-semibold text-lg">
            Getting your lessons ready! ✨
          </p>
        </div>
      </div>
    );
  }

  const pendingAssignments = assignments.filter(
    (a) => a.status === "pending",
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b-6 border-[#F4C21A] rounded-b-3xl mx-2 mt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="p-2 bg-yellow-100 rounded-2xl group-hover:rotate-12 transition-transform">
                <img
                  src={logo}
                  alt="TinyLearn"
                  className="h-14 w-14 object-contain"
                />
              </div>
              <span className="text-3xl font-semibold text-indigo-900 tracking-tight">
                Tiny<span className="text-[#F4C21A]">Learn</span>
              </span>
            </Link>
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block bg-indigo-50 px-4 py-2 rounded-2xl border-2 border-indigo-100">
                <p className="text-sm text-indigo-600 font-bold">
                  Ready to learn? 🚀
                </p>
                <p className="text-xl font-semibold text-indigo-900">
                  {user?.name}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-indigo-500/50"
              >
                Logout 👋
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#F4C21A] via-[#FFD700] to-[#FFA500] rounded-[3rem] shadow-2xl p-10 text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <h1 className="text-5xl sm:text-6xl font-semibold text-indigo-900 mb-4 drop-shadow-sm">
            Hi {user?.name}! 🌟
          </h1>
          <p className="text-2xl text-indigo-800 font-bold drop-shadow-sm">
            Let's learn something awesome today!
          </p>
          {pendingAssignments > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full shadow-md">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <span className="font-bold text-gray-900">
                You have {pendingAssignments} assignment
                {pendingAssignments > 1 ? "s" : ""} to complete
              </span>
            </div>
          )}
        </div>

        {/* My Lessons Section */}
        <div className="mb-10">
          <div className="flex items-center justify-center sm:justify-start gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center shadow-xl transform -rotate-6">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-semibold text-indigo-900 tracking-tight">
              My Lessons 📚
            </h2>
          </div>

          {lessons.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-[3rem] shadow-xl p-12 text-center border-4 border-dashed border-indigo-200">
              <BookOpen className="w-20 h-20 mx-auto text-indigo-300 mb-4 animate-bounce" />
              <h3 className="text-2xl font-semibold text-indigo-900 mb-2">
                No lessons right now!
              </h3>
              <p className="text-lg text-indigo-600 font-semibold">
                Your teacher hasn't assigned any lessons yet. Time to play! 🎈
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="bg-white rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-4 border-white hover:border-[#F4C21A] cursor-pointer group hover:-translate-y-2"
                >
                  <div className="p-8">
                    <div className="flex items-start gap-6 mb-6">
                      <div
                        className={`w-20 h-20 ${lesson.color} rounded-[1.5rem] flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                      >
                        {lesson.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold text-indigo-900 mb-2 line-clamp-2 leading-tight">
                          {lesson.title}
                        </h3>
                        <p className="text-md text-indigo-500 font-bold mb-3">
                          🧑‍🏫 {lesson.teacher}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          <span className="text-sm font-bold px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full capitalize border-2 border-indigo-200">
                            {lesson.category}
                          </span>
                          <span className="text-sm font-bold px-3 py-1 bg-pink-100 text-pink-700 rounded-full capitalize border-2 border-pink-200">
                            {lesson.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 bg-indigo-50 p-5 rounded-3xl">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-bold text-indigo-700">
                          Your Progress
                        </span>
                        <span className="font-semibold text-indigo-900 bg-white px-3 py-1 rounded-full shadow-sm">
                          {lesson.completed} / {lesson.lessons}
                        </span>
                      </div>
                      <div className="w-full bg-white rounded-full h-4 shadow-inner overflow-hidden border-2 border-indigo-100">
                        <div
                          className={`h-full ${lesson.color} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                          style={{ width: `${lesson.progress}%` }}
                        >
                          <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20"></div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        navigate(`/student/lessons/${lesson.id}`);
                      }}
                      className="mt-6 w-full bg-[#F4C21A] hover:bg-[#FFD700] active:scale-95 text-indigo-900 font-semibold py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-xl text-xl border-b-4 border-yellow-600 active:border-b-0 active:mt-7 flex justify-center items-center gap-2"
                    >
                      {lesson.progress > 0
                        ? "Keep Going! 🚀"
                        : "Let's Start! ⭐"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Assignments Section */}
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl transform rotate-6">
              <FileCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-semibold text-indigo-900 tracking-tight">
              My Quests 🏆
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {assignments.length === 0 && (
              <div className="md:col-span-2 bg-white/80 backdrop-blur-sm rounded-[3rem] shadow-xl p-12 text-center border-4 border-dashed border-emerald-200">
                <FileCheck className="w-20 h-20 mx-auto text-emerald-300 mb-4 animate-bounce" />
                <h3 className="text-2xl font-semibold text-emerald-900 mb-2">
                  No active quests!
                </h3>
                <p className="text-lg text-emerald-600 font-semibold">
                  You're all caught up. Great job! 🎉
                </p>
              </div>
            )}
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className={`bg-white rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-300 border-4 border-white ${
                  assignment.status === "completed"
                    ? "hover:border-green-400 bg-gradient-to-b from-green-50 to-white"
                    : assignment.urgent
                      ? "hover:border-red-400 bg-gradient-to-b from-red-50 to-white hover:-translate-y-2 animate-pulse hover:animate-none"
                      : "hover:border-[#F4C21A] hover:-translate-y-2"
                } cursor-pointer overflow-hidden group`}
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-5">
                      <div className="text-5xl bg-white p-3 rounded-[1.5rem] shadow-md group-hover:scale-110 transition-transform">
                        {assignment.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-indigo-900 mb-2 leading-tight">
                          {assignment.title}
                        </h3>
                        <p className="text-md text-indigo-500 font-bold bg-indigo-50 inline-block px-3 py-1 rounded-lg">
                          {assignment.subject}
                        </p>
                      </div>
                    </div>
                    {assignment.status === "completed" && (
                      <div className="bg-green-500 rounded-full p-2 shadow-lg transform rotate-12">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>

                  <div
                    className={`flex items-center gap-3 mb-6 p-4 rounded-2xl ${assignment.urgent ? "bg-red-100" : "bg-gray-50"}`}
                  >
                    <Clock
                      className={`w-6 h-6 ${assignment.urgent ? "text-red-600 animate-spin-slow" : "text-gray-500"}`}
                    />
                    <span
                      className={`text-md font-semibold ${
                        assignment.urgent ? "text-red-700" : "text-gray-700"
                      }`}
                    >
                      Due: {assignment.dueDate}
                    </span>
                    {assignment.urgent && (
                      <span className="ml-auto bg-red-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-md">
                        HURRY! 🏃
                      </span>
                    )}
                  </div>

                  {assignment.status === "completed" ? (
                    <button
                      onClick={() =>
                        navigate(`/student/assignments/${assignment.id}`)
                      }
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all shadow-lg text-xl border-b-4 border-green-700 active:border-b-0 active:mt-[4px] relative"
                    >
                      Completed! 🎉
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        navigate(`/student/assignments/${assignment.id}`)
                      }
                      className={`w-full ${
                        assignment.urgent
                          ? "bg-red-500 hover:bg-red-600 border-red-700 text-white"
                          : "bg-[#F4C21A] hover:bg-[#d4a617] border-[#c09615] text-black"
                      } font-semibold py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-xl text-xl border-b-4 active:border-b-0 active:translate-y-1 relative`}
                    >
                      {assignment.submission?.status === "draft"
                        ? "Continue Quest! ⚔️"
                        : "Start Quest! ⚔️"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Encouragement Section */}
        <div className="mt-10 bg-white rounded-3xl shadow-xl p-8 border-4 border-[#F4C21A] text-center">
          <div className="flex justify-center mb-4">
            <Award className="w-16 h-16 text-[#F4C21A]" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            Keep up the great work!
          </h3>
          <p className="text-lg text-gray-700 font-medium">
            You're doing amazing! Every lesson completed is a step closer to
            becoming a super learner!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
