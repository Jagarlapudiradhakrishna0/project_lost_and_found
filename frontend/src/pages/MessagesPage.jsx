import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, ChevronRight, Loader, Send } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Toast from '../components/Toast';
import { getConversations, sendDirectMessage, getConversation } from '../utils/api';

const MessagesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchConversations();
  }, [user]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const data = await getConversations(token);
      console.log('Conversations:', data);
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setToast({ type: 'error', message: 'Failed to load conversations' });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    setMessageInput('');
    
    try {
      const token = localStorage.getItem('token');
      const conversationMessages = await getConversation(conversation.otherUserId, token);
      console.log('Fetched conversation messages:', conversationMessages);
      setMessages(conversationMessages || []);
    } catch (error) {
      console.error('Error fetching conversation:', error);
      setToast({ type: 'error', message: 'Failed to load messages' });
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) {
      setToast({ type: 'error', message: 'Message cannot be empty' });
      return;
    }

    if (!selectedConversation) {
      setToast({ type: 'error', message: 'No conversation selected' });
      return;
    }

    setSendingMessage(true);
    try {
      const token = localStorage.getItem('token');
      const newMessage = await sendDirectMessage(
        {
          recipientId: selectedConversation.otherUserId,
          itemId: selectedConversation.itemId,
          itemType: selectedConversation.itemType,
          message: messageInput,
        },
        token
      );

      console.log('Message sent:', newMessage);
      setMessageInput('');
      setToast({ type: 'success', message: 'Message sent!' });
      
      // Reload the conversation to show the new message
      const updated = await getConversation(selectedConversation.otherUserId, token);
      setMessages(updated || []);
    } catch (error) {
      console.error('Error sending message:', error);
      setToast({ type: 'error', message: error.message || 'Failed to send message' });
    } finally {
      setSendingMessage(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Messages</h1>
          </div>
          <p className="text-slate-400">View and manage your conversations</p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center min-h-96">
            <Loader className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        ) : conversations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-12 text-center"
          >
            <MessageCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No conversations yet</h2>
            <p className="text-slate-400">
              Start a conversation by contacting someone about an item
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <div className="lg:col-span-1 space-y-3">
              {conversations.map((conversation, idx) => (
                <motion.div
                  key={conversation._id || idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleSelectConversation(conversation)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    selectedConversation?._id === conversation._id
                      ? 'bg-blue-600/20 border border-blue-500/50'
                      : 'bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white truncate">
                      {conversation.otherUserName}
                    </h3>
                    {conversation.unreadCount > 0 && (
                      <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 truncate mb-2">
                    {conversation.lastMessage}
                  </p>
                  <p className="text-xs text-slate-500">
                    {conversation.itemName} • {conversation.itemType}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Conversation Detail */}
            {selectedConversation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lg:col-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 flex flex-col"
              >
                {/* Conversation Header */}
                <div className="border-b border-slate-700/50 pb-4 mb-4">
                  <h2 className="text-2xl font-bold text-white">
                    {selectedConversation.otherUserName}
                  </h2>
                  <p className="text-sm text-slate-400">
                    {selectedConversation.itemName} • {selectedConversation.itemType}
                  </p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-slate-900/30 rounded-lg p-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-slate-400 text-sm">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg, idx) => {
                      const isMyMessage = msg.senderId?._id === user.id || msg.senderId === user.id || (typeof msg.senderId === 'object' && msg.senderId._id === user.id);
                      const senderName = msg.senderId?.name || 'Unknown';
                      
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                              isMyMessage
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-slate-700 text-slate-100 rounded-bl-none'
                            }`}
                          >
                            {!isMyMessage && (
                              <p className="text-xs font-semibold text-slate-300 mb-1">{senderName}</p>
                            )}
                            <p className="text-sm">{msg.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(msg.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type your message..."
                    disabled={sendingMessage}
                    className="flex-1 px-4 py-2.5 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={sendingMessage || !messageInput.trim()}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg transition-colors font-medium flex items-center gap-2 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    {sendingMessage ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default MessagesPage;
