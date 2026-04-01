import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  LogOut,
  User,
  Settings,
  LayoutDashboard,
} from 'lucide-react';
import NotificationBell from './NotificationBell';
import { useAuth } from '../hooks/useAuth';

const Navbar = ({ unreadNotifications = 0, onNotificationClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Lost Items', path: '/lost-items' },
    { label: 'Found Items', path: '/found-items' },
    { label: 'My Items', path: '/my-items' },
    { label: 'Matches', path: '/matches' },
    { label: 'Messages', path: '/messages' },
    ...(isAdmin ? [{ label: 'Admin Panel', path: '/admin', icon: LayoutDashboard }] : []),
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-slate-900/95 to-slate-900/80 backdrop-blur-xl border-b border-slate-800/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl text-white hover:text-blue-400 transition-colors"
          >
            <span className="text-2xl">🧭</span>
            <span className="hidden sm:inline">Lost & Found</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            {user && (
              <NotificationBell
                count={unreadNotifications}
                onClick={onNotificationClick}
              />
            )}

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-colors">
                  <img
                    src={user.profileImage || 'https://ui-avatars.com/api/?name=' + user.name}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="hidden sm:inline text-sm font-medium text-white">
                    {user.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all"
                  >
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-white hover:bg-slate-700 rounded-t-lg"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-white hover:bg-slate-700"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-white hover:bg-red-600/20 rounded-b-lg border-t border-slate-700"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="px-3 py-2 text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4 border-t border-slate-800"
            >
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-4 py-2 text-sm font-medium ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
