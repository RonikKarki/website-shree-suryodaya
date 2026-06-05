const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    // Contact / WhatsApp
    whatsappNumber:  { type: String, default: '' },
    phoneNumber:     { type: String, default: '' },
    email:           { type: String, default: '' },
    address:         { type: String, default: '' },
    // Social media
    facebookUrl:     { type: String, default: '' },
    instagramUrl:    { type: String, default: '' },
    twitterUrl:      { type: String, default: '' },
    youtubeUrl:      { type: String, default: '' },
    // WhatsApp default message
    whatsappDefaultMessage: {
      type: String,
      default: 'Hello! I am interested in your rice products. Please provide more information.',
    },
    // Company basics
    companyName:     { type: String, default: 'Shree Suryodaya Khadya Udhyog Limited' },
    tagline:         { type: String, default: "Nepal's Finest Rice, Milled with Pride" },
    registrationNo:  { type: String, default: '' },
    panNo:           { type: String, default: '' },
    foundedYear:     { type: String, default: '2009' },
    // Admin security — bcrypt-hashed password stored in DB
    adminPasswordHash: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
