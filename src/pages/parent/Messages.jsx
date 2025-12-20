import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MessageCircle, Send, Search, User } from 'lucide-react';
import logo from '../../assets/levelup-logo.png';

/**
 * Messages Page
 * Parent-teacher communication interface
 */
function Messages() {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState(0);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock conversations data
  const conversations = [
    {
      id: 1,
      teacher: 'Ms. Smith',
      subject: 'Mathematics',
      avatar: '👩‍🏫',
      lastMessage: 'Emma is doing great in class! She showed excellent problem-solving skills this week.',
      time: '2 hours ago',
      unread: 2,
      messages: [
        { id: 1, sender: 'teacher', text: 'Hello! Just wanted to share that Emma did wonderfully on her fractions test.', time: '2 days ago' },
        { id: 2, sender: 'parent', text: 'Thank you so much for letting me know! She\'s been working really hard on fractions.', time: '2 days ago' },
        { id: 3, sender: 'teacher', text: 'It really shows! She got 95%. Would you like to see the test?', time: '2 days ago' },
        { id: 4, sender: 'parent', text: 'Yes, please! That would be wonderful.', time: '1 day ago' },
        { id: 5, sender: 'teacher', text: 'Emma is doing great in class! She showed excellent problem-solving skills this week.', time: '2 hours ago' },
      ]
    },
    {
      id: 2,
      teacher: 'Mr. Davis',
      subject: 'Reading',
      avatar: '👨‍🏫',
      lastMessage: 'Please encourage Noah to read 20 minutes daily. He\'s making good progress!',
      time: '1 day ago',
      unread: 1,
      messages: [
        { id: 1, sender: 'teacher', text: 'Hi Sarah, I wanted to discuss Noah\'s reading progress.', time: '3 days ago' },
        { id: 2, sender: 'parent', text: 'Of course! How is he doing?', time: '3 days ago' },
        { id: 3, sender: 'teacher', text: 'He\'s doing well! I recommend 20 minutes of reading daily to improve his fluency.', time: '2 days ago' },
        { id: 4, sender: 'parent', text: 'We\'ll definitely start that routine. Thank you for the suggestion!', time: '2 days ago' },
        { id: 5, sender: 'teacher', text: 'Please encourage Noah to read 20 minutes daily. He\'s making good progress!', time: '1 day ago' },
      ]
    },
    {
      id: 3,
      teacher: 'Ms. Brown',
      subject: 'Science',
      avatar: '👩‍🔬',
      lastMessage: 'Reminder: Science fair project is due next week. Emma has chosen a great topic!',
      time: '2 days ago',
      unread: 0,
      messages: [
        { id: 1, sender: 'teacher', text: 'Hello! Emma selected "Plant Growth" for her science fair project.', time: '1 week ago' },
        { id: 2, sender: 'parent', text: 'That sounds perfect for her! She loves gardening.', time: '1 week ago' },
        { id: 3, sender: 'teacher', text: 'Wonderful! The project is due next Friday. Let me know if you need any supplies.', time: '5 days ago' },
        { id: 4, sender: 'parent', text: 'Will do, thank you!', time: '5 days ago' },
        { id: 5, sender: 'teacher', text: 'Reminder: Science fair project is due next week. Emma has chosen a great topic!', time: '2 days ago' },
      ]
    },
    {
      id: 4,
      teacher: 'Ms. Taylor',
      subject: 'Art',
      avatar: '🎨',
      lastMessage: 'Emma\'s artwork will be displayed in the school gallery. Well done!',
      time: '3 days ago',
      unread: 0,
      messages: [
        { id: 1, sender: 'teacher', text: 'I have exciting news about Emma\'s art project!', time: '4 days ago' },
        { id: 2, sender: 'parent', text: 'I can\'t wait to hear!', time: '4 days ago' },
        { id: 3, sender: 'teacher', text: 'Her watercolor landscape is being featured in our school gallery!', time: '3 days ago' },
        { id: 4, sender: 'parent', text: 'Oh my! That\'s wonderful! She\'ll be so excited!', time: '3 days ago' },
        { id: 5, sender: 'teacher', text: 'Emma\'s artwork will be displayed in the school gallery. Well done!', time: '3 days ago' },
      ]
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      console.log('Sending message:', messageText);
      setMessageText('');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentConversation = conversations[selectedConversation];
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50/30">
      {/* Top Navigation */}
      <nav className="bg-white border-b-2 border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/parent/dashboard" className="flex items-center gap-3 group">
              <img src={logo} alt="TinyLearn" className="h-14 w-14 object-contain transition-transform group-hover:scale-110" />
              <div>
                <h1 className="text-2xl font-black text-gray-900">TinyLearn</h1>
                <p className="text-xs text-gray-600 font-semibold">Parent Portal</p>
              </div>
            </Link>
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-1">
                <Link
                  to="/parent/dashboard"
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-semibold transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/parent/progress"
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-semibold transition-colors"
                >
                  Student Progress
                </Link>
                <Link
                  to="/parent/messages"
                  className="px-4 py-2 bg-[#F4C21A] text-gray-900 rounded-lg font-semibold relative"
                >
                  Messages
                  {totalUnread > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {totalUnread}
                    </span>
                  )}
                </Link>
              </div>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Messages</h2>
          <p className="text-lg text-gray-600">
            Communicate with your children's teachers
          </p>
        </div>

        {/* Messages Interface */}
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden" style={{ height: 'calc(100vh - 300px)', minHeight: '600px' }}>
          <div className="grid grid-cols-3 h-full">
            {/* Conversations List */}
            <div className="col-span-1 border-r border-gray-200 flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4C21A] focus:border-[#F4C21A] transition"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conversation, index) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(index)}
                    className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                      selectedConversation === index ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{conversation.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-gray-900 truncate">{conversation.teacher}</h4>
                          {conversation.unread > 0 && (
                            <span className="w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 font-medium mb-1">{conversation.subject}</p>
                        <p className="text-sm text-gray-700 truncate">{conversation.lastMessage}</p>
                        <p className="text-xs text-gray-500 mt-1">{conversation.time}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="col-span-2 flex flex-col">
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{currentConversation.avatar}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{currentConversation.teacher}</h3>
                    <p className="text-sm text-gray-600 font-medium">{currentConversation.subject}</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {currentConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'parent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${message.sender === 'parent' ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`rounded-2xl p-4 ${
                          message.sender === 'parent'
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.text}</p>
                      </div>
                      <p className={`text-xs text-gray-500 mt-1 ${message.sender === 'parent' ? 'text-right' : 'text-left'}`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-6 border-t border-gray-200 bg-white">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4C21A] focus:border-[#F4C21A] transition"
                  />
                  <button
                    type="submit"
                    disabled={!messageText.trim()}
                    className="px-6 py-3 bg-[#F4C21A] hover:bg-[#d4a617] active:bg-[#c09615] disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;
