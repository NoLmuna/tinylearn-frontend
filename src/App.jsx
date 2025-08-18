import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Lessons from './pages/Lessons';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import StudentDashboard from './pages/dashboards/Student/StudentDashboard';
import TeacherDashboard from './pages/dashboards/Teacher/TeacherDashboard';
import ParentDashboard from './pages/dashboards/Parent/ParentDashboard';
import AdminDashboard from './pages/dashboards/Admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/parent" element={<ParentDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="student" element={<StudentDashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="lessons" element={<Lessons />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
