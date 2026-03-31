const express = require('express');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { auth } = require('../middleware/auth');
 
const router = express.Router();
 
router.post('/:postId', auth, async (req, res) => {
  try {
    const { content } = req.body;
 
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'err_comment_content_required' });
    }
 
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'err_post_not_found' });
    }
 
    const comment = new Comment({
      post: req.params.postId,
      author: req.userId,
      content: content.trim()
    });
 
    await comment.save();
    await comment.populate('author', 'username avatarUrl');
 
    res.status(201).json({ comment });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    res.status(500).json({ message: 'err_server_add_comment' });
  }
});
 
router.get('/user/:userId', async (req, res) => {
  try {
    const comments = await Comment.find({ author: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('author', 'username avatarUrl')
      .populate({
        path: 'post',
        select: 'content author',
        populate: { path: 'author', select: 'username' }
      });
 
    res.json({ comments });
  } catch (error) {
    res.status(500).json({ message: 'err_server_load_comments' });
  }
});
 
router.delete('/:commentId', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
 
    if (!comment) {
      return res.status(404).json({ message: 'err_comment_not_found' });
    }
 
    const isOwner = comment.author.toString() === req.userId.toString();
    const isAdmin = req.user.isAdmin;
 
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'err_not_authorized_comment' });
    }
 
    await Comment.findByIdAndDelete(req.params.commentId);
    res.json({ message: 'success_comment_deleted' });
  } catch (error) {
    res.status(500).json({ message: 'err_server_delete_comment' });
  }
});
 
module.exports = router;