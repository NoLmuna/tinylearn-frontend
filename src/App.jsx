import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

/**
 * App Component
 * Main application component with routing configuration
 */
function App() {
  return (
    <Routes>
      {/* Routes with MainLayout (includes Navbar) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      
      {/* 404 Route without layout */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
