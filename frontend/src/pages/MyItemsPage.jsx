import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Eye, Plus } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import GlassButton from '../components/GlassButton';
import { useAuth } from '../hooks/useAuth';
import { getLostItems, getFoundItems } from '../utils/api';

const MyItemsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('lost');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const lostData = await getLostItems({ userId: user.id });
      const foundData = await getFoundItems({ userId: user.id });
      
      setLostItems(Array.isArray(lostData) ? lostData : []);
      setFoundItems(Array.isArray(foundData) ? foundData : []);
    } catch (error) {
      console.error('Error fetching items:', error);
      setToast({ type: 'error', message: 'Failed to load items' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Lost': 'bg-red-900/20 text-red-400 border-red-700',
      'Found': 'bg-green-900/20 text-green-400 border-green-700',
      'Matched': 'bg-blue-900/20 text-blue-400 border-blue-700',
    };
    return colors[status] || 'bg-slate-700/20 text-slate-400 border-slate-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pt-20 pb-20 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const itemsToShow = activeTab === 'lost' ? lostItems : foundItems;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">My Items</h1>
          <p className="text-slate-400">Manage your reported items</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-4 mb-8"
        >
          <button
            onClick={() => setActiveTab('lost')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'lost'
                ? 'bg-red-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Lost Items ({lostItems.length})
          </button>
          <button
            onClick={() => setActiveTab('found')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'found'
                ? 'bg-green-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Found Items ({foundItems.length})
          </button>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-4 mb-8"
        >
          <GlassButton
            onClick={() => navigate('/report-lost')}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Report Lost Item
          </GlassButton>
          <GlassButton
            onClick={() => navigate('/report-found')}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Report Found Item
          </GlassButton>
        </motion.div>

        {/* Items Grid */}
        {itemsToShow.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-12 text-center"
          >
            <p className="text-slate-400 text-lg mb-4">No {activeTab} items yet</p>
            <GlassButton
              onClick={() => navigate(activeTab === 'lost' ? '/report-lost' : '/report-found')}
            >
              Report Your First {activeTab === 'lost' ? 'Lost' : 'Found'} Item
            </GlassButton>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {itemsToShow.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 hover:border-blue-500/50 transition-all"
              >
                {/* Item Image */}
                {item.images && item.images[0] && (
                  <img
                    src={item.images[0].url}
                    alt={item.itemName}
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />
                )}

                {/* Item Details */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white">{item.itemName}</h3>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    {item.category && (
                      <span className="text-sm text-slate-400">{item.category}</span>
                    )}
                  </div>

                  {item.color && (
                    <p className="text-sm text-slate-300">
                      <span className="text-slate-400">Color:</span> {item.color}
                    </p>
                  )}

                  {item.lostLocation || item.foundLocation ? (
                    <p className="text-sm text-slate-300">
                      <span className="text-slate-400">Location:</span> {item.lostLocation || item.foundLocation}
                    </p>
                  ) : null}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-slate-700">
                    <button
                      onClick={() => navigate(`/item/${activeTab === 'lost' ? 'lost' : 'found'}/${item._id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => setToast({ type: 'info', message: 'Delete feature coming soon!' })}
                      className="flex items-center justify-center px-3 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-300 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default MyItemsPage;
