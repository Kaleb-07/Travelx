const User = require('../models/User');

async function getMe(req, res) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function updateMe(req, res) {
  try {
    const { firstName, lastName, country, imageUrl } = req.body;
    const updates = {};
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (country !== undefined) updates.country = country;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;

    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { getMe, updateMe };
