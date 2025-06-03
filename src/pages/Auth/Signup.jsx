import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlayfulButton from '../../components/PlayfulButton';

const roleFields = {
  student: { label: 'Class Code', name: 'classCode', placeholder: 'Enter your class code' },
  parent: { label: 'Child Code', name: 'childCode', placeholder: 'Enter your child code' },
  tutor: { label: 'Staff Code', name: 'staffCode', placeholder: 'Enter your staff code' },
};

export default function Signup() {
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({ name: '', email: '', password: '', code: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add sign-up logic here
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-pink-50 via-yellow-50 to-sky-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-2">Join TinyLearn Today!</h2>
          <p className="text-base sm:text-lg text-gray-700">Create your account to get started</p>
        </div>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 sm:px-10 shadow-xl rounded-3xl border border-pink-100">
          <div className="flex justify-center gap-3 mb-8">
            {['student', 'parent', 'tutor'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`px-6 py-3 rounded-full text-base font-bold border-2 transition-colors shadow-md ${role === r ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-base font-medium text-gray-700 mb-1">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="block w-full rounded-lg border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-medium text-gray-800"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-1">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                className="block w-full rounded-lg border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-medium text-gray-800"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-base font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={form.password}
                onChange={handleChange}
                className="block w-full rounded-lg border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-medium text-gray-800"
              />
            </div>
            <div>
              <label htmlFor="code" className="block text-base font-medium text-gray-700 mb-1">{roleFields[role].label}</label>
              <input
                id="code"
                name="code"
                type="text"
                required
                placeholder={roleFields[role].placeholder}
                value={form.code}
                onChange={handleChange}
                className="block w-full rounded-lg border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-medium text-gray-800"
              />
            </div>

            <PlayfulButton type="submit" className="w-full text-xl py-4" color="yellow">
              Sign Up
            </PlayfulButton>
          </form>
          <div className="mt-8 text-center text-base">
            <span>Already have an account? </span>
            <a href="/login" className="text-primary hover:underline font-semibold">Sign In</a>
          </div>
        </div>
      </div>
    </div>
  );
} 