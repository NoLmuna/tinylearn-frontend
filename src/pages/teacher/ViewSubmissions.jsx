import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ArrowLeft, FileText, User, Calendar, CheckCircle2, Clock, Award, AlertCircle, BookOpen, Search, Filter, Eye } from 'lucide-react';
import logo from '../../assets/levelup-logo.png';
import { useTeacherSubmissions, useGradeSubmission, useAssignmentById } from '../../hooks/teacherHooks';

/**
 * Teacher View Submissions Page
 * View and grade student submissions for an assignment
 */
function ViewSubmissions() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [gradeForm, setGradeForm] = useState({ score: '', feedback: '' });
  const [gradeErrors, setGradeErrors] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');

  const { data: assignmentData } = useAssignmentById(assignmentId);
  const { data: submissionsData, isLoading } = useTeacherSubmissions({ 
    assignmentId,
    graded: filterStatus === 'all' ? 'all' : filterStatus === 'graded' ? 'graded' : 'ungraded'
  });
  const gradeSubmission = useGradeSubmission();

  const assignment = assignmentData?.data || null;
  const submissions = submissionsData?.data?.submissions || [];

  const handleGradeClick = (submission) => {
    setSelectedSubmission(submission);
    setGradeForm({
      score: submission.score || '',
      feedback: submission.feedback || ''
    });
    setGradeErrors({});
    setShowGradeModal(true);
  };

  const handleGradeInputChange = (e) => {
    const { name, value } = e.target;
    setGradeForm(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (gradeErrors[name]) {
      setGradeErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateGradeForm = () => {
    const errors = {};
    
    if (!gradeForm.score || gradeForm.score === '') {
      errors.score = 'Score is required';
    } else {
      const scoreValue = parseFloat(gradeForm.score);
      if (isNaN(scoreValue) || scoreValue < 0) {
        errors.score = 'Score must be a valid number';
      } else if (assignment && scoreValue > assignment.maxPoints) {
        errors.score = `Score cannot exceed ${assignment.maxPoints} points`;
      }
    }

    setGradeErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitGrade = async () => {
    if (!validateGradeForm()) {
      return;
    }

    try {
      await gradeSubmission.mutateAsync({
        submissionId: selectedSubmission._id || selectedSubmission.id,
        score: parseFloat(gradeForm.score),
        feedback: gradeForm.feedback.trim() || null
      });
      
      setShowGradeModal(false);
      setSelectedSubmission(null);
      setGradeForm({ score: '', feedback: '' });
    } catch (error) {
      console.error('Grade submission error:', error);
      setGradeErrors({ submit: error.response?.data?.message || 'Failed to grade submission. Please try again.' });
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft' },
      submitted: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Submitted' },
      graded: { bg: 'bg-green-100', text: 'text-green-700', label: 'Graded' },
      returned: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Returned' }
    };
    const badge = badges[status] || badges.draft;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-indigo-500 rounded-2xl flex items-center justify-center animate-pulse">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <div className="text-2xl text-gray-600 font-semibold">Loading submissions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/teacher/materials" className="flex items-center gap-3">
                <img src={logo} alt="TinyLearn" className="h-10 w-10 object-contain" />
                <div className="hidden sm:block">
                  <h1 className="text-xl font-black text-gray-900">Teacher Portal</h1>
                </div>
              </Link>
            </div>
            <Button
              onClick={() => navigate('/teacher/materials')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Materials
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Assignment Header */}
        {assignment && (
          <Card className="mb-6 border-2 border-indigo-200">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-gray-900 mb-2">
                {assignment.title}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {assignment.lessonId && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Lesson: {assignment.lessonId.title}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Due: {formatDate(assignment.dueDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>Max Points: {assignment.maxPoints}</span>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Filters and Stats */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Submissions</option>
              <option value="ungraded">Ungraded</option>
              <option value="graded">Graded</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold">{submissions.length}</span> submission{submissions.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {/* Submissions List */}
        {submissions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No submissions found</h3>
              <p className="text-gray-600">
                {filterStatus === 'all' 
                  ? 'No students have submitted this assignment yet.'
                  : filterStatus === 'graded'
                  ? 'No graded submissions found.'
                  : 'No ungraded submissions found.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => {
              const submissionId = submission._id || submission.id;
              const student = submission.studentId || {};
              const studentName = student.firstName && student.lastName 
                ? `${student.firstName} ${student.lastName}`
                : 'Unknown Student';
              const isGraded = submission.status === 'graded';
              const percentage = submission.percentage || (submission.score && assignment 
                ? ((submission.score / assignment.maxPoints) * 100).toFixed(2) 
                : null);

              return (
                <Card key={submissionId} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <User className="w-5 h-5 text-gray-600" />
                          <h3 className="text-lg font-bold text-gray-900">{studentName}</h3>
                          {getStatusBadge(submission.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 ml-8">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Submitted: {formatDate(submission.submittedAt)}</span>
                          </div>
                          {isGraded && submission.gradedAt && (
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Graded: {formatDate(submission.gradedAt)}</span>
                            </div>
                          )}
                        </div>
                        {isGraded && (
                          <div className="ml-8 mt-2 flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4 text-green-600" />
                              <span className="font-bold text-green-700">
                                Score: {submission.score} / {assignment?.maxPoints || 'N/A'}
                              </span>
                            </div>
                            {percentage && (
                              <span className="text-sm text-gray-600">
                                ({percentage}% - {submission.gradeLetter || 'N/A'})
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setShowGradeModal(true);
                            setGradeForm({
                              score: submission.score || '',
                              feedback: submission.feedback || ''
                            });
                          }}
                          className={isGraded ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' : ''}
                        >
                          {isGraded ? 'Update Grade' : 'Grade'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setShowGradeModal(true);
                            setGradeForm({
                              score: submission.score || '',
                              feedback: submission.feedback || ''
                            });
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Grade Modal */}
      {showGradeModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl shadow-2xl">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-black">Grade Submission</CardTitle>
                <button
                  onClick={() => {
                    setShowGradeModal(false);
                    setSelectedSubmission(null);
                    setGradeForm({ score: '', feedback: '' });
                    setGradeErrors({});
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Student Info */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Student</h3>
                  <p className="text-gray-700">
                    {selectedSubmission.studentId?.firstName} {selectedSubmission.studentId?.lastName}
                  </p>
                </div>

                {/* Submission Content */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Submission</h3>
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 max-h-60 overflow-y-auto">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedSubmission.content || 'No content submitted'}
                    </p>
                  </div>
                </div>

                {/* Grade Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Score * (Max: {assignment?.maxPoints || 'N/A'})
                    </label>
                    <input
                      type="number"
                      name="score"
                      value={gradeForm.score}
                      onChange={handleGradeInputChange}
                      min="0"
                      max={assignment?.maxPoints || 1000}
                      step="0.01"
                      className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        gradeErrors.score ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Enter score"
                    />
                    {gradeErrors.score && (
                      <p className="text-xs text-red-600 mt-1">{gradeErrors.score}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Feedback (Optional)
                    </label>
                    <textarea
                      name="feedback"
                      value={gradeForm.feedback}
                      onChange={handleGradeInputChange}
                      rows="4"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Provide feedback to the student..."
                    />
                  </div>
                </div>

                {/* Error Message */}
                {gradeErrors.submit && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm font-semibold text-red-800">{gradeErrors.submit}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => {
                      setShowGradeModal(false);
                      setSelectedSubmission(null);
                      setGradeForm({ score: '', feedback: '' });
                      setGradeErrors({});
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitGrade}
                    disabled={gradeSubmission.isPending}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-purple-600 hover:to-indigo-600"
                  >
                    {gradeSubmission.isPending ? 'Grading...' : 'Submit Grade'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default ViewSubmissions;

