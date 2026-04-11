# 🎓 Lost & Found Management System

> A modern, full-stack web application for managing lost and found items in educational institutions

[![Node.js](https://img.shields.io/badge/Node.js-v18.0+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18.0+-blue)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v5.0+-green)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v3.3+-38B2AC)](https://tailwindcss.com/)

## 🌟 Features

### Core Functionality
- ✅ **Report Lost Items** - Users can report items they've lost with detailed information and photos
- ✅ **Report Found Items** - Community members can report discovered items
- ✅ **Smart Matching** - Intelligent algorithm automatically matches lost and found items
- ✅ **Direct Messaging** - Real-time communication with item reporters and finders
- ✅ **Real-time Notifications** - Instant updates on matches and messages
- ✅ **User Profiles** - Manage profile, track item history, and view past matches
- ✅ **Admin Dashboard** - Monitor and manage all items and users

### Technical Features
- 🔐 **JWT Authentication** - Secure token-based authentication
- 🔔 **Socket.io** - Real-time messaging and live notifications
- 📸 **Image Upload** - Cloudinary integration for item photos
- 📱 **Responsive Design** - Mobile-first approach, works on all devices
- 🎨 **Modern UI** - Beautiful dark theme with Tailwind CSS and animations
- ⚡ **Optimized Performance** - Fast load times with efficient data handling

---

## 🏗️ Project Structure

```
lost-and-found/
├── backend/                    # Node.js/Express API
│   ├── config/                # Configurations (DB, Cloudinary)
│   ├── controllers/           # Business logic
│   ├── middleware/            # Auth, error handling
│   ├── models/                # MongoDB schemas
│   ├── routes/                # API endpoints
│   ├── utils/                 # Helper functions
│   ├── server.js              # Entry point
│   ├── Dockerfile             # Docker configuration
│   └── package.json
│
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # API and utility functions
│   │   ├── App.jsx            # Main app component
│   │   └── index.jsx          # Entry point
│   ├── Dockerfile             # Docker configuration
│   ├── tailwind.config.js     # Tailwind configuration
│   └── package.json
│
├── package.json               # Root dependencies
└── README.md                  # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ 
- npm or yarn
- MongoDB Atlas account (free tier: https://www.mongodb.com/cloud/atlas)
- Cloudinary account (optional, for image uploads): https://cloudinary.com

### Local Development

**1. Clone the repository:**
```bash
git clone https://github.com/Jagarlapudiradhakrishna0/Devops_project_lost_and_found.git
cd Devops_project_lost_and_found
```

**2. Install dependencies:**
```bash
# Root directory
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

**3. Configure environment variables:**

Create `.env` file in `backend/` directory:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lost-and-found
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Cloudinary (optional)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
```

Create `.env` file in `frontend/` directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

**4. Start development servers:**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

Access the app at: **http://localhost:3000**

---

## 📦 Deployment

### 🌐 Deployment Stack: Render (Backend) + Vercel (Frontend) + MongoDB Atlas

This guide covers deploying the Lost & Found application using the recommended production-grade stack:
- **Backend:** Render (Node.js/Express)
- **Frontend:** Vercel (React)
- **Database:** MongoDB Atlas (Cloud MongoDB)

---

### Step 1: Set Up MongoDB Atlas (Database)

**1.1 Create MongoDB Atlas Account:**
- Go to https://www.mongodb.com/cloud/atlas
- Sign up/Login with GitHub (recommended)
- Create a new organization or use existing one

**1.2 Create a Cluster:**
- Click **+ Create a Deployment**
- Choose **M0 Sandbox** (free tier) or higher
- Select your preferred region (choose one closest to your users)
- Click **Create Deployment**
- Choose **Security Quickstart**
  - Create a database user (save username & password)
  - Add your IP address (or use 0.0.0.0 for development)
  - Click **Finish & Close**

**1.3 Get Connection String:**
- Click **Databases** → Your cluster
- Click **Connect** button
- Select **Drivers**
- Choose **Node.js** and version **4.0 or later**
- Copy the connection string: `mongodb+srv://username:password@cluster.mongodb.net/myFirstDatabase`
- Replace `myFirstDatabase` with: `lost-and-found`
- Replace `username` and `password` with your created user credentials
- Save this connection string securely

**Connection String Format:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/lost-and-found?retryWrites=true&w=majority
```

---

### Step 2: Deploy Backend to Render

**2.1 Prepare Backend:**
- Ensure your backend has a `server.js` file in the `backend/` directory
- Verify `package.json` has a valid `start` script:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

**2.2 Create Render Account & Deploy:**
- Go to https://render.com
- Sign up with GitHub
- Click **New +** → **Web Service**
- Connect your GitHub repository
- Configure the service:
  - **Name:** `lost-found-api` (or your preferred name)
  - **Root Directory:** `backend/`
  - **Environment:** `Node`
  - **Build Command:** `npm install`
  - **Start Command:** `npm start`
  - **Instance Type:** Free (or Starter+ for production)

**2.3 Set Environment Variables in Render:**
- In your Render service dashboard, go to **Environment**
- Add the following environment variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lost-and-found?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_characters
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-frontend-vercel-url.vercel.app
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
```

**2.4 Deploy:**
- Click **Deploy**
- Wait for build to complete (2-5 minutes)
- Once deployed, note your Render URL: `https://your-app-name.onrender.com`

> ⚠️ **Note:** Free Render instances spin down after 15 minutes of inactivity. For production, upgrade to a paid plan.

---

### Step 3: Deploy Frontend to Vercel

**3.1 Build Check:**
- Ensure frontend builds successfully:
```bash
cd frontend
npm run build
```

**3.2 Create Vercel Account & Deploy:**
- Go to https://vercel.com
- Sign up with GitHub
- Click **Add New...** → **Project**
- Select your repository
- Configure the project:
  - **Framework Preset:** React
  - **Root Directory:** `frontend/`
  - **Build Command:** `npm run build`
  - **Output Directory:** `build/`

**3.3 Set Environment Variables in Vercel:**
- In Vercel project dashboard, go to **Settings** → **Environment Variables**
- Add:
```
REACT_APP_API_URL=https://your-app-name.onrender.com/api
```
- Click **Add** after each variable

**3.4 Deploy:**
- Click **Deploy**
- Wait for build to complete (1-3 minutes)
- Your frontend will be live at a URL like: `https://your-project-name.vercel.app`

---

### Step 4: Update Backend for Frontend URL

**4.1 Update CORS Configuration:**
After frontend is deployed, update backend CORS settings:

In `backend/server.js` or your main Express app:
```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
```

In `backend/.env`:
```
CLIENT_URL=https://your-project-name.vercel.app
```

**4.2 Redeploy Backend:**
- Push changes to GitHub (main branch)
- Render will automatically detect and redeploy

---

### 🔗 Production Links

After successful deployment, you'll have these URLs:

| Service | URL Format | Example |
|---------|-----------|---------|
| **Frontend (Vercel)** | `https://<project-name>.vercel.app` | https://lost-found-app.vercel.app |
| **Backend API (Render)** | `https://<app-name>.onrender.com` | https://lost-found-api.onrender.com |
| **Database (MongoDB Atlas)** | Connection String | See MongoDB Atlas dashboard |

> ✅ **Yes, you should include deployment links in your README!** This helps users and collaborators understand where the live application is hosted.

---

### 📋 Deployment Checklist

- [ ] MongoDB Atlas cluster created and running
- [ ] Backend `.env` configured with all required variables
- [ ] Backend deployed to Render and receiving requests
- [ ] Frontend `.env` configured with Render API URL
- [ ] Frontend deployed to Vercel
- [ ] CORS configured to accept Vercel frontend URL
- [ ] Test API endpoints from Vercel frontend
- [ ] Verify image uploads (Cloudinary) work in production
- [ ] Check real-time features (Socket.io) work across domains
- [ ] Monitor logs for errors in Render dashboard

---

### 🔧 Troubleshooting Deployment

**Backend won't deploy on Render:**
- Check that `backend/package.json` has a `start` script
- Check for build errors in Render logs
- Verify all environment variables are set correctly

**Frontend can't connect to backend:**
- Verify `REACT_APP_API_URL` is set correctly in Vercel
- Check CORS settings in backend
- Ensure backend is running (check Render dashboard)
- Check browser console for CORS errors

**MongoDB Atlas connection failing:**
- Verify connection string is correct in `MONGODB_URI`
- Check IP whitelist in MongoDB Atlas (needed for Render IP)
- Ensure database user credentials are correct
- Try connecting from MongoDB Compass to verify credentials

**Images not uploading:**
- Verify Cloudinary credentials in backend
- Check Cloudinary account has sufficient quota
- Review Cloudinary dashboard for upload errors

---

## 🔐 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key-123` |
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment mode | `production` or `development` |
| `CLIENT_URL` | Frontend application URL | `https://app.example.com` |
| `CLOUDINARY_NAME` | Cloudinary account name | `your-account` |
| `CLOUDINARY_KEY` | Cloudinary API key | `xxxxx` |
| `CLOUDINARY_SECRET` | Cloudinary API secret | `xxxxx` |
| `REACT_APP_API_URL` | Backend API endpoint (frontend) | `https://api.example.com` |

---

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Lost Items
- `GET /api/lost-items` - Get all lost items
- `POST /api/lost-items` - Create lost item
- `GET /api/lost-items/:id` - Get lost item details
- `PUT /api/lost-items/:id` - Update lost item
- `DELETE /api/lost-items/:id` - Delete lost item

### Found Items
- `GET /api/found-items` - Get all found items
- `POST /api/found-items` - Create found item
- `GET /api/found-items/:id` - Get found item details

### Matches
- `GET /api/matches` - Get matched items
- `POST /api/matches` - Create match

### Messages
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Send message
- `GET /api/direct-messages` - Get direct messages

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Real-time:** Socket.io
- **Image Upload:** Cloudinary
- **Validation:** Joi, Express Validator

### Frontend
- **Library:** React 18
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Real-time:** Socket.io Client
- **Animations:** Framer Motion
- **Icons:** Lucide React

---

## 📝 License

This project is open source and available under the MIT License.

---

## 👥 Contributing

Contributions are welcome! Please feel free to submit Pull Requests.

**Steps to contribute:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Support

For support, email the maintainers or open an issue on GitHub.

---

## 🎉 Acknowledgments

- Built with ❤️ for educational institutions
- Special thanks to all contributors
- Icons by Lucide React
- Styling by Tailwind CSS
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
