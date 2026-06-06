const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

const adminAuth      = require('../middleware/adminAuth');
const HomepageContent= require('../models/HomepageContent');
const Product        = require('../models/Product');
const Contact        = require('../models/Contact');
const Settings       = require('../models/Settings');
const AboutContent   = require('../models/AboutContent');
const GalleryImage   = require('../models/GalleryImage');
const BlogPost       = require('../models/BlogPost');
const ContactContent = require('../models/ContactContent');
const Testimonial    = require('../models/Testimonial');
const FactoryContent = require('../models/FactoryContent');
const Brand          = require('../models/Brand');

// ─── Multer (memory storage — buffer passed directly to base64) ───────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
    cb(ok ? null : new Error('Only image files allowed.'), ok);
  },
});

// ─── Helper: verify password against DB hash or .env fallback ─────────────────
async function verifyAdminPassword(password) {
  const settings = await Settings.findOne().select('adminPasswordHash');
  if (settings?.adminPasswordHash) {
    return bcrypt.compare(password, settings.adminPasswordHash);
  }
  // .env fallback (plain text comparison for backward compat)
  return password === process.env.ADMIN_PASSWORD;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ success: false, message: 'Password required.' });

    const valid = await verifyAdminPassword(password);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Incorrect password.' });
    }

    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ success: true, token, expiresIn: 43200 });
  } catch {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Change password
router.post('/change-password', adminAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both passwords required.' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters.' });
    }

    const valid = await verifyAdminPassword(currentPassword);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    const hash = await bcrypt.hash(newPassword, 12);
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();
    settings.adminPasswordHash = hash;
    await settings.save();

    // Issue a fresh token
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ success: true, message: 'Password changed successfully.', token });
  } catch {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── Image Upload ─────────────────────────────────────────────────────────────
router.post('/upload', adminAuth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });
  const dataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  res.json({ success: true, url: dataUrl });
});

router.delete('/upload', adminAuth, (req, res) => {
  // base64 images are stored in MongoDB — nothing to delete from disk
  res.json({ success: true });
});

