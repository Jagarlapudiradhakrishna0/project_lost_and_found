import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Lock, User, Mail, Phone, BookOpen } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Toast from '../components/Toast';
import GlassButton from '../components/GlassButton';
import { updateProfile } from '../utils/api';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    year: '1st',
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      department: user.department || '',
      year: user.year || '1st',
    });
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setToast({
          type: 'error',
          message: 'Authentication required',
        });
        return;
      }

      const response = await updateProfile({
        name: formData.name,
        phone: formData.phone,
        department: formData.department,
        year: formData.year,
      }, token);

      if (response.error) {
        setToast({
          type: 'error',
          message: response.error || 'Failed to update profile',
        });
      } else {
        setToast({
          type: 'success',
          message: 'Profile updated successfully!',
        });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: error.message || 'Failed to update profile',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pt-20 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Profile
          </button>
          <h1 className="text-4xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 mt-2">Manage your profile and preferences</p>
        </motion.div>

        {/* Settings Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 mb-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="flex items-center gap-2 text-white font-semibold mb-2">
                <User className="w-5 h-5 text-blue-400" />
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="flex items-center gap-2 text-white font-semibold mb-2">
                <Mail className="w-5 h-5 text-green-400" />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
                className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="flex items-center gap-2 text-white font-semibold mb-2">
                <Phone className="w-5 h-5 text-purple-400" />
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Department */}
            <div>
              <label htmlFor="department" className="flex items-center gap-2 text-white font-semibold mb-2">
                <BookOpen className="w-5 h-5 text-orange-400" />
                Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g., Computer Science"
                className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Year */}
            <div>
              <label htmlFor="year" className="text-white font-semibold mb-2 block">
                Year
              </label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
              </select>
            </div>

            {/* Save Button */}
            <div className="flex gap-4 pt-4">
              <GlassButton
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {loading ? 'Saving...' : 'Save Changes'}
              </GlassButton>
              <GlassButton
                type="button"
                variant="secondary"
                onClick={() => navigate('/profile')}
                className="flex-1"
              >
                Cancel
              </GlassButton>
            </div>
          </form>
        </motion.div>

        {/* Password Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8"
        >
          <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-4">
            <Lock className="w-5 h-5 text-red-400" />
            Password & Security
          </h2>
          <p className="text-slate-400">
            Password management features coming soon. For security reasons, please contact support to change your password.
          </p>
        </motion.div>
      </div>

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default SettingsPage;
