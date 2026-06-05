const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');

router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();
    res.json({ success: true, data: testimonials });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
