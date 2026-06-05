const mongoose = require('mongoose');

// Stores the entire homepage as a single document (singleton pattern)
const homepageContentSchema = new mongoose.Schema(
  {
    hero: {
      slides: [
        {
          id: String,
          image: { type: String, default: '' },
          overlayOpacity: { type: Number, default: 0.55 },
          tag: String,
          title: String,
          subtitle: String,
        },
      ],
      buttons: [
        {
          id: String,
          label: String,
          link: String,
          variant: { type: String, enum: ['primary', 'secondary', 'outline'], default: 'primary' },
        },
      ],
      autoplayInterval: { type: Number, default: 5000 },
    },

    companyIntro: {
      sectionTag: { type: String, default: 'Our Story' },
      title: String,
      description: String,
      images: [{ type: String }],
      highlights: [{ id: String, icon: String, text: String }],
      ctaLabel: { type: String, default: 'Read Our Full Story' },
      ctaLink: { type: String, default: '/about' },
    },

    whyChooseUs: {
      sectionTag: { type: String, default: 'Why Us?' },
      title: String,
      subtitle: String,
      items: [
        {
          id: String,
          icon: String,
          title: String,
          description: String,
        },
      ],
    },

    process: {
      sectionTag: { type: String, default: 'Our Process' },
      title: String,
      subtitle: String,
      steps: [
        {
          id: String,
          step: String,
          icon: String,
          title: String,
          description: String,
        },
      ],
    },

    featuredProducts: {
      sectionTag: { type: String, default: 'Our Range' },
      title: String,
      subtitle: String,
      limit: { type: Number, default: 3 },
      ctaLabel: { type: String, default: 'View All Products' },
      ctaLink: { type: String, default: '/products' },
    },

    stats: {
      sectionTag: { type: String, default: 'By the Numbers' },
      title: String,
      subtitle: String,
      backgroundStyle: { type: String, enum: ['dark', 'brand', 'white'], default: 'dark' },
      items: [
        {
          id: String,
          icon: String,
          value: String,
          label: String,
          suffix: { type: String, default: '' },
        },
      ],
    },

    gallery: {
      sectionTag: { type: String, default: 'Factory Gallery' },
      title: String,
      subtitle: String,
      images: [
        {
          id: String,
          src: { type: String, default: '' },
          caption: String,
        },
      ],
      ctaLabel: { type: String, default: 'Explore Our Factory' },
      ctaLink: { type: String, default: '/factory' },
    },

    brandsSection: {
      sectionTag:  { type: String, default: 'Our Brands' },
      title:       { type: String, default: 'Brands That Families Trust' },
      subtitle:    { type: String, default: 'Two distinct brands crafted for different needs — both delivering the quality Suryodaya is known for.' },
      isVisible:   { type: Boolean, default: true },
    },

    testimonialsSection: {
      sectionTag:  { type: String, default: 'Testimonials' },
      title:       { type: String, default: 'What Our Customers Say' },
      subtitle:    String,
      isVisible:   { type: Boolean, default: true },
    },

    cta: {
      title: String,
      subtitle: String,
      backgroundStyle: { type: String, enum: ['green', 'gold', 'dark'], default: 'green' },
      buttons: [
        {
          id: String,
          label: String,
          link: String,
          variant: { type: String, enum: ['primary', 'secondary', 'outline'], default: 'primary' },
          icon: String,
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HomepageContent', homepageContentSchema);
