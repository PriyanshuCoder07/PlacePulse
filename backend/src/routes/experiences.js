const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');
const { protect } = require('../middleware/auth');

// Get all verified experiences with filters
router.get('/', async (req, res) => {
  const { company, branch, year, minCgpa, maxCgpa, search } = req.query;
  const filter = { verified: true };

  if (company) filter.company = { $regex: company, $options: 'i' };
  if (branch) filter.branch = branch;
  if (year) filter.year = Number(year);
  if (minCgpa || maxCgpa) {
    filter.cgpa = {};
    if (minCgpa) filter.cgpa.$gte = Number(minCgpa);
    if (maxCgpa) filter.cgpa.$lte = Number(maxCgpa);
  }
  if (search) {
    filter.$or = [
      { company: { $regex: search, $options: 'i' } },
      { role: { $regex: search, $options: 'i' } },
      { questionsAsked: { $regex: search, $options: 'i' } },
    ];
  }

  const experiences = await Experience.find(filter)
    .populate('submittedBy', 'name photo')
    .sort({ createdAt: -1 });

  res.json(experiences);
});

// Get single experience
router.get('/:id', async (req, res) => {
  const experience = await Experience.findById(req.params.id)
    .populate('submittedBy', 'name photo');
  if (!experience) return res.status(404).json({ message: 'Not found' });
  res.json(experience);
});

// Submit experience
router.post('/', protect, async (req, res) => {
  const { company, role, ctc, branch, cgpa, year, rounds, questionsAsked, tips, anonymous } = req.body;

  const experience = await Experience.create({
    company, role, ctc, branch, cgpa, year, rounds, questionsAsked, tips,
    anonymous,
    submittedBy: req.user._id,
    submitterName: anonymous ? 'Anonymous' : req.user.name,
    verified: false,
  });

  res.status(201).json({ message: 'Submitted! Awaiting admin approval.', experience });
});

// Upvote experience
router.post('/:id/upvote', protect, async (req, res) => {
  const experience = await Experience.findById(req.params.id);
  if (!experience) return res.status(404).json({ message: 'Not found' });

  const alreadyUpvoted = experience.upvotes.includes(req.user._id);
  if (alreadyUpvoted) {
    experience.upvotes = experience.upvotes.filter(id => id.toString() !== req.user._id.toString());
  } else {
    experience.upvotes.push(req.user._id);
  }

  await experience.save();
  res.json({ upvotes: experience.upvotes.length, upvoted: !alreadyUpvoted });
});

module.exports = router;