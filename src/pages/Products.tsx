import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard.js';
import RequestModal from '../components/RequestModal.js';
import { motion } from 'framer-motion';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleHeaderMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const xOffset = (e.clientX - width / 2) / (width / 2);
    const yOffset = (e.clientY - height / 2) / (height / 2);
    setCoords({ x: xOffset * 15, y: yOffset * 15 });
  };

  const handleHeaderMouseLeave = () => {
    setCoords({ x: 0, y: 0 });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        setProducts(res.data);
      } catch (error) {
        console.error('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 3D Stagger Entrance Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.95,
      rotateX: 15
    },
    show: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 80,
        damping: 16
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onMouseMove={handleHeaderMouseMove}
          onMouseLeave={handleHeaderMouseLeave}
          className="mb-16 text-center cursor-default"
          style={{
            transform: `translate3d(${-coords.x}px, ${-coords.y}px, 0)`,
            transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        >
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-6">The Collection</h1>
          <p className="text-white/50 max-w-2xl mx-auto">
            Browse our complete range of precision-engineered agricultural machinery and smart farming solutions. 
            Every product is built with rugged durability, advanced engineering, and uncompromising attention to performance.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c5a059]"></div>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            style={{ 
              perspective: '1200px', 
              transformStyle: 'preserve-3d' 
            }}
          >
            {products.map((product: any) => (
              <motion.div 
                key={product._id} 
                variants={itemVariants}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <ProductCard 
                  product={product} 
                  onRequest={(p) => setSelectedProduct(p)} 
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <RequestModal 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        product={selectedProduct} 
      />
    </div>
  );
}
