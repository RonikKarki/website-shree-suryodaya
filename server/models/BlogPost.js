const mongoose = require('mongoose');

function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const blogPostSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, unique: true, sparse: true },
    excerpt:     { type: String, default: '' },
    content:     { type: String, default: '' }, // paragraphs (\n\n separated)
    coverImage:  { type: String, default: '' },
    category:    {
      type: String,
      enum: ['news', 'product', 'story', 'event', 'achievement', 'announcement'],
      default: 'news',
    },
    tags:        [{ type: String }],
    author:      { type: String, default: 'Shree Suryodaya Team' },
    publishedAt: { type: Date },
    isPublished: { type: Boolean, default: false },
    views:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-generate slug before saving
blogPostSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('title')) {
    let base = toSlug(this.title);
    let slug = base;
    let count = 0;
    while (await mongoose.model('BlogPost').exists({ slug, _id: { $ne: this._id } })) {
      count++;
      slug = `${base}-${count}`;
    }
    this.slug = slug;
  }
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
