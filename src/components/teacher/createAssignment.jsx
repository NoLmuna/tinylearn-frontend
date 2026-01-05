import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { X, Plus, CheckCircle, AlertCircle, FileText, Users, Calendar, Award, BookOpen } from 'lucide-react';
import { useCreateAssignment } from '../../hooks/teacherHooks';
import { useTeacherLessons } from '../../hooks/teacherHooks';
import { useAssignedStudents } from '../../hooks/teacherHooks';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Create Assignment Modal Component
 * Form to create a new assignment
 */
function CreateAssignment({ isOpen, onClose }) {
  const queryClient = useQueryClient();
  const createAssignment = useCreateAssignment();
  const { data: lessonsData } = useTeacherLessons(false);
  const { data: studentsData } = useAssignedStudents(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    lessonId: '',
    assignedTo: [],
    assignToAll: false,
    dueDate: '',
    maxPoints: 100,
    assignmentType: 'homework',
    attachments: []
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const lessons = lessonsData?.data?.lessons || [];
  const students = studentsData?.data || [];

  const assignmentTypes = [
    { value: 'homework', label: 'Homework' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'project', label: 'Project' },
    { value: 'reading', label: 'Reading' },
    { value: 'practice', label: 'Practice' }
  ];

  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        lessonId: '',
        assignedTo: [],
        assignToAll: false,
        dueDate: '',
        maxPoints: 100,
        assignmentType: 'homework',
        attachments: []
      });
      setFormErrors({});
      setSuccessMessage('');
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : value);
    
    setFormData(prev => {
      if (name === 'assignToAll') {
        return {
          ...prev,
          assignToAll: checked,
          assignedTo: checked ? [] : prev.assignedTo
        };
      }
      return {
        ...prev,
        [name]: newValue
      };
    });

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleStudentToggle = (studentId) => {
    setFormData(prev => {
      const currentAssigned = prev.assignedTo || [];
      const isSelected = currentAssigned.includes(studentId);
      
      return {
        ...prev,
        assignedTo: isSelected
          ? currentAssigned.filter(id => id !== studentId)
          : [...currentAssigned, studentId],
        assignToAll: false
      };
    });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    if (!formData.dueDate) {
      errors.dueDate = 'Due date is required';
    } else {
      const dueDate = new Date(formData.dueDate);
      const now = new Date();
      if (dueDate <= now) {
        errors.dueDate = 'Due date must be in the future';
      }
    }
    if (formData.maxPoints < 1 || formData.maxPoints > 1000) {
      errors.maxPoints = 'Max points must be between 1 and 1000';
    }
    if (!formData.assignToAll && (!formData.assignedTo || formData.assignedTo.length === 0)) {
      errors.assignedTo = 'Please assign to at least one student or select "Assign to All Students"';
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
      const assignmentData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        lessonId: formData.lessonId || null,
        assignedTo: formData.assignToAll ? [] : formData.assignedTo,
        dueDate: formData.dueDate,
        maxPoints: formData.maxPoints,
        assignmentType: formData.assignmentType,
        attachments: formData.attachments || []
      };
      
      await createAssignment.mutateAsync(assignmentData);
      setSuccessMessage('Assignment created successfully!');

      // Reset form
      setFormData({
        title: '',
        description: '',
        lessonId: '',
        assignedTo: [],
        assignToAll: false,
        dueDate: '',
        maxPoints: 100,
        assignmentType: 'homework',
        attachments: []
      });
      setFormErrors({});

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['teacher-assignments'] });

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      console.error('Creation error:', error);
      setFormErrors({ submit: error.response?.data?.message || 'Failed to create assignment. Please try again.' });
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      lessonId: '',
      assignedTo: [],
      assignToAll: false,
      dueDate: '',
      maxPoints: 100,
      assignmentType: 'homework',
      attachments: []
    });
    setFormErrors({});
    setSuccessMessage('');
    onClose();
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between sticky top-0 bg-white z-10">
          <CardTitle className="text-2xl font-black flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Create New Assignment
          </CardTitle>
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

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-gray-900 border-b border-gray-200 pb-2">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    formErrors.title ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="e.g., Algebra Practice Set 1"
                />
                {formErrors.title && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    formErrors.description ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="Assignment description and instructions..."
                />
                {formErrors.description && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.description}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <BookOpen className="w-4 h-4" />
                  Link to Lesson (Optional)
                </label>
                <select
                  name="lessonId"
                  value={formData.lessonId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a lesson (optional)</option>
                  {lessons.filter(l => l.isActive !== false).map((lesson) => (
                    <option key={lesson._id || lesson.id} value={lesson._id || lesson.id}>
                      {lesson.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Assignment Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-gray-900 border-b border-gray-200 pb-2">Assignment Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4" />
                    Due Date *
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    min={getMinDate()}
                    className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      formErrors.dueDate ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {formErrors.dueDate && (
                    <p className="text-xs text-red-600 mt-1">{formErrors.dueDate}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <Award className="w-4 h-4" />
                    Max Points *
                  </label>
                  <input
                    type="number"
                    name="maxPoints"
                    value={formData.maxPoints}
                    onChange={handleInputChange}
                    min="1"
                    max="1000"
                    className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      formErrors.maxPoints ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {formErrors.maxPoints && (
                    <p className="text-xs text-red-600 mt-1">{formErrors.maxPoints}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Assignment Type *</label>
                <select
                  name="assignmentType"
                  value={formData.assignmentType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {assignmentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Student Assignment */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Assign To
              </h3>
              
              <div>
                <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-300 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    name="assignToAll"
                    checked={formData.assignToAll}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span className="font-semibold text-gray-900">Assign to All Students</span>
                </label>
              </div>

              {!formData.assignToAll && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Select Students *</label>
                  <div className={`max-h-60 overflow-y-auto border-2 rounded-xl p-4 ${
                    formErrors.assignedTo ? 'border-red-300' : 'border-gray-200'
                  }`}>
                    {students.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">No students available</p>
                    ) : (
                      <div className="space-y-2">
                        {students.map((student) => {
                          const studentId = student._id || student.id || student.studentId?._id || student.studentId?.id;
                          const studentName = student.firstName && student.lastName
                            ? `${student.firstName} ${student.lastName}`
                            : student.studentId?.firstName && student.studentId?.lastName
                            ? `${student.studentId.firstName} ${student.studentId.lastName}`
                            : 'Unknown Student';
                          
                          return (
                            <label
                              key={studentId}
                              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={formData.assignedTo.includes(studentId)}
                                onChange={() => handleStudentToggle(studentId)}
                                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                              />
                              <span className="text-sm text-gray-700">{studentName}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {formErrors.assignedTo && (
                    <p className="text-xs text-red-600 mt-1">{formErrors.assignedTo}</p>
                  )}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                onClick={handleClose}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createAssignment.isPending}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-purple-600 hover:to-indigo-600"
              >
                {createAssignment.isPending ? 'Creating...' : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Assignment
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateAssignment;

