import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Upload,
  MapPin,
  Calendar,
  Tag,
  Shield,
} from 'lucide-react';
import GlassInput from '../components/GlassInput';
import GlassButton from '../components/GlassButton';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { reportFoundItem } from '../utils/api';
import { containerVariants, itemVariants } from '../utils/animations';

const CATEGORIES = [
  'Phone',
  'Wallet',
  'ID Card',
  'Laptop',
  'Headphones',
  'Watch',
  'Bag',
  'Keys',
  'Books',
  'Other',
];

const ReportFoundPage = () => {
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    category: '',
    color: '',
    foundDate: '',
    foundTime: '',
    foundLocation: '',
    isSafeWithMe: true,
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024;

    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        setToast({ type: 'error', message: 'Image must be less than 5MB' });
        return false;
      }
      return true;
    });

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...validFiles],
    }));

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.itemName.trim()) newErrors.itemName = 'Item name is required';
    if (!formData.description.trim())
      newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.foundDate) newErrors.foundDate = 'Date is required';
    if (!formData.foundLocation) newErrors.foundLocation = 'Location is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const result = await reportFoundItem(formData, token);
      if (result.error) {
        setToast({ type: 'error', message: result.error });
        setLoading(false);
        return;
      }
      setToast({ type: 'success', message: 'Found item reported successfully!' });
      setTimeout(() => navigate('/found-items'), 1500);
    } catch (error) {
      console.error('Report error:', error);
      setToast({ type: 'error', message: error.message || 'Failed to report found item' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pt-20 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Report Found Item</h1>
          <p className="text-slate-400">
            You can help by reporting the item you found
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-400" />
                Item Information
              </h2>

              <GlassInput
                label="Item Name"
                name="itemName"
                placeholder="Describe the item"
                value={formData.itemName}
                onChange={handleChange}
                error={errors.itemName}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </motion.div>

                <GlassInput
                  label="Color"
                  name="color"
                  placeholder="Item color"
                  value={formData.color}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Detailed description of the found item..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </motion.div>

            {/* Date & Location */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-400" />
                When & Where
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <GlassInput
                  label="Date Found"
                  type="date"
                  name="foundDate"
                  value={formData.foundDate}
                  onChange={handleChange}
                  error={errors.foundDate}
                  required
                />
                <GlassInput
                  label="Time Found"
                  type="time"
                  name="foundTime"
                  value={formData.foundTime}
                  onChange={handleChange}
                />
              </div>

              <GlassInput
                label="Location Found"
                name="foundLocation"
                placeholder="Where did you find this?"
                value={formData.foundLocation}
                onChange={handleChange}
                error={errors.foundLocation}
                icon={MapPin}
                required
              />
            </motion.div>

            {/* Images */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-purple-400" />
                Images (Recommended)
              </h2>

              <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="imageInput"
                />
                <label
                  htmlFor="imageInput"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="w-8 h-8 text-slate-400" />
                  <p className="text-white font-medium">Click to upload images</p>
                  <p className="text-sm text-slate-400">PNG, JPG up to 5MB each</p>
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {imagePreviews.map((preview, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${idx}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Safety */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-yellow-400" />
                Safety & Custody
              </h2>

              <motion.label className="flex items-center gap-3 p-4 bg-slate-700/20 rounded-lg hover:bg-slate-700/30 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  name="isSafeWithMe"
                  checked={formData.isSafeWithMe}
                  onChange={handleChange}
                  className="w-5 h-5 accent-blue-500"
                />
                <span className="text-white font-medium">
                  Item is safe with me (for secure handover)
                </span>
              </motion.label>
            </motion.div>

            {/* Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex gap-4 pt-6"
            >
              <GlassButton
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => navigate(-1)}
              >
                Cancel
              </GlassButton>
              <GlassButton
                type="submit"
                loading={loading}
                className="flex-1"
              >
                Report Found Item
              </GlassButton>
            </motion.div>
          </form>
        </motion.div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {loading && <LoadingSpinner fullScreen />}
    </div>
  );
};

export default ReportFoundPage;
