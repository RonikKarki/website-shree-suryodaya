const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    nameNepali: { type: String, trim: true },
    category: {
      type: String,
      enum: ['premium', 'medium', 'economy', 'specialty'],
      default: 'medium',
    },
    description: { type: String, required: true },
    features: [{ type: String }],
    grainType: { type: String },
    grainLength: { type: String },
    aroma: { type: String },
    texture: { type: String },
    cookingTip: { type: String },
    packagingSizes: [{ type: String }],
    image: { type: String, default: '' },
    brand: { type: String, default: '' },
    whatsappMessage: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
