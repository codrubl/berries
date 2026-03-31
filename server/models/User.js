const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
 
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'err_username_required'],
    unique: true,
    trim: true,
    minlength: [3, 'err_username_min'],
    maxlength: [30, 'err_username_max']
  },
  email: {
    type: String,
    required: [true, 'err_email_required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'err_email_invalid']
  },
  password: {
    type: String,
    required: [true, 'err_password_required'],
    minlength: [6, 'err_password_min']
  },
  bio: {
    type: String,
    default: '',
    maxlength: [300, 'err_bio_max']
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  walletAddress: {
    type: String,
    default: ''
  },
  interests: {
    type: [String],
    default: []
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
 
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
 
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
 
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};
 
module.exports = mongoose.model('User', userSchema);