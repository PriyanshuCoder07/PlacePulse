const admin = require('../config/firebase');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    let user = await User.findOne({ email: decoded.email });

    if (!user) {
      user = await User.create({
        name: decoded.name,
        email: decoded.email,
        photo: decoded.picture,
        isAdmin: decoded.email === process.env.ADMIN_EMAIL,
      });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user?.isAdmin) return res.status(403).json({ message: 'Admin access only' });
  next();
};

module.exports = { protect, adminOnly };