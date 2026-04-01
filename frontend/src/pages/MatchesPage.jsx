import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Loader,
  CheckCircle,
  XCircle,
  AlertCircle,
  Heart,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Toast from '../components/Toast';
import GlassButton from '../components/GlassButton';
import { getMyMatches, acceptMatch, confirmReturn, rejectMatch } from '../utils/api';

const MatchesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMatches();
  }, [user]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const data = await getMyMatches(token);
      console.log('Matches:', data);
      setMatches(data || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
      setToast({ type: 'error', message: 'Failed to load matches' });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptMatch = async (matchId) => {
    setActionLoading(matchId);
    try {
      const token = localStorage.getItem('token');
      await acceptMatch(matchId, token);
      setToast({ type: 'success', message: 'Match accepted! Messages enabled.' });
      fetchMatches();
    } catch (error) {
      console.error('Error accepting match:', error);
      setToast({ type: 'error', message: error.message || 'Failed to accept match' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmReturn = async (matchId) => {
    setActionLoading(matchId);
    try {
      const token = localStorage.getItem('token');
      await confirmReturn(matchId, token);
      setToast({ type: 'success', message: 'Item successfully returned! ✓' });
      fetchMatches();
    } catch (error) {
      console.error('Error confirming return:', error);
      setToast({ type: 'error', message: error.message || 'Failed to confirm return' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectMatch = async (matchId) => {
    setActionLoading(matchId);
    try {
      const token = localStorage.getItem('token');
      await rejectMatch(matchId, token);
      setToast({ type: 'success', message: 'Match rejected' });
      fetchMatches();
    } catch (error) {
      console.error('Error rejecting match:', error);
      setToast({ type: 'error', message: error.message || 'Failed to reject match' });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-900/20', text: 'text-yellow-400', label: 'Pending Review' },
      contact_requested: { bg: 'bg-blue-900/20', text: 'text-blue-400', label: 'Contact Requested' },
      in_contact: { bg: 'bg-purple-900/20', text: 'text-purple-400', label: 'In Contact' },
      completed: { bg: 'bg-green-900/20', text: 'text-green-400', label: '✓ Completed' },
      rejected: { bg: 'bg-red-900/20', text: 'text-red-400', label: 'Rejected' },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const isUserLostItemOwner = (match) => match.lostUserId?._id === user.id;
  const isUserItemFinder = (match) => match.foundUserId?._id === user.id;

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
            <Heart className="w-8 h-8 text-red-400" />
            <h1 className="text-4xl font-bold text-white">Item Matches</h1>
          </div>
          <p className="text-slate-400">
            Track lost items matched with found items and manage returns
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center min-h-96">
            <Loader className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        ) : matches.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-12 text-center"
          >
            <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No matches yet</h2>
            <p className="text-slate-400 mb-6">
              Report lost and found items to find matches
            </p>
            <div className="flex gap-3 justify-center">
              <GlassButton onClick={() => navigate('/report-lost')} className="px-6">
                Report Lost Item
              </GlassButton>
              <GlassButton onClick={() => navigate('/report-found')} className="px-6">
                Report Found Item
              </GlassButton>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {matches.map((match, idx) => {
              const lostItem = match.lostItemId;
              const foundItem = match.foundItemId;

              return (
                <motion.div
                  key={match._id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
                >
                  {/* Status */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {match.status === 'completed' ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : match.status === 'rejected' ? (
                        <XCircle className="w-6 h-6 text-red-400" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-yellow-400" />
                      )}
                      <h2 className="text-xl font-bold text-white">Match Opportunity</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(match.status)}
                      <span className="px-3 py-1 bg-slate-700/50 rounded-lg text-sm text-slate-300">
                        {match.similarityScore}% match
                      </span>
                    </div>
                  </div>

                  {/* Items Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Lost Item */}
                    <div className="bg-slate-900/50 rounded-xl p-4 border border-red-500/20">
                      <h3 className="text-sm font-semibold text-red-400 mb-2">📌 LOST ITEM</h3>
                      <h4 className="text-lg font-bold text-white mb-2">{lostItem?.itemName}</h4>
                      <div className="space-y-2 text-sm text-slate-300">
                        <div>
                          <span className="font-semibold">Category:</span> {lostItem?.category}
                        </div>
                        {lostItem?.color && (
                          <div>
                            <span className="font-semibold">Color:</span> {lostItem.color}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {lostItem?.lostLocation}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(lostItem?.lostDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-slate-400 mt-2">
                          <span className="font-semibold">Reporter:</span> {match.lostUserId?.name}
                        </div>
                      </div>
                    </div>

                    {/* Found Item */}
                    <div className="bg-slate-900/50 rounded-xl p-4 border border-green-500/20">
                      <h3 className="text-sm font-semibold text-green-400 mb-2">✓ FOUND ITEM</h3>
                      <h4 className="text-lg font-bold text-white mb-2">{foundItem?.itemName}</h4>
                      <div className="space-y-2 text-sm text-slate-300">
                        <div>
                          <span className="font-semibold">Category:</span> {foundItem?.category}
                        </div>
                        {foundItem?.color && (
                          <div>
                            <span className="font-semibold">Color:</span> {foundItem.color}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {foundItem?.foundLocation}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(foundItem?.foundDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-slate-400 mt-2">
                          <span className="font-semibold">Finder:</span> {match.foundUserId?.name}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Matching Criteria */}
                  <div className="bg-slate-900/30 rounded-lg p-3 mb-6">
                    <p className="text-sm font-semibold text-slate-300 mb-2">Matched on:</p>
                    <div className="flex flex-wrap gap-2">
                      {match.matchingCriteria?.category && (
                        <span className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded">
                          ✓ Category
                        </span>
                      )}
                      {match.matchingCriteria?.color && (
                        <span className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded">
                          ✓ Color
                        </span>
                      )}
                      {match.matchingCriteria?.location && (
                        <span className="px-2 py-1 bg-yellow-600/20 text-yellow-300 text-xs rounded">
                          ✓ Location
                        </span>
                      )}
                      {match.matchingCriteria?.date && (
                        <span className="px-2 py-1 bg-green-600/20 text-green-300 text-xs rounded">
                          ✓ Date
                        </span>
                      )}
                      {match.matchingCriteria?.description && (
                        <span className="px-2 py-1 bg-pink-600/20 text-pink-300 text-xs rounded">
                          ✓ Description
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {match.status !== 'completed' && match.status !== 'rejected' && (
                    <div className="flex gap-3">
                      {isUserItemFinder(match) && match.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAcceptMatch(match._id)}
                            disabled={actionLoading === match._id}
                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white rounded-lg transition-colors font-medium"
                          >
                            {actionLoading === match._id ? 'Accepting...' : 'Accept Match'}
                          </button>
                          <button
                            onClick={() => handleRejectMatch(match._id)}
                            disabled={actionLoading === match._id}
                            className="flex-1 px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-300 rounded-lg transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {isUserLostItemOwner(match) && match.status === 'contact_requested' && (
                        <button
                          onClick={() => handleConfirmReturn(match._id)}
                          disabled={actionLoading === match._id}
                          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg transition-colors font-medium"
                        >
                          {actionLoading === match._id ? 'Confirming...' : '✓ Confirm I Received Item'}
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default MatchesPage;
