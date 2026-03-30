const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName:    { type: String, required: true, trim: true },
  lastName:     { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  country:      { type: String, required: true },
  imageUrl:     { type: String, default: '' },
  createdAt:    { type: Date, default: Date.now }
}, {
  toJSON: {
    transform(doc, ret) {
      delete ret.passwordHash;
      return ret;
    }
  }
});

module.exports = mongoose.model('User', userSchema);
