const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');

// GET published posts — ?page=1&limit=9&category=news
router.get('/', async (req, res) => {
  try {
    const page     = Math.max(1, parseInt(req.query.page)  || 1);
    const limit    = Math.min(30, parseInt(req.query.limit) || 9);
    const skip     = (page - 1) * limit;
    const filter   = { isPublished: true };
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }
    const [posts, total] = await Promise.all([
      BlogPost.find(filter)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-content')   // exclude heavy content from listing
        .lean(),
      BlogPost.countDocuments(filter),
    ]);
    res.json({ success: true, data: posts, total, page, pages: Math.ceil(total / limit) });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET single post by slug — increments views
router.get('/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOneAndUpdate(
      { slug: req.params.slug, isPublished: true },
      { $inc: { views: 1 } },
      { new: true }
    ).lean();
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
