import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../../services/api';
import DashboardNavbar from '../../../components/ui/DashboardNavbar';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  UserIcon,
  CalendarDaysIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const GradeAssignment = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeData, setGradeData] = useState({
    score: '',
    feedback: '',
    status: 'graded'
  });

  const fetchAssignmentAndSubmissions = React.useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch assignment details and submissions in parallel
      const [assignmentRes, submissionsRes] = await Promise.all([
        api.getAssignment(assignmentId),
        api.getSubmissions({ assignmentId })
      ]);

      if (assignmentRes.success) {
        setAssignment(assignmentRes.data);
      }

      if (submissionsRes.success) {
        const submissionList = submissionsRes.data.submissions || [];
        setSubmissions(submissionList);
        
        // Auto-select first ungraded submission
        const firstUngraded = submissionList.find(sub => !sub.isGraded);
        if (firstUngraded) {
          setSelectedSubmission(firstUngraded);
        } else if (submissionList.length > 0) {
          setSelectedSubmission(submissionList[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch assignment data:', error);
      toast.error('Failed to load assignment data');
    } finally {
      setLoading(false);
    }
  }, [assignmentId]);

  useEffect(() => {
    if (assignmentId) {
      fetchAssignmentAndSubmissions();
    }
  }, [assignmentId, fetchAssignmentAndSubmissions]);

  const handleSubmissionSelect = (submission) => {
    setSelectedSubmission(submission);
    if (submission.isGraded) {
      setGradeData({
        score: submission.score || '',
        feedback: submission.feedback || '',
        status: submission.status || 'graded'
      });
    } else {
      setGradeData({
        score: '',
        feedback: '',
        status: 'graded'
      });
    }
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedSubmission) {
      toast.error('Please select a submission to grade');
      return;
    }

    if (!gradeData.score || parseFloat(gradeData.score) < 0 || parseFloat(gradeData.score) > (assignment?.maxPoints || 100)) {
      toast.error(`Score must be between 0 and ${assignment?.maxPoints || 100}`);
      return;
    }

    try {
      setSaving(true);
      
      const gradePayload = {
        score: parseFloat(gradeData.score),
        feedback: gradeData.feedback.trim(),
        status: gradeData.status,
        isGraded: true
      };

      const response = await api.gradeSubmission(selectedSubmission.id, gradePayload);
      
      if (response.success) {
        toast.success('Submission graded successfully!');
        fetchAssignmentAndSubmissions(); // Refresh data
        
        // Move to next ungraded submission
        const currentIndex = submissions.findIndex(sub => sub.id === selectedSubmission.id);
        const nextUngraded = submissions.slice(currentIndex + 1).find(sub => !sub.isGraded);
        if (nextUngraded) {
          setSelectedSubmission(nextUngraded);
          setGradeData({ score: '', feedback: '', status: 'graded' });
        }
      } else {
        toast.error('Failed to grade submission');
      }
    } catch (error) {
      console.error('Failed to grade submission:', error);
      toast.error('Failed to grade submission');
    } finally {
      setSaving(false);
    }
  };

  const getSubmissionStatusColor = (submission) => {
    if (submission.isGraded) {
      const score = submission.score || 0;
      const maxPoints = assignment?.maxPoints || 100;
      const percentage = (score / maxPoints) * 100;
      
      if (percentage >= 90) return 'bg-green-100 text-green-800';
      if (percentage >= 80) return 'bg-blue-100 text-blue-800';
      if (percentage >= 70) return 'bg-yellow-100 text-yellow-800';
      return 'bg-red-100 text-red-800';
    }
    return 'bg-orange-100 text-orange-800';
  };

  const getSubmissionStatusText = (submission) => {
    if (submission.isGraded) {
      return `${submission.score}/${assignment?.maxPoints || 100}`;
    }
    return 'Pending';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <DashboardNavbar role="teacher" currentPage="Grade Assignment" />
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <DashboardNavbar role="teacher" currentPage="Grade Assignment" />
        <div className="max-w-7xl mx-auto p-6">
          <Card className="p-8 text-center">
            <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Assignment not found</h2>
            <p className="text-gray-600 mb-4">The assignment you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/teacher/assignments')}>
              Back to Assignments
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <DashboardNavbar role="teacher" currentPage="Grade Assignment" />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/teacher/assignments')}
            className="mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Assignments
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <DocumentTextIcon className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-800">Grade Assignment</h1>
          </div>
          <p className="text-gray-600">Review and grade student submissions</p>
        </div>

        {/* Assignment Info */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{assignment.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="h-4 w-4 text-gray-500" />
              <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <StarIcon className="h-4 w-4 text-gray-500" />
              <span>Max Points: {assignment.maxPoints || 100}</span>
            </div>
            <div className="flex items-center gap-2">
              <DocumentTextIcon className="h-4 w-4 text-gray-500" />
              <span>Type: {assignment.assignmentType?.charAt(0).toUpperCase() + assignment.assignmentType?.slice(1)}</span>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submissions List */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Submissions ({submissions.length})
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {submissions.length > 0 ? (
                  submissions.map((submission) => (
                    <div
                      key={submission.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedSubmission?.id === submission.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleSubmissionSelect(submission)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-gray-800">
                          {submission.studentName || `Student ${submission.studentId}`}
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSubmissionStatusColor(submission)}`}>
                          {getSubmissionStatusText(submission)}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                      </div>
                      {submission.isGraded && (
                        <div className="flex items-center gap-1 mt-1">
                          <CheckCircleIcon className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-green-600">Graded</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No submissions yet</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Grading Panel */}
          <div className="lg:col-span-2">
            {selectedSubmission ? (
              <div className="space-y-6">
                {/* Submission Details */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Submission by {selectedSubmission.studentName || `Student ${selectedSubmission.studentId}`}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Student Response
                      </label>
                      <div className="bg-gray-50 rounded-lg p-4 border">
                        <p className="text-gray-800">
                          {selectedSubmission.content || 'No content provided'}
                        </p>
                      </div>
                    </div>

                    {selectedSubmission.attachments && selectedSubmission.attachments.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Attachments
                        </label>
                        <div className="space-y-2">
                          {selectedSubmission.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                              <DocumentTextIcon className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-700">{attachment.name || `Attachment ${index + 1}`}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Grading Form */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {selectedSubmission.isGraded ? 'Update Grade' : 'Grade Submission'}
                  </h3>
                  
                  <form onSubmit={handleGradeSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Score (out of {assignment.maxPoints || 100})
                        </label>
                        <input
                          type="number"
                          value={gradeData.score}
                          onChange={(e) => setGradeData(prev => ({ ...prev, score: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          min="0"
                          max={assignment.maxPoints || 100}
                          step="0.5"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          value={gradeData.status}
                          onChange={(e) => setGradeData(prev => ({ ...prev, status: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="graded">Graded</option>
                          <option value="needs_revision">Needs Revision</option>
                          <option value="excellent">Excellent</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Feedback
                      </label>
                      <textarea
                        value={gradeData.feedback}
                        onChange={(e) => setGradeData(prev => ({ ...prev, feedback: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows="4"
                        placeholder="Provide feedback to help the student improve..."
                      />
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/teacher/assignments')}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={saving}
                        className="min-w-[120px]"
                      >
                        {saving ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Saving...
                          </div>
                        ) : (
                          selectedSubmission.isGraded ? 'Update Grade' : 'Grade Submission'
                        )}
                      </Button>
                    </div>
                  </form>
                </Card>
              </div>
            ) : (
              <Card className="p-12 text-center">
                <XCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a submission</h3>
                <p className="text-gray-600">Choose a submission from the left panel to start grading</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeAssignment;
