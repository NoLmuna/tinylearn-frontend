/* eslint-disable */
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "../../contexts/adminContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import {
  BookOpen,
  Users,
  MessageCircle,
  LogOut,
  Send,
  Search,
  TrendingUp,
  Bell,
} from "lucide-react";
import logo from "../../assets/levelup-logo.png";
import {
  useTeacherConversations,
  useTeacherMessages,
  useSendTeacherMessage,
} from "../../hooks/teacherHooks";

/**
 * Teacher Messages Page
 * Teacher â†” Parent communication interface (real API)
 */
function TeacherMessages() {
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserRole, setSelectedUserRole] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);

  const { user, logout } = useAdmin();
  const teacherName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "Teacher";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const { data: convsData, isLoading: isLoadingConvs } =
    useTeacherConversations();
  const conversations = convsData?.data ?? [];

  const { data: messagesData, isLoading: isLoadingMessages } =
    useTeacherMessages(selectedUserId, selectedUserRole);
  const messages = messagesData?.data?.messages ?? [];

  const sendMessage = useSendTeacherMessage();

  const totalUnread = conversations.reduce(
    (sum, c) => sum + (c.unreadCount ?? 0),
    0,
  );

  const selectedConv =
    conversations.find((c) => c.partnerId?.toString() === selectedUserId) ??
    null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectConv = (conv) => {
    setSelectedUserId(conv.partnerId?.toString());
    setSelectedUserRole(conv.partnerRole);
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!messageText.trim() || !selectedUserId || !selectedUserRole) return;
    await sendMessage.mutateAsync({
      receiverId: selectedUserId,
      receiverType: selectedUserRole,
      content: messageText.trim(),
    });
    setMessageText("");
  };

  const filteredConversations = conversations.filter((conv) => {
    const name =
      `${conv.partner?.firstName ?? ""} ${conv.partner?.lastName ?? ""}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/teacher/dashboard" className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="TinyLearn"
                  className="h-10 w-10 object-contain"
                />
                <div className="hidden sm:block">
                  <h1 className="text-xl font-semibold text-slate-900">
                    Teacher Portal
                  </h1>
                </div>
              </Link>
              <div className="hidden md:flex items-center gap-1">
                <Link
                  to="/teacher/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  <TrendingUp className="w-4 h-4" /> Dashboard
                </Link>
                <Link
                  to="/teacher/users"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  <Users className="w-4 h-4" /> Users
                </Link>
                <Link
                  to="/teacher/materials"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  <BookOpen className="w-4 h-4" /> Learning Materials
                </Link>
                <Link
                  to="/teacher/messages"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-50 text-indigo-600"
                >
                  <MessageCircle className="w-4 h-4" /> Messages
                  {totalUnread > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {totalUnread}
                    </span>
                  )}
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-white font-medium text-sm">
                  {user?.firstName?.[0]?.toUpperCase() ?? "T"}
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-900">
                    {teacherName}
                  </p>
                  <p className="text-xs text-slate-500">Teacher</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
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
          <h2 className="text-3xl font-semibold text-slate-900 mb-2">Messages</h2>
          <p className="text-slate-600 text-lg">Communicate with parents</p>
        </div>

        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div className="grid md:grid-cols-3 h-[calc(100vh-250px)]">
            {/* Conversations List */}
            <div className="border-r border-slate-200 bg-slate-50 flex flex-col">
              <CardHeader className="border-b border-slate-200 bg-white shrink-0">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-2 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </CardHeader>
              <div className="overflow-y-auto flex-1">
                {isLoadingConvs ? (
                  <div className="p-6 text-center text-slate-500">
                    Loading...
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-6 text-center text-slate-500">
                    <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p>No conversations yet</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => {
                    const otherId = conv.partnerId?.toString();
                    const isSelected = otherId === selectedUserId;
                    return (
                      <button
                        key={otherId}
                        onClick={() => handleSelectConv(conv)}
                        className={`w-full p-4 border-b border-slate-200 hover:bg-white transition-all text-left ${isSelected ? "bg-white border-l-4 border-l-indigo-500" : ""}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                            {(
                              conv.partner?.firstName?.[0] ?? "?"
                            ).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-slate-900 truncate">
                                {conv.partner?.firstName}{" "}
                                {conv.partner?.lastName}
                              </p>
                              {conv.unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-2">
                                  {conv.unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mb-1 capitalize">
                              {conv.partnerRole}
                            </p>
                            <p className="text-sm text-slate-600 truncate">
                              {conv.lastMessage?.content ?? ""}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Conversation View */}
            <div className="md:col-span-2 flex flex-col">
              {!selectedUserId ? (
                <div className="flex-1 flex items-center justify-center bg-slate-50">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-slate-500 text-lg font-semibold">
                      Select a conversation to start messaging
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <CardHeader className="border-b border-slate-200 bg-white shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-white font-medium text-sm">
                        {(
                          selectedConv?.partner?.firstName?.[0] ?? "?"
                        ).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {selectedConv?.partner?.firstName}{" "}
                          {selectedConv?.partner?.lastName}
                        </p>
                        <p className="text-sm text-slate-500 capitalize">
                          {selectedConv?.partnerRole}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    {isLoadingMessages ? (
                      <div className="text-center text-slate-500">
                        Loading messages...
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center text-slate-500 py-8">
                        No messages yet. Start the conversation!
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((msg) => {
                          const isOwn =
                            (msg.senderId?._id || msg.senderId) ===
                            (user?._id || user?.id);
                          return (
                            <div
                              key={msg._id}
                              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                            >
                              <div className="max-w-[70%]">
                                <div
                                  className={`px-4 py-3 rounded-2xl ${
                                    isOwn
                                      ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-br-none"
                                      : "bg-white border-2 border-slate-200 text-slate-900 rounded-bl-none"
                                  }`}
                                >
                                  <p className="text-sm">{msg.content}</p>
                                </div>
                                <p
                                  className={`text-xs text-gray-400 mt-1 ${isOwn ? "text-right" : "text-left"}`}
                                >
                                  {msg.createdAt
                                    ? new Date(
                                        msg.createdAt,
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })
                                    : ""}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </CardContent>

                  <div className="border-t border-slate-200 p-4 bg-white shrink-0">
                    <form onSubmit={handleSend} className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <Button
                        type="submit"
                        disabled={!messageText.trim() || sendMessage.isPending}
                        className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-purple-600 hover:to-indigo-600 px-6"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default TeacherMessages;
