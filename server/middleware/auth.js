const jwt = require('jsonwebtoken');
const User = require('../models/User');
 
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'err_auth_required' });
    }
 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
 
    if (!user) {
      return res.status(401).json({ message: 'err_user_not_found' });
    }
 
    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'err_token_invalid' });
  }
};
 
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (user) {
        req.user = user;
        req.userId = user._id;
      }
    }
  } catch (error) {
    // no auth
  }
  next();
};
 
module.exports = { auth, optionalAuth };