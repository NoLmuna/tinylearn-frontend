/* eslint-disable */
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
  Upload,
  Plus,
  FileText,
  Video,
  Image,
  File,
  TrendingUp,
  Bell,
  Eye,
  Edit,
  Trash2,
  Download,
  Archive,
  RotateCcw,
} from "lucide-react";
import logo from "../../assets/levelup-logo.png";
import CreateLesson from "../../components/teacher/createLessons";
import EditLesson from "../../components/teacher/editLessons";
import CreateAssignment from "../../components/teacher/createAssignment";
import {
  useTeacherLessons,
  useArchiveLesson,
  useRestoreLesson,
  useTeacherAssignments,
} from "../../hooks/teacherHooks";

/**
 * Teacher Learning Materials Page
 * Upload modules/lessons and create assignments
 */
function TeacherMaterials() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("modules");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateLessonModal, setShowCreateLessonModal] = useState(false);
  const [showEditLessonModal, setShowEditLessonModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] =
    useState(false);

  const teacherUser = { name: "Sarah Johnson", subject: "Mathematics" };

  // Hooks
  const { data: lessonsData, isLoading: isLoadingLessons } =
    useTeacherLessons(showArchived);
  const { data: assignmentsData, isLoading: isLoadingAssignments } =
    useTeacherAssignments();
  const archiveLesson = useArchiveLesson();
  const restoreLesson = useRestoreLesson();

  const { logout } = useAdmin();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleEdit = (lesson) => {
    setSelectedLesson(lesson);
    setShowEditLessonModal(true);
  };

  const handleArchive = async (lesson) => {
    if (
      !window.confirm(
        `Are you sure you want to archive "${lesson.title}"? This will deactivate the lesson.`,
      )
    ) {
      return;
    }

    try {
      await archiveLesson.mutateAsync(lesson._id || lesson.id);
    } catch (error) {
      console.error("Archive error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to archive lesson. Please try again.",
      );
    }
  };

  const handleRestore = async (lesson) => {
    if (
      !window.confirm(
        `Are you sure you want to restore "${lesson.title}"? This will reactivate the lesson.`,
      )
    ) {
      return;
    }

    try {
      await restoreLesson.mutateAsync(lesson._id || lesson.id);
    } catch (error) {
      console.error("Restore error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to restore lesson. Please try again.",
      );
    }
  };

  const lessons = lessonsData?.data?.lessons || [];
  const assignments = assignmentsData?.data?.assignments || [];

  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-600" />;
      case "video":
        return <Video className="w-5 h-5 text-indigo-600" />;
      case "image":
        return <Image className="w-5 h-5 text-blue-600" />;
      default:
        return <File className="w-5 h-5 text-slate-600" />;
    }
  };

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
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all"
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
            Learning Materials
          </h2>
          <p className="text-slate-600 text-lg">
            Upload modules and create assignments
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Total Lessons
                  </p>
                  <p className="text-4xl font-black text-slate-900">
                    {lessons.length}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-indigo-50">
                  <BookOpen className="w-8 h-8 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Active Assignments
                  </p>
                  <p className="text-4xl font-black text-slate-900">
                    {assignments.filter((a) => a.isActive !== false).length}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-blue-50">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Active Lessons
                  </p>
                  <p className="text-4xl font-black text-slate-900">
                    {lessons.filter((l) => l.isActive !== false).length}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-green-50">
                  <Eye className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <Button
            onClick={() => setActiveTab("modules")}
            variant={activeTab === "modules" ? "default" : "outline"}
            className={
              activeTab === "modules"
                ? "bg-gradient-to-r from-indigo-500 to-blue-600"
                : ""
            }
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Learning Modules
          </Button>
          <Button
            onClick={() => setActiveTab("assignments")}
            variant={activeTab === "assignments" ? "default" : "outline"}
            className={
              activeTab === "assignments"
                ? "bg-gradient-to-r from-indigo-500 to-blue-600"
                : ""
            }
          >
            <FileText className="w-4 h-4 mr-2" />
            Assignments
          </Button>
        </div>

        {/* Modules Tab */}
        {activeTab === "modules" && (
          <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b border-slate-100 bg-slate-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="text-2xl font-black">
                  Learning Lessons
                </CardTitle>
                <div className="flex gap-3">
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
                    onClick={() => setShowCreateLessonModal(true)}
                    className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-purple-600 hover:to-indigo-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Lesson
                  </Button>
                  <Button
                    onClick={() => setShowUploadModal(true)}
                    variant="outline"
                    className="border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Module
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {isLoadingLessons ? (
                <div className="text-center py-8">
                  <p className="text-slate-600">Loading lessons...</p>
                </div>
              ) : lessons.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-slate-600">No lessons found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {lessons.map((lesson) => (
                    <div
                      key={lesson._id || lesson.id}
                      className={`border-2 rounded-xl p-5 hover:border-indigo-200 transition-all ${!lesson.isActive ? "opacity-60 bg-slate-50 border-slate-200" : "border-slate-100 hover:bg-indigo-50/30"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          {lesson.imageUrl ? (
                            <img
                              src={lesson.imageUrl}
                              alt={lesson.title}
                              className="w-16 h-16 object-cover rounded-xl"
                            />
                          ) : (
                            <div className="p-3 rounded-xl bg-slate-50">
                              <BookOpen className="w-8 h-8 text-indigo-600" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3
                                className={`font-bold ${!lesson.isActive ? "text-slate-500" : "text-slate-900"}`}
                              >
                                {lesson.title}
                              </h3>
                              {!lesson.isActive && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                                  <Archive className="w-3 h-3" />
                                  Archived
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <span className="capitalize">
                                {lesson.category}
                              </span>
                              <span>•</span>
                              <span className="capitalize">
                                {lesson.difficulty}
                              </span>
                              <span>•</span>
                              <span>{lesson.ageGroup}</span>
                              {lesson.duration && (
                                <>
                                  <span>•</span>
                                  <span>{lesson.duration} min</span>
                                </>
                              )}
                              {lesson.createdAt && (
                                <>
                                  <span>•</span>
                                  <span>
                                    Created{" "}
                                    {new Date(
                                      lesson.createdAt,
                                    ).toLocaleDateString()}
                                  </span>
                                </>
                              )}
                            </div>
                            {lesson.description && (
                              <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                                {lesson.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-blue-50 hover:text-blue-600"
                            onClick={() =>
                              navigate(
                                `/teacher/lessons/${lesson._id || lesson.id}`,
                              )
                            }
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-indigo-50 hover:text-indigo-600"
                            onClick={() => handleEdit(lesson)}
                            disabled={!lesson.isActive}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {lesson.isActive ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-red-50 hover:text-red-600"
                              onClick={() => handleArchive(lesson)}
                              disabled={archiveLesson.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-green-50 hover:text-green-600"
                              onClick={() => handleRestore(lesson)}
                              disabled={restoreLesson.isPending}
                            >
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Assignments Tab */}
        {activeTab === "assignments" && (
          <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b border-slate-100 bg-slate-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="text-2xl font-black">
                  Assignments
                </CardTitle>
                <Button
                  onClick={() => setShowCreateAssignmentModal(true)}
                  className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-purple-600 hover:to-indigo-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Assignment
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {isLoadingAssignments ? (
                <div className="text-center py-8">
                  <p className="text-slate-600">Loading assignments...</p>
                </div>
              ) : assignments.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-slate-600">No assignments found</p>
                  <p className="text-sm text-slate-500 mt-2">
                    Create your first assignment to get started
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-4 px-4 text-sm font-bold text-slate-700">
                          Title
                        </th>
                        <th className="text-left py-4 px-4 text-sm font-bold text-slate-700">
                          Linked Lesson
                        </th>
                        <th className="text-left py-4 px-4 text-sm font-bold text-slate-700">
                          Due Date
                        </th>
                        <th className="text-left py-4 px-4 text-sm font-bold text-slate-700">
                          Submissions
                        </th>
                        <th className="text-left py-4 px-4 text-sm font-bold text-slate-700">
                          Type
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
                      {assignments.map((assignment) => {
                        const assignmentId = assignment._id || assignment.id;
                        const submissionStats =
                          assignment.submissionStats || {};
                        const totalAssigned = submissionStats.total || 0;
                        const submitted = submissionStats.submitted || 0;
                        const dueDate = assignment.dueDate
                          ? new Date(assignment.dueDate).toLocaleDateString()
                          : "N/A";
                        const lessonTitle =
                          assignment.lessonId?.title || "No lesson linked";
                        const isActive = assignment.isActive !== false;
                        const progressPercentage =
                          totalAssigned > 0
                            ? (submitted / totalAssigned) * 100
                            : 0;

                        return (
                          <tr
                            key={assignmentId}
                            className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${!isActive ? "opacity-60 bg-slate-50" : ""}`}
                          >
                            <td className="py-4 px-4 font-semibold text-slate-900">
                              {assignment.title}
                            </td>
                            <td className="py-4 px-4 text-sm text-slate-600">
                              {lessonTitle}
                            </td>
                            <td className="py-4 px-4 text-sm text-slate-600">
                              {dueDate}
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm">
                                <span className="font-semibold text-slate-900">
                                  {submitted}
                                </span>
                                <span className="text-slate-600">
                                  {" "}
                                  / {totalAssigned}
                                </span>
                              </div>
                              {totalAssigned > 0 && (
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                  <div
                                    className="bg-gradient-to-r from-indigo-500 to-blue-600 h-2 rounded-full transition-all"
                                    style={{ width: `${progressPercentage}%` }}
                                  />
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 capitalize">
                                {assignment.assignmentType || "homework"}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                  isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {isActive ? "Active" : "Archived"}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="hover:bg-blue-50 hover:text-blue-600"
                                  onClick={() =>
                                    navigate(
                                      `/teacher/assignments/${assignmentId}/submissions`,
                                    )
                                  }
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="hover:bg-indigo-50 hover:text-indigo-600"
                                  disabled={!isActive}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="hover:bg-red-50 hover:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Lesson Modal */}
      <CreateLesson
        isOpen={showCreateLessonModal}
        onClose={() => setShowCreateLessonModal(false)}
      />

      {/* Edit Lesson Modal */}
      <EditLesson
        isOpen={showEditLessonModal}
        onClose={() => {
          setShowEditLessonModal(false);
          setSelectedLesson(null);
        }}
        lesson={selectedLesson}
      />

      {/* Upload Module Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl shadow-2xl">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-2xl font-black">
                Upload Learning Module
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Module Title
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Introduction to Algebra"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                  placeholder="Brief description of the module..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Upload File
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-sm font-semibold text-slate-700 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-slate-500">
                    PDF, Video, or Image files (Max 100MB)
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setShowUploadModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-purple-600 hover:to-indigo-600"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Module
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Assignment Modal */}
      <CreateAssignment
        isOpen={showCreateAssignmentModal}
        onClose={() => setShowCreateAssignmentModal(false)}
      />
    </div>
  );
}

export default TeacherMaterials;
