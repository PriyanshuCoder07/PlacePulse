const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  ctc: { type: String, required: true },
  branch: { type: String, required: true },
  cgpa: { type: Number, required: true },
  year: { type: Number, required: true },
  rounds: [{ type: String }],
  questionsAsked: { type: String },
  tips: { type: String },
  anonymous: { type: Boolean, default: false },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  submitterName: { type: String },
  verified: { type: Boolean, default: false },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);