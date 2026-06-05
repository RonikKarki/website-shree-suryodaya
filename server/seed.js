require('dotenv').config();
// Force Google DNS to bypass IPv6 DNS server that can't resolve Atlas SRV records
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
const mongoose    = require('mongoose');
const bcrypt      = require('bcryptjs');
const Product        = require('./models/Product');
const CompanyInfo    = require('./models/CompanyInfo');
const HomepageContent= require('./models/HomepageContent');
const Settings       = require('./models/Settings');
const AboutContent   = require('./models/AboutContent');
const GalleryImage   = require('./models/GalleryImage');
const BlogPost       = require('./models/BlogPost');
const ContactContent = require('./models/ContactContent');
const Testimonial    = require('./models/Testimonial');
const FactoryContent = require('./models/FactoryContent');
const Brand          = require('./models/Brand');

// ─────────────────────────────────────────────────────────────────────────────
// Rice Products — realistic Nepal varieties
// ─────────────────────────────────────────────────────────────────────────────
const products = [
  {
    name: 'Sona Mansuli Rice',
    nameNepali: 'सोना मसुरी चामल',
    category: 'medium',
    description:
      'Sona Mansuli is one of the most beloved everyday rice varieties across Nepal and India. Known for its slightly aromatic grain, low starch content, and fluffy texture after cooking. Perfect for dal-bhat, pulao, and everyday Nepali meals.',
    features: ['Low starch', 'Fluffy texture', 'Stone-free', 'Double polished', 'Quick cooking'],
    grainType: 'Medium Grain',
    grainLength: '5 mm',
    aroma: 'Mild, pleasant',
    texture: 'Soft and slightly sticky',
    cookingTip: 'Soak for 20 minutes before cooking. Use 1:1.5 rice to water ratio for perfect results.',
    packagingSizes: ['1 kg', '2 kg', '5 kg', '10 kg', '25 kg', '50 kg'],
    image: '',
    sortOrder: 1,
  },
  {
    name: 'Jeera Masino Rice',
    nameNepali: 'जीरा मसिनो चामल',
    category: 'specialty',
    description:
      'Jeera Masino is a thin, delicate aromatic rice variety renowned for its natural cumin-like fragrance. Each grain is slender and separates beautifully after cooking, making it ideal for biryanis, fried rice, khichdi, and gourmet Nepali dishes.',
    features: ['Natural cumin aroma', 'Thin slender grain', 'Non-sticky', 'Premium sorted', 'High demand variety'],
    grainType: 'Long-Medium Grain (Slender)',
    grainLength: '6–7 mm',
    aroma: 'Natural cumin-like fragrance',
    texture: 'Firm, fluffy, separate grains',
    cookingTip: 'Best cooked with the absorption method. Use 1:2 ratio. Do not stir during cooking.',
    packagingSizes: ['1 kg', '5 kg', '10 kg', '25 kg'],
    image: '',
    sortOrder: 2,
  },
  {
    name: 'Katarni Rice',
    nameNepali: 'कटारनी चामल',
    category: 'premium',
    description:
      'Katarni is a GI-tagged traditional aromatic rice variety grown along the Nepal-Bihar border region. Celebrated for its unique floral fragrance and superior taste, Katarni is considered a delicacy. Milled with extra care to preserve its natural qualities.',
    features: ['GI-tagged variety', 'Distinctive floral aroma', 'Traditional cultivation', 'Premium quality', 'Limited harvest'],
    grainType: 'Medium Grain (Traditional)',
    grainLength: '5.5–6 mm',
    aroma: 'Unique floral-sweet fragrance',
    texture: 'Soft, moist, and slightly sticky',
    cookingTip: 'Katarni needs slightly less water than regular rice. Use 1:1.2 ratio. The aroma intensifies during cooking.',
    packagingSizes: ['1 kg', '2 kg', '5 kg', '10 kg'],
    image: '',
    sortOrder: 3,
  },
  {
    name: 'Premium Basmati Rice',
    nameNepali: 'प्रिमियम बासमती चामल',
    category: 'premium',
    description:
      'Our aged long-grain basmati is sourced from the finest paddy and milled to perfection. Renowned across Nepal for its enchanting aroma, extra-long grains that elongate further on cooking, and the light, non-sticky texture that makes every biryani extraordinary.',
    features: ['Extra-long grain', 'Aged 1 year', 'Low glycemic index', 'Non-GMO', 'Pesticide tested'],
    grainType: 'Extra Long Grain Basmati',
    grainLength: '8–9 mm (cooked)',
    aroma: 'Distinctly aromatic — classic pandan-like scent',
    texture: 'Fluffy, elongated, non-sticky',
    cookingTip: 'Rinse 2–3 times and soak 30 minutes. Use 1:1.75 ratio. Rest covered for 5 minutes after cooking.',
    packagingSizes: ['1 kg', '5 kg', '10 kg', '25 kg', '50 kg'],
    image: '',
    sortOrder: 4,
  },
  {
    name: 'Marshi Rice',
    nameNepali: 'मर्सी चामल',
    category: 'specialty',
    description:
      'Marshi is a traditional high-altitude aromatic rice grown in the hills of Nepal. This heirloom variety has a rich, nutty fragrance and superior taste that sets it apart from commercial rice. Rare, seasonal, and treasured by connoisseurs of authentic Nepali cuisine.',
    features: ['Heirloom hill variety', 'Rich nutty aroma', 'Traditional farming', 'Seasonal availability', 'Nutrient-dense'],
    grainType: 'Short-Medium Grain (Heirloom)',
    grainLength: '4–5 mm',
    aroma: 'Rich, nutty, distinctly earthy',
    texture: 'Firm with pleasant chewiness',
    cookingTip: 'Soaking overnight is recommended. The grain holds its shape well and pairs beautifully with curries and ghee.',
    packagingSizes: ['1 kg', '2 kg', '5 kg'],
    image: '',
    sortOrder: 5,
  },
  {
    name: 'Brown Rice (Unpolished)',
    nameNepali: 'ब्राउन राइस (अनपोलिस्ड)',
    category: 'specialty',
    description:
      'Whole grain brown rice with the nutritious bran layer intact. Packed with dietary fiber, B vitamins, minerals, and antioxidants. The healthiest rice option — ideal for health-conscious families, diabetics, and those managing weight.',
    features: ['Whole grain', 'High dietary fiber', 'Rich in B vitamins & minerals', 'Low glycemic index', 'No artificial processing'],
    grainType: 'Medium Grain (Unpolished)',
    grainLength: '5–6 mm',
    aroma: 'Natural, wholesome, nutty',
    texture: 'Slightly chewy with a hearty bite',
    cookingTip: 'Soak for 1 hour before cooking. Use 1:2.5 ratio. Cook on low flame for 35–40 minutes for best results.',
    packagingSizes: ['1 kg', '2 kg', '5 kg', '10 kg'],
    image: '',
    sortOrder: 6,
  },
  {
    name: 'Mansuli Economy Rice',
    nameNepali: 'मसुरी इकोनोमी चामल',
    category: 'economy',
    description:
      'Our economy rice delivers consistent quality and nourishing value at an accessible price. Clean-milled, stone-free, and suitable for daily household cooking, institutional use, and bulk buyers. Quality you can count on at every price point.',
    features: ['Clean milled', 'Stone-free', 'Consistent quality', 'Bulk packing available', 'Best value'],
    grainType: 'Short-Medium Grain',
    grainLength: '4–5 mm',
    aroma: 'Neutral',
    texture: 'Soft and fluffy',
    cookingTip: 'Use 1:1.5 ratio. Rinse once before cooking.',
    packagingSizes: ['5 kg', '10 kg', '25 kg', '50 kg'],
    image: '',
    sortOrder: 7,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Company info
// ─────────────────────────────────────────────────────────────────────────────
const companyData = [
  {
    key: 'stats',
    value: { yearsInOperation: 15, dailyCapacityMT: 50, productVarieties: 7, districtsServed: 12 },
  },
  {
    key: 'milestones',
    value: [
      { year: '2009', event: 'Founded in Gaindakot, Nawalpur, Nepal' },
      { year: '2012', event: 'Expanded milling capacity to 20 MT/day' },
      { year: '2015', event: 'Introduced automated sorting and grading machines' },
      { year: '2018', event: 'Launched premium basmati and Katarni specialty rice lines' },
      { year: '2021', event: 'Achieved 50 MT/day processing capacity' },
      { year: '2023', event: 'Expanded distribution to 12 districts across Nepal' },
    ],
  },
  {
    key: 'certifications',
    value: ['Government of Nepal Registered', 'Food Safety Standards Compliant', 'Nawalpur Chamber of Commerce Member'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Testimonials
// ─────────────────────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: 'Ram Prasad Sharma',
    role: 'Owner',
    company: 'Sharma General Store, Kathmandu',
    content: 'We have been stocking Suryodaya Sona Mansuli and Jeera Masino for three years now. Our customers specifically ask for Suryodaya by name — the quality is consistently excellent and the grain is always clean. Delivery is reliable and the pricing is fair.',
    rating: 5,
    isActive: true,
    isFeatured: true,
    sortOrder: 1,
  },
  {
    name: 'Sunita Thapa',
    role: 'Head Chef',
    company: 'Himalayan Kitchen Restaurant, Pokhara',
    content: 'We use Suryodaya Premium Basmati for all our biryanis and Katarni rice for our specialty Nepali thalis. The aroma is outstanding and the grain quality never disappoints. Our guests frequently compliment the rice — and we always tell them it is from Suryodaya.',
    rating: 5,
    isActive: true,
    isFeatured: true,
    sortOrder: 2,
  },
  {
    name: 'Bishnu Devi Adhikari',
    role: 'Homemaker',
    company: 'Gaindakot, Nawalpur',
    content: 'हाम्रो परिवारले वर्षौंदेखि सूर्योदयको चामल प्रयोग गर्दै आएको छ। गुणस्तर सधैं राम्रो हुन्छ र दाम पनि उचित छ। स्थानीय कम्पनीको सहयोग गर्न पाउँदा गर्व लाग्छ।',
    rating: 5,
    isActive: true,
    isFeatured: false,
    sortOrder: 3,
  },
  {
    name: 'Kamal Bahadur KC',
    role: 'Proprietor',
    company: 'KC Wholesale Suppliers, Butwal',
    content: 'We purchase 25–50 MT of Suryodaya rice per month for distribution across Rupandehi and Palpa. The consistency is what sets them apart — every batch meets the same quality standard. The team is professional and payment terms are flexible. Highly recommended for wholesale buyers.',
    rating: 5,
    isActive: true,
    isFeatured: true,
    sortOrder: 4,
  },
  {
    name: 'Dipendra Maharjan',
    role: 'Manager',
    company: 'Annapurna Catering, Lalitpur',
    content: 'Our catering business serves 300+ meals daily at corporate events. We switched to Suryodaya Brown Rice and Sona Mansuli six months ago and have seen a noticeable improvement in feedback from our clients. The consistent grain size makes cooking in bulk much easier.',
    rating: 5,
    isActive: true,
    isFeatured: false,
    sortOrder: 5,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Site Settings
// ─────────────────────────────────────────────────────────────────────────────
const settingsData = {
  whatsappNumber: '977XXXXXXXXXX', // Replace with real number (no + or spaces)
  phoneNumber: '+977-XX-XXXXXXX',
  email: 'info@shreesuryodaya.com.np',
  address: 'Gaindakot, Nawalpur, Gandaki Province, Nepal',
  facebookUrl: '',
  instagramUrl: '',
  twitterUrl: '',
  youtubeUrl: '',
  whatsappDefaultMessage:
    'Hello! I am interested in your rice products. Please provide more information about pricing and availability.',
  companyName: 'Shree Suryodaya Khadya Udhyog Limited',
  tagline: "Nepal's Finest Rice, Milled with Pride",
  registrationNo: '',
  panNo: '',
  foundedYear: '2009',
  // adminPasswordHash will be set in the seed function after bcrypt hashing
};

// ─────────────────────────────────────────────────────────────────────────────
// Homepage content
// ─────────────────────────────────────────────────────────────────────────────
const homepageContent = {
  hero: {
    slides: [
      {
        id: 'slide-1',
        image: '',
        overlayOpacity: 0.6,
        tag: 'Gaindakot, Nawalpur, Nepal',
        title: "Nepal's Finest Rice,\nMilled with Pride",
        subtitle:
          'Premium quality rice from the fertile plains of Nawalpur — clean, pure, and grown with care.',
      },
      {
        id: 'slide-2',
        image: '',
        overlayOpacity: 0.55,
        tag: '50 MT Daily Capacity',
        title: 'State-of-the-Art\nRice Milling',
        subtitle:
          'Our modern integrated mill processes 50 metric tons daily using the latest optical sorting and grading technology.',
      },
      {
        id: 'slide-3',
        image: '',
        overlayOpacity: 0.6,
        tag: 'Farm to Table',
        title: 'Directly from\nFarmer to Your Kitchen',
        subtitle:
          'We partner with local paddy farmers to bring you the freshest, most nutritious rice — supporting Nepali agriculture.',
      },
    ],
    buttons: [
      { id: 'btn-1', label: 'Explore Our Rice', link: '/products', variant: 'secondary' },
      { id: 'btn-2', label: 'Contact Us', link: '/contact', variant: 'outline' },
    ],
    autoplayInterval: 5000,
  },
  companyIntro: {
    sectionTag: 'Our Story',
    title: 'Rooted in Nawalpur, Trusted Across Nepal',
    description:
      "Founded in 2009 in the heart of Gaindakot, Shree Suryodaya Khadya Udhyog Limited has grown from a small local mill to one of the region's most trusted rice processing companies. We work directly with paddy farmers across Nawalpur, ensuring fair prices for them and premium quality for you.\n\nOur modern milling facility processes up to 50 metric tons of rice daily, equipped with the latest technology to deliver clean, sorted, and nutritious rice to households, restaurants, and retailers across Nepal.",
    images: ['', ''],
    highlights: [
      { id: 'h1', icon: '✅', text: '15+ years of excellence in rice milling' },
      { id: 'h2', icon: '🤝', text: 'Direct farmer partnerships across Nawalpur' },
      { id: 'h3', icon: '⚙️', text: '50 MT/day integrated processing capacity' },
      { id: 'h4', icon: '🚚', text: 'Serving 12+ districts across Nepal' },
    ],
    ctaLabel: 'Read Our Full Story',
    ctaLink: '/about',
  },
  whyChooseUs: {
    sectionTag: 'Why Us?',
    title: 'The Suryodaya Difference',
    subtitle: 'We go beyond milling — we deliver trust, quality, and value in every bag of rice we produce.',
    items: [
      { id: 'w1', icon: '🌾', title: 'Farm-to-Mill Freshness', description: 'We source directly from paddy farmers in the Nawalpur region, ensuring the freshest grain at every harvest season.' },
      { id: 'w2', icon: '⚙️', title: 'Modern Milling Technology', description: 'Our plant uses state-of-the-art rubber roll hullers, gravity separators, and optical sorters for pristine grain quality.' },
      { id: 'w3', icon: '✅', title: 'Rigorous Quality Control', description: 'Every batch is tested for moisture, purity, and foreign matter. Zero tolerance for substandard grain.' },
      { id: 'w4', icon: '📦', title: 'Flexible Packaging', description: 'Available in 1 kg to 50 kg packages — suitable for households, restaurants, retailers, and bulk buyers.' },
      { id: 'w5', icon: '🤝', title: 'Trusted by Thousands', description: 'Over 15 years of consistent quality has earned the trust of households, restaurants, and retailers across Nepal.' },
      { id: 'w6', icon: '🌱', title: 'Supporting Local Farmers', description: 'We pay fair prices directly to paddy farmers, contributing to sustainable livelihoods across Nawalpur district.' },
    ],
  },
  process: {
    sectionTag: 'Our Process',
    title: 'From Paddy to Your Plate',
    subtitle: 'Our 6-step milling process ensures every grain meets the highest standards of cleanliness, appearance, and nutrition.',
    steps: [
      { id: 'p1', step: '01', icon: '🌾', title: 'Paddy Procurement', description: 'We source high-quality paddy directly from verified farmers across Nawalpur. Each batch is weighed, graded, and moisture-tested.' },
      { id: 'p2', step: '02', icon: '🧹', title: 'Pre-Cleaning', description: 'Raw paddy passes through rotary drum cleaners and vibrating screens to remove dust, straw, stones, and foreign materials.' },
      { id: 'p3', step: '03', icon: '⚙️', title: 'Hulling & Whitening', description: 'Rubber roller hullers remove the husk. Friction whiteners remove the bran layer to produce bright, clean white rice.' },
      { id: 'p4', step: '04', icon: '⚖️', title: 'Grading & Separation', description: 'Gravity separators and length graders sort grains by size, weight, and density — ensuring maximum uniformity.' },
      { id: 'p5', step: '05', icon: '🔬', title: 'Optical Color Sorting', description: 'CCD color sorters detect and remove discolored or damaged grains using high-speed cameras and precision air jets.' },
      { id: 'p6', step: '06', icon: '📦', title: 'Quality Check & Packing', description: 'Cleared rice is packed in 1–50 kg bags using automated machines, then dispatched to distributors across Nepal.' },
    ],
  },
  featuredProducts: {
    sectionTag: 'Our Range',
    title: 'Handpicked Rice Varieties',
    subtitle: 'From aromatic Katarni to wholesome Brown Rice — the perfect grain for every dish and every occasion.',
    limit: 3,
    ctaLabel: 'View All Products',
    ctaLink: '/products',
  },
  stats: {
    sectionTag: 'By the Numbers',
    title: 'Our Achievements in Numbers',
    subtitle: 'A track record of quality, consistency, and growth over 15 years.',
    backgroundStyle: 'dark',
    items: [
      { id: 's1', icon: '🏆', value: '15', suffix: '+', label: 'Years of Experience' },
      { id: 's2', icon: '⚙️', value: '50', suffix: ' MT', label: 'Daily Processing Capacity' },
      { id: 's3', icon: '🌾', value: '7', suffix: '+', label: 'Rice Varieties' },
      { id: 's4', icon: '🚚', value: '12', suffix: '+', label: 'Districts Served' },
      { id: 's5', icon: '👨‍🌾', value: '100', suffix: '+', label: 'Farmer Partners' },
      { id: 's6', icon: '📦', value: '15000', suffix: ' MT', label: 'Annual Output' },
    ],
  },
  gallery: {
    sectionTag: 'Factory Gallery',
    title: 'Inside Our Mill',
    subtitle: 'A glimpse into our modern integrated rice milling facility in Gaindakot, Nawalpur.',
    images: [
      { id: 'g1', src: '', caption: 'Modern milling machines' },
      { id: 'g2', src: '', caption: 'Quality sorting line' },
      { id: 'g3', src: '', caption: 'Optical color sorters' },
      { id: 'g4', src: '', caption: 'Packaging unit' },
      { id: 'g5', src: '', caption: 'Paddy storage facility' },
      { id: 'g6', src: '', caption: 'Dispatch and logistics' },
    ],
    ctaLabel: 'Explore Our Factory',
    ctaLink: '/factory',
  },
  cta: {
    title: 'Ready to Order or Have Questions?',
    subtitle: 'Whether you are a retailer, restaurant, or household looking for quality rice — we are here to help.',
    backgroundStyle: 'green',
    buttons: [
      { id: 'c1', label: 'Send Us a Message', link: '/contact', variant: 'secondary', icon: '✉️' },
      { id: 'c2', label: 'Call Us Now', link: 'tel:+977XXXXXXXXXX', variant: 'outline', icon: '📞' },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// About Page Content
// ─────────────────────────────────────────────────────────────────────────────
const aboutContent = {
  hero: {
    title: 'About Shree Suryodaya',
    subtitle: 'A story rooted in the fertile lands of Nawalpur — 15 years of quality, trust, and community.',
    image: '',
  },
  profile: {
    sectionTag: 'Company Profile',
    title: 'Who We Are',
    description: 'Shree Suryodaya Khadya Udhyog Limited is a premier rice processing company based in Gaindakot, Nawalpur, Gandaki Province, Nepal. Established in 2009, we have grown from a modest local milling unit into one of the region\'s most trusted rice processors.\n\nWe operate a modern integrated rice mill with a daily processing capacity of 50 metric tons. Our facility employs the latest rubber roll hullers, optical color sorters, gravity separators, and automated packaging lines — all aligned to deliver rice that is clean, nutritious, and consistently excellent.\n\nOur company is rooted in a simple philosophy: treat farmers fairly, process honestly, and deliver quality that families can trust. That philosophy has earned us loyal customers across 12+ districts of Nepal.',
    image: '',
    highlights: [
      { id: 'ph1', icon: '🗓️', label: 'Established', value: '2009' },
      { id: 'ph2', icon: '📍', label: 'Location', value: 'Gaindakot, Nawalpur' },
      { id: 'ph3', icon: '⚙️', label: 'Daily Capacity', value: '50 MT/day' },
      { id: 'ph4', icon: '🌾', label: 'Products', value: '7 Rice Varieties' },
      { id: 'ph5', icon: '🚚', label: 'Distribution', value: '12+ Districts' },
      { id: 'ph6', icon: '👷', label: 'Employees', value: '40+ Staff' },
    ],
  },
  visionMission: {
    vision: {
      title: 'Our Vision',
      content: 'To become the most trusted and recognized rice brand in Nepal — synonymous with purity, flavor, and consistent quality — by continuously investing in technology, farmer partnerships, and product innovation that benefits communities across the country.',
      image: '',
    },
    mission: {
      title: 'Our Mission',
      content: 'To deliver consistently clean, nutritious, and high-quality rice products to Nepali households and institutions, while uplifting the livelihoods of local farming communities through fair, transparent, and sustainable trade practices.',
      image: '',
    },
    commitment: {
      title: 'Our Commitment',
      content: 'We are committed to food safety, fair trade, environmental responsibility, and community development. Every grain we process reflects our promise — to the farmers who grew it and the families who will cook and eat it.',
    },
  },
  values: [
    { id: 'v1', icon: '🌾', title: 'Quality First', description: 'We never compromise on the quality of grain — from paddy sourcing to final packaging. Every batch is tested and verified.', color: 'green' },
    { id: 'v2', icon: '🤝', title: 'Farmer Partnership', description: 'We build long-term, fair relationships with paddy farmers, ensuring they receive fair prices and reliable market access.', color: 'gold' },
    { id: 'v3', icon: '💡', title: 'Innovation', description: 'We continuously invest in modern milling technology and processes to improve quality, efficiency, and sustainability.', color: 'blue' },
    { id: 'v4', icon: '🌿', title: 'Sustainability', description: 'We minimize waste, optimize energy use, and support environmentally responsible farming practices across our supply chain.', color: 'green' },
    { id: 'v5', icon: '💼', title: 'Integrity', description: 'Honest and transparent business practices have been the foundation of our company since day one.', color: 'brown' },
    { id: 'v6', icon: '🏘️', title: 'Community', description: 'We invest in the communities around us — supporting local employment, farmer welfare, and regional agricultural development.', color: 'gold' },
  ],
  history: {
    sectionTag: 'Our Journey',
    title: 'A Legacy Built Year by Year',
    subtitle: 'From a small local mill to a regional leader in rice processing — every milestone reflects our commitment to growth.',
    milestones: [
      { id: 'm1', year: '2009', title: 'Foundation', description: 'Shree Suryodaya Khadya Udhyog Limited was established in Gaindakot, Nawalpur by a family with a passion for quality food and fair trade. Operations began with a small 5 MT/day milling unit.', image: '' },
      { id: 'm2', year: '2011', title: 'First Expansion', description: 'Increased milling capacity to 10 MT/day and began supplying to retailers across Nawalpur district. Hired our first team of skilled mill workers.', image: '' },
      { id: 'm3', year: '2014', title: 'Technology Upgrade', description: 'Invested in our first rubber roll huller and friction whitener, significantly improving grain quality. Capacity reached 20 MT/day.', image: '' },
      { id: 'm4', year: '2017', title: 'Optical Color Sorter', description: 'Installed a state-of-the-art CCD optical color sorter — a major step forward in grain purity and visual quality. Began supplying to major retailers.', image: '' },
      { id: 'm5', year: '2020', title: 'Premium Product Launch', description: 'Launched the Katarni and Jeera Masino premium rice lines. Received strong market response and expanded dealer network to 8 districts.', image: '' },
      { id: 'm6', year: '2023', title: '50 MT Milestone', description: 'Achieved full 50 MT/day integrated processing capacity with automated packaging. Distribution now covers 12+ districts across Nepal.', image: '' },
    ],
  },
  factory: {
    sectionTag: 'Our Facility',
    title: 'Modern Rice Processing Plant',
    subtitle: 'A fully integrated 50 MT/day rice mill in Gaindakot, Nawalpur — equipped with the latest processing technology.',
    description: 'Our facility covers approximately 2 Bigha of land in Gaindakot and houses a complete rice processing line from paddy intake to finished product dispatch. The plant runs 18 hours daily and is staffed by trained engineers and quality technicians.',
    specs: [
      { id: 'fs1', icon: '⚙️', label: 'Daily Capacity', value: '50 MT/day' },
      { id: 'fs2', icon: '📐', label: 'Plant Area', value: '2 Bigha' },
      { id: 'fs3', icon: '🕐', label: 'Operating Hours', value: '18 hrs/day' },
      { id: 'fs4', icon: '👷', label: 'Mill Staff', value: '40+ workers' },
      { id: 'fs5', icon: '🏗️', label: 'Storage Capacity', value: '500 MT' },
      { id: 'fs6', icon: '📦', label: 'Annual Output', value: '~15,000 MT' },
    ],
    images: [
      { id: 'fi1', src: '', caption: 'Mill exterior' },
      { id: 'fi2', src: '', caption: 'Milling floor' },
      { id: 'fi3', src: '', caption: 'Optical color sorter' },
      { id: 'fi4', src: '', caption: 'Packaging unit' },
    ],
  },
  team: {
    sectionTag: 'Our Team',
    title: 'The People Behind Suryodaya',
    subtitle: 'A dedicated team of professionals committed to delivering quality in every grain.',
    members: [
      { id: 't1', name: 'Managing Director', role: 'Founder & Managing Director', bio: 'Visionary founder with 20+ years of experience in agri-food processing and community development in Nawalpur.', image: '' },
      { id: 't2', name: 'Operations Director', role: 'Director of Operations', bio: 'Oversees the entire milling facility, quality control systems, and production planning to ensure consistent output.', image: '' },
      { id: 't3', name: 'Sales Manager', role: 'Sales & Distribution Manager', bio: 'Manages dealer networks, retail partnerships, and client relationships across Nepal.', image: '' },
    ],
  },
  certifications: {
    sectionTag: 'Certifications',
    title: 'Our Credentials',
    items: [
      { id: 'c1', icon: '🏛️', title: 'Government Registered', issuer: 'Government of Nepal', year: '2009' },
      { id: 'c2', icon: '🛡️', title: 'Food Safety Compliant', issuer: 'Nepal Food Safety Standards', year: '2015' },
      { id: 'c3', icon: '🤝', title: 'Chamber Member', issuer: 'Nawalpur Chamber of Commerce', year: '2010' },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Gallery Images (placeholder entries — admin uploads real images)
// ─────────────────────────────────────────────────────────────────────────────
const galleryImages = [
  { title: 'Mill Exterior', category: 'factory', src: '', caption: 'Shree Suryodaya mill complex in Gaindakot', sortOrder: 1 },
  { title: 'Milling Floor', category: 'factory', src: '', caption: 'Main milling floor with processing lines', sortOrder: 2 },
  { title: 'Paddy Storage', category: 'warehouse', src: '', caption: 'Paddy storage warehouse — 500 MT capacity', sortOrder: 3 },
  { title: 'Finished Rice Storage', category: 'warehouse', src: '', caption: 'Finished rice ready for dispatch', sortOrder: 4 },
  { title: 'Rubber Roll Huller', category: 'machinery', src: '', caption: 'Modern rubber roll hullers for gentle de-husking', sortOrder: 5 },
  { title: 'Optical Color Sorter', category: 'machinery', src: '', caption: 'CCD optical sorter for defect removal', sortOrder: 6 },
  { title: 'Gravity Separator', category: 'machinery', src: '', caption: 'Gravity separator for grain grading', sortOrder: 7 },
  { title: 'Paddy Intake', category: 'processing', src: '', caption: 'Paddy arriving from local farms', sortOrder: 8 },
  { title: 'Pre-cleaning Stage', category: 'processing', src: '', caption: 'Cleaning and sorting raw paddy', sortOrder: 9 },
  { title: 'Whitening Process', category: 'processing', src: '', caption: 'Bran removal and whitening stage', sortOrder: 10 },
  { title: 'Packaging Line', category: 'packaging', src: '', caption: 'Automated packaging from 1 kg to 50 kg', sortOrder: 11 },
  { title: 'Bag Stitching', category: 'packaging', src: '', caption: 'Final sealing and labeling of rice bags', sortOrder: 12 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Blog Posts
// ─────────────────────────────────────────────────────────────────────────────
const blogPosts = [
  {
    title: 'Celebrating 15 Years of Excellence in Rice Milling',
    excerpt: 'From a small 5 MT/day milling unit in 2009 to a modern 50 MT/day integrated rice mill in 2024 — we look back at 15 years of growth, hard work, and community.',
    content: `In 2009, Shree Suryodaya Khadya Udhyog Limited opened its doors in Gaindakot, Nawalpur with a simple mission: to mill quality rice honestly and to treat paddy farmers with respect. Fifteen years later, we are proud to look back on a journey that has transformed not just our company, but the livelihoods of hundreds of farming families across Nawalpur.

We began with a modest 5 MT/day milling unit and a small team of five. The early years were about building trust — with local farmers who supplied paddy, with retailers who stocked our rice, and with households who cooked it on their tables. Word of mouth spread quietly but surely.

By 2014, we had invested in modern machinery: rubber roll hullers that treated grain gently, friction whiteners that produced brighter rice, and gravity separators that eliminated inferior grains. The quality difference was immediate and customers noticed.

The installation of our optical color sorter in 2017 was a turning point. For the first time, we could guarantee rice that was visually flawless — every discolored or damaged grain removed with machine precision. Our premium product lines — Katarni and Jeera Masino — launched to strong market response.

Today, we operate a fully integrated 50 MT/day plant with automated packaging, a team of 40+ staff, and a distribution network spanning 12+ districts. We process over 15,000 MT of rice annually and serve thousands of households, restaurants, and retailers across Nepal.

But what we are most proud of is not the machinery or the capacity — it is the relationships. The farmers who have grown paddy for us year after year. The retailers who have trusted our quality. The families whose dal-bhat begins with a bag of Suryodaya rice.

Here is to the next 15 years. Thank you, Nepal.`,
    category: 'achievement',
    tags: ['milestone', 'company news', '15 years'],
    author: 'Shree Suryodaya Team',
    isPublished: true,
    coverImage: '',
  },
  {
    title: 'Introducing Katarni Rice: A Taste of Tradition',
    excerpt: 'We are excited to announce the expansion of our Katarni Rice line — a GI-tagged aromatic variety grown along the Nepal-Bihar border, now available in more packaging options.',
    content: `Katarni rice holds a special place in the culinary traditions of the Nepal-Bihar border region. With its distinctive floral-sweet fragrance, soft texture, and unique taste, it has been treasured by connoisseurs for generations. At Shree Suryodaya, we are proud to mill and bring this exceptional variety to more tables across Nepal.

What makes Katarni special? The answer lies in its origin. Grown in the alluvial plains along the Nepal-Bihar border, Katarni benefits from a unique combination of soil composition, water quality, and climate that cannot be replicated elsewhere. This geographical identity is now protected — Katarni holds a Geographical Indication (GI) tag, certifying its authenticity and origin.

Our Katarni rice is sourced directly from verified farmers in the growing region and processed with extra care to preserve its natural qualities. We use lower-friction milling settings to protect the delicate bran structure that holds much of the aroma, and we avoid excessive polishing that would strip away the grain's character.

The result is Katarni rice that arrives at your kitchen with its fragrance intact — a rice that fills the room with a gentle floral scent as it cooks and rewards you with a soft, moist texture and a flavor that is simply unlike any ordinary rice.

Starting this season, Suryodaya Katarni is now available in 1 kg, 2 kg, 5 kg, and 10 kg packaging. We have also introduced a premium gift pack — ideal for festivals, weddings, and gifting occasions.

Experience Katarni. Experience tradition.`,
    category: 'product',
    tags: ['Katarni', 'premium rice', 'product launch'],
    author: 'Shree Suryodaya Team',
    isPublished: true,
    coverImage: '',
  },
  {
    title: 'Meet the Farmers: The Backbone of Suryodaya Quality',
    excerpt: 'Behind every bag of Suryodaya rice are the hands of dedicated paddy farmers across Nawalpur. We take a closer look at the partnerships that define our quality.',
    content: `At Shree Suryodaya, we often say that our quality begins in the field, not in the mill. The truth behind that statement becomes clear when you visit the paddy farms of Nawalpur district during harvest season.

We work with over 100 paddy farming families across Nawalpur and neighboring districts. These are not anonymous suppliers — they are partners whose names we know, whose fields we visit, and whose harvests we celebrate alongside them.

Our procurement model is built on three principles: fair prices, advance contracts, and technical support. When harvest season approaches, our field team visits partner farms to assess crop quality and negotiate procurement prices. We offer rates that are competitive with — and often above — the open market, providing farmers with price certainty before they commit to harvesting costs.

For farmers who want to grow premium varieties like Katarni or Jeera Masino, we provide seeds, fertilizer guidance, and technical assistance through the growing season. The investment pays off: premium paddy commands premium prices, and the quality of the resulting rice reflects the care taken from seed to harvest.

One of our oldest partners is a farming family in Gaindakot who has been supplying Sona Mansuli paddy to us since 2011. Over 13 seasons, they have expanded their paddy acreage from 4 kattha to nearly 3 bigha — growth they attribute partly to the reliable market that Suryodaya provides.

This is the kind of relationship we want to build with every farmer we work with. Because when farmers thrive, the land is tended with pride, the grain is grown with care, and the rice that reaches your table truly is something special.`,
    category: 'story',
    tags: ['farmers', 'community', 'paddy'],
    author: 'Shree Suryodaya Team',
    isPublished: true,
    coverImage: '',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Contact Page Content
// ─────────────────────────────────────────────────────────────────────────────
const contactContent = {
  hero: {
    title: 'Contact Us',
    subtitle: 'We are always happy to hear from you — whether you have a product inquiry, want to become a dealer, or just want to say hello.',
  },
  intro: {
    title: 'Reach Out to Us',
    description: 'Our team is available Sunday through Friday to answer your questions and assist with orders, wholesale inquiries, and dealer applications. Use any of the channels below to get in touch.',
  },
  phones: [
    { id: 'ph1', label: 'Main Office', number: '+977-XX-XXXXXXX' },
    { id: 'ph2', label: 'Mobile / WhatsApp', number: '+977-98XXXXXXXX' },
  ],
  emails: [
    { id: 'em1', label: 'General Inquiries', email: 'info@shreesuryodaya.com.np' },
    { id: 'em2', label: 'Wholesale Orders', email: 'sales@shreesuryodaya.com.np' },
  ],
  address: {
    street: 'Gaindakot Municipality',
    city: 'Gaindakot',
    district: 'Nawalpur',
    province: 'Gandaki Province',
    country: 'Nepal',
    full: 'Gaindakot, Nawalpur, Gandaki Province, Nepal',
  },
  officeHours: 'Sunday – Friday: 9:00 AM – 5:00 PM\nSaturday: 9:00 AM – 1:00 PM\nPublic Holidays: Closed',
  whatsappNumber: '977XXXXXXXXXX',
  whatsappMessage: 'Hello! I would like to inquire about Shree Suryodaya rice products. Please provide more information.',
  mapEmbedUrl: '', // Admin pastes Google Maps embed URL
  mapLinkUrl: 'https://maps.google.com/?q=Gaindakot+Nawalpur+Nepal',
  socialLinks: [
    { id: 'sl1', platform: 'Facebook', url: '', icon: 'facebook' },
    { id: 'sl2', platform: 'WhatsApp', url: '', icon: 'whatsapp' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Brands
// ─────────────────────────────────────────────────────────────────────────────
const brands = [
  {
    name: 'Manaslu',
    nepaliName: 'मनास्लु',
    logo: '',
    tagline: 'Premium Quality, Pure Taste',
    description: 'Named after the majestic Manaslu — Nepal\'s third highest peak. Manaslu brand rice is crafted for households and fine dining establishments that demand the very finest grain quality. Every batch is extra-sorted and stone-free.',
    accentColor: '#1B5E20',
    isActive: true,
    sortOrder: 1,
  },
  {
    name: 'Namche',
    nepaliName: 'नाम्चे',
    logo: '',
    tagline: 'Traditional Heritage, Everyday Nourishment',
    description: 'Named after the vibrant Namche Bazaar — gateway to the Himalayas. Namche brand rice delivers consistent quality and wholesome nourishment for everyday family meals. Trusted by households and retailers across Nepal.',
    accentColor: '#E65100',
    isActive: true,
    sortOrder: 2,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Factory content
// ─────────────────────────────────────────────────────────────────────────────
const factoryContent = {
  hero: {
    title: 'State-of-the-Art Rice Milling',
    subtitle: 'A modern integrated rice mill in Gaindakot, Nawalpur — processing 50 metric tons daily with precision and care.',
  },
  capacity: {
    sectionTag: 'Capacity',
    title: 'Mill at a Glance',
    items: [
      { id: 'c1', icon: '⚙️', label: 'Daily Processing Capacity', value: '50 MT' },
      { id: 'c2', icon: '📊', label: 'Annual Output (approx.)',   value: '15,000 MT' },
      { id: 'c3', icon: '🏗️', label: 'Storage Capacity',         value: '500 MT' },
      { id: 'c4', icon: '🕐', label: 'Working Hours',             value: '18 hrs/day' },
      { id: 'c5', icon: '📐', label: 'Mill Area',                 value: '2 Bigha' },
      { id: 'c6', icon: '👷', label: 'Staff',                     value: '40+ Workers' },
    ],
  },
  process: {
    sectionTag: 'Process',
    title: 'From Paddy to Premium Rice',
    subtitle: 'Our 8-step milling process ensures every grain meets the highest standards of cleanliness, appearance, and nutritional value.',
    steps: [
      { id: 'p1', step: '01', icon: '🌾', title: 'Paddy Procurement',      desc: 'We source high-quality paddy directly from verified farmers across Nawalpur and neighboring districts. Each batch is weighed, graded, and moisture-tested before entering our facility.' },
      { id: 'p2', step: '02', icon: '🧹', title: 'Pre-Cleaning',           desc: 'Raw paddy passes through rotary drum cleaners and vibrating screens to remove dust, straw, stones, and other foreign materials before hulling.' },
      { id: 'p3', step: '03', icon: '⚙️', title: 'Hulling (De-husking)',   desc: 'Rubber roller hullers gently remove the husk from paddy grains while preserving the bran layer. This produces brown rice that is then graded for further milling.' },
      { id: 'p4', step: '04', icon: '✨', title: 'Whitening & Polishing',  desc: 'Friction whiteners and polishers remove the bran layer to achieve the bright, white rice finish. Polishing enhances appearance and shelf life without compromising nutritional quality.' },
      { id: 'p5', step: '05', icon: '⚖️', title: 'Grading & Separation',  desc: 'Gravity separators and length graders sort grains by size, weight, and density — separating whole grains from broken rice for maximum uniformity in each product.' },
      { id: 'p6', step: '06', icon: '🔬', title: 'Color Sorting',          desc: 'State-of-the-art optical color sorters detect and remove discolored, chalky, or damaged grains using high-speed cameras and precision air jets — ensuring visual perfection.' },
      { id: 'p7', step: '07', icon: '✅', title: 'Quality Testing',        desc: 'Our quality team tests each batch for moisture content, milling degree, broken percentage, and foreign matter presence before it is cleared for packaging.' },
      { id: 'p8', step: '08', icon: '📦', title: 'Packaging & Dispatch',   desc: 'Certified rice is packaged in 1 kg, 5 kg, 10 kg, 25 kg, and 50 kg bags using automated filling and sealing machines, then dispatched to distributors across Nepal.' },
    ],
  },
  machinery: {
    sectionTag: 'Equipment',
    title: 'Our Machinery',
    subtitle: 'Equipped with modern agri-processing machinery to achieve the best milling efficiency and product quality.',
    items: [
      { id: 'm1', name: 'Rubber Roll Huller',             qty: '4 units',  spec: '3–5 MT/hr each',          purpose: 'Paddy de-husking' },
      { id: 'm2', name: 'Friction Whitener',              qty: '6 units',  spec: '2–3 MT/hr each',          purpose: 'Bran removal' },
      { id: 'm3', name: 'Rice Polisher',                  qty: '4 units',  spec: 'Water-mist polishing',    purpose: 'Surface finish' },
      { id: 'm4', name: 'Gravity Separator',              qty: '2 units',  spec: '5 MT/hr each',            purpose: 'Density grading' },
      { id: 'm5', name: 'Length Grader (Indent Cylinder)',qty: '4 units',  spec: '3 MT/hr each',            purpose: 'Size sorting' },
      { id: 'm6', name: 'Optical Color Sorter',           qty: '2 units',  spec: '3-chute CCD sorter',      purpose: 'Defect removal' },
      { id: 'm7', name: 'Moisture Meter',                 qty: 'Multiple', spec: 'Digital, ±0.1% accuracy', purpose: 'Quality check' },
      { id: 'm8', name: 'Automatic Packing Machine',      qty: '3 units',  spec: '1–50 kg range',           purpose: 'Packaging' },
    ],
  },
  quality: {
    sectionTag:  'Quality Assurance',
    title:       'Every Batch Tested. Every Bag Guaranteed.',
    description: 'Our quality assurance process covers every stage of production — from incoming paddy inspection to outgoing product certification. We follow strict parameters to ensure consistency across every bag we sell.',
    checklist: [
      { id: 'q1', text: 'Incoming paddy moisture check (≤14%)' },
      { id: 'q2', text: 'Foreign matter & stone removal verification' },
      { id: 'q3', text: 'Milling degree assessment' },
      { id: 'q4', text: 'Broken grain percentage control (<5%)' },
      { id: 'q5', text: 'Color and visual inspection of each batch' },
      { id: 'q6', text: 'Final packaging integrity check' },
    ],
    cards: [
      { id: 'qc1', emoji: '🔬', title: 'Lab Testing',        desc: 'Digital moisture meters and grain analyzers in every shift' },
      { id: 'qc2', emoji: '👁️', title: 'Visual Inspection',  desc: 'Trained QC staff monitor output at every machine stage' },
      { id: 'qc3', emoji: '📋', title: 'Batch Records',      desc: 'Full traceability from paddy lot to finished product' },
      { id: 'qc4', emoji: '🚫', title: 'Zero Tolerance',     desc: 'Stone-free, pesticide-tested, and chemical-free milling' },
    ],
  },
  location: {
    sectionTag:  'Location',
    title:       'Find Our Mill',
    subtitle:    'Located in the agricultural hub of Gaindakot, Nawalpur — easily accessible for suppliers and distributors.',
    address:     'Gaindakot, Nawalpur, Gandaki Province, Nepal',
    mapEmbedUrl: '',
    mapLinkUrl:  'https://maps.google.com/?q=Gaindakot,Nawalpur,Nepal',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    console.log('MongoDB connected');

    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`✓ Inserted ${products.length} products`);

    await CompanyInfo.deleteMany({});
    await CompanyInfo.insertMany(companyData);
    console.log(`✓ Inserted ${companyData.length} company info entries`);

    await Settings.deleteMany({});
    await Settings.create(settingsData);
    console.log('✓ Inserted site settings');

    await HomepageContent.deleteMany({});
    await HomepageContent.create(homepageContent);
    console.log('✓ Inserted homepage content');

    await AboutContent.deleteMany({});
    await AboutContent.create(aboutContent);
    console.log('✓ Inserted about page content');

    await GalleryImage.deleteMany({});
    await GalleryImage.insertMany(galleryImages);
    console.log(`✓ Inserted ${galleryImages.length} gallery images`);

    await BlogPost.deleteMany({});
    for (const post of blogPosts) {
      const bp = new BlogPost(post);
      await bp.save();
    }
    console.log(`✓ Inserted ${blogPosts.length} blog posts`);

    await ContactContent.deleteMany({});
    await ContactContent.create(contactContent);
    console.log('✓ Inserted contact page content');

    // Hash admin password and store in Settings
    const adminPass = process.env.ADMIN_PASSWORD || 'suryodaya@admin2024';
    const adminPasswordHash = await bcrypt.hash(adminPass, 12);
    await Settings.findOneAndUpdate({}, { ...settingsData, adminPasswordHash }, { upsert: true });
    console.log('✓ Settings saved with hashed admin password');

    await Testimonial.deleteMany({});
    await Testimonial.insertMany(testimonials);
    console.log(`✓ Inserted ${testimonials.length} testimonials`);

    await FactoryContent.deleteMany({});
    await FactoryContent.create(factoryContent);
    console.log('✓ Inserted factory page content');

    await Brand.deleteMany({});
    await Brand.insertMany(brands);
    console.log(`✓ Inserted ${brands.length} brands`);

    // Add brandsSection to homepage content
    await HomepageContent.findOneAndUpdate({}, {
      $set: {
        brandsSection: {
          sectionTag: 'Our Brands',
          title: 'Brands That Families Trust',
          subtitle: 'Two distinct brands crafted for different needs — both delivering the quality Suryodaya is known for.',
          isVisible: true,
        },
      },
    });
    console.log('✓ Homepage brandsSection added');

    // Update homepage content with testimonialsSection
    await HomepageContent.findOneAndUpdate({}, {
      $set: {
        testimonialsSection: {
          sectionTag: 'Customer Reviews',
          title: 'Trusted by Thousands Across Nepal',
          subtitle: 'Hear from the retailers, restaurants, and households who choose Suryodaya rice every day.',
          isVisible: true,
        }
      }
    });
    console.log('✓ Homepage testimonials section added');

    console.log('\n✅ Seed completed! Visit /admin to manage content.');
    console.log(`   Admin password: ${adminPass}`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
