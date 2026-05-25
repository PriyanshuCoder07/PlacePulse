const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');
const { protect, adminOnly } = require('../middleware/auth');

// Get all pending experiences
router.get('/pending', protect, adminOnly, async (req, res) => {
  const experiences = await Experience.find({ verified: false })
    .populate('submittedBy', 'name email')
    .sort({ createdAt: -1 });
  res.json(experiences);
});

// Approve experience
router.patch('/:id/approve', protect, adminOnly, async (req, res) => {
  const experience = await Experience.findByIdAndUpdate(
    req.params.id,
    { verified: true },
    { new: true }
  );
  res.json(experience);
});

// Reject/delete experience
router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Experience.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// Analytics
router.get('/analytics', protect, adminOnly, async (req, res) => {
  const total = await Experience.countDocuments({ verified: true });
  const byCompany = await Experience.aggregate([
    { $match: { verified: true } },
    { $group: { _id: '$company', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);
  const byBranch = await Experience.aggregate([
    { $match: { verified: true } },
    { $group: { _id: '$branch', count: { $sum: 1 } } },
  ]);
  const avgCtc = await Experience.aggregate([
    { $match: { verified: true } },
    { $group: { _id: '$company', avgCgpa: { $avg: '$cgpa' } } },
    { $sort: { avgCgpa: -1 } },
    { $limit: 10 },
  ]);

  res.json({ total, byCompany, byBranch, avgCtc });
});
// Get all approved experiences
router.get('/all-experiences', protect, adminOnly, async (req, res) => {
  const experiences = await Experience.find({ verified: true })
    .populate('submittedBy', 'name email')
    .sort({ createdAt: -1 });
  res.json(experiences);
});

// Edit experience before approving
router.patch('/:id/edit', protect, adminOnly, async (req, res) => {
  const experience = await Experience.findByIdAndUpdate(
    req.params.id, req.body, { new: true }
  );
  res.json(experience);
});

// Get all users
router.get('/users', protect, adminOnly, async (req, res) => {
  const User = require('../models/User');
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
});

// Toggle admin
router.patch('/users/:id/toggle-admin', protect, adminOnly, async (req, res) => {
  const User = require('../models/User');
  const user = await User.findById(req.params.id);
  user.isAdmin = !user.isAdmin;
  await user.save();
  res.json(user);
});

module.exports = router;