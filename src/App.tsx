/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from './store/useStore.js';

// Components
import Navbar from './components/Navbar.js';
import Footer from './components/Footer.js';
import CustomCursor from './components/CustomCursor.js';

// Pages
import Home from './pages/Home.js';
import Products from './pages/Products.js';
import ProductDetail from './pages/ProductDetail.js';
import About from './pages/About.js';
import Contact from './pages/Contact.js';
import Login from './pages/Admin/Login.js';
import Dashboard from './pages/Admin/Dashboard.js';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-white">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default function App() {
  const { setSettings, setAdmin } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch initial settings
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/api/settings');
        setSettings(res.data);
      } catch (error) {
        console.error('Failed to fetch settings');
      } finally {
        setIsLoading(false);
      }
    };

    // Check admin auth
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAdmin(res.data);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
    };

    fetchSettings();
    checkAuth();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <CustomCursor />
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
            className="fixed inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center z-50"
          >
            <div className="relative flex items-center justify-center">
              {/* Outer glowing ring */}
              <div className="w-16 h-16 border-2 border-t-[#c5a059] border-r-transparent border-b-[#c5a059] border-l-transparent rounded-full animate-spin"></div>
              {/* Inner pulsing circle */}
              <div className="absolute w-8 h-8 bg-[#c5a059]/20 rounded-full animate-ping"></div>
              {/* Center core dot */}
              <div className="absolute w-4 h-4 bg-[#c5a059] rounded-full"></div>
            </div>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
              className="mt-6 text-sm uppercase tracking-[0.3em] text-[#c5a059]/80 animate-pulse font-serif"
            >
              Loading Vallery
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5 } }}
            className="min-h-screen flex flex-col"
          >
            <AppLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
              </Routes>
            </AppLayout>
          </motion.div>
        )}
      </AnimatePresence>
    </Router>
  );
}
