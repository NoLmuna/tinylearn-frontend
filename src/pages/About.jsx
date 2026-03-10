/**
 * About Page Component
 * Detailed information about TinyLearn
 */
function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 border border-gray-100">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
            About TinyLearn
          </h1>

          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              TinyLearn is a modern web application built with the latest
              technologies to provide a seamless learning experience. We believe
              that education should be accessible, engaging, and effective for
              everyone.
            </p>

            <p>
              Our platform combines cutting-edge technology with proven
              educational methods to create an experience that's both powerful
              and intuitive. Whether you're starting a new career, expanding
              your skills, or pursuing a passion, we're here to support your
              journey.
            </p>

            <p>
              Founded in 2025, TinyLearn has grown to serve thousands of
              learners worldwide. Our team is dedicated to continuous
              improvement and innovation, ensuring that you always have access
              to the best learning tools and resources.
            </p>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Values
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">•</span>
                  <span>
                    <strong>Accessibility:</strong> Learning should be available
                    to everyone, everywhere
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">•</span>
                  <span>
                    <strong>Quality:</strong> We maintain the highest standards
                    in all our content
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">•</span>
                  <span>
                    <strong>Collaboration:</strong> Facilitating seamless
                    connections between teachers and parents
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">•</span>
                  <span>
                    <strong>Engagement:</strong> Making learning an exciting
                    adventure for students
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
