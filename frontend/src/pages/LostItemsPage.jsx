import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Filter } from 'lucide-react';
import ItemCard from '../components/ItemCard';
import GlassButton from '../components/GlassButton';
import GlassInput from '../components/GlassInput';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import { getLostItems } from '../utils/api';
import { containerVariants, itemVariants } from '../utils/animations';

const LostItemsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchLostItems();
  }, [searchTerm, categoryFilter, locationFilter]);

  const fetchLostItems = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (searchTerm) filters.searchTerm = searchTerm;
      if (categoryFilter) filters.category = categoryFilter;
      if (locationFilter) filters.location = locationFilter;

      const data = await getLostItems(filters);
      console.log('Fetched lost items:', data);
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching items:', error);
      setToast({ type: 'error', message: 'Failed to load items' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (itemId, type) => {
    navigate(`/item/${type}/${itemId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Lost Items</h1>
            <p className="text-slate-400">Browse lost items in your college</p>
          </div>
          <GlassButton
            onClick={() => navigate('/report-lost')}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Report Lost
          </GlassButton>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <GlassInput
              type="text"
              placeholder="Search items..."
              icon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-w-[150px]"
            >
              <option value="">All Categories</option>
              <option value="Phone">Phone</option>
              <option value="Wallet">Wallet</option>
              <option value="ID Card">ID Card</option>
              <option value="Laptop">Laptop</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </motion.div>

        {/* Items Grid */}
        {loading ? (
          <LoadingSpinner size="lg" />
        ) : items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-slate-400 text-lg">No lost items found</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {items.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                type="lost"
                onViewDetails={handleViewDetails}
              />
            ))}
          </motion.div>
        )}
      </div>

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

export default LostItemsPage;
