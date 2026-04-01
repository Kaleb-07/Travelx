const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SALT_ROUNDS = 10;

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function safeUser(user) {
  const { passwordHash, ...rest } = user.toJSON();
  return rest;
}

async function register(req, res) {
  try {
    const { firstName, lastName, email, password, country } = req.body;

    if (!firstName || !lastName || !email || !password || !country) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ firstName, lastName, email: email.toLowerCase().trim(), passwordHash, country });
    const token = signToken(user.id);

    return res.status(201).json({ token, user: safeUser(user) });
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

    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user.id);
    return res.status(200).json({ token, user: safeUser(user) });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { register, login };
