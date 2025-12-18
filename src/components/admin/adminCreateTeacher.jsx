import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { AlertCircle, UserPlus2 } from 'lucide-react';
import { useCreateTeacher } from '../../hooks/adminHooks.jsx';

function AdminCreateTeacher({ onCancel }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    bio: '',
    subjectSpecialty: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const createTeacherMutation = useCreateTeacher();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const data = await createTeacherMutation.mutateAsync(formData);

      if (data) {
        setSuccess('Teacher account created successfully.');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          bio: '',
          subjectSpecialty: '',
        });
        // Optionally close modal on success
        if (onCancel) {
          onCancel();
        }
      }
    } catch (err) {
      if (err?.name === 'ZodError') {
        const first = err.errors?.[0];
        setError(first?.message ?? 'Please check the form fields.');
        return;
      }

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Unable to create teacher. Please try again.';
      setError(message);
      console.error('Create teacher error:', err);
    }
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-xl border rounded-2xl w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <UserPlus2 className="w-5 h-5" />
          Create New Teacher
        </CardTitle>
        <CardDescription>Register a new teacher account for your center.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg flex items-start gap-2 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="firstName">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4C21A] focus:border-transparent text-sm"
                placeholder="Jane"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="lastName">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4C21A] focus:border-transparent text-sm"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4C21A] focus:border-transparent text-sm"
              placeholder="teacher@tinylearn.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="password">
              Temporary Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4C21A] focus:border-transparent text-sm"
              placeholder="Minimum 6 characters"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="subjectSpecialty">
                Subject Specialty
              </label>
              <input
                id="subjectSpecialty"
                name="subjectSpecialty"
                value={formData.subjectSpecialty}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4C21A] focus:border-transparent text-sm"
                placeholder="Math, Reading, Science..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="bio">
                Short Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4C21A] focus:border-transparent text-sm resize-none"
                placeholder="Optional introduction"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCancel}
                className="w-full md:w-auto"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              size="sm"
              disabled={createTeacherMutation.isPending}
              className="w-full md:w-auto"
            >
              {createTeacherMutation.isPending ? 'Creating...' : 'Create Teacher'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default AdminCreateTeacher;

