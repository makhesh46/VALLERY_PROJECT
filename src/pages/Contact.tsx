import { motion } from 'framer-motion';
import { useStore } from '../store/useStore.js';
import { Instagram } from 'lucide-react';

export default function Contact() {
  const { settings } = useStore();

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-6">Contact Us</h1>
          <p className="text-white/50 max-w-2xl mx-auto">
            We welcome inquiries for bespoke commissions, collaborations, and general questions about our collection.
          </p>
        </motion.div>

        <div className="max-w-xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1a1a1a] p-12 rounded-2xl border border-white/5"
          >
            <h2 className="text-2xl font-serif text-white mb-8">Get in Touch</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xs uppercase tracking-widest text-white/40 mb-2">Email</h3>
                <a href={`mailto:${settings?.adminEmail || 'contact@example.com'}`} className="text-lg text-[#c5a059] hover:underline">
                  {settings?.adminEmail || 'contact@example.com'}
                </a>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-widest text-white/40 mb-2">Phone / WhatsApp</h3>
                <a href={`tel:${settings?.adminPhone || '+1 234 567 890'}`} className="text-lg text-white hover:text-[#c5a059] transition-colors">
                  {settings?.adminPhone || '+1 234 567 890'}
                </a>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-widest text-white/40 mb-2">Atelier Address</h3>
                <p className="text-lg text-white/80 whitespace-pre-line">
                  {settings?.atelierAddress || 'Kanniyakumari\nTamil Nadu\nIndia'}
                </p>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-widest text-white/40 mb-2">Socials</h3>
                <a 
                  href={`https://instagram.com/${(settings?.instagramUsername || '@vallery_studio.lab').replace('@', '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 text-lg text-white hover:text-[#c5a059] transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                  {settings?.instagramUsername || '@vallery_studio.lab'}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
