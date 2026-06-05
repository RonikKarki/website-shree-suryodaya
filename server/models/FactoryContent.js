const mongoose = require('mongoose');

const factoryContentSchema = new mongoose.Schema(
  {
    hero: {
      title:    { type: String, default: 'State-of-the-Art Rice Milling' },
      subtitle: { type: String, default: 'A modern integrated rice mill in Gaindakot, Nawalpur — processing 50 metric tons daily with precision and care.' },
    },

    capacity: {
      sectionTag: { type: String, default: 'Capacity' },
      title:      { type: String, default: 'Mill at a Glance' },
      items: [{
        id:    String,
        icon:  String,
        label: String,
        value: String,
      }],
    },

    process: {
      sectionTag: { type: String, default: 'Process' },
      title:      { type: String, default: 'From Paddy to Premium Rice' },
      subtitle:   String,
      steps: [{
        id:   String,
        step: String,
        icon: String,
        title: String,
        desc: String,
      }],
    },

    machinery: {
      sectionTag: { type: String, default: 'Equipment' },
      title:      { type: String, default: 'Our Machinery' },
      subtitle:   String,
      items: [{
        id:      String,
        name:    String,
        qty:     String,
        spec:    String,
        purpose: String,
      }],
    },

    quality: {
      sectionTag:  { type: String, default: 'Quality Assurance' },
      title:       { type: String, default: 'Every Batch Tested. Every Bag Guaranteed.' },
      description: String,
      checklist: [{ id: String, text: String }],
      cards:     [{ id: String, emoji: String, title: String, desc: String }],
    },

    location: {
      sectionTag:  { type: String, default: 'Location' },
      title:       { type: String, default: 'Find Our Mill' },
      subtitle:    String,
      address:     { type: String, default: 'Gaindakot, Nawalpur, Gandaki Province, Nepal' },
      mapEmbedUrl: { type: String, default: '' },
      mapLinkUrl:  { type: String, default: 'https://maps.google.com/?q=Gaindakot,Nawalpur,Nepal' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FactoryContent', factoryContentSchema);
