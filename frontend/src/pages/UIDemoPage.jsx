import React, { useState, useEffect } from 'react';
import { ChevronRight, TrendingUp, Users, Heart, MessageCircle, Search, Star, MapPin, Calendar, BarChart3, PieChart, LineChart, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import './UIDemoPage.css';

const UIDemoPage = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [animateCounters, setAnimateCounters] = useState(false);

  useEffect(() => {
    setAnimateCounters(true);
  }, []);

  // Counter Animation Component
  const Counter = ({ end, label }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!animateCounters) return;
      let interval;
      const increment = end / 100;
      interval = setInterval(() => {
        setCount((prev) => {
          if (prev >= end) {
            clearInterval(interval);
            return end;
          }
          return Math.floor(prev + increment);
        });
      }, 20);
      return () => clearInterval(interval);
    }, [animateCounters, end]);

    return (
      <div className="counter-card">
        <motion.div 
          className="counter-number"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {count}+
        </motion.div>
        <div className="counter-label">{label}</div>
      </div>
    );
  };

  // ===== DEMO 1: ENHANCED HERO SECTION =====
  const HeroDemo = () => (
    <div className="demo-section">
      <div className="demo-hero">
        <motion.div 
          className="hero-background"
          animate={{ 
            background: ['linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                        'linear-gradient(135deg, #764ba2 0%, #667eea 100%)']
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
        >
          {/* Animated floating particles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              animate={{
                y: [0, -30, 0],
                x: [0, Math.sin(i) * 50, 0],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 6 + i, repeat: Infinity }}
            />
          ))}
        </motion.div>

        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="hero-logo"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            🧭
          </motion.div>
          
          <motion.h1 
            className="hero-title"
            animate={{ 
              textShadow: ['0 0 10px rgba(102, 126, 234, 0.5)', 
                          '0 0 30px rgba(102, 126, 234, 0.8)',
                          '0 0 10px rgba(102, 126, 234, 0.5)']
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Lost & Found
          </motion.h1>
          
          <p className="hero-subtitle">Find what you've lost. Help others find their belongings.</p>
          
          <div className="hero-buttons">
            <motion.button 
              className="btn-primary"
              whileHover={{ scale: 1.05, boxShadow: '0 15px 40px rgba(102, 126, 234, 0.6)' }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Lost Items
            </motion.button>
            <motion.button 
              className="btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Found Items
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );

  // ===== DEMO 2: ENHANCED STAT CARDS =====
  const StatsDemo = () => (
    <div className="demo-section">
      <h2 className="demo-title">Enhanced Statistics Cards</h2>
      <p className="demo-subtitle">With animated counters and gradient backgrounds</p>
      
      <motion.div 
        className="stats-grid"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="stat-card stat-card-1"
          whileHover={{ y: -10, boxShadow: '0 20px 50px rgba(102, 126, 234, 0.3)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="stat-icon">📋</div>
          <Counter end={500} label="Items Reported" />
          <div className="stat-chart">📈 +25% this month</div>
        </motion.div>

        <motion.div
          className="stat-card stat-card-2"
          whileHover={{ y: -10, boxShadow: '0 20px 50px rgba(139, 92, 246, 0.3)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-icon">👥</div>
          <Counter end={1200} label="Active Users" />
          <div className="stat-chart">📈 +40% this month</div>
        </motion.div>

        <motion.div
          className="stat-card stat-card-3"
          whileHover={{ y: -10, boxShadow: '0 20px 50px rgba(236, 72, 153, 0.3)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-icon">✨</div>
          <Counter end={85} label="Success Rate" />
          <div className="stat-chart">📈 +15% this month</div>
        </motion.div>
      </motion.div>
    </div>
  );

  // ===== DEMO 3: ENHANCED ITEM CARDS =====
  const ItemCardsDemo = () => (
    <div className="demo-section">
      <h2 className="demo-title">Premium Item Cards</h2>
      <p className="demo-subtitle">With images, better layout, and hover effects</p>
      
      <motion.div 
        className="items-grid"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {[
          { title: 'iPhone 13 Pro', category: 'Electronics', location: 'Main Campus', date: '2 days ago', image: '📱', user: 'John Doe' },
          { title: 'Black Wallet', category: 'Accessories', location: 'Library', date: '1 day ago', image: '👝', user: 'Jane Smith' },
          { title: 'ID Card', category: 'Documents', location: 'Cafeteria', date: '3 hours ago', image: '🆔', user: 'Mike Johnson' }
        ].map((item, idx) => (
          <motion.div
            key={idx}
            className="item-card-enhanced"
            whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="item-image">
              <div className="image-placeholder">{item.image}</div>
              <motion.div 
                className="category-badge"
                whileHover={{ scale: 1.1 }}
              >
                {item.category}
              </motion.div>
              <motion.button 
                className="like-btn"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                ❤️
              </motion.button>
            </div>

            <div className="item-content">
              <h3 className="item-title">{item.title}</h3>
              
              <div className="item-meta">
                <div className="meta-item">
                  <MapPin size={16} />
                  <span>{item.location}</span>
                </div>
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>{item.date}</span>
                </div>
              </div>

              <div className="item-user">
                <div className="user-avatar">👤</div>
                <div>
                  <div className="user-name">{item.user}</div>
                  <div className="user-rating">⭐ 4.8 reputation</div>
                </div>
              </div>

              <div className="item-actions">
                <motion.button 
                  className="action-btn primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Details
                </motion.button>
                <motion.button 
                  className="action-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  💬 Message
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );

  // ===== DEMO 4: HOW IT WORKS TIMELINE =====
  const TimelineDemo = () => (
    <div className="demo-section">
      <h2 className="demo-title">Interactive Timeline</h2>
      <p className="demo-subtitle">How the Lost & Found system works</p>
      
      <div className="timeline">
        {[
          { step: 1, title: 'Report Lost Item', desc: 'Tell us what you lost with photos and details', icon: '📋' },
          { step: 2, title: 'Smart Matching', desc: 'Our system matches lost & found items', icon: '🎯' },
          { step: 3, title: 'Connect', desc: 'Chat safely with the other person', icon: '💬' },
          { step: 4, title: 'Return', desc: 'Safely retrieve your item', icon: '✨' }
        ].map((item, idx) => (
          <motion.div
            key={idx}
            className="timeline-item"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15 }}
          >
            <motion.div 
              className="timeline-dot"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
            >
              <div className="dot-number">{item.step}</div>
            </motion.div>
            
            <div className="timeline-content">
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>

            {idx < 3 && <div className="timeline-arrow">→</div>}
          </motion.div>
        ))}
      </div>
    </div>
  );

  // ===== DEMO 5: LOADING SKELETON =====
  const LoadingDemo = () => (
    <div className="demo-section">
      <h2 className="demo-title">Loading Skeletons</h2>
      <p className="demo-subtitle">Smooth loading experience with shimmer effect</p>
      
      <motion.div 
        className="skeleton-grid"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="skeleton-card">
            <div className="skeleton skeleton-image"></div>
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-button"></div>
          </div>
        ))}
      </motion.div>
    </div>
  );

  // ===== DEMO 6: EMPTY STATE =====
  const EmptyStateDemo = () => (
    <div className="demo-section">
      <h2 className="demo-title">Enhanced Empty States</h2>
      <p className="demo-subtitle">Engaging illustrations with helpful guidance</p>
      
      <motion.div 
        className="empty-state-container"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <motion.div 
          className="empty-illustration"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          💌
        </motion.div>
        
        <h3>No Conversations Yet</h3>
        <p>Start a conversation by contacting someone about an item</p>
        
        <motion.button 
          className="btn-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Browse Items Now
        </motion.button>
      </motion.div>
    </div>
  );

  // ===== DEMO 7: FORM WITH ANIMATIONS =====
  const FormDemo = () => (
    <div className="demo-section">
      <h2 className="demo-title">Enhanced Form</h2>
      <p className="demo-subtitle">With smooth animations and better UX</p>
      
      <motion.div 
        className="form-container"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="form-group">
          <label>Item Name</label>
          <motion.input 
            type="text" 
            placeholder="What did you lose?"
            className="form-input"
            whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(102, 126, 234, 0.5)' }}
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <motion.select 
            className="form-input"
            whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(102, 126, 234, 0.5)' }}
          >
            <option>Select Category</option>
            <option>Electronics</option>
            <option>Accessories</option>
            <option>Documents</option>
          </motion.select>
        </div>

        <div className="form-group">
          <label>Description</label>
          <motion.textarea 
            placeholder="Describe the item..."
            className="form-input"
            rows="4"
            whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(102, 126, 234, 0.5)' }}
          />
        </div>

        <motion.button 
          className="btn-primary btn-submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Submit Report
        </motion.button>
      </motion.div>
    </div>
  );

  return (
    <motion.div className="ui-demo-page">
      <motion.header className="demo-header">
        <motion.div 
          className="header-logo"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          🧭
        </motion.div>
        <h1>UI/UX Demo - Lost & Found Redesign</h1>
        <p>Scroll down to see all the enhancements</p>
      </motion.header>

      <motion.div className="demo-nav">
        {['hero', 'stats', 'cards', 'timeline', 'loading', 'empty', 'form'].map((tab) => (
          <motion.button
            key={tab}
            className={`nav-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      <motion.div className="demos-container">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === 'hero' && <HeroDemo />}
          {activeTab === 'stats' && <StatsDemo />}
          {activeTab === 'cards' && <ItemCardsDemo />}
          {activeTab === 'timeline' && <TimelineDemo />}
          {activeTab === 'loading' && <LoadingDemo />}
          {activeTab === 'empty' && <EmptyStateDemo />}
          {activeTab === 'form' && <FormDemo />}
        </motion.div>
      </motion.div>

      <motion.footer className="demo-footer">
        <div className="footer-content">
          <h3>Ready to upgrade?</h3>
          <p>If you like these improvements, let me know and I'll implement them in your actual app!</p>
          <motion.button 
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Let's Do It! 🚀
          </motion.button>
        </div>
      </motion.footer>
    </motion.div>
  );
};

export default UIDemoPage;
