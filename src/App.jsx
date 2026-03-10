import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

// Public Pages
import Landing from "./pages/Landing";
import Features from "./pages/Features";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Main Login (for Student, Parent, Teacher)
import MainLogin from "./pages/MainLogin";

// Student Pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentSpecLesson from "./pages/student/SpecLesson";
import StudentSpecAssignment from "./pages/student/SpecAssignment";

// Parent Pages
import ParentDashboard from "./pages/parent/Dashboard";
import ParentProgress from "./pages/parent/StudentProgress";
import ParentMessages from "./pages/parent/Messages";

// Teacher Pages
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherUsers from "./pages/teacher/Users";
import TeacherSpecUser from "./pages/teacher/SpecUser";
import TeacherMaterials from "./pages/teacher/Materials";
import TeacherSpecLessons from "./pages/teacher/SpecLessons";
import TeacherMessages from "./pages/teacher/Messages";
import ViewSubmissions from "./pages/teacher/ViewSubmissions";

// Admin Pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminTeachers from "./pages/admin/Teachers";
import AdminReports from "./pages/admin/Reports";

import ProtectedRoute from "./components/ProtectedRoute";

/**
 * App Component
 * Main application component with routing configuration
 * Organized by user roles: Public, Student, Parent, Teacher, Admin
 */
function App() {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Main Login for Student, Parent, Teacher */}
        <Route path="/login" element={<MainLogin />} />

        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/lessons/:id"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentSpecLesson />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/assignments/:id"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentSpecAssignment />
            </ProtectedRoute>
          }
        />

        {/* Parent Routes */}
        <Route
          path="/parent/dashboard"
          element={
            <ProtectedRoute allowedRoles={["parent"]}>
              <ParentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/progress"
          element={
            <ProtectedRoute allowedRoles={["parent"]}>
              <ParentProgress />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/messages"
          element={
            <ProtectedRoute allowedRoles={["parent"]}>
              <ParentMessages />
            </ProtectedRoute>
          }
        />

        {/* Teacher Routes */}
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/users"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/users/:type/:id"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherSpecUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/materials"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherMaterials />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/lessons/:id"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherSpecLessons />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/assignments/:assignmentId/submissions"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <ViewSubmissions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/messages"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherMessages />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes - Separate Login */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]} redirectTo="/admin/login">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/teachers"
          element={
            <ProtectedRoute allowedRoles={["admin"]} redirectTo="/admin/login">
              <AdminTeachers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={["admin"]} redirectTo="/admin/login">
              <AdminReports />
            </ProtectedRoute>
          }
        />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
