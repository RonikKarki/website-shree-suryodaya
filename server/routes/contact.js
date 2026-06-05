const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    const contact = new Contact({ name, email, phone, subject, message });
    await contact.save();

    res.status(201).json({
      success: true,
      message: 'Your message has been received. We will get back to you shortly.',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// GET all messages (admin use)
router.get('/', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
