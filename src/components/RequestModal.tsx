import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

export default function RequestModal({ isOpen, onClose, product }: RequestModalProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    address: '',
    email: '',
    phoneNumber: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/requests', {
        ...formData,
        productId: product._id,
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({ customerName: '', address: '', email: '', phoneNumber: '', message: '' });
      }, 3000);
    } catch (error) {
      alert('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <div className="p-8">
            <h2 className="text-3xl font-serif mb-2 text-white">Request Product</h2>
            <p className="text-white/60 mb-8">You are requesting: <span className="text-[#c5a059]">{product?.name}</span></p>

            {success ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif text-white mb-2">Request Sent Successfully</h3>
                <p className="text-white/60">We will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">Full Name</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c5a059] transition-colors"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">Email</label>
                    <input
                      required
                      type="email"
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c5a059] transition-colors"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">Phone</label>
                    <input
                      required
                      type="tel"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      title="Phone number must be exactly 10 digits"
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c5a059] transition-colors"
                      value={formData.phoneNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length <= 10) {
                          setFormData({ ...formData, phoneNumber: val });
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">Delivery Address</label>
                  <textarea
                    required
                    rows={2}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c5a059] transition-colors resize-none"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">Additional Message (Optional)</label>
                  <textarea
                    rows={3}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c5a059] transition-colors resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#c5a059] text-black font-medium py-4 rounded-lg uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 mt-4"
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
