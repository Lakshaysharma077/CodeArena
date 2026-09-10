const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { dataStore } = require('../data/store');

const JWT_SECRET = process.env.JWT_SECRET || 'codearena_super_secret_jwt_key_2026';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'codearena_super_secret_refresh_key_2026';

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id || user._id, username: user.username, role: user.role || 'user' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  const refreshToken = jwt.sign(
    { id: user.id || user._id },
    REFRESH_SECRET,
    { expiresIn: '30d' }
  );
  return { accessToken, refreshToken };
};

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, country, college } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      country: country || 'India',
      college: college || 'IIT Delhi',
      rating: 1200,
      role: 'user'
    });

    const tokens = generateTokens(user);
    const userObj = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      rating: user.rating,
      rank: user.rank,
      avatar: user.avatar,
      country: user.country,
      college: user.college,
      stats: user.stats
    };
    dataStore.users.set(userObj.id, userObj);

    res.status(201).json({
      message: 'Account created successfully',
      tokens,
      user: userObj
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const tokens = generateTokens(user);

    const userObj = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      rating: user.rating,
      rank: user.rank,
      avatar: user.avatar,
      country: user.country,
      college: user.college,
      stats: user.stats
    };
    dataStore.users.set(userObj.id, userObj);

    res.json({
      message: 'Login successful',
      tokens,
      user: userObj
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/auth/me
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const userObj = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      rating: user.rating,
      rank: user.rank,
      avatar: user.avatar,
      country: user.country,
      college: user.college,
      stats: user.stats
    };
    dataStore.users.set(userObj.id, userObj);

    res.json({
      user: userObj
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

module.exports = router;
