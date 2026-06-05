import { Routes, Route } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppFloat from './components/WhatsAppFloat';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Factory from './pages/Factory';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';

function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <ScrollToTop />
      <Routes>
        {/* Public pages */}
        <Route path="/"         element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about"    element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
        <Route path="/factory"  element={<PublicLayout><Factory /></PublicLayout>} />
        <Route path="/gallery"  element={<PublicLayout><Gallery /></PublicLayout>} />
        <Route path="/blog"     element={<PublicLayout><Blog /></PublicLayout>} />
        <Route path="/blog/:slug" element={<PublicLayout><BlogPost /></PublicLayout>} />
        <Route path="/contact"  element={<PublicLayout><Contact /></PublicLayout>} />

        {/* Admin — no Navbar/Footer */}
        <Route path="/admin"           element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
      </Routes>
    </AdminProvider>
  );
}
