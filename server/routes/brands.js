const express = require('express');
const router  = express.Router();
const Brand   = require('../models/Brand');

router.get('/', async (req, res) => {
  try {
    const brands = await Brand.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 }).lean();
    res.json({ success: true, data: brands });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
