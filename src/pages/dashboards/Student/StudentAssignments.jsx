import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../../services/api';
import DashboardNavbar from '../../../components/ui/DashboardNavbar';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PaperAirplaneIcon,
  EyeIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

const StudentAssignments = () => {
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');

  const statuses = [
    { value: 'all', label: 'All Assignments' },
    { value: 'not_started', label: 'Not Started' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'overdue', label: 'Overdue' }
  ];

  const filterAndSortAssignments = useCallback(() => {
    let filtered = assignments;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(assignment => assignment.status === statusFilter);
    }

    // Sort assignments
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'subject':
          return a.subject.localeCompare(b.subject);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    setFilteredAssignments(filtered);
  }, [assignments, searchTerm, statusFilter, sortBy]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await api.getAssignments();
      
      if (response.success) {
        const assignments = response.data.assignments || response.data || [];
        
        // Process assignments to add student-specific fields
        const processedAssignments = assignments.map(assignment => {
          const now = new Date();
          const dueDate = new Date(assignment.dueDate);
          const isOverdue = dueDate < now && (!assignment.submission || assignment.submission.status !== 'submitted');
          
          let status = 'not_started';
          let progress = 0;
          
          if (assignment.submission) {
            switch (assignment.submission.status) {
              case 'submitted':
              case 'graded':
                status = 'submitted';
                progress = 100;
                break;
              case 'draft':
                status = 'in_progress';
                progress = assignment.submission.progress || 25;
                break;
              default:
                status = 'not_started';
                progress = 0;
            }
          }
          
          if (isOverdue && status !== 'submitted') {
            status = 'overdue';
          }

          return {
            ...assignment,
            status,
            progress,
            submittedAt: assignment.submission?.submittedAt,
            grade: assignment.submission?.grade,
            feedback: assignment.submission?.feedback,
            estimatedTime: assignment.estimatedTime || 60, // Default 60 minutes
            subject: assignment.subject || 'General'
          };
        });
        
        setAssignments(processedAssignments);
      } else {
        toast.error('Failed to load assignments');
      }
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    filterAndSortAssignments();
  }, [assignments, searchTerm, statusFilter, sortBy, filterAndSortAssignments]);

  const startAssignment = async (assignment) => {
    try {
      toast.success(`Starting "${assignment.title}"...`, { icon: '📝' });
      // Here you would navigate to the assignment page
      // navigate(`/assignment/${assignment.id}`);
    } catch (error) {
      console.error('Failed to start assignment:', error);
      toast.error('Failed to start assignment');
    }
  };

  const viewSubmission = async (assignment) => {
    try {
      toast.success(`Viewing submission for "${assignment.title}"...`, { icon: '👀' });
      // Here you would navigate to the submission view page
      // navigate(`/assignment/${assignment.id}/submission`);
    } catch (error) {
      console.error('Failed to view submission:', error);
      toast.error('Failed to view submission');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'not_started': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'submitted': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'not_started': return DocumentTextIcon;
      case 'in_progress': return PlayIcon;
      case 'submitted': return CheckCircleIcon;
      case 'overdue': return ExclamationTriangleIcon;
      default: return DocumentTextIcon;
    }
  };

  const formatDueDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${diffDays} days`;
    }
  };

  const getSubjectEmoji = (subject) => {
    switch (subject) {
      case 'Math': return '🔢';
      case 'Science': return '🔬';
      case 'English': return '📚';
      case 'History': return '🏛️';
      default: return '📖';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar role="student" currentPage="Assignments" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar role="student" currentPage="Assignments" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Assignments</h1>
          <p className="text-gray-600">Complete your assignments and track your progress!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {assignments.length}
            </div>
            <div className="text-sm text-gray-600">Total Assignments</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {assignments.filter(a => a.status === 'in_progress').length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {assignments.filter(a => a.status === 'submitted').length}
            </div>
            <div className="text-sm text-gray-600">Submitted</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-red-600">
              {assignments.filter(a => a.status === 'overdue').length}
            </div>
            <div className="text-sm text-gray-600">Overdue</div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="title">Sort by Title</option>
              <option value="subject">Sort by Subject</option>
              <option value="status">Sort by Status</option>
            </select>

            {/* Results Count */}
            <div className="flex items-center text-gray-600">
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              {filteredAssignments.length} assignment{filteredAssignments.length !== 1 ? 's' : ''}
            </div>
          </div>
        </Card>

        {/* Assignments List */}
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => {
            const StatusIcon = getStatusIcon(assignment.status);
            const isOverdue = assignment.status === 'overdue';
            
            return (
              <Card key={assignment.id} className={`p-6 hover:shadow-lg transition-shadow duration-300 ${isOverdue ? 'border-red-200 bg-red-50' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-2xl">{getSubjectEmoji(assignment.subject)}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                        <p className="text-sm text-gray-600">{assignment.subject}</p>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-2">{assignment.description}</p>

                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                          {formatDueDate(assignment.dueDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        ~{assignment.estimatedTime} minutes
                      </div>
                      {assignment.grade && (
                        <div className="flex items-center gap-1">
                          <CheckCircleIcon className="h-4 w-4 text-green-600" />
                          Grade: {assignment.grade}%
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {assignment.status === 'in_progress' && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{assignment.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${assignment.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Feedback */}
                    {assignment.feedback && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-green-800">{assignment.feedback}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3 ml-6">
                    {/* Status Badge */}
                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(assignment.status)}`}>
                      <StatusIcon className="h-3 w-3" />
                      {assignment.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {assignment.status === 'submitted' ? (
                        <Button
                          onClick={() => viewSubmission(assignment)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm flex items-center gap-2"
                        >
                          <EyeIcon className="h-4 w-4" />
                          View
                        </Button>
                      ) : (
                        <Button
                          onClick={() => startAssignment(assignment)}
                          className={`${
                            assignment.status === 'overdue' 
                              ? 'bg-red-600 hover:bg-red-700' 
                              : 'bg-blue-600 hover:bg-blue-700'
                          } text-white px-4 py-2 text-sm flex items-center gap-2`}
                        >
                          {assignment.status === 'in_progress' ? (
                            <>
                              <PlayIcon className="h-4 w-4" />
                              Continue
                            </>
                          ) : (
                            <>
                              <PaperAirplaneIcon className="h-4 w-4" />
                              Start
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredAssignments.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAssignments;