// ─── Dashboard stats ──────────────────────────────────────────────────────────
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const [
      totalProducts, activeProducts,
      totalPosts, publishedPosts,
      totalGallery,
      totalTestimonials,
      totalMessages, unreadMessages,
      recentMessages,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      BlogPost.countDocuments(),
      BlogPost.countDocuments({ isPublished: true }),
      GalleryImage.countDocuments({ isActive: true }),
      Testimonial.countDocuments({ isActive: true }),
      Contact.countDocuments(),
      Contact.countDocuments({ isRead: false }),
      Contact.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    res.json({
      success: true,
      data: {
        products:     { total: totalProducts, active: activeProducts },
        posts:        { total: totalPosts, published: publishedPosts },
        gallery:      { active: totalGallery },
        testimonials: { active: totalTestimonials },
        messages:     { total: totalMessages, unread: unreadMessages },
        recentMessages,
      },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── Homepage content ─────────────────────────────────────────────────────────
router.get('/homepage', adminAuth, async (req, res) => {
  try {
    res.json({ success: true, data: await HomepageContent.findOne() });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.put('/homepage', adminAuth, async (req, res) => {
  try {
    const { section, data } = req.body;
    const doc = await HomepageContent.findOne();
    if (!doc) return res.status(404).json({ success: false, message: 'Homepage not initialised. Run seed.' });
    if (section) { doc[section] = data; }
    else { const { _id, __v, createdAt, updatedAt, ...rest } = req.body; Object.assign(doc, rest); }
    await doc.save();
    res.json({ success: true, data: doc });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

// ─── Products CRUD ────────────────────────────────────────────────────────────
router.get('/products', adminAuth, async (req, res) => {
  try {
    res.json({ success: true, data: await Product.find().sort({ sortOrder: 1, createdAt: 1 }) });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.post('/products', adminAuth, async (req, res) => {
  try {
    const last = await Product.findOne().sort({ sortOrder: -1 });
    const product = new Product({ ...req.body, sortOrder: last ? last.sortOrder + 1 : 0 });
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/products/:id', adminAuth, async (req, res) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!p) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: p });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/products/:id', adminAuth, async (req, res) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.patch('/products/:id/toggle', adminAuth, async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: 'Not found' });
    p.isActive = !p.isActive;
    await p.save();
    res.json({ success: true, data: p });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.post('/products/reorder', adminAuth, async (req, res) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order)) return res.status(400).json({ success: false });
    await Promise.all(order.map(({ id, sortOrder }) => Product.findByIdAndUpdate(id, { sortOrder })));
    res.json({ success: true, data: await Product.find().sort({ sortOrder: 1 }) });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

// ─── Settings (company info + contact + social) ───────────────────────────────
router.get('/settings', adminAuth, async (req, res) => {
  try {
    let s = await Settings.findOne().select('-adminPasswordHash');
    if (!s) s = await Settings.create({});
    res.json({ success: true, data: s });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.put('/settings', adminAuth, async (req, res) => {
  try {
    // Never allow overwriting password hash via this endpoint
    const { adminPasswordHash, ...safeData } = req.body;
    let s = await Settings.findOne();
    if (!s) { s = new Settings(safeData); }
    else { Object.assign(s, safeData); }
    await s.save();
    const result = s.toObject();
    delete result.adminPasswordHash;
    res.json({ success: true, data: result });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

// ─── About page ────────────────────────────────────────────────────────────────
router.get('/about', adminAuth, async (req, res) => {
  try { res.json({ success: true, data: await AboutContent.findOne() }); }
  catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.put('/about', adminAuth, async (req, res) => {
  try {
    const { section, data } = req.body;
    const doc = await AboutContent.findOne();
    if (!doc) return res.status(404).json({ success: false, message: 'About content not found. Run seed.' });
    if (section) { doc[section] = data; }
    else { const { _id, __v, createdAt, updatedAt, ...rest } = req.body; Object.assign(doc, rest); }
    await doc.save();
    res.json({ success: true, data: doc });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

// ─── Contact page content ─────────────────────────────────────────────────────
router.get('/contact-page', adminAuth, async (req, res) => {
  try { res.json({ success: true, data: await ContactContent.findOne() }); }
  catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.put('/contact-page', adminAuth, async (req, res) => {
  try {
    let doc = await ContactContent.findOne();
    if (!doc) { doc = new ContactContent(req.body); }
    else { const { _id, __v, createdAt, updatedAt, ...rest } = req.body; Object.assign(doc, rest); }
    await doc.save();
    res.json({ success: true, data: doc });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

// ─── Gallery ──────────────────────────────────────────────────────────────────
router.get('/gallery', adminAuth, async (req, res) => {
  try { res.json({ success: true, data: await GalleryImage.find().sort({ sortOrder: 1 }) }); }
  catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.post('/gallery', adminAuth, async (req, res) => {
  try {
    const last = await GalleryImage.findOne().sort({ sortOrder: -1 });
    const img = new GalleryImage({ ...req.body, sortOrder: last ? last.sortOrder + 1 : 0 });
    await img.save();
    res.status(201).json({ success: true, data: img });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/gallery/:id', adminAuth, async (req, res) => {
  try {
    const img = await GalleryImage.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!img) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: img });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/gallery/:id', adminAuth, async (req, res) => {
  try {
    const img = await GalleryImage.findByIdAndDelete(req.params.id);
    if (!img) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.patch('/gallery/:id/toggle', adminAuth, async (req, res) => {
  try {
    const img = await GalleryImage.findById(req.params.id);
    if (!img) return res.status(404).json({ success: false, message: 'Not found' });
    img.isActive = !img.isActive;
    await img.save();
    res.json({ success: true, data: img });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.post('/gallery/reorder', adminAuth, async (req, res) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order)) return res.status(400).json({ success: false });
    await Promise.all(order.map(({ id, sortOrder }) => GalleryImage.findByIdAndUpdate(id, { sortOrder })));
    res.json({ success: true, data: await GalleryImage.find().sort({ sortOrder: 1 }) });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

// ─── Blog Posts ────────────────────────────────────────────────────────────────
router.get('/blog', adminAuth, async (req, res) => {
  try { res.json({ success: true, data: await BlogPost.find().sort({ createdAt: -1 }).select('-content') }); }
  catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.get('/blog/:id', adminAuth, async (req, res) => {
  try {
    const p = await BlogPost.findById(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: p });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.post('/blog', adminAuth, async (req, res) => {
  try { const p = new BlogPost(req.body); await p.save(); res.status(201).json({ success: true, data: p }); }
  catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/blog/:id', adminAuth, async (req, res) => {
  try {
    const p = await BlogPost.findById(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: 'Not found' });
    Object.assign(p, req.body);
    await p.save();
    res.json({ success: true, data: p });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/blog/:id', adminAuth, async (req, res) => {
  try {
    const p = await BlogPost.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.patch('/blog/:id/toggle', adminAuth, async (req, res) => {
  try {
    const p = await BlogPost.findById(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: 'Not found' });
    p.isPublished = !p.isPublished;
    if (p.isPublished && !p.publishedAt) p.publishedAt = new Date();
    await p.save();
    res.json({ success: true, data: p });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

// ─── Testimonials CRUD ────────────────────────────────────────────────────────
router.get('/testimonials', adminAuth, async (req, res) => {
  try { res.json({ success: true, data: await Testimonial.find().sort({ sortOrder: 1, createdAt: 1 }) }); }
  catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.post('/testimonials', adminAuth, async (req, res) => {
  try {
    const last = await Testimonial.findOne().sort({ sortOrder: -1 });
    const t = new Testimonial({ ...req.body, sortOrder: last ? last.sortOrder + 1 : 0 });
    await t.save();
    res.status(201).json({ success: true, data: t });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/testimonials/:id', adminAuth, async (req, res) => {
  try {
    const t = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!t) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: t });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/testimonials/:id', adminAuth, async (req, res) => {
  try {
    const t = await Testimonial.findByIdAndDelete(req.params.id);
    if (!t) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.patch('/testimonials/:id/toggle', adminAuth, async (req, res) => {
  try {
    const t = await Testimonial.findById(req.params.id);
    if (!t) return res.status(404).json({ success: false, message: 'Not found' });
    t.isActive = !t.isActive;
    await t.save();
    res.json({ success: true, data: t });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.post('/testimonials/reorder', adminAuth, async (req, res) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order)) return res.status(400).json({ success: false });
    await Promise.all(order.map(({ id, sortOrder }) => Testimonial.findByIdAndUpdate(id, { sortOrder })));
    res.json({ success: true, data: await Testimonial.find().sort({ sortOrder: 1 }) });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

// ─── Contact messages (form submissions) ─────────────────────────────────────
router.get('/contacts', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, unread } = req.query;
    const filter = unread === 'true' ? { isRead: false } : {};
    const [messages, total] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
      Contact.countDocuments(filter),
    ]);
    res.json({ success: true, data: messages, total, unread: await Contact.countDocuments({ isRead: false }) });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.patch('/contacts/:id/read', adminAuth, async (req, res) => {
  try {
    const m = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.json({ success: true, data: m });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.patch('/contacts/mark-all-read', adminAuth, async (req, res) => {
  try {
    await Contact.updateMany({ isRead: false }, { isRead: true });
    res.json({ success: true });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.delete('/contacts/:id', adminAuth, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

// ─── Brands CRUD ─────────────────────────────────────────────────────────────
router.get('/brands', adminAuth, async (req, res) => {
  try { res.json({ success: true, data: await Brand.find().sort({ sortOrder: 1, createdAt: 1 }) }); }
  catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.post('/brands', adminAuth, async (req, res) => {
  try {
    const last = await Brand.findOne().sort({ sortOrder: -1 });
    const brand = new Brand({ ...req.body, sortOrder: last ? last.sortOrder + 1 : 0 });
    await brand.save();
    res.status(201).json({ success: true, data: brand });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/brands/:id', adminAuth, async (req, res) => {
  try {
    const b = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!b) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: b });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/brands/:id', adminAuth, async (req, res) => {
  try {
    const b = await Brand.findByIdAndDelete(req.params.id);
    if (!b) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.patch('/brands/:id/toggle', adminAuth, async (req, res) => {
  try {
    const b = await Brand.findById(req.params.id);
    if (!b) return res.status(404).json({ success: false, message: 'Not found' });
    b.isActive = !b.isActive;
    await b.save();
    res.json({ success: true, data: b });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.post('/brands/reorder', adminAuth, async (req, res) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order)) return res.status(400).json({ success: false });
    await Promise.all(order.map(({ id, sortOrder }) => Brand.findByIdAndUpdate(id, { sortOrder })));
    res.json({ success: true, data: await Brand.find().sort({ sortOrder: 1 }) });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

// ─── Factory content ──────────────────────────────────────────────────────────
router.get('/factory', adminAuth, async (req, res) => {
  try { res.json({ success: true, data: await FactoryContent.findOne() }); }
  catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

router.put('/factory', adminAuth, async (req, res) => {
  try {
    const { section, data } = req.body;
    let doc = await FactoryContent.findOne();
    if (!doc) return res.status(404).json({ success: false, message: 'Factory content not found. Run seed.' });
    if (section) { doc[section] = data; }
    else { const { _id, __v, createdAt, updatedAt, ...rest } = req.body; Object.assign(doc, rest); }
    await doc.save();
    res.json({ success: true, data: doc });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

module.exports = router;
