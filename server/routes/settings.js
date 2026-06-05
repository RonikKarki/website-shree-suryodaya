const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// GET public settings (WhatsApp number, contact info)
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne().lean();
    if (!settings) settings = {};
    res.json({ success: true, data: settings });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
