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
  BookOpen,
  Users,
  MessageCircle,
  LogOut,
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  Bell,
  Mail,
  Phone,
  Award,
  Target,
  Calendar,
  User,
  Archive,
  RotateCcw,
} from "lucide-react";
import logo from "../../assets/levelup-logo.png";
import {
  useAssignedStudents,
  useAssignedParents,
  useArchiveStudent,
  useArchiveParent,
  useRestoreStudent,
  useRestoreParent,
} from "../../hooks/teacherHooks";
import CreateStudentAndParent from "../../components/teacher/createStudentandParents";

/**
 * Teacher Users Management Page
 * Manage students and parents with unique card-based design
 */
function TeacherUsers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  // Hooks
  const { data: assignedStudentsData, isLoading: isLoadingStudents } =
    useAssignedStudents(showArchived);
  const { data: assignedParentsData, isLoading: isLoadingParents } =
    useAssignedParents(showArchived);
  const archiveStudent = useArchiveStudent();
  const archiveParent = useArchiveParent();
  const restoreStudent = useRestoreStudent();
  const restoreParent = useRestoreParent();

  const teacherUser = { name: "Sarah Johnson", subject: "Mathematics" };

  const { logout } = useAdmin();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleArchive = async (user) => {
    if (
      !window.confirm(
        `Are you sure you want to archive ${user.name}? This will deactivate their account.`,
      )
    ) {
      return;
    }

    try {
      if (user.type === "student") {
        await archiveStudent.mutateAsync(user.id);
      } else {
        await archiveParent.mutateAsync(user.id);
      }
    } catch (error) {
      console.error("Archive error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to archive user. Please try again.",
      );
    }
  };

  const handleRestore = async (user) => {
    if (
      !window.confirm(
        `Are you sure you want to restore ${user.name}? This will reactivate their account.`,
      )
    ) {
      return;
    }

    try {
      if (user.type === "student") {
        await restoreStudent.mutateAsync(user.id);
      } else {
        await restoreParent.mutateAsync(user.id);
      }
    } catch (error) {
      console.error("Restore error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to restore user. Please try again.",
      );
    }
  };

  // Transform API data to match UI structure
  const transformUsers = () => {
    const users = [];
    const colors = [
      "from-blue-400 to-cyan-500",
      "bg-purple-500 hover:bg-purple-600 transition-colors",
      "bg-emerald-500 hover:bg-emerald-600 transition-colors",
      "from-orange-400 to-red-500",
      "from-teal-400 to-cyan-500",
      "from-indigo-400 to-purple-500",
      "from-pink-400 to-rose-500",
      "from-yellow-400 to-orange-500",
      "from-red-400 to-pink-500",
      "from-cyan-400 to-blue-500",
    ];

    // Add students
    if (assignedStudentsData?.data) {
      assignedStudentsData.data.forEach((student, index) => {
        const studentId = student._id || student.id;
        const parentNames =
          student.parents && student.parents.length > 0
            ? student.parents
                .map((p) => `${p.firstName} ${p.lastName}`)
                .join(", ")
            : "No parent assigned";

        users.push({
          id: studentId,
          name: `${student.firstName} ${student.lastName}`,
          email: student.email,
          type: "student",
          grade: student.grade || "N/A",
          parent: parentNames,
          status: student.accountStatus || "active",
          isActive: student.isActive !== false,
          performance: 85, // Mock for now - can be calculated from actual data later
          attendance: 95, // Mock for now - can be calculated from actual data later
          lastActive: student.lastLogin
            ? new Date(student.lastLogin).toLocaleDateString()
            : "Never",
          color: colors[index % colors.length],
          _raw: student,
        });
      });
    }

    // Add parents
    if (assignedParentsData?.data) {
      assignedParentsData.data.forEach((parent, index) => {
        const parentId = parent._id || parent.id;
        const childrenNames =
          parent.children && parent.children.length > 0
            ? parent.children
                .map((c) => `${c.firstName} ${c.lastName}`)
                .join(", ")
            : "No children";

        users.push({
          id: parentId,
          name: `${parent.firstName} ${parent.lastName}`,
          email: parent.email,
          type: "parent",
          children: childrenNames,
          phone: parent.phoneNumber || "N/A",
          status: parent.accountStatus || "active",
          isActive: parent.isActive !== false,
          engagement: "High", // Mock for now - can be calculated from actual data later
          lastContact: parent.lastLogin
            ? new Date(parent.lastLogin).toLocaleDateString()
            : "Never",
          color:
            colors[
              (index + (assignedStudentsData?.data?.length || 0)) %
                colors.length
            ],
          _raw: parent,
        });
      });
    }

    return users;
  };

  const users = transformUsers();

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || user.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const studentCount = users.filter((u) => u.type === "student").length;
  const parentCount = users.filter((u) => u.type === "parent").length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
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
                  <h1 className="text-xl font-black text-slate-900">
                    Teacher Portal
                  </h1>
                  <p className="text-xs text-indigo-600 font-semibold">
                    {teacherUser.subject}
                  </p>
                </div>
              </Link>

              <div className="hidden md:flex items-center gap-1">
                <Link
                  to="/teacher/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  <TrendingUp className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/teacher/users"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-50 text-indigo-600 transition-all"
                >
                  <Users className="w-4 h-4" />
                  Users
                </Link>
                <Link
                  to="/teacher/materials"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  Learning Materials
                </Link>
                <Link
                  to="/teacher/messages"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Messages
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    3
                  </span>
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-white font-bold text-sm">
                  {teacherUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {teacherUser.name}
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
          <h2 className="text-3xl font-black text-slate-900 mb-2">
            User Management
          </h2>
          <p className="text-slate-600 text-lg">
            Manage student and parent accounts
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Total Students
                  </p>
                  <p className="text-4xl font-black text-slate-900">
                    {studentCount}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    ↑ 12% from last month
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-blue-50">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Linked Parents
                  </p>
                  <p className="text-4xl font-black text-slate-900">
                    {parentCount}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    79% engagement rate
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-green-50">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Avg. Performance
                  </p>
                  <p className="text-4xl font-black text-slate-900">89%</p>
                  <p className="text-xs text-slate-500 mt-2">
                    ↑ 5% improvement
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-indigo-50">
                  <Target className="w-8 h-8 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Bar */}
        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white appearance-none cursor-pointer"
                  >
                    <option value="all">All Users</option>
                    <option value="student">Students</option>
                    <option value="parent">Parents</option>
                  </select>
                </div>
                <Button
                  variant={showArchived ? "default" : "outline"}
                  onClick={() => setShowArchived(!showArchived)}
                  className={
                    showArchived
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : ""
                  }
                >
                  <Archive className="w-4 h-4 mr-2" />
                  {showArchived ? "Hide Archived" : "Show Archived"}
                </Button>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-purple-600 hover:to-indigo-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {(isLoadingStudents || isLoadingParents) && (
          <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-indigo-50 rounded-2xl flex items-center justify-center animate-pulse">
                <Users className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Loading users...
              </h3>
              <p className="text-slate-600">
                Please wait while we fetch the data
              </p>
            </CardContent>
          </Card>
        )}

        {/* User Cards Grid */}
        {!(isLoadingStudents || isLoadingParents) && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <Card
                key={user.id}
                className={`border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 ${!user.isActive ? "opacity-60 bg-slate-50" : ""}`}
              >
                <CardContent className="p-6">
                  {/* Header with Avatar */}
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-14 h-14 rounded-full bg-gradient-to-br ${!user.isActive ? "from-gray-400 to-gray-600" : user.type === "student" ? "from-blue-400 to-blue-600" : "from-green-400 to-green-600"} flex items-center justify-center text-white font-bold text-lg shadow-md`}
                    >
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className={`font-bold text-lg ${!user.isActive ? "text-slate-500" : "text-slate-900"}`}
                        >
                          {user.name}
                        </h3>
                        {!user.isActive && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                            <Archive className="w-3 h-3" />
                            Archived
                          </span>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          !user.isActive
                            ? "bg-slate-100 text-slate-600"
                            : user.type === "student"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        <User className="w-3 h-3" />
                        {user.type === "student" ? "Student" : "Parent"}
                      </span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2.5 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    {user.type === "student" ? (
                      <>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Award className="w-4 h-4 text-gray-400" />
                          <span>{user.grade}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>Parent: {user.parent}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{user.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>Child: {user.children}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Performance Metrics for Students */}
                  {user.type === "student" && (
                    <div className="space-y-3 mb-4 p-4 bg-slate-50 rounded-xl">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-slate-600">
                            Performance
                          </span>
                          <span className="text-sm font-bold text-indigo-600">
                            {user.performance}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${user.performance}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-slate-600">
                            Attendance
                          </span>
                          <span className="text-sm font-bold text-blue-600">
                            {user.attendance}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${user.attendance}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Engagement for Parents */}
                  {user.type === "parent" && (
                    <div className="mb-4 p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-600">
                          Engagement
                        </span>
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            user.engagement === "Very High"
                              ? "bg-green-100 text-green-700"
                              : user.engagement === "High"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {user.engagement}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="w-3 h-3" />
                        <span>Last contact: {user.lastContact}</span>
                      </div>
                    </div>
                  )}

                  {/* Last Active */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-200">
                    <div
                      className={`w-2 h-2 rounded-full ${!user.isActive ? "bg-gray-400" : "bg-green-500"}`}
                    ></div>
                    <span>
                      {!user.isActive
                        ? "Archived"
                        : user.type === "student"
                          ? `Active ${user.lastActive}`
                          : `Contacted ${user.lastContact}`}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                      onClick={() =>
                        navigate(`/teacher/users/${user.type}/${user.id}`)
                      }
                      disabled={!user.isActive}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300"
                      onClick={() =>
                        navigate(`/teacher/users/${user.type}/${user.id}`)
                      }
                      disabled={!user.isActive}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    {user.isActive ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                        onClick={() => handleArchive(user)}
                        disabled={
                          archiveStudent.isPending || archiveParent.isPending
                        }
                        title="Archive user (deactivate account)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                        onClick={() => handleRestore(user)}
                        disabled={
                          restoreStudent.isPending || restoreParent.isPending
                        }
                        title="Restore user (reactivate account)"
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Restore
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-indigo-50 rounded-2xl flex items-center justify-center">
                <Users className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No users found
              </h3>
              <p className="text-slate-600 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setFilterType("all");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Student & Parent Modal */}
      <CreateStudentAndParent
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}

export default TeacherUsers;
