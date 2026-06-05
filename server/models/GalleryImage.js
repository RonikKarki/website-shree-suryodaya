const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema(
  {
    title:    { type: String, trim: true, default: '' },
    category: {
      type: String,
      enum: ['factory', 'machinery', 'warehouse', 'processing', 'packaging', 'team', 'other'],
      default: 'factory',
    },
    src:       { type: String, default: '' },
    caption:   { type: String, default: '' },
    alt:       { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
    isActive:  { type: Boolean, default: true },
    isFeatured:{ type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
