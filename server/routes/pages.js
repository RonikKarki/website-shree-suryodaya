const express = require('express');
const router = express.Router();
const AboutContent   = require('../models/AboutContent');
const ContactContent = require('../models/ContactContent');
const FactoryContent = require('../models/FactoryContent');

router.get('/about', async (req, res) => {
  try {
    const data = await AboutContent.findOne().lean();
    if (!data) return res.status(404).json({ success: false, message: 'About content not found' });
    res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/contact-page', async (req, res) => {
  try {
    const data = await ContactContent.findOne().lean();
    if (!data) return res.status(404).json({ success: false, message: 'Contact content not found' });
    res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/factory', async (req, res) => {
  try {
    const data = await FactoryContent.findOne().lean();
    if (!data) return res.status(404).json({ success: false, message: 'Factory content not found. Run seed.' });
    res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
