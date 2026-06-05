const express = require('express');
const router = express.Router();
const HomepageContent = require('../models/HomepageContent');

// GET homepage content (public)
router.get('/', async (req, res) => {
  try {
    const content = await HomepageContent.findOne().lean();
    if (!content) return res.status(404).json({ success: false, message: 'Homepage content not configured.' });
    res.json({ success: true, data: content });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
