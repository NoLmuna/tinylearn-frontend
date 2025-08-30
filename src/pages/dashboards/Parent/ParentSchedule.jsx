import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import {
  CalendarDaysIcon,
  ClockIcon,
  BookOpenIcon,
  DocumentTextIcon,
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import DashboardNavbar from '../../../components/ui/DashboardNavbar';
import api from '../../../services/api';

const ParentSchedule = () => {
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduleData, setScheduleData] = useState({
    assignments: [],
    lessons: [],
    events: []
  });

  const fetchScheduleData = useCallback(async (child) => {
    try {
      console.log('📅 Fetching schedule data for child:', child.student.id);
      
      // For now, we'll generate a schedule based on assignments and lessons
      // In a real implementation, you might have separate schedule endpoints
      
      const assignments = child.submissions || [];
      const progress = child.progress || [];
      
      // Create upcoming assignments with due dates
      const upcomingAssignments = assignments
        .filter(sub => sub.assignment && new Date(sub.assignment.dueDate) > new Date())
        .map(sub => ({
          id: sub.assignment.id,
          title: sub.assignment.title,
          type: 'assignment',
          date: sub.assignment.dueDate,
          time: '23:59',
          description: sub.assignment.description,
          status: sub.status || 'pending',
          priority: new Date(sub.assignment.dueDate) - new Date() < 7 * 24 * 60 * 60 * 1000 ? 'high' : 'normal'
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      // Create lesson schedule
      const upcomingLessons = progress
        .filter(p => p.lesson && !p.completed)
        .slice(0, 10) // Limit to next 10 lessons
        .map((p, index) => {
          // Generate future dates for lessons (this would come from actual schedule in real app)
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + index + 1);
          
          return {
            id: p.lesson.id,
            title: p.lesson.title,
            type: 'lesson',
            date: futureDate.toISOString().split('T')[0],
            time: '10:00',
            description: p.lesson.description,
            category: p.lesson.category,
            difficulty: p.lesson.difficulty
          };
        });

      // Generate some example events
      const events = [
        {
          id: 'event1',
          title: 'Parent-Teacher Conference',
          type: 'event',
          date: (() => {
            const date = new Date();
            date.setDate(date.getDate() + 14);
            return date.toISOString().split('T')[0];
          })(),
          time: '15:00',
          description: 'Quarterly progress review meeting'
        },
        {
          id: 'event2',
          title: 'Science Fair Presentation',
          type: 'event',
          date: (() => {
            const date = new Date();
            date.setDate(date.getDate() + 21);
            return date.toISOString().split('T')[0];
          })(),
          time: '14:00',
          description: 'Student science project presentations'
        }
      ];

      setScheduleData({
        assignments: upcomingAssignments,
        lessons: upcomingLessons,
        events: events
      });
    } catch (error) {
      console.error('💥 Failed to fetch schedule data:', error);
      toast.error('Failed to load schedule data');
    }
  }, []);

  const fetchChildrenData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching parent children data...');
      
      const response = await api.getParentChildren();
      console.log('👨‍👩‍👧‍👦 Children response:', response);
      
      if (response.success) {
        const childrenData = response.data || [];
        console.log('✅ Children loaded:', childrenData);
        setChildren(childrenData);
        
        // Select first child by default
        if (childrenData.length > 0) {
          setSelectedChild(childrenData[0]);
          await fetchScheduleData(childrenData[0]);
        }
      } else {
        console.error('❌ Failed to fetch children:', response);
        toast.error('Failed to load children data');
      }
    } catch (error) {
      console.error('💥 Failed to fetch children:', error);
      toast.error('Failed to load children data');
    } finally {
      setLoading(false);
    }
  }, [fetchScheduleData]);

  useEffect(() => {
    fetchChildrenData();
  }, [fetchChildrenData]);

  const handleChildSelect = async (child) => {
    setSelectedChild(child);
    await fetchScheduleData(child);
  };

  const getAllScheduleItems = () => {
    const allItems = [
      ...scheduleData.assignments,
      ...scheduleData.lessons,
      ...scheduleData.events
    ].sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`));

    return allItems;
  };

  const getItemsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return getAllScheduleItems().filter(item => item.date === dateString);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getItemIcon = (type) => {
    switch (type) {
      case 'assignment':
        return <DocumentTextIcon className="h-5 w-5" />;
      case 'lesson':
        return <BookOpenIcon className="h-5 w-5" />;
      case 'event':
        return <CalendarDaysIcon className="h-5 w-5" />;
      default:
        return <ClockIcon className="h-5 w-5" />;
    }
  };

  const getItemColor = (type, priority) => {
    if (type === 'assignment' && priority === 'high') {
      return 'border-red-200 bg-red-50 text-red-700';
    }
    switch (type) {
      case 'assignment':
        return 'border-blue-200 bg-blue-50 text-blue-700';
      case 'lesson':
        return 'border-green-200 bg-green-50 text-green-700';
      case 'event':
        return 'border-purple-200 bg-purple-50 text-purple-700';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-700';
    }
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day; // Adjust to Monday
    startOfWeek.setDate(diff);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push(date);
    }
    return weekDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        <DashboardNavbar role="parent" currentPage="Schedule" />
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        <DashboardNavbar role="parent" currentPage="Schedule" />
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center py-12">
            <UserIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Children Found</h3>
            <p className="text-gray-600">No children are linked to your parent account.</p>
          </div>
        </div>
      </div>
    );
  }

  const weekDays = getWeekDays();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <DashboardNavbar role="parent" currentPage="Schedule" />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Schedule & Calendar</h1>
          <p className="text-gray-600">View your children's upcoming assignments, lessons, and events</p>
        </div>

        {/* Child Selector */}
        {children.length > 1 && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Child</h3>
            <div className="flex flex-wrap gap-4">
              {children.map((child) => (
                <button
                  key={child.student.id}
                  onClick={() => handleChildSelect(child)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedChild?.student.id === child.student.id
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-purple-600">
                        {child.student.firstName.charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium">{child.student.firstName} {child.student.lastName}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        )}

        {selectedChild && (
          <>
            {/* Week Navigation */}
            <Card className="p-6 mb-6">
              <div className="flex items-center justify-between">
                <Button
                  onClick={() => navigateWeek('prev')}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  <span>Previous Week</span>
                </Button>
                
                <h2 className="text-xl font-semibold text-gray-800">
                  Week of {formatDate(weekDays[0])}
                </h2>
                
                <Button
                  onClick={() => navigateWeek('next')}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <span>Next Week</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            {/* Weekly Calendar */}
            <Card className="p-6 mb-6">
              <div className="grid grid-cols-7 gap-4">
                {weekDays.map((day, index) => {
                  const dayItems = getItemsForDate(day);
                  const isToday = day.toDateString() === new Date().toDateString();
                  
                  return (
                    <div key={index} className="min-h-32">
                      <div className={`text-center p-2 rounded-lg mb-2 ${
                        isToday ? 'bg-purple-100 text-purple-700' : 'bg-gray-50 text-gray-700'
                      }`}>
                        <div className="text-xs font-medium">
                          {day.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="text-lg font-bold">
                          {day.getDate()}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        {dayItems.slice(0, 3).map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className={`text-xs p-2 rounded border ${getItemColor(item.type, item.priority)}`}
                          >
                            <div className="flex items-center space-x-1">
                              {getItemIcon(item.type)}
                              <span className="font-medium truncate">{item.title}</span>
                            </div>
                            <div className="text-xs opacity-75">{formatTime(item.time)}</div>
                          </div>
                        ))}
                        {dayItems.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{dayItems.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Upcoming Items List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Assignments */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                  <span>Upcoming Assignments</span>
                </h3>
                <div className="space-y-3">
                  {scheduleData.assignments.slice(0, 5).map((assignment) => (
                    <div key={assignment.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-blue-800">{assignment.title}</p>
                          <p className="text-sm text-blue-600">
                            {new Date(assignment.date).toLocaleDateString()} at {formatTime(assignment.time)}
                          </p>
                          {assignment.priority === 'high' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                              Due Soon
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {scheduleData.assignments.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No upcoming assignments</p>
                  )}
                </div>
              </Card>

              {/* Lessons */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <BookOpenIcon className="h-5 w-5 text-green-600" />
                  <span>Upcoming Lessons</span>
                </h3>
                <div className="space-y-3">
                  {scheduleData.lessons.slice(0, 5).map((lesson) => (
                    <div key={lesson.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="font-medium text-green-800">{lesson.title}</p>
                      <p className="text-sm text-green-600">
                        {new Date(lesson.date).toLocaleDateString()} at {formatTime(lesson.time)}
                      </p>
                      <p className="text-xs text-green-600">{lesson.category}</p>
                    </div>
                  ))}
                  {scheduleData.lessons.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No upcoming lessons</p>
                  )}
                </div>
              </Card>

              {/* Events */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <CalendarDaysIcon className="h-5 w-5 text-purple-600" />
                  <span>School Events</span>
                </h3>
                <div className="space-y-3">
                  {scheduleData.events.map((event) => (
                    <div key={event.id} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="font-medium text-purple-800">{event.title}</p>
                      <p className="text-sm text-purple-600">
                        {new Date(event.date).toLocaleDateString()} at {formatTime(event.time)}
                      </p>
                      <p className="text-xs text-purple-600">{event.description}</p>
                    </div>
                  ))}
                  {scheduleData.events.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No upcoming events</p>
                  )}
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ParentSchedule;
