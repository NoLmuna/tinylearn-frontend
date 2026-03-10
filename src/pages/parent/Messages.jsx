/* eslint-disable */
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "../../contexts/adminContext";
import { MessageCircle, Send, Search } from "lucide-react";
import logo from "../../assets/levelup-logo.png";
import {
  useParentConversations,
  useParentMessages,
  useSendParentMessage,
} from "../../hooks/parentHooks";

/**
 * Messages Page
 * Parent-teacher communication interface (real API)
 */
function Messages() {
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserRole, setSelectedUserRole] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);

  const { user, logout } = useAdmin();

  const { data: convsData, isLoading: isLoadingConvs } =
    useParentConversations();
  const conversations = convsData?.data ?? [];

  const { data: messagesData, isLoading: isLoadingMessages } =
    useParentMessages(selectedUserId, selectedUserRole);
  const messages = messagesData?.data?.messages ?? [];

  const sendMessage = useSendParentMessage();

  const totalUnread = conversations.reduce(
    (sum, c) => sum + (c.unreadCount ?? 0),
    0,
  );

  const selectedConv =
    conversations.find((c) => c.partnerId?.toString() === selectedUserId) ??
    null;

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
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
      {/* Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/parent/dashboard" className="flex items-center gap-3">
              <img
                src={logo}
                alt="TinyLearn"
                className="h-8 w-8 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                  TinyLearn
                </h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Parent Portal
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/parent/dashboard"
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/parent/progress"
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md text-sm font-medium transition-colors"
                >
                  Student Progress
                </Link>
                <Link
                  to="/parent/messages"
                  className="px-3 py-1.5 bg-slate-100 text-slate-800 rounded-md text-sm font-medium transition-colors relative"
                >
                  Messages
                  {totalUnread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {totalUnread}
                    </span>
                  )}
                </Link>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10 border-b border-slate-200 pb-6">
          <h2 className="text-2xl font-semibold text-slate-800 mb-1">
            Messages
          </h2>
          <p className="text-sm text-slate-500">
            Communicate with your children's teachers
          </p>
        </div>

        <div
          className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
          style={{ height: "calc(100vh - 280px)", minHeight: "500px" }}
        >
          <div className="grid grid-cols-3 h-full">
            {/* Conversations sidebar */}
            <div className="col-span-1 border-r border-slate-200 flex flex-col bg-slate-50/50">
              <div className="p-4 border-b border-slate-200 bg-white">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition-colors"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {isLoadingConvs ? (
                  <div className="p-6 text-center text-sm text-slate-500">
                    Loading...
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-6 text-center text-slate-400">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No conversations</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => {
                    const otherId = conv.partnerId?.toString();
                    const isSelected = otherId === selectedUserId;
                    return (
                      <button
                        key={otherId}
                        onClick={() => {
                          setSelectedUserId(otherId);
                          setSelectedUserRole(conv.partnerRole);
                        }}
                        className={`w-full p-4 border-b border-slate-100 transition-colors text-left ${
                          isSelected
                            ? "bg-white border-l-2 border-l-slate-800"
                            : "hover:bg-slate-100/50 border-l-2 border-l-transparent"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-700 flex-shrink-0">
                            {(
                              conv.partner?.firstName?.[0] ?? "?"
                            ).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <h4 className="font-semibold text-sm text-slate-800 truncate">
                                {conv.partner?.firstName}{" "}
                                {conv.partner?.lastName}
                              </h4>
                              {conv.unreadCount > 0 && (
                                <span className="w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                                  {conv.unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 capitalize mb-1">
                              {conv.partnerRole}
                            </p>
                            <p className="text-xs text-slate-600 truncate">
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

            {/* Chat area */}
            <div className="col-span-2 flex flex-col bg-white">
              {!selectedUserId ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                  <MessageCircle className="w-12 h-12 mb-3 opacity-20" />
                  <p className="text-sm font-medium">Select a conversation</p>
                </div>
              ) : (
                <>
                  <div className="p-5 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-800">
                        {(
                          selectedConv?.partner?.firstName?.[0] ?? "?"
                        ).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-slate-800">
                          {selectedConv?.partner?.firstName}{" "}
                          {selectedConv?.partner?.lastName}
                        </h3>
                        <p className="text-xs text-slate-500 capitalize">
                          {selectedConv?.partnerRole}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                    {isLoadingMessages ? (
                      <div className="text-center text-sm text-slate-500">
                        Loading messages...
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        No messages yet. Start the conversation!
                      </div>
                    ) : (
                      messages.map((msg) => {
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
                                className={`rounded-2xl p-4 ${isOwn ? "bg-blue-500 text-white" : "bg-white text-gray-900 border border-gray-200"}`}
                              >
                                <p className="text-sm leading-relaxed">
                                  {msg.content}
                                </p>
                              </div>
                              <p
                                className={`text-xs text-gray-500 mt-1 ${isOwn ? "text-right" : "text-left"}`}
                              >
                                {msg.createdAt
                                  ? new Date(msg.createdAt).toLocaleTimeString(
                                      [],
                                      { hour: "2-digit", minute: "2-digit" },
                                    )
                                  : ""}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

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
                        disabled={!messageText.trim() || sendMessage.isPending}
                        className="px-6 py-3 bg-[#F4C21A] hover:bg-[#d4a617] disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                      >
                        <Send className="w-5 h-5" />
                        Send
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;
