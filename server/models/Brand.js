const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    nepaliName:  { type: String, trim: true, default: '' },
    logo:        { type: String, default: '' },
    tagline:     { type: String, default: '' },
    description: { type: String, default: '' },
    accentColor: { type: String, default: '#1B5E20' },
    isActive:    { type: Boolean, default: true },
    sortOrder:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Brand', brandSchema);
