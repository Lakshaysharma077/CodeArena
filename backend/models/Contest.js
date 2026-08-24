const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  type: { type: String, enum: ['LIVE', 'UPCOMING', 'PAST', 'VIRTUAL'], default: 'UPCOMING' },
  problemsCount: { type: Number, default: 4 },
  participantsCount: { type: Number, default: 0 },
  prizes: [{ type: String }],
  bannerUrl: { type: String },
  registrationOpen: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Contest', contestSchema);
