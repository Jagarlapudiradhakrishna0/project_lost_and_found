const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    console.log('📝 REGISTER API HIT');
    console.log('Request body:', req.body);
    
    const {
      fullName,
      email,
      password,
      rollNumber,
      department,
      year
    } = req.body;

    const name = fullName;

    // Validate input
    if (!name || !email || !password || !rollNumber) {
      console.log('❌ Missing fields:', { name, email, password, rollNumber });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    console.log('🔍 Checking if user exists:', email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    console.log('👤 Creating new user...');
    const user = new User({
      name,
      email,
      password,
      rollNumber,
      department,
      year,
      isVerified: true,
    });

    console.log('💾 Saving user to database...');
    await user.save();
    console.log('✅ User saved successfully:', user._id);

    // Generate token
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET not set in environment variables!');
      return res.status(500).json({ error: 'Server configuration error: JWT_SECRET not set' });
    }
    
    console.log('🔐 Generating JWT token...');
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log('✅ Token generated successfully');

    console.log('📤 Sending registration response...');
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        role: user.role,
      },
    });
    console.log('✅ REGISTRATION COMPLETE');
  } catch (error) {
    console.error("❌ REGISTER ERROR:", error.message);
    console.error(error.stack);
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        role: user.role,
        reputation: user.reputation,
        successfulReturns: user.successfulReturns,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, department, year, profileImage } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, department, year, profileImage },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
