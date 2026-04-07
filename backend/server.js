const express = require('express');
require('dotenv').config();
const cors = require('cors');
const fileUpload = require('express-fileupload');
const http = require('http');
const socketIo = require('socket.io');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// CORS Configuration for Vercel deployment
const allowedOrigins = [
  'https://lost2found.vercel.app',
  'https://lostandfound-git-master-radha-krishnas-projects-9a2e031d.vercel.app',
  'https://lostandfound-4u0dezpvy-radha-krishnas-projects-9a2e031d.vercel.app',
  process.env.CLIENT_URL || 'http://localhost:3000', // Add env-based URL for flexibility
];

// Initialize app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  },
});

// Connect to MongoDB
connectDB();

// Middleware - CORS must be before routes
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }));

// Serve uploaded files
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/lost-items', require('./routes/lostItems'));
app.use('/api/found-items', require('./routes/foundItems'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/direct-messages', require('./routes/directMessages'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Debug endpoint
app.get('/api/debug/counts', async (req, res) => {
  try {
    const LostItem = require('./models/LostItem');
    const FoundItem = require('./models/FoundItem');
    const User = require('./models/User');
    
    const [lostCount, foundCount, userCount] = await Promise.all([
      LostItem.countDocuments(),
      FoundItem.countDocuments(),
      User.countDocuments(),
    ]);
    
    res.json({
      lostItems: lostCount,
      foundItems: foundCount,
      users: userCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use(errorHandler);

// WebSocket connections for real-time updates
let activeUsers = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins with their ID
  socket.on('user-online', (userId) => {
    activeUsers[userId] = socket.id;
    socket.userId = userId;
    console.log('Active users:', Object.keys(activeUsers));
  });

  // Send message event
  socket.on('new-message', (data) => {
    const { recipientId, message } = data;
    const recipientSocket = activeUsers[recipientId];
    if (recipientSocket) {
      io.to(recipientSocket).emit('receive-message', message);
    }
  });

  // Notification event
  socket.on('new-notification', (data) => {
    const { userId, notification } = data;
    const userSocket = activeUsers[userId];
    if (userSocket) {
      io.to(userSocket).emit('notification-received', notification);
    }
  });

  // Match found event
  socket.on('match-found', (data) => {
    const { userId, match } = data;
    const userSocket = activeUsers[userId];
    if (userSocket) {
      io.to(userSocket).emit('match-alert', match);
    }
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      delete activeUsers[socket.userId];
      console.log('User disconnected:', socket.id);
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  if (process.env.MONGO_URI) {
    console.log(`✅ MongoDB URI configured`);
  } else {
    console.warn(`⚠️ MONGO_URI not set in environment variables`);
  }
});

server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🗄️  MongoDB connected to: ${process.env.MONGODB_URI}`);
});

module.exports = { app, io };
