const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { auth } = require('../middleware/auth');
 
const router = express.Router();
 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = 'avatar-' + Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
 
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('err_image_only'), false);
  }
};
 
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
});
 
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};
 
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
 
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
 
    if (existingUser) {
      const field = existingUser.email === email ? 'err_email_taken' : 'err_username_taken';
      return res.status(400).json({ message: field });
    }
 
    const user = new User({ username, email, password });
    await user.save();
    const token = generateToken(user._id);
 
    res.status(201).json({ message: 'success_account_created', token, user: user.toJSON() });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    res.status(500).json({ message: 'err_server_register' });
  }
});
 
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'err_email_password' });
 
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'err_email_password' });
 
    const token = generateToken(user._id);
    res.json({ message: 'success_login', token, user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'err_server_login' });
  }
});
 
router.get('/me', auth, async (req, res) => {
  try {
    res.json({ user: req.user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'err_server_profile' });
  }
});
 
router.put('/profile', auth, async (req, res) => {
  try {
    const { bio, walletAddress, username } = req.body;
    const updates = {};
 
    if (bio !== undefined) updates.bio = bio;
    if (walletAddress !== undefined) updates.walletAddress = walletAddress;
    if (username) {
      const existing = await User.findOne({ username, _id: { $ne: req.userId } });
      if (existing) {
        return res.status(400).json({ message: 'err_username_taken' });
      }
      updates.username = username;
    }
 
    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true, runValidators: true });
    res.json({ user: user.toJSON() });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    res.status(500).json({ message: 'err_server_update_profile' });
  }
});
 
router.put('/interests', auth, async (req, res) => {
  try {
    const { interests } = req.body;
    if (!Array.isArray(interests)) {
      return res.status(400).json({ message: 'err_invalid_interests' });
    }
 
    const user = await User.findByIdAndUpdate(
      req.userId,
      { interests },
      { new: true }
    );
    res.json({ user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'err_server_update_profile' });
  }
});
 
router.put('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'err_no_image' });
    }
 
    const currentUser = await User.findById(req.userId);
    if (currentUser.avatarUrl) {
      const oldPath = path.join(__dirname, '..', currentUser.avatarUrl);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
 
    const avatarUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.userId, { avatarUrl }, { new: true });
    res.json({ user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'err_server_upload_image' });
  }
});
 
router.delete('/avatar', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    if (currentUser.avatarUrl) {
      const oldPath = path.join(__dirname, '..', currentUser.avatarUrl);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
 
    const user = await User.findByIdAndUpdate(req.userId, { avatarUrl: '' }, { new: true });
    res.json({ user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'err_server_delete_image' });
  }
});
 
router.delete('/account', auth, async (req, res) => {
  try {
    const userId = req.userId;
 
    await Comment.deleteMany({ author: userId });
 
    const userPosts = await Post.find({ author: userId }).select('_id imageUrl');
    const postIds = userPosts.map(p => p._id);
    await Comment.deleteMany({ post: { $in: postIds } });
 
    for (const post of userPosts) {
      if (post.imageUrl) {
        const imgPath = path.join(__dirname, '..', post.imageUrl);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      }
    }
    await Post.deleteMany({ author: userId });
 
    const user = await User.findById(userId);
    if (user && user.avatarUrl) {
      const avatarPath = path.join(__dirname, '..', user.avatarUrl);
      if (fs.existsSync(avatarPath)) fs.unlinkSync(avatarPath);
    }
 
    await User.findByIdAndDelete(userId);
 
    res.json({ message: 'success_account_deleted' });
  } catch (error) {
    res.status(500).json({ message: 'err_server_delete_account' });
  }
});
 
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'err_user_not_found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'err_server_profile' });
  }
});
 
router.get('/admin/users', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'err_not_admin' });
    }
 
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'err_server_profile' });
  }
});
 
router.delete('/admin/user/:id', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'err_not_admin' });
    }
 
    const targetId = req.params.id;
 
    if (targetId === req.userId.toString()) {
      return res.status(400).json({ message: 'err_admin_self_delete' });
    }
 
    await Comment.deleteMany({ author: targetId });
 
    const userPosts = await Post.find({ author: targetId }).select('_id imageUrl');
    const postIds = userPosts.map(p => p._id);
    await Comment.deleteMany({ post: { $in: postIds } });
 
    for (const post of userPosts) {
      if (post.imageUrl) {
        const imgPath = path.join(__dirname, '..', post.imageUrl);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      }
    }
    await Post.deleteMany({ author: targetId });
 
    const targetUser = await User.findById(targetId);
    if (targetUser && targetUser.avatarUrl) {
      const avatarPath = path.join(__dirname, '..', targetUser.avatarUrl);
      if (fs.existsSync(avatarPath)) fs.unlinkSync(avatarPath);
    }
 
    await User.findByIdAndDelete(targetId);
 
    res.json({ message: 'success_user_deleted_admin' });
  } catch (error) {
    res.status(500).json({ message: 'err_server_delete_account' });
  }
});
 
module.exports = router;