import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { X, CheckCircle, AlertCircle, User, Mail, Lock, Award, Phone, Users } from 'lucide-react';
import { useCreateStudent } from '../../hooks/teacherHooks';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Create Student and Parent Modal Component
 * Combined form to create both student and parent accounts together
 */
function CreateStudentAndParent({ isOpen, onClose }) {
  const queryClient = useQueryClient();
  const createStudent = useCreateStudent();
  
  const [formData, setFormData] = useState({
    // Student fields
    studentFirstName: '',
    studentLastName: '',
    studentEmail: '',
    studentPassword: '',
    grade: '',
    age: '',
    // Parent fields
    parentFirstName: '',
    parentLastName: '',
    parentEmail: '',
    parentPassword: '',
    phoneNumber: '',
    relationship: '',
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate student fields
    if (!formData.studentFirstName.trim()) {
      errors.studentFirstName = 'Student first name is required';
    }
    if (!formData.studentLastName.trim()) {
      errors.studentLastName = 'Student last name is required';
    }
    if (!formData.studentEmail.trim()) {
      errors.studentEmail = 'Student email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.studentEmail)) {
      errors.studentEmail = 'Please enter a valid email address';
    }
    if (!formData.studentPassword.trim()) {
      errors.studentPassword = 'Student password is required';
    } else if (formData.studentPassword.length < 6) {
      errors.studentPassword = 'Password must be at least 6 characters';
    }

    // Validate parent fields
    if (!formData.parentFirstName.trim()) {
      errors.parentFirstName = 'Parent first name is required';
    }
    if (!formData.parentLastName.trim()) {
      errors.parentLastName = 'Parent last name is required';
    }
    if (!formData.parentEmail.trim()) {
      errors.parentEmail = 'Parent email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)) {
      errors.parentEmail = 'Please enter a valid email address';
    }
    if (!formData.parentPassword.trim()) {
      errors.parentPassword = 'Parent password is required';
    } else if (formData.parentPassword.length < 6) {
      errors.parentPassword = 'Password must be at least 6 characters';
    }

    // Check if emails are different
    if (formData.studentEmail.toLowerCase() === formData.parentEmail.toLowerCase()) {
      errors.parentEmail = 'Parent email must be different from student email';
    }

    // Validate age
    if (formData.age && (isNaN(formData.age) || formData.age < 1 || formData.age > 18)) {
      errors.age = 'Age must be between 1 and 18';
    }

    // Validate phone number
    if (formData.phoneNumber && !/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        // Student data
        studentFirstName: formData.studentFirstName.trim(),
        studentLastName: formData.studentLastName.trim(),
        studentEmail: formData.studentEmail.trim().toLowerCase(),
        studentPassword: formData.studentPassword,
        // Parent data
        parentFirstName: formData.parentFirstName.trim(),
        parentLastName: formData.parentLastName.trim(),
        parentEmail: formData.parentEmail.trim().toLowerCase(),
        parentPassword: formData.parentPassword,
      };

      // Add optional fields
      if (formData.grade) submitData.grade = formData.grade;
      if (formData.age) submitData.age = parseInt(formData.age);
      if (formData.phoneNumber) submitData.phoneNumber = formData.phoneNumber.trim();
      if (formData.relationship) submitData.relationship = formData.relationship.trim();
      
      await createStudent.mutateAsync(submitData);
      setSuccessMessage('Student and parent created successfully!');

      // Reset form
      setFormData({
        studentFirstName: '',
        studentLastName: '',
        studentEmail: '',
        studentPassword: '',
        grade: '',
        age: '',
        parentFirstName: '',
        parentLastName: '',
        parentEmail: '',
        parentPassword: '',
        phoneNumber: '',
        relationship: '',
      });
      setFormErrors({});

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['assigned-students'] });
      queryClient.invalidateQueries({ queryKey: ['assigned-parents'] });

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      console.error('Creation error:', error);
      setFormErrors({ submit: error.response?.data?.message || 'Creation failed. Please try again.' });
    }
  };

  const handleClose = () => {
    setFormData({
      studentFirstName: '',
      studentLastName: '',
      studentEmail: '',
      studentPassword: '',
      grade: '',
      age: '',
      parentFirstName: '',
      parentLastName: '',
      parentEmail: '',
      parentPassword: '',
      phoneNumber: '',
      relationship: '',
    });
    setFormErrors({});
    setSuccessMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between sticky top-0 bg-white z-10">
          <CardTitle className="text-2xl font-black">Create Student & Parent</CardTitle>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {successMessage && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-sm font-semibold text-green-800">{successMessage}</p>
              </div>
            )}

            {/* Error Message */}
            {formErrors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm font-semibold text-red-800">{formErrors.submit}</p>
              </div>
            )}

            {/* Student Information Section */}
            <div className="space-y-4 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-black text-blue-900">Student Information</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="studentFirstName"
                    value={formData.studentFirstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.studentFirstName ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="John"
                  />
                  {formErrors.studentFirstName && (
                    <p className="text-xs text-red-600 mt-1">{formErrors.studentFirstName}</p>
                  )}
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="studentLastName"
                    value={formData.studentLastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.studentLastName ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Doe"
                  />
                  {formErrors.studentLastName && (
                    <p className="text-xs text-red-600 mt-1">{formErrors.studentLastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <Mail className="w-4 h-4" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="studentEmail"
                  value={formData.studentEmail}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.studentEmail ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="student@example.com"
                />
                {formErrors.studentEmail && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.studentEmail}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <Lock className="w-4 h-4" />
                  Password *
                </label>
                <input
                  type="password"
                  name="studentPassword"
                  value={formData.studentPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.studentPassword ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="Minimum 6 characters"
                />
                {formErrors.studentPassword && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.studentPassword}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <Award className="w-4 h-4" />
                    Grade
                  </label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Grade</option>
                    <option value="5th Grade">5th Grade</option>
                    <option value="6th Grade">6th Grade</option>
                    <option value="7th Grade">7th Grade</option>
                    <option value="8th Grade">8th Grade</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="1"
                    max="18"
                    className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.age ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="1-18"
                  />
                  {formErrors.age && (
                    <p className="text-xs text-red-600 mt-1">{formErrors.age}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Parent Information Section */}
            <div className="space-y-4 p-4 bg-green-50 rounded-xl border-2 border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-black text-green-900">Parent Information</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="parentFirstName"
                    value={formData.parentFirstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      formErrors.parentFirstName ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Jane"
                  />
                  {formErrors.parentFirstName && (
                    <p className="text-xs text-red-600 mt-1">{formErrors.parentFirstName}</p>
                  )}
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="parentLastName"
                    value={formData.parentLastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      formErrors.parentLastName ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Doe"
                  />
                  {formErrors.parentLastName && (
                    <p className="text-xs text-red-600 mt-1">{formErrors.parentLastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <Mail className="w-4 h-4" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="parentEmail"
                  value={formData.parentEmail}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    formErrors.parentEmail ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="parent@example.com"
                />
                {formErrors.parentEmail && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.parentEmail}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <Lock className="w-4 h-4" />
                  Password *
                </label>
                <input
                  type="password"
                  name="parentPassword"
                  value={formData.parentPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    formErrors.parentPassword ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="Minimum 6 characters"
                />
                {formErrors.parentPassword && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.parentPassword}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      formErrors.phoneNumber ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="+1234567890"
                  />
                  {formErrors.phoneNumber && (
                    <p className="text-xs text-red-600 mt-1">{formErrors.phoneNumber}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2">Relationship</label>
                  <select
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Relationship</option>
                    <option value="mother">Mother</option>
                    <option value="father">Father</option>
                    <option value="guardian">Guardian</option>
                    <option value="grandmother">Grandmother</option>
                    <option value="grandfather">Grandfather</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                onClick={handleClose}
                variant="outline"
                className="flex-1"
                disabled={createStudent.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-purple-600 hover:to-indigo-600"
                disabled={createStudent.isPending}
              >
                {createStudent.isPending ? 'Creating...' : 'Create Student & Parent'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateStudentAndParent;

