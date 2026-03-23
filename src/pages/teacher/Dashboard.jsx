import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "../../contexts/adminContext";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  BookOpen,
  Users,
  MessageCircle,
  LogOut,
  Upload,
  ClipboardCheck,
  TrendingUp,
  Bell,
} from "lucide-react";
import logo from "../../assets/levelup-logo.png";
import {
  useAssignedStudents,
  useTeacherLessons,
  useTeacherAssignments,
  useTeacherConversations,
} from "../../hooks/teacherHooks";

/**
 * Teacher Dashboard Component
 * Overview dashboard for teachers â€” real API data
 */
function Dashboard() {
  const navigate = useNavigate();

  const { user, logout } = useAdmin();
  const teacherName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "Teacher";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Real data
  const { data: studentsData } = useAssignedStudents();
  const { data: lessonsData } = useTeacherLessons();
  const { data: assignmentsData } = useTeacherAssignments();
  const { data: convsData } = useTeacherConversations();

  const studentCount =
    studentsData?.data?.students?.length ?? studentsData?.data?.length ?? 0;
  const lessonCount =
    lessonsData?.data?.lessons?.length ?? lessonsData?.data?.length ?? 0;
  const assignmentCount =
    assignmentsData?.data?.assignments?.length ??
    assignmentsData?.data?.length ??
    0;
  const conversations = convsData?.data ?? [];
  const unreadCount = conversations.reduce(
    (sum, c) => sum + (c.unreadCount ?? 0),
    0,
  );

  const stats = [
    {
      title: "Total Students",
      value: studentCount,
      icon: Users,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      description: "Assigned to your classes",
    },
    {
      title: "Learning Modules",
      value: lessonCount,
      icon: BookOpen,
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
      description: "Lessons created",
    },
    {
      title: "Active Assignments",
      value: assignmentCount,
      icon: ClipboardCheck,
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      description: "Assignments issued",
    },
    {
      title: "Unread Messages",
      value: unreadCount,
      icon: MessageCircle,
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      description: "Waiting for your reply",
    },
  ];

  const quickActions = [
    {
      title: "Create Assignment",
      icon: ClipboardCheck,
      path: "/teacher/materials",
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Upload Module",
      icon: Upload,
      path: "/teacher/materials",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Manage Users",
      icon: Users,
      path: "/teacher/users",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "View Messages",
      icon: MessageCircle,
      path: "/teacher/messages",
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/teacher/dashboard" className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="TinyLearn"
                  className="h-10 w-10 object-contain"
                />
                <div className="hidden sm:block">
                  <h1 className="text-xl font-semibold text-slate-900">
                    Teacher Portal
                  </h1>
                </div>
              </Link>
              <div className="hidden md:flex items-center gap-1">
                <Link
                  to="/teacher/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-50 text-indigo-600"
                >
                  <TrendingUp className="w-4 h-4" /> Dashboard
                </Link>
                <Link
                  to="/teacher/users"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  <Users className="w-4 h-4" /> Users
                </Link>
                <Link
                  to="/teacher/materials"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  <BookOpen className="w-4 h-4" /> Learning Materials
                </Link>
                <Link
                  to="/teacher/messages"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  <MessageCircle className="w-4 h-4" /> Messages
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-white font-medium text-sm">
                  {user?.firstName?.[0]?.toUpperCase() ?? "T"}
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-900">
                    {teacherName}
                  </p>
                  <p className="text-xs text-slate-500">Teacher</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-slate-900 mb-2">
            Welcome back, {teacherName}!
          </h2>
          <p className="text-slate-600 text-lg">
            Here's what's happening in your classes today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="border border-slate-200 shadow-sm hover:shadow-md transition-all"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-semibold text-slate-900 mb-2">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to manage your classroom
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className="p-6 bg-white rounded-xl border-2 border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all group flex flex-col items-center justify-center text-center w-full"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                  >
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    {action.title}
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversations preview */}
        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Recent Messages
            </CardTitle>
            <CardDescription>Latest conversations with parents</CardDescription>
          </CardHeader>
          <CardContent>
            {conversations.length === 0 ? (
              <p className="text-slate-500 text-center py-6">
                No conversations yet.
              </p>
            ) : (
              <div className="space-y-4">
                {conversations.slice(0, 5).map((conv) => {
                  const other = conv.partner ?? {};
                  const otherId = conv.partnerId?.toString();
                  return (
                    <Link
                      key={otherId}
                      to="/teacher/messages"
                      className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-medium text-indigo-700 flex-shrink-0">
                        {(other.firstName?.[0] ?? "?").toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-slate-900">
                            {other.firstName} {other.lastName}
                          </p>
                          {conv.unreadCount > 0 && (
                            <span className="w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 truncate">
                          {conv.lastMessage?.content ?? ""}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
