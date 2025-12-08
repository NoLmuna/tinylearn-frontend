import { Link } from 'react-router-dom';

/**
 * About Page Component
 * Information about the project
 */
function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8"
          >
            ← Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            About TinyLearn
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Project Structure
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                This starter template includes a well-organized folder structure:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><code className="bg-gray-100 px-2 py-1 rounded">assets/</code> - Static assets like images, fonts</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">components/</code> - Reusable UI components</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">features/</code> - Feature-specific components and logic</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">pages/</code> - Page-level components for routing</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">layouts/</code> - Layout wrapper components</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">hooks/</code> - Custom React hooks</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">contexts/</code> - React Context providers</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">services/</code> - API services and external integrations</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">utils/</code> - Utility functions and helpers</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">styles/</code> - Global styles and CSS files</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Technologies Used
            </h2>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-center gap-3">
                <span className="font-semibold">⚛️ React 19</span>
                <span>- Modern UI library</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">⚡ Vite</span>
                <span>- Next generation frontend tooling</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">🎨 TailwindCSS</span>
                <span>- Utility-first CSS framework</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">🛣️ React Router</span>
                <span>- Client-side routing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
