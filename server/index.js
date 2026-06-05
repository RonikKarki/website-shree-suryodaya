require('dotenv').config();
const express     = require('express');
const cors        = require('cors');
const helmet      = require('helmet');
const rateLimit   = require('express-rate-limit');
const mongoose    = require('mongoose');
const path        = require('path');

const productRoutes     = require('./routes/products');
const contactRoutes     = require('./routes/contact');
const companyRoutes     = require('./routes/company');
const homepageRoutes    = require('./routes/homepage');
const settingsRoutes    = require('./routes/settings');
const pagesRoutes       = require('./routes/pages');
const galleryRoutes     = require('./routes/gallery');
const blogRoutes        = require('./routes/blog');
const testimonialsRoutes= require('./routes/testimonials');
const brandsRoutes      = require('./routes/brands');
const adminRoutes       = require('./routes/admin');

const app = express();

// ─── Security headers ─────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow /uploads images
  contentSecurityPolicy: false, // disabled since the frontend handles its own CSP
}));

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.CLIENT_URL || 'https://yourdomain.com']
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({ origin: allowedOrigins, credentials: true }));

// ─── Rate limiting ────────────────────────────────────────────────────────────
// Strict limit on login: 10 attempts per 15 min per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API limit: 300 req/min per IP
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests. Please slow down.' },
});

app.use('/api/', apiLimiter);
app.use('/api/admin/login', loginLimiter);

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Static uploads ───────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ─── API routes ───────────────────────────────────────────────────────────────
app.use('/api/products',      productRoutes);
app.use('/api/contact',       contactRoutes);
app.use('/api/company',       companyRoutes);
app.use('/api/homepage',      homepageRoutes);
app.use('/api/settings',      settingsRoutes);
app.use('/api/pages',         pagesRoutes);
app.use('/api/gallery',       galleryRoutes);
app.use('/api/blog',          blogRoutes);
app.use('/api/testimonials',  testimonialsRoutes);
app.use('/api/brands',        brandsRoutes);
app.use('/api/admin',         adminRoutes);

app.get('/api/health', (req, res) =>
  res.json({ status: 'OK', message: 'Shree Suryodaya API running', timestamp: new Date() })
);

// ─── Error handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✓ MongoDB connected');
    app.listen(PORT, () => console.log(`✓ Server running on port ${PORT}`));
  })
  .catch((err) => { console.error('MongoDB error:', err.message); process.exit(1); });
