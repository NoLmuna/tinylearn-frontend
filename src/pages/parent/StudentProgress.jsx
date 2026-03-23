import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "../../contexts/adminContext";
import {
  BookOpen,
  CheckCircle,
  Clock,
  AlertCircle,
  Award,
  ChevronDown,
  ChevronUp,
  Users,
} from "lucide-react";
import logo from "../../assets/levelup-logo.png";
import {
  useParentChildren,
  useParentChildProgress,
  useParentChildAssignments,
} from "../../hooks/parentHooks";

/**
 * Student Progress Page
 * Detailed view of lessons and assignments using real backend data
 */
function StudentProgress() {
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState(0);
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [assignmentFilter, setAssignmentFilter] = useState("all");

  const { logout } = useAdmin();

  const { data: childrenData, isLoading: isLoadingChildren } =
    useParentChildren();
  const { data: progressData, isLoading: isLoadingProgress } =
    useParentChildProgress();
  const { data: assignmentsData, isLoading: isLoadingAssignments } =
    useParentChildAssignments();

  const rawChildren = childrenData?.data ?? [];
  const rawProgress = Array.isArray(progressData?.data)
    ? progressData.data
    : (progressData?.data?.progress ?? []);
  const rawAssignments = Array.isArray(assignmentsData?.data)
    ? assignmentsData.data
    : (assignmentsData?.data?.assignments ?? []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const currentChild = rawChildren[selectedChild] ?? null;
  const currentChildId = currentChild?._id || currentChild?.id;

  // Filter progress and assignments by selected child
  const childProgress = rawProgress.filter(
    (p) => (p.studentId?._id || p.studentId) === currentChildId,
  );

  // Group progress by lesson title/subject for display
  const lessonGroups = childProgress.reduce((acc, p) => {
    const key = p.lessonId?.title || p.lessonId || "Unknown Lesson";
    if (!acc[key]) {
      acc[key] = { title: key, chapters: [] };
    }
    acc[key].chapters.push(p);
    return acc;
  }, {});

  const lessonList = Object.values(lessonGroups).map((group) => {
    const total = group.chapters.length;
    const completed = group.chapters.filter(
      (c) => c.status === "completed",
    ).length;
    return {
      title: group.title,
      total,
      completed,
      progress: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });

  const overallProgress =
    lessonList.length > 0
      ? Math.round(
          lessonList.reduce((sum, l) => sum + l.progress, 0) /
            lessonList.length,
        )
      : 0;

  const childAssignments = rawAssignments.filter(
    (a) => (a.studentId?._id || a.studentId) === currentChildId,
  );

  const filteredAssignments = childAssignments.filter((a) => {
    if (assignmentFilter === "completed")
      return a.status === "completed" || a.status === "graded";
    if (assignmentFilter === "pending")
      return a.status === "pending" || a.status === "submitted";
    return true;
  });

  const isLoading =
    isLoadingChildren || isLoadingProgress || isLoadingAssignments;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/parent/dashboard" className="flex items-center gap-3">
              <img
                src={logo}
                alt="TinyLearn"
                className="h-8 w-8 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                  TinyLearn
                </h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Parent Portal
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/parent/dashboard"
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/parent/progress"
                  className="px-3 py-1.5 bg-slate-100 text-slate-800 rounded-md text-sm font-medium transition-colors"
                >
                  Student Progress
                </Link>
                <Link
                  to="/parent/messages"
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md text-sm font-medium transition-colors"
                >
                  Messages
                </Link>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10 border-b border-slate-200 pb-6">
          <h2 className="text-2xl font-semibold text-slate-800 mb-1">
            Student Progress
          </h2>
          <p className="text-sm text-slate-500">
            Track your child's learning journey and scheduled assignments
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
          </div>
        ) : rawChildren.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-slate-200 shadow-sm">
            <Users className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p className="text-lg font-medium text-slate-700 mb-1">
              No students registered
            </p>
            <p className="text-sm text-slate-500">
              Please contact the school administration to link your child's
              account.
            </p>
          </div>
        ) : (
          <>
            {/* Child Selector */}
            <div className="flex gap-3 mb-8 flex-wrap">
              {rawChildren.map((child, index) => (
                <button
                  key={child._id || child.id}
                  onClick={() => {
                    setSelectedChild(index);
                    setExpandedLesson(null);
                  }}
                  className={`flex items-center gap-3 px-5 py-3 rounded-lg border text-sm font-medium transition-all ${
                    selectedChild === index
                      ? "border-slate-800 bg-slate-800 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <div className="text-left">
                    <p className="font-semibold">
                      {child.firstName} {child.lastName}
                    </p>
                    {child.grade && (
                      <p className="text-xs opacity-80 font-normal">
                        {child.grade}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Overall Progress */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    Overall Progress
                  </h3>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    All lessons combined
                  </p>
                </div>
                <div className="text-right flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-slate-800">
                    {overallProgress}%
                  </p>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Complete
                  </p>
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-slate-800 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>

            {/* Lessons Progress */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-slate-100 rounded-md flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-slate-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Course Materials
                </h3>
              </div>

              {lessonList.length === 0 ? (
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 text-center text-sm text-slate-500">
                  <p>No lesson data available for this student yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {lessonList.map((lesson, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setExpandedLesson(expandedLesson === idx ? null : idx)
                        }
                        className="w-full p-6 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1 text-left">
                            <div className="w-4 h-4 bg-blue-500 rounded-full" />
                            <div className="flex-1">
                              <h4 className="text-xl font-bold text-gray-900 mb-3">
                                {lesson.title}
                              </h4>
                              <div className="flex items-center gap-4">
                                <div className="flex-1 max-w-md">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-semibold text-gray-700">
                                      Progress
                                    </span>
                                    <span className="text-sm font-bold text-gray-900">
                                      {lesson.completed}/{lesson.total} chapters
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                      className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                                      style={{ width: `${lesson.progress}%` }}
                                    />
                                  </div>
                                </div>
                                <div className="text-2xl font-semibold text-gray-900">
                                  {lesson.progress}%
                                </div>
                              </div>
                            </div>
                          </div>
                          {expandedLesson === idx ? (
                            <ChevronUp className="w-6 h-6 text-gray-600 ml-4" />
                          ) : (
                            <ChevronDown className="w-6 h-6 text-gray-600 ml-4" />
                          )}
                        </div>
                      </button>
                      {expandedLesson === idx && (
                        <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                          <p className="text-gray-700">
                            {lesson.completed} of {lesson.total} chapters
                            completed.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Assignments */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">
                  Assignments
                </h3>
              </div>

              <div className="flex gap-3 mb-6 flex-wrap">
                {[
                  { label: `All (${childAssignments.length})`, value: "all" },
                  {
                    label: `Completed (${childAssignments.filter((a) => a.status === "completed" || a.status === "graded").length})`,
                    value: "completed",
                  },
                  {
                    label: `Pending (${childAssignments.filter((a) => a.status === "pending" || a.status === "submitted").length})`,
                    value: "pending",
                  },
                ].map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setAssignmentFilter(f.value)}
                    className={`px-5 py-2 rounded-xl font-semibold transition-colors ${
                      assignmentFilter === f.value
                        ? "bg-[#F4C21A] text-gray-900"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {filteredAssignments.length === 0 ? (
                <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500">
                  No assignments found for this filter.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredAssignments.map((assignment) => {
                    const isDone =
                      assignment.status === "completed" ||
                      assignment.status === "graded";
                    return (
                      <div
                        key={assignment._id}
                        className={`bg-white rounded-2xl shadow-lg border-2 p-6 ${isDone ? "border-green-300" : "border-orange-300"}`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-900 mb-1">
                              {assignment.title}
                            </h4>
                            {assignment.lessonId?.title && (
                              <p className="text-sm text-gray-600 font-medium">
                                {assignment.lessonId.title}
                              </p>
                            )}
                          </div>
                          {isDone ? (
                            <div className="bg-green-500 rounded-full p-2 shadow-md">
                              <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                          ) : (
                            <div className="bg-orange-500 rounded-full p-2 shadow-md">
                              <Clock className="w-6 h-6 text-white" />
                            </div>
                          )}
                        </div>

                        {isDone ? (
                          <div className="space-y-3">
                            {assignment.grade != null && (
                              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <span className="text-sm font-semibold text-gray-700">
                                  Score:
                                </span>
                                <span className="text-2xl font-bold text-green-600">
                                  {assignment.grade}/100
                                </span>
                              </div>
                            )}
                            {assignment.feedback && (
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs font-semibold text-gray-600 mb-1">
                                  Teacher Feedback:
                                </p>
                                <p className="text-sm text-gray-800">
                                  {assignment.feedback}
                                </p>
                              </div>
                            )}
                            {assignment.dueDate && (
                              <p className="text-xs text-gray-500">
                                Due:{" "}
                                {new Date(
                                  assignment.dueDate,
                                ).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {assignment.dueDate && (
                              <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                                <p className="text-sm font-semibold text-orange-800">
                                  Due:{" "}
                                  {new Date(
                                    assignment.dueDate,
                                  ).toLocaleDateString()}
                                </p>
                                {assignment.description && (
                                  <p className="text-sm text-gray-700 mt-1">
                                    {assignment.description}
                                  </p>
                                )}
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-orange-700">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-xs font-semibold capitalize">
                                {assignment.status}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StudentProgress;
