const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    role:        { type: String, trim: true, default: '' },
    company:     { type: String, trim: true, default: '' },
    avatar:      { type: String, default: '' },
    content:     { type: String, required: true },
    rating:      { type: Number, min: 1, max: 5, default: 5 },
    isActive:    { type: Boolean, default: true },
    isFeatured:  { type: Boolean, default: false },
    sortOrder:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
