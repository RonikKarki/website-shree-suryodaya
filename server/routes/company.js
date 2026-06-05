const express = require('express');
const router = express.Router();
const CompanyInfo = require('../models/CompanyInfo');

// GET all company info
router.get('/', async (req, res) => {
  try {
    const info = await CompanyInfo.find();
    const result = {};
    info.forEach((item) => {
      result[item.key] = item.value;
    });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET single key
router.get('/:key', async (req, res) => {
  try {
    const info = await CompanyInfo.findOne({ key: req.params.key });
    if (!info) return res.status(404).json({ success: false, message: 'Key not found' });
    res.json({ success: true, data: info.value });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT upsert a key
router.put('/:key', async (req, res) => {
  try {
    const info = await CompanyInfo.findOneAndUpdate(
      { key: req.params.key },
      { value: req.body.value },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: info });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
