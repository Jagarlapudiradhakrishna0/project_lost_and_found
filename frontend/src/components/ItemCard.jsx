import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { hoverScale, itemVariants } from '../utils/animations';

const ItemCard = ({ item, onViewDetails, type = 'lost' }) => {
  const [imageError, setImageError] = useState(false);
  
  const statusColors = {
    Lost: 'text-red-400 bg-red-900/20',
    Returned: 'text-green-400 bg-green-900/20',
    Matched: 'text-yellow-400 bg-yellow-900/20',
    Available: 'text-blue-400 bg-blue-900/20',
    Claimed: 'text-purple-400 bg-purple-900/20',
  };

  const dateField = type === 'lost' ? item.lostDate : item.foundDate;
  const locationField =
    type === 'lost' ? item.lostLocation : item.foundLocation;

  const hasImage = item.images && item.images.length > 0 && !imageError;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5 }}
      className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-700/50 overflow-hidden hover:border-slate-600/80 transition-all duration-300 cursor-pointer h-full"
      onClick={() => onViewDetails(item._id, type)}
    >
      {/* Image Container */}
      <div className="relative h-40 bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden">
        {hasImage ? (
          <img
            src={item.images[0].url}
            alt={item.itemName}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          // Solid background when no image
          <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700" />
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />

        {/* Status Badge */}
        <div
          className={`absolute top-3 right-3 px-3 py-1 rounded-lg text-xs font-semibold ${statusColors[item.status]} backdrop-blur-md`}
        >
          {item.status}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
            {item.category}
          </span>
          {item.color && (
            <span className="text-xs font-medium text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
              {item.color}
            </span>
          )}
        </div>

        {/* Item Name */}
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {item.itemName}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-400 line-clamp-2 mb-3">
          {item.description}
        </p>

        {/* Meta Info */}
        <div className="space-y-1 mb-4 text-xs text-slate-400">
          <p>📍 {locationField}</p>
          <p>📅 {new Date(dateField).toLocaleDateString()}</p>
          {item.reward?.offered && (
            <p className="text-yellow-400 font-semibold">💰 Reward Offered</p>
          )}
        </div>

        {/* User Info */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
          <div className="flex-1">
            <p className="text-xs font-medium text-white">
              {item.userId?.name || 'Anonymous'}
            </p>
            {item.userId?.reputation !== undefined && (
              <p className="text-xs text-slate-400">
                ⭐ {item.userId.reputation} reputation
              </p>
            )}
          </div>
          <button
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(item._id, type);
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ItemCard;
