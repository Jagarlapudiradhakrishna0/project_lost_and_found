import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Clock, User, Send, X, Phone } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import GlassButton from '../components/GlassButton';
import Modal from '../components/Modal';
import { getLostItemById, getFoundItemById, sendDirectMessage, markLostItemAsReceived, markFoundItemAsReceived } from '../utils/api';
import { useAuth } from '../hooks/useAuth';

// Centralized Backend URL for image serving
const BACKEND_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

const ItemDetailPage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [markingAsReceived, setMarkingAsReceived] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [type, id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const getAPI = type === 'lost' ? getLostItemById : getFoundItemById;
      const data = await getAPI(id);
      setItem(data);
    } catch (error) {
      console.error('Error fetching item:', error);
      setToast({ type: 'error', message: 'Failed to load item details' });
      setTimeout(() => navigate(type === 'lost' ? '/lost-items' : '/found-items'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      setToast({ type: 'error', message: 'Message cannot be empty' });
      return;
    }

    if (!user) {
      setToast({ type: 'error', message: 'Please login to send messages' });
      return;
    }

    setSendingMessage(true);
    try {
      await sendDirectMessage(
        {
          recipientId: item.userId._id,
          itemId: item._id,
          itemType: type,
          message: messageText,
        },
        localStorage.getItem('token')
      );
      setToast({ type: 'success', message: 'Message sent to reporter!' });
      setMessageText('');
      setShowMessageModal(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setToast({ type: 'error', message: error.message || 'Failed to send message' });
    } finally {
      setSendingMessage(false);
    }
  };

  const handleMarkAsReceived = async () => {
    if (!user) {
      setToast({ type: 'error', message: 'Please login to mark item as received' });
      return;
    }

    setMarkingAsReceived(true);
    try {
      const markAPI = type === 'lost' ? markLostItemAsReceived : markFoundItemAsReceived;
      await markAPI(item._id, localStorage.getItem('token'));
      setToast({ type: 'success', message: 'Item marked as received! ✓' });
      setItem({ ...item, status: 'Matched' });
      setTimeout(() => navigate(type === 'lost' ? '/lost-items' : '/found-items'), 1500);
    } catch (error) {
      console.error('Error marking as received:', error);
      setToast({ type: 'error', message: error.message || 'Failed to mark item as received' });
    } finally {
      setMarkingAsReceived(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pt-20 pb-20 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-slate-400 text-center">Item not found</p>
        </div>
      </div>
    );
  }

  const dateField = type === 'lost' ? item.lostDate : item.foundDate;
  const locationField = type === 'lost' ? item.lostLocation : item.foundLocation;
  const timeField = type === 'lost' ? item.lostTime : item.foundTime;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(type === 'lost' ? '/lost-items' : '/found-items')}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to {type === 'lost' ? 'Lost' : 'Found'} Items
        </motion.button>

        {/* Item Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Images */}
            <div>
              {item.images && item.images.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <img
                    src={`${BACKEND_URL}${item.images[0].url}`}
                    alt={item.itemName}
                    className="w-full h-80 object-cover rounded-lg"
                    onError={(e) => {
                      console.log('Failed to load image, trying fallback');
                      e.target.src = item.images[0].url;
                    }}
                  />
                  {item.images.length > 1 && (
                    <div className="grid grid-cols-3 gap-2">
                      {item.images.slice(1).map((img, idx) => (
                        <img
                          key={idx}
                          src={`${BACKEND_URL}${img.url}`}
                          alt={`${item.itemName} ${idx + 2}`}
                          className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                          onError={(e) => {
                            e.target.src = img.url;
                          }}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="w-full h-80 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-6xl">📦</span>
                </div>
              )}
            </div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Title & Status */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-3xl font-bold text-white">{item.itemName}</h1>
                  <span
                    className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                      item.status === 'Lost'
                        ? 'text-red-400 bg-red-900/20'
                        : item.status === 'Matched'
                        ? 'text-yellow-400 bg-yellow-900/20'
                        : 'text-blue-400 bg-blue-900/20'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-slate-400">{item.description}</p>
              </div>

              {/* Category & Color */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-slate-700/50 rounded-lg text-sm text-slate-300">
                    {item.category}
                  </span>
                  {item.color && (
                    <span className="px-3 py-1 bg-slate-700/50 rounded-lg text-sm text-slate-300">
                      {item.color}
                    </span>
                  )}
                </div>
              </div>

              {/* Date & Location */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-300">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-slate-400">
                      {type === 'lost' ? 'Date Lost' : 'Date Found'}
                    </p>
                    <p className="font-medium">
                      {new Date(dateField).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {timeField && (
                  <div className="flex items-center gap-3 text-slate-300">
                    <Clock className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-sm text-slate-400">
                        {type === 'lost' ? 'Time Lost' : 'Time Found'}
                      </p>
                      <p className="font-medium">{timeField}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 text-slate-300">
                  <MapPin className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-sm text-slate-400">
                      {type === 'lost' ? 'Location Lost' : 'Location Found'}
                    </p>
                    <p className="font-medium">{locationField}</p>
                  </div>
                </div>
              </div>

              {/* Reporter Info */}
              {item.userId && (
                <div className="border-t border-slate-700/50 pt-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-slate-400">Reported by</p>
                      <p className="font-medium text-white">{item.userId.name}</p>
                    </div>
                  </div>
                  {item.userId.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-sm text-slate-400">Contact</p>
                        <p className="font-medium text-white">{item.userId.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Button */}
              {user && item.userId ? (
                // Check if user is the reporter
                item.userId._id === user.id || item.userId === user.id ? (
                  // Show "Mark as Received" only for the person who reported the item
                  <button
                    onClick={handleMarkAsReceived}
                    disabled={markingAsReceived || item.status === 'Matched'}
                    className={`w-full px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                      item.status === 'Matched'
                        ? 'bg-green-600/30 text-green-300 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {markingAsReceived ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Marking...
                      </>
                    ) : (
                      <>
                        {item.status === 'Matched' ? '✓ Item Received' : '✓ Mark as Received'}
                      </>
                    )}
                  </button>
                ) : (
                  // Show "Contact Reporter" for others
                  <GlassButton
                    onClick={() => {
                      if (!user) {
                        setToast({ type: 'error', message: 'Please login to contact reporter' });
                        setTimeout(() => navigate('/login'), 1500);
                        return;
                      }
                      setShowMessageModal(true);
                    }}
                    className="w-full"
                  >
                    Contact Reporter
                  </GlassButton>
                )
              ) : (
                // Show "Contact Reporter" for not logged in users
                <GlassButton
                  onClick={() => {
                    if (!user) {
                      setToast({ type: 'error', message: 'Please login to contact reporter' });
                      setTimeout(() => navigate('/login'), 1500);
                      return;
                    }
                    setShowMessageModal(true);
                  }}
                  className="w-full"
                >
                  Contact Reporter
                </GlassButton>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Message Modal */}
      <Modal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        title="Send Message"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-400 mb-2">
              Message to <span className="font-semibold text-white">{item?.userId?.name}</span>
            </p>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message here..."
              rows="4"
              className="w-full px-4 py-3 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              disabled={sendingMessage}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowMessageModal(false)}
              className="flex-1 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700/70 text-white rounded-lg transition-colors"
              disabled={sendingMessage}
            >
              Cancel
            </button>
            <button
              onClick={handleSendMessage}
              disabled={sendingMessage || !messageText.trim()}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Send className="w-4 h-4" />
              {sendingMessage ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ItemDetailPage;
