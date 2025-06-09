import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Lessons from './pages/Lessons';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import StudentDashboard from './pages/Student/StudentDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="student" element={<StudentDashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="parent" element={<Dashboard />} />
            <Route path="tutor" element={<Dashboard />} />
            <Route path="lessons" element={<Lessons />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
