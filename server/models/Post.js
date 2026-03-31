const mongoose = require('mongoose');
 
const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'err_post_content_required'],
    maxlength: [5000, 'err_post_content_max']
  },
  imageUrl: {
    type: String,
    default: ''
  },
  tags: {
    type: [String],
    default: []
  },
  totalDonations: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
 
postSchema.index({ createdAt: -1 });
 
module.exports = mongoose.model('Post', postSchema);