const mongoose = require('mongoose');

const aboutContentSchema = new mongoose.Schema(
  {
    hero: {
      title:    { type: String, default: 'About Shree Suryodaya' },
      subtitle: { type: String, default: '' },
      image:    { type: String, default: '' },
    },

    profile: {
      sectionTag:  String,
      title:       String,
      description: String, // multi-paragraph (\n\n separated)
      image:       { type: String, default: '' },
      highlights: [{ id: String, icon: String, label: String, value: String }],
    },

    visionMission: {
      vision: {
        title:       { type: String, default: 'Our Vision' },
        content:     String,
        image:       { type: String, default: '' },
      },
      mission: {
        title:       { type: String, default: 'Our Mission' },
        content:     String,
        image:       { type: String, default: '' },
      },
      commitment: {
        title:       { type: String, default: 'Our Commitment' },
        content:     String,
      },
    },

    values: [
      {
        id:          String,
        icon:        String,
        title:       String,
        description: String,
        color:       { type: String, default: 'green' }, // green | gold | brown | blue
      },
    ],

    history: {
      sectionTag: String,
      title:      String,
      subtitle:   String,
      milestones: [
        {
          id:          String,
          year:        String,
          title:       String,
          description: String,
          image:       { type: String, default: '' },
        },
      ],
    },

    factory: {
      sectionTag:  String,
      title:       String,
      subtitle:    String,
      description: String,
      specs: [{ id: String, icon: String, label: String, value: String }],
      images: [{ id: String, src: { type: String, default: '' }, caption: String }],
    },

    team: {
      sectionTag: String,
      title:      String,
      subtitle:   String,
      members: [
        {
          id:       String,
          name:     String,
          role:     String,
          bio:      String,
          image:    { type: String, default: '' },
        },
      ],
    },

    certifications: {
      sectionTag: String,
      title:      String,
      items: [{ id: String, icon: String, title: String, issuer: String, year: String }],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AboutContent', aboutContentSchema);
