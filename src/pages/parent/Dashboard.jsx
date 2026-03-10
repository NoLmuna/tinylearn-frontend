/* eslint-disable */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "../../contexts/adminContext";
import {
  Users,
  BookOpen,
  MessageCircle,
  TrendingUp,
  ChevronRight,
  Award,
  Clock,
  Bell,
} from "lucide-react";
import logo from "../../assets/levelup-logo.png";
import {
  useParentChildren,
  useParentChildProgress,
  useParentConversations,
} from "../../hooks/parentHooks";

/**
 * Parent Dashboard Component
 * Overview page with real backend data for progress, activity, and messages
 */
function Dashboard() {
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState(0);

  const { user, logout } = useAdmin();
  const firstName = user?.firstName ?? "Parent";

  // Real backend data
  const { data: childrenData, isLoading: isLoadingChildren } =
    useParentChildren();
  const { data: progressData, isLoading: isLoadingProgress } =
    useParentChildProgress();
  const { data: conversationsData } = useParentConversations();

  const rawChildren = childrenData?.data ?? [];
  const rawProgress = Array.isArray(progressData?.data)
    ? progressData.data
    : (progressData?.data?.progress ?? []);
  const conversations = conversationsData?.data ?? [];

  // Build child entries from backend data
  const children = rawChildren.map((child, idx) => {
    const childProgress = rawProgress.filter(
      (p) => (p.studentId?._id || p.studentId) === (child._id || child.id),
    );
    const completedLessons = childProgress.filter(
      (p) => p.status === "completed",
    ).length;
    const totalLessons = childProgress.length;
    const overallProgress =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    return {
      id: child._id || child.id,
      name: `${child.firstName} ${child.lastName}`,
      grade: child.grade ?? "",
      activeLessons: childProgress.filter((p) => p.status === "in-progress")
        .length,
      completedThisWeek: completedLessons,
      overallProgress,
    };
  });

  // Unread conversations count
  const unreadCount = conversations.filter((c) => c.unreadCount > 0).length;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const currentChild = children[selectedChild] ?? null;

  const isLoading = isLoadingChildren || isLoadingProgress;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation - Professional & Clean */}
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
                  className="px-3 py-1.5 bg-slate-100 text-slate-800 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/parent/progress"
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md text-sm font-medium transition-colors"
                >
                  Student Progress
                </Link>
                <Link
                  to="/parent/messages"
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md text-sm font-medium transition-colors relative"
                >
                  Messages
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
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
        {/* Welcome Header */}
        <div className="mb-10 border-b border-slate-200 pb-6">
          <h2 className="text-2xl font-semibold text-slate-800 mb-1">
            Welcome back, {firstName}
          </h2>
          <p className="text-sm text-slate-500">
            Overview of your children's academic progress and recent
            communications.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
          </div>
        ) : children.length === 0 ? (
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
              {children.map((child, index) => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChild(index)}
                  className={`flex items-center gap-3 px-5 py-3 rounded-lg border text-sm font-medium transition-all ${
                    selectedChild === index
                      ? "border-slate-800 bg-slate-800 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <div className="text-left">
                    <p className="font-semibold">{child.name}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Stats */}
            {currentChild && (
              <div className="grid md:grid-cols-3 gap-5 mb-10">
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Overall Completion
                    </p>
                    <TrendingUp className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <p className="text-3xl font-bold text-slate-800">
                      {currentChild.overallProgress}%
                    </p>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className="bg-slate-800 h-1.5 rounded-full"
                      style={{ width: `${currentChild.overallProgress}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Active Lessons
                    </p>
                    <BookOpen className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-3xl font-bold text-slate-800">
                    {currentChild.activeLessons}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Currently in progress
                  </p>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Completed Tasks
                    </p>
                    <Award className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-3xl font-bold text-slate-800">
                    {currentChild.completedThisWeek}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Successfully finished
                  </p>
                </div>
              </div>
            )}

            {/* Communications Preview */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Recent Communications
                  </h3>
                  <Link
                    to="/parent/messages"
                    className="text-sm font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1"
                  >
                    View All <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                  {conversations.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <MessageCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm font-medium">No recent messages</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {conversations.slice(0, 4).map((conv) => {
                        const other = conv.partner ?? {};
                        const otherId = conv.partnerId?.toString();
                        return (
                          <Link
                            key={otherId}
                            to="/parent/messages"
                            className="block p-4 hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold text-sm text-slate-800">
                                {other.firstName} {other.lastName}
                              </p>
                              {conv.unreadCount > 0 && (
                                <span className="text-[10px] font-bold text-white bg-amber-500 px-2 py-0.5 rounded-full">
                                  {conv.unreadCount} new
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-500 truncate">
                              {conv.lastMessage?.content ?? ""}
                            </p>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Quick Actions
                  </h3>
                </div>
                <div className="grid gap-3">
                  <Link
                    to="/parent/progress"
                    className="flex items-center p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-300 shadow-sm transition-colors group"
                  >
                    <div className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center mr-4 group-hover:bg-slate-200 transition-colors">
                      <BookOpen className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-800">
                        Academic Progress
                      </p>
                      <p className="text-xs text-slate-500">
                        Detailed lesson and assignment tracing
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
                  </Link>
                  <Link
                    to="/parent/messages"
                    className="flex items-center p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-300 shadow-sm transition-colors group"
                  >
                    <div className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center mr-4 group-hover:bg-slate-200 transition-colors">
                      <MessageCircle className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-800">
                        Contact Faculty
                      </p>
                      <p className="text-xs text-slate-500">
                        Send direct messages to teachers
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
