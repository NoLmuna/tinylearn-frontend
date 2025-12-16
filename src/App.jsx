import { Routes, Route } from 'react-router-dom';

// Public Pages
import Landing from './pages/Landing';
import Features from './pages/Features';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Main Login (for Student, Parent, Teacher)
import MainLogin from './pages/MainLogin';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';

// Parent Pages
import ParentDashboard from './pages/parent/Dashboard';

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';

/**
 * App Component
 * Main application component with routing configuration
 * Organized by user roles: Public, Student, Parent, Teacher, Admin
 */
function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/features" element={<Features />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* Main Login for Student, Parent, Teacher */}
      <Route path="/login" element={<MainLogin />} />
      
      {/* Student Routes */}
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/dashboard" element={<StudentDashboard />} /> {/* Legacy route */}
      
      {/* Parent Routes */}
      <Route path="/parent/dashboard" element={<ParentDashboard />} />
      
      {/* Teacher Routes */}
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      
      {/* Admin Routes - Separate Login */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      
      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
