const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SALT_ROUNDS = 10;

function signToken(userId) {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

async function register(req, res) {
  try {
    const { firstName, lastName, email, password, country } = req.body;

    if (!firstName || !lastName || !email || !password || !country) {
      return res.status(400).json({ message: 'All fields are required: firstName, lastName, email, password, country' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({ firstName, lastName, email, passwordHash, country });

    const token = signToken(user._id);

    return res.status(201).json({ token, user });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');

    const INVALID = 'Invalid credentials';

    if (!user) {
      return res.status(401).json({ message: INVALID });
    }

    // Re-attach passwordHash for comparison (toJSON strips it, but the doc still has it)
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: INVALID });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({ token, user });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { register, login };
