# 🎓 Lost & Found Management System

> A modern, full-stack web application for managing lost and found items in educational institutions

[![Node.js](https://img.shields.io/badge/Node.js-v16.0+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18.0+-blue)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v4.0+-green)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🌟 Features

### Core Functionality
- ✅ **Report Lost Items** - Users can report items they've lost with detailed information
- ✅ **Report Found Items** - Community members can report discovered items
- ✅ **Smart Matching** - Intelligent algorithm automatically matches lost and found items
- ✅ **Direct Messaging** - Communicate with item reporters and finders
- ✅ **Real-time Notifications** - Get instant updates on matches and messages
- ✅ **User Profiles** - Manage your profile and track your item history
- ✅ **Success Tracking** - Monitor successful item returns and matches

### Technical Features
- 🔐 **JWT Authentication** - Secure user authentication and authorization
- 🔔 **Socket.io Integration** - Real-time messaging and notifications
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI** - Beautiful gradient-based dark theme with smooth animations
- ⚡ **Performance Optimized** - Fast load times and efficient data handling

## 🏗️ Project Structure

```
lost-and-found/
├── backend/
│   ├── config/          # Database and service configurations
│   ├── controllers/     # Business logic controllers
│   ├── middleware/      # Authentication and error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── utils/           # Utility functions
│   ├── server.js        # Main server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── utils/       # Helper functions and API calls
│   │   ├── App.jsx      # Main application component
│   │   └── index.jsx    # React entry point
│   ├── public/          # Static assets
│   └── package.json
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local or cloud instance)
- **Cloudinary Account** (for image hosting - optional)

### Setup & Installation

#### 1. Clone Repository
```bash
git clone https://github.com/yourusername/lost-and-found.git
cd lost-and-found
```

#### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in the `backend` folder:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lost-and-found
JWT_SECRET=your_secure_secret_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:3000
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
```

#### 4. Start Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Backend runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# Frontend runs on http://localhost:3000
```

✅ Open your browser and navigate to **http://localhost:3000**

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Lost Items
- `GET /api/lost-items` - Get all lost items
- `GET /api/lost-items/:id` - Get specific lost item
- `POST /api/lost-items` - Report lost item
- `PUT /api/lost-items/:id/mark-received` - Mark item as received

### Found Items
- `GET /api/found-items` - Get all found items
- `GET /api/found-items/:id` - Get specific found item
- `POST /api/found-items` - Report found item
- `PUT /api/found-items/:id/mark-received` - Mark item as received

### Matches
- `GET /api/matches` - Get user's matches
- `POST /api/matches` - Create match
- `PUT /api/matches/:id/accept` - Accept match
- `PUT /api/matches/:id/confirm-return` - Confirm item return
- `PUT /api/matches/:id/reject` - Reject match

### Messages & Notifications
- `POST /api/messages` - Send message
- `GET /api/messages/:matchId` - Get conversation
- `GET /api/notifications` - Get notifications
- `POST /api/direct-messages` - Send direct message

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  rollNumber: String,
  department: String,
  year: String,
  profileImage: String,
  successfulReturns: Number,
  successfulMatches: Number,
  createdAt: Date
}
```

### Item Models (Lost/Found)
```javascript
{
  itemName: String,
  description: String,
  category: String,
  color: String,
  images: [String],
  location: String,
  date: Date,
  time: String,
  reportedBy: ObjectId,
  status: String,
  createdAt: Date
}
```

### Match Model
```javascript
{
  lostItemId: ObjectId,
  foundItemId: ObjectId,
  initiatedBy: ObjectId,
  similarity: Number,
  status: String,
  createdAt: Date
}
```

## 🎨 Technology Stack

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Socket.io** - Real-time communication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image hosting

## 📱 Features Demonstration

### Reporting Items
1. Users register and create an account
2. Navigate to "Report Lost" or "Report Found"
3. Fill in item details (name, category, color, location, etc.)
4. Upload item images
5. Submit - item is now visible to the community

### Matching System
- Algorithm automatically scores potential matches
- Considers category, color, location, date, and description
- Users receive notifications when matches are found
- Users can accept, confirm, or reject matches

### Communication
- Direct messaging between item reporters and finders
- Real-time notifications via Socket.io
- View conversation history

### Success Tracking
- Profile displays successful returns count
- View all your reported items
- Track item status (Lost, Found, Matched, Received)

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Protected API routes
- ✅ CORS configuration
- ✅ Input validation
- ✅ Error handling middleware

## 📄 Environment Configuration

Create `.env` file in backend folder with:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET` - Image hosting
- `CLIENT_URL` - Frontend URL
- `PORT` - Server port

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Created with ❤️ for educational institutions

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Happy Lost & Found Management! 🎓**

## 📁 All Files in One Place

Everything is now organized in: **`C:\dev\lost-and-found\`**

### File Locations:
- Backend entry: `C:\dev\lost-and-found\backend\server.js`
- Frontend entry: `C:\dev\lost-and-found\frontend\src\App.jsx`
- Environment config: `C:\dev\lost-and-found\backend\.env`

## 🎯 Next Steps

1. ✅ Open `C:\dev\lost-and-found` in VS Code
2. ✅ Create `.env` file in backend folder
3. ✅ Run backend: `cd backend && node server.js`
4. ✅ Run frontend: `cd frontend && npm start`
5. ✅ Visit http://localhost:3002

## 📞 Support

For issues or questions:
- Check SETUP_GUIDE.md for detailed setup
- Review API_DOCUMENTATION.md for API reference
- See DESIGN_GUIDE.md for UI specifications

---

**Ready to launch? Open C:\dev\lost-and-found in VS Code and get started!** 🚀
