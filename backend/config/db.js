const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set');
    }
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Connected to database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('💡 Check:');
    console.error('   1. MONGO_URI is set in environment variables');
    console.error('   2. Username and password are correct');
    console.error('   3. Database name is included in connection string');
    console.error('   4. IP whitelist includes Render servers (0.0.0.0/0)');
    console.error('   5. Special characters in password are URL encoded');
    // Don't exit - allow server to run and provide better error messages
    // This allows frontend to get CORS-enabled error responses
  }
};

module.exports = connectDB;
