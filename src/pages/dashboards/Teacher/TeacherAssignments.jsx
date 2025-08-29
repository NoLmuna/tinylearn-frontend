import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../../services/api';
import DashboardNavbar from '../../../components/ui/DashboardNavbar';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import {
  DocumentTextIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CalendarDaysIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const TeacherAssignments = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const assignmentTypes = [
    'homework',
    'quiz',
    'project',
    'essay',
    'presentation',
    'lab',
    'other'
  ];

  useEffect(() => {
    fetchAssignments();
  }, []);

  const filterAssignments = React.useCallback(() => {
    let filtered = assignments;

    if (searchTerm) {
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter) {
      filtered = filtered.filter(assignment => assignment.assignmentType === typeFilter);
    }

    if (statusFilter) {
      const now = new Date();
      filtered = filtered.filter(assignment => {
        const dueDate = new Date(assignment.dueDate);
        switch (statusFilter) {
          case 'upcoming':
            return dueDate > now;
          case 'overdue':
            return dueDate < now;
          case 'graded':
            return assignment.isGraded;
          case 'ungraded':
            return !assignment.isGraded;
          default:
            return true;
        }
      });
    }

    setFilteredAssignments(filtered);
  }, [assignments, searchTerm, typeFilter, statusFilter]);

  useEffect(() => {
    filterAssignments();
  }, [filterAssignments]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await api.getAssignments();
      
      if (response.success) {
        // Handle both direct array and nested object format
        const assignmentsData = response.data;
        const assignmentsList = Array.isArray(assignmentsData) ? assignmentsData : (assignmentsData.assignments || []);
        setAssignments(assignmentsList);
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

  const handleCreateAssignment = () => {
    navigate('/teacher/assignments/create');
  };

  const handleViewAssignment = (assignmentId) => {
    navigate(`/teacher/assignments/${assignmentId}`);
  };

  const handleEditAssignment = (assignmentId) => {
    navigate(`/teacher/assignments/${assignmentId}/edit`);
  };

  const handleGradeAssignment = (assignmentId) => {
    navigate(`/teacher/assignments/${assignmentId}/grade`);
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) {
      try {
        const response = await api.deleteAssignment(assignmentId);
        
        if (response.success) {
          toast.success('Assignment deleted successfully');
          fetchAssignments();
        } else {
          toast.error('Failed to delete assignment');
        }
      } catch (error) {
        console.error('Failed to delete assignment:', error);
        toast.error('Failed to delete assignment');
      }
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setStatusFilter('');
  };

  const getStatusInfo = (assignment) => {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const isOverdue = dueDate < now;
    const daysDiff = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

    if (assignment.isGraded) {
      return {
        color: 'bg-green-100 text-green-800',
        text: 'Graded',
        icon: null
      };
    }

    if (isOverdue) {
      return {
        color: 'bg-red-100 text-red-800',
        text: 'Overdue',
        icon: <ExclamationTriangleIcon className="h-3 w-3" />
      };
    }

    if (daysDiff <= 3) {
      return {
        color: 'bg-yellow-100 text-yellow-800',
        text: `Due in ${daysDiff} day${daysDiff !== 1 ? 's' : ''}`,
        icon: <ClockIcon className="h-3 w-3" />
      };
    }

    return {
      color: 'bg-blue-100 text-blue-800',
      text: 'Active',
      icon: null
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <DashboardNavbar role="teacher" currentPage="Assignments" />
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <DashboardNavbar role="teacher" currentPage="Assignments" />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <DocumentTextIcon className="h-8 w-8 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-800">My Assignments</h1>
            </div>
            <Button onClick={handleCreateAssignment}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Create New Assignment
            </Button>
          </div>
          <p className="text-gray-600">Manage homework, quizzes, and projects for your students</p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <FunnelIcon className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="ml-auto"
            >
              Clear All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Search assignments..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                {assignmentTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="upcoming">Upcoming</option>
                <option value="overdue">Overdue</option>
                <option value="graded">Graded</option>
                <option value="ungraded">Needs Grading</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            Showing {filteredAssignments.length} of {assignments.length} assignments
          </p>
        </div>

        {/* Assignments List */}
        {filteredAssignments.length > 0 ? (
          <div className="space-y-4">
            {filteredAssignments.map((assignment) => {
              const statusInfo = getStatusInfo(assignment);
              return (
                <Card
                  key={assignment.id}
                  className="p-6 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {assignment.title}
                            </h3>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.color}`}>
                              {statusInfo.icon}
                              {statusInfo.text}
                            </div>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3">
                            {assignment.description}
                          </p>
                          
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <DocumentTextIcon className="h-4 w-4" />
                              <span>{assignment.assignmentType?.charAt(0).toUpperCase() + assignment.assignmentType?.slice(1) || 'Assignment'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CalendarDaysIcon className="h-4 w-4" />
                              <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>Max Points: {assignment.maxPoints || 100}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewAssignment(assignment.id)}
                        title="View assignment"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditAssignment(assignment.id)}
                        title="Edit assignment"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      {!assignment.isGraded && (
                        <Button
                          size="sm"
                          onClick={() => handleGradeAssignment(assignment.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Grade
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAssignment(assignment.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete assignment"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {assignments.length === 0 ? 'No assignments created yet' : 'No assignments match your filters'}
            </h3>
            <p className="text-gray-600 mb-6">
              {assignments.length === 0 
                ? 'Create your first assignment to give students tasks and homework'
                : 'Try adjusting your search criteria or filters'
              }
            </p>
            {assignments.length === 0 ? (
              <Button onClick={handleCreateAssignment}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Your First Assignment
              </Button>
            ) : (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default TeacherAssignments;
