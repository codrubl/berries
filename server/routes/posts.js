const express = require('express');
const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { auth, optionalAuth } = require('../middleware/auth');
 
const router = express.Router();
 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
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
  limits: { fileSize: 5 * 1024 * 1024 }
});
 
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
 
    let posts;
    const populateFields = 'username avatarUrl walletAddress';
 
    // User logat cu interese
    if (req.user && req.user.interests && req.user.interests.length > 0) {
      const userInterests = req.user.interests;
 
      // Posturi bazate pe interese, cronologice
      const matchingPosts = await Post.find({ tags: { $in: userInterests } })
        .sort({ createdAt: -1 })
        .populate('author', populateFields);
 
      const matchingIds = matchingPosts.map(p => p._id);
 
      // Alte posturi, cronologice
      const otherPosts = await Post.find({ _id: { $nin: matchingIds } })
        .sort({ createdAt: -1 })
        .populate('author', populateFields);
 
      const allPosts = [...matchingPosts, ...otherPosts];
      const total = allPosts.length;
      posts = allPosts.slice(skip, skip + limit);
 
      res.json({
        posts,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total
      });
    } else {
      // Pt feed cronologic
      posts = await Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', populateFields);
 
      const total = await Post.countDocuments();
 
      res.json({
        posts,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'err_server_load_posts' });
  }
});
 
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username avatarUrl walletAddress bio');
 
    if (!post) {
      return res.status(404).json({ message: 'err_post_not_found' });
    }
 
    const comments = await Comment.find({ post: post._id })
      .sort({ createdAt: -1 })
      .populate('author', 'username avatarUrl');
 
    res.json({ post, comments });
  } catch (error) {
    res.status(500).json({ message: 'err_server_load_post' });
  }
});
 
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { content, tags } = req.body;
 
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'err_post_content_required' });
    }
 
    const postData = {
      author: req.userId,
      content: content.trim()
    };
 
    if (tags) {
      try {
        postData.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (e) {
        postData.tags = [];
      }
    }
 
    if (req.file) {
      postData.imageUrl = `/uploads/${req.file.filename}`;
    }
 
    const post = new Post(postData);
    await post.save();
    await post.populate('author', 'username avatarUrl walletAddress');
 
    res.status(201).json({ post });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    res.status(500).json({ message: 'err_server_create_post' });
  }
});
 
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
 
    if (!post) {
      return res.status(404).json({ message: 'err_post_not_found' });
    }
 
    if (post.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'err_not_authorized_post' });
    }
 
    await Comment.deleteMany({ post: post._id });
    await Post.findByIdAndDelete(req.params.id);
 
    res.json({ message: 'success_post_deleted' });
  } catch (error) {
    res.status(500).json({ message: 'err_server_delete_post' });
  }
});
 
router.get('/user/:userId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
 
    const posts = await Post.find({ author: req.params.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username avatarUrl walletAddress');
 
    const total = await Post.countDocuments({ author: req.params.userId });
 
    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
    res.status(500).json({ message: 'err_server_load_posts' });
  }
});
 
module.exports = router;