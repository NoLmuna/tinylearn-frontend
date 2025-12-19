import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { BookOpen, Users, MessageCircle, LogOut, Send, Search, TrendingUp, Bell } from 'lucide-react';
import logo from '../../assets/levelup-logo.png';

/**
 * Teacher Messages Page
 * Teacher ↔ Parent communication interface
 */
function TeacherMessages() {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const teacherUser = { name: 'Sarah Johnson', subject: 'Mathematics' };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Mock conversations data
  const conversations = [
    {
      id: 1,
      parent: 'Jane Doe',
      student: 'John Doe',
      avatar: 'JD',
      lastMessage: 'Thank you for the update on John\'s progress!',
      timestamp: '2 hours ago',
      unread: 2,
      messages: [
        { id: 1, sender: 'parent', text: 'Hello, I wanted to discuss John\'s recent test results.', time: '10:30 AM' },
        { id: 2, sender: 'teacher', text: 'Of course! John has been doing very well. His test scores have improved significantly.', time: '10:35 AM' },
        { id: 3, sender: 'parent', text: 'That\'s great to hear! Are there any areas he should focus on?', time: '10:40 AM' },
        { id: 4, sender: 'teacher', text: 'He could benefit from more practice with quadratic equations. I\'ve assigned some additional exercises.', time: '10:45 AM' },
        { id: 5, sender: 'parent', text: 'Thank you for the update on John\'s progress!', time: '10:50 AM' }
      ]
    },
    {
      id: 2,
      parent: 'Robert Smith',
      student: 'Emily Smith',
      avatar: 'RS',
      lastMessage: 'Will Emily be able to make up the missed assignment?',
      timestamp: '5 hours ago',
      unread: 1,
      messages: [
        { id: 1, sender: 'parent', text: 'Hi Ms. Johnson, Emily was sick last week and missed some classes.', time: 'Yesterday 3:20 PM' },
        { id: 2, sender: 'teacher', text: 'I hope she\'s feeling better! She can definitely make up the work.', time: 'Yesterday 4:15 PM' },
        { id: 3, sender: 'parent', text: 'Will Emily be able to make up the missed assignment?', time: 'Today 9:00 AM' }
      ]
    },
    {
      id: 3,
      parent: 'Sarah Brown',
      student: 'Michael Brown',
      avatar: 'SB',
      lastMessage: 'Thank you! I\'ll make sure he completes it.',
      timestamp: 'Yesterday',
      unread: 0,
      messages: [
        { id: 1, sender: 'teacher', text: 'Hello! Michael forgot to submit his homework yesterday. Could you remind him?', time: 'Yesterday 11:00 AM' },
        { id: 2, sender: 'parent', text: 'Thank you! I\'ll make sure he completes it.', time: 'Yesterday 11:30 AM' }
      ]
    },
    {
      id: 4,
      parent: 'David Wilson',
      student: 'Lisa Wilson',
      avatar: 'DW',
      lastMessage: 'Lisa has been enjoying the new module!',
      timestamp: '2 days ago',
      unread: 0,
      messages: [
        { id: 1, sender: 'parent', text: 'Lisa has been enjoying the new module!', time: '2 days ago' }
      ]
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.parent.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.student.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageText.trim() && selectedConversation) {
      // Mock sending message
      console.log('Sending message:', messageText);
      setMessageText('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/teacher/dashboard" className="flex items-center gap-3">
                <img src={logo} alt="TinyLearn" className="h-10 w-10 object-contain" />
                <div className="hidden sm:block">
                  <h1 className="text-xl font-black text-gray-900">Teacher Portal</h1>
                  <p className="text-xs text-indigo-600 font-semibold">{teacherUser.subject}</p>
                </div>
              </Link>

              <div className="hidden md:flex items-center gap-1">
                <Link
                  to="/teacher/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
                >
                  <TrendingUp className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/teacher/users"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
                >
                  <Users className="w-4 h-4" />
                  Users
                </Link>
                <Link
                  to="/teacher/materials"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  Learning Materials
                </Link>
                <Link
                  to="/teacher/messages"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-50 text-indigo-600 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Messages
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">3</span>
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  {teacherUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">{teacherUser.name}</p>
                  <p className="text-xs text-gray-500">Teacher</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-gray-900 mb-2">Messages</h2>
          <p className="text-gray-600 text-lg">Communicate with parents</p>
        </div>

        {/* Messaging Interface */}
        <Card className="border-none shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-3 h-[calc(100vh-250px)]">
            {/* Conversations List */}
            <div className="border-r border-gray-200 bg-gray-50">
              <CardHeader className="border-b border-gray-200 bg-white">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </CardHeader>
              <div className="overflow-y-auto h-[calc(100%-80px)]">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full p-4 border-b border-gray-200 hover:bg-white transition-all text-left ${
                      selectedConversation?.id === conv.id ? 'bg-white border-l-4 border-l-indigo-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {conv.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-bold text-gray-900 truncate">{conv.parent}</p>
                          {conv.unread > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-2">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mb-1">Parent of {conv.student}</p>
                        <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                        <p className="text-xs text-gray-400 mt-1">{conv.timestamp}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation View */}
            <div className="md:col-span-2 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Conversation Header */}
                  <CardHeader className="border-b border-gray-200 bg-white">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">
                        {selectedConversation.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{selectedConversation.parent}</p>
                        <p className="text-sm text-gray-500">Parent of {selectedConversation.student}</p>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <div className="space-y-4">
                      {selectedConversation.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'teacher' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] ${message.sender === 'teacher' ? 'order-2' : 'order-1'}`}>
                            <div
                              className={`px-4 py-3 rounded-2xl ${
                                message.sender === 'teacher'
                                  ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-br-none'
                                  : 'bg-white border-2 border-gray-200 text-gray-900 rounded-bl-none'
                              }`}
                            >
                              <p className="text-sm">{message.text}</p>
                            </div>
                            <p className={`text-xs text-gray-400 mt-1 ${message.sender === 'teacher' ? 'text-right' : 'text-left'}`}>
                              {message.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  {/* Message Input */}
                  <div className="border-t border-gray-200 p-4 bg-white">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <Button
                        onClick={handleSendMessage}
                        className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-purple-600 hover:to-indigo-600 px-6"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-semibold">Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default TeacherMessages;
