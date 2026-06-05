const express = require('express');
const router = express.Router();
const GalleryImage = require('../models/GalleryImage');

// GET all active gallery images, optional ?category=factory
router.get('/', async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }
    const images = await GalleryImage.find(filter).sort({ sortOrder: 1, createdAt: 1 }).lean();
    res.json({ success: true, data: images });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
