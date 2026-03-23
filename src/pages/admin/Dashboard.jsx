import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "../../contexts/adminContext";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Shield,
  Users,
  BookOpen,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  LogOut,
  Search,
  Plus,
  Eye,
  LayoutDashboard,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import logo from "../../assets/levelup-logo.png";
import AdminCreateTeacher from "../../components/admin/adminCreateTeacher.jsx";
import { useAdminTeachers, useAdminStats } from "../../hooks/adminHooks.jsx";

/**
 * Admin Dashboard Component
 * Modern administrative control panel with real backend data
 */
function Dashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  // Real backend data
  const {
    data: statsData,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useAdminStats();
  const { data: teachersResponse, isLoading: isLoadingTeachers } =
    useAdminTeachers();

  const stats = statsData?.data ?? {};
  const apiTeachers = Array.isArray(teachersResponse?.data)
    ? teachersResponse.data
    : [];

  const teachers = apiTeachers.map((t) => ({
    id: t.id || t._id,
    name: `${t.firstName} ${t.lastName}`,
    email: t.email,
    subject: t.subjectSpecialty || "N/A",
    status: t.accountStatus,
  }));

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const systemStatCards = [
    {
      title: "Total Teachers",
      value: isLoadingStats ? "â€”" : (stats.totalTeachers ?? 0),
      icon: Users,
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
    },
    {
      title: "Total Students",
      value: isLoadingStats ? "â€”" : (stats.totalStudents ?? 0),
      icon: BookOpen,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      title: "Total Parents",
      value: isLoadingStats ? "â€”" : (stats.totalParents ?? 0),
      icon: Users,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Total Users",
      value: isLoadingStats ? "â€”" : (stats.totalUsers ?? 0),
      icon: TrendingUp,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Modern Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <img
                  src={logo}
                  alt="TinyLearn"
                  className="h-10 w-10 object-contain"
                />
                <div className="hidden sm:block">
                  <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                    TinyLearn
                    <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white rounded-md">
                      ADMIN
                    </span>
                  </h1>
                </div>
              </Link>

              <div className="hidden md:flex items-center gap-1">
                <Link
                  to="/admin/dashboard"
                  onClick={() => setActiveNav("dashboard")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeNav === "dashboard"
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/admin/teachers"
                  onClick={() => setActiveNav("teachers")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeNav === "teachers"
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Teachers
                </Link>
                <Link
                  to="/admin/reports"
                  onClick={() => setActiveNav("reports")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeNav === "reports"
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  System & Reports
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900">
                    {user?.firstName
                      ? `${user.firstName} ${user.lastName}`
                      : "Administrator"}
                  </p>
                  <p className="text-xs text-slate-500">Admin</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-semibold text-slate-900 mb-2">
              Dashboard Overview
            </h2>
            <p className="text-lg text-slate-600">
              Monitor system performance and manage teachers
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchStats()}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* System Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemStatCards.map((stat, index) => (
            <Card
              key={index}
              className="border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-semibold text-slate-900">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Teacher Management Section */}
        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="border-b border-slate-100 bg-slate-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
                  <Users className="w-6 h-6 text-indigo-600" />
                  Teacher Management
                </CardTitle>
                <p className="text-sm text-slate-600 mt-1">
                  {isLoadingTeachers
                    ? "Loading..."
                    : `${teachers.length} teacher${teachers.length !== 1 ? "s" : ""} registered`}
                </p>
              </div>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-md transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Teacher
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search teachers by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {isLoadingTeachers ? (
              <div className="text-center py-12 text-slate-500">
                Loading teachers...
              </div>
            ) : filteredTeachers.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                {teachers.length === 0
                  ? "No teachers found. Create one to get started."
                  : "No teachers match your search."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-4 px-4 text-sm font-bold text-slate-700">
                        Name
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-slate-700">
                        Email
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-slate-700">
                        Subject
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-slate-700">
                        Status
                      </th>
                      <th className="text-right py-4 px-4 text-sm font-bold text-slate-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeachers.map((teacher) => (
                      <tr
                        key={teacher.id}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-white font-bold">
                              {teacher.name.charAt(0)}
                            </div>
                            <span className="font-semibold text-slate-900">
                              {teacher.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-600">
                          {teacher.email}
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                            {teacher.subject}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              teacher.status === "active"
                                ? "bg-green-100 text-green-700"
                                : teacher.status === "suspended"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {teacher.status || "pending"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/admin/teachers`)}
                              className="hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Teachers notice */}
        {stats.pendingTeachers > 0 && (
          <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-yellow-400">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  {stats.pendingTeachers} teacher account
                  {stats.pendingTeachers !== 1 ? "s" : ""} pending approval
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review pending teachers in the Teachers section.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin/teachers")}
              >
                Review
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Teacher Modal */}
      {showCreateModal && (
        <AdminCreateTeacher onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

export default Dashboard;
