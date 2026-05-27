import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RequestModal from '../components/RequestModal.js';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c5a059]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center items-center text-white">
        <h2 className="text-2xl font-serif mb-4">Product not found</h2>
        <button onClick={() => navigate('/products')} className="text-[#c5a059] hover:underline">Return to Collection</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-white/50 hover:text-white transition-colors mb-8 text-sm uppercase tracking-widest"
        >
          <ArrowLeft size={16} className="mr-2" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4"
          >
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#1a1a1a] aspect-square flex items-center justify-center">
              <img 
                src={product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[activeImageIndex] : product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            {product.imageUrls && product.imageUrls.length > 1 && (
              <div className="flex gap-4 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {product.imageUrls.map((url: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 relative group bg-[#1a1a1a] ${
                      activeImageIndex === index ? 'border-[#c5a059]' : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <img src={url} alt={`${product.name} - ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">{product.name}</h1>
            <p className="text-2xl text-[#c5a059] mb-8">₹{product.price}</p>
            
            <div className="prose prose-invert mb-12">
              <p className="text-white/70 leading-relaxed text-lg">{product.description}</p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto px-12 py-4 bg-[#c5a059] text-black font-medium rounded-full uppercase tracking-widest hover:bg-white transition-colors"
            >
              Request This Product
            </button>
          </motion.div>
        </div>
      </div>

      <RequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={product} 
      />
    </div>
  );
}
