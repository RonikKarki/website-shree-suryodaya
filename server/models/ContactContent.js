const mongoose = require('mongoose');

const contactContentSchema = new mongoose.Schema(
  {
    hero: {
      title:    { type: String, default: 'Get in Touch' },
      subtitle: { type: String, default: '' },
    },
    intro: {
      title:       String,
      description: String,
    },
    phones: [{ id: String, label: String, number: String }],
    emails: [{ id: String, label: String, email: String }],
    address: {
      street:   String,
      city:     String,
      district: String,
      province: String,
      country:  { type: String, default: 'Nepal' },
      full:     String, // fallback full address
    },
    officeHours: String,
    whatsappNumber:  { type: String, default: '' },
    whatsappMessage: { type: String, default: '' },
    mapEmbedUrl:     { type: String, default: '' }, // Google Maps iframe src
    mapLinkUrl:      { type: String, default: '' }, // "Open in Maps" link
    socialLinks: [{ id: String, platform: String, url: String, icon: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactContent', contactContentSchema);
