import { Link } from 'react-router-dom';

/**
 * Home Page Component
 * Main landing page of the application
 */
function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to TinyLearn
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A clean and scalable Vite + React + TailwindCSS starter template
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/about"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Learn More
            </Link>
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-indigo-600 text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Powered by Vite for instant server start and blazing fast HMR
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-indigo-600 text-3xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">Beautiful UI</h3>
            <p className="text-gray-600">
              TailwindCSS configured and ready for rapid UI development
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-indigo-600 text-3xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">Scalable Structure</h3>
            <p className="text-gray-600">
              Organized folder structure for building applications that scale
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
