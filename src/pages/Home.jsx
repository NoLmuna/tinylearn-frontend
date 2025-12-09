/**
 * Home Page Component
 * Main dashboard/home page after signing in
 */
function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Welcome Back!
          </h1>
          <p className="text-xl text-gray-600">
            Continue your learning journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard Card 1 */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">My Courses</h3>
            <p className="text-gray-600 mb-4">Continue where you left off</p>
            <div className="text-3xl font-bold text-blue-600">8</div>
            <p className="text-sm text-gray-500">Active courses</p>
          </div>

          {/* Dashboard Card 2 */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Achievements</h3>
            <p className="text-gray-600 mb-4">Your learning milestones</p>
            <div className="text-3xl font-bold text-green-600">24</div>
            <p className="text-sm text-gray-500">Badges earned</p>
          </div>

          {/* Dashboard Card 3 */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Study Time</h3>
            <p className="text-gray-600 mb-4">This week's progress</p>
            <div className="text-3xl font-bold text-purple-600">12h</div>
            <p className="text-sm text-gray-500">Total hours</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
