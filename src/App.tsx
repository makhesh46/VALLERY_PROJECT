/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import axios from 'axios';
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

  useEffect(() => {
    // Fetch initial settings
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/api/settings');
        setSettings(res.data);
      } catch (error) {
        console.error('Failed to fetch settings');
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
    </Router>
  );
}
