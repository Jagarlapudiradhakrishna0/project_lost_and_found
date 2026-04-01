import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, BookOpen, Calendar, Award, Heart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Toast from '../components/Toast';
import GlassButton from '../components/GlassButton';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pt-20 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8">
            <img
              src={user.profileImage || 'https://ui-avatars.com/api/?name=' + user.name}
              alt={user.name}
              className="w-24 h-24 rounded-full border-2 border-blue-500"
            />
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{user.name}</h1>
              <p className="text-slate-400">@{user.rollNumber}</p>
              <p className="text-slate-300 mt-2">{user.department || 'Department not set'}</p>
            </div>
          </div>
        </motion.div>

        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
          
          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-start gap-4 p-4 bg-slate-700/20 rounded-lg">
              <Mail className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-slate-400">Email</p>
                <p className="text-white font-medium">{user.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4 p-4 bg-slate-700/20 rounded-lg">
              <Phone className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-slate-400">Phone</p>
                <p className="text-white font-medium">{user.phone || 'Not provided'}</p>
              </div>
            </div>

            {/* Roll Number */}
            <div className="flex items-start gap-4 p-4 bg-slate-700/20 rounded-lg">
              <BookOpen className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-slate-400">Roll Number</p>
                <p className="text-white font-medium">{user.rollNumber}</p>
              </div>
            </div>

            {/* Year */}
            <div className="flex items-start gap-4 p-4 bg-slate-700/20 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-slate-400">Year</p>
                <p className="text-white font-medium">{user.year || 'Not set'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {/* Lost Items */}
          <div className="bg-gradient-to-br from-red-900/20 to-red-800/20 backdrop-blur-xl rounded-2xl border border-red-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-300 mb-1">Lost Items Reported</p>
                <p className="text-3xl font-bold text-red-400">{user.lostItemsCount || 0}</p>
              </div>
              <Heart className="w-12 h-12 text-red-400/30" />
            </div>
          </div>

          {/* Found Items */}
          <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 backdrop-blur-xl rounded-2xl border border-green-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-300 mb-1">Found Items Reported</p>
                <p className="text-3xl font-bold text-green-400">{user.foundItemsCount || 0}</p>
              </div>
              <Award className="w-12 h-12 text-green-400/30" />
            </div>
          </div>

          {/* Successful Returns */}
          <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 backdrop-blur-xl rounded-2xl border border-blue-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-300 mb-1">Successful Returns</p>
                <p className="text-3xl font-bold text-blue-400">{user.successfulReturns || 0}</p>
              </div>
              <Heart className="w-12 h-12 text-blue-400/30" />
            </div>
          </div>

          {/* Successful Matches */}
          <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 backdrop-blur-xl rounded-2xl border border-purple-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-300 mb-1">Successful Matches</p>
                <p className="text-3xl font-bold text-purple-400">{user.successfulMatches || 0}</p>
              </div>
              <Award className="w-12 h-12 text-purple-400/30" />
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4"
        >
          <GlassButton
            onClick={() => navigate('/settings')}
            className="flex-1"
          >
            Edit Profile
          </GlassButton>
          <GlassButton
            onClick={() => navigate('/my-items')}
            variant="secondary"
            className="flex-1"
          >
            My Items
          </GlassButton>
        </motion.div>
      </div>

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default ProfilePage;
