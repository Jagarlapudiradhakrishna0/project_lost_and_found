import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';
import Navbar from './components/Navbar';
import Modal from './components/Modal';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LostItemsPage from './pages/LostItemsPage';
import FoundItemsPage from './pages/FoundItemsPage';
import ReportLostPage from './pages/ReportLostPage';
import ReportFoundPage from './pages/ReportFoundPage';
import MatchesPage from './pages/MatchesPage';
import ItemDetailPage from './pages/ItemDetailPage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import MyItemsPage from './pages/MyItemsPage';
import { useAuth } from './hooks/useAuth';
import { getNotifications } from './utils/api';

// Centralized Socket configuration
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'https://last-and-found-vnla.onrender.com';

const ProtectedRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const { user, token, loading } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const socket = React.useRef(null);

  // Initialize Socket.io connection
  useEffect(() => {
    if (user && token) {
      socket.current = io(SOCKET_URL, {
        auth: { token },
      });

      socket.current.on('notification-received', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });

      socket.current.on('message-received', (message) => {
        // Handle message notifications
      });

      return () => {
        socket.current?.disconnect();
      };
    }
  }, [user, token]);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (user && token) {
        try {
          const data = await getNotifications(token);
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount);
        } catch (error) {
          console.error('Failed to load notifications:', error);
        }
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Fetch every 30 seconds

    return () => clearInterval(interval);
  }, [user, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
        {/* Navbar */}
        <Navbar
          unreadNotifications={unreadCount}
          onNotificationClick={() => setShowNotifications(true)}
        />

        {/* Notifications Modal */}
        <Modal
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          title="Notifications"
          size="lg"
        >
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-slate-400 text-center py-4">No notifications</p>
            ) : (
              notifications.map((notif) => (
                <motion.div
                  key={notif._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-slate-700/30 p-3 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer"
                >
                  <h4 className="font-semibold text-white">{notif.title}</h4>
                  <p className="text-sm text-slate-300">{notif.message}</p>
                </motion.div>
              ))
            )}
          </div>
        </Modal>

        {/* Routes */}
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route
              path="/login"
              element={
                user ? <Navigate to="/" /> : <LoginPage />
              }
            />
            <Route
              path="/register"
              element={
                user ? <Navigate to="/" /> : <RegisterPage />
              }
            />

            {/* Protected Routes */}
            <Route
              path="/lost-items"
              element={<LostItemsPage />}
            />
            <Route
              path="/found-items"
              element={<FoundItemsPage />}
            />
            <Route
              path="/item/:type/:id"
              element={<ItemDetailPage />}
            />
            <Route
              path="/report-lost"
              element={
                <ProtectedRoute isAuthenticated={!!user}>
                  <ReportLostPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report-found"
              element={
                <ProtectedRoute isAuthenticated={!!user}>
                  <ReportFoundPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/matches"
              element={
                <ProtectedRoute isAuthenticated={!!user}>
                  <MatchesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute isAuthenticated={!!user}>
                  <MessagesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-items"
              element={
                <ProtectedRoute isAuthenticated={!!user}>
                  <MyItemsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute isAuthenticated={!!user}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute isAuthenticated={!!user}>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </div>
  );
}

export default App;
