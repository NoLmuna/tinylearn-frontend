import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

/**
 * MainLayout Component
 * Wrapper layout with navigation for main pages
 */
function MainLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
