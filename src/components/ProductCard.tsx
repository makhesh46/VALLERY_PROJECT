import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
  };
  onRequest: (product: any) => void;
}

export default function ProductCard({ product, onRequest }: ProductCardProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Coordinates relative to card center
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Calculate rotation angles (max 12 degrees)
    const rX = -(mouseY / (height / 2)) * 12;
    const rY = (mouseX / (width / 2)) * 12;
    
    setRotate({ x: rX, y: rY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-[#1a1a1a] border border-white/5 transition-all duration-300 cursor-pointer"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        transform: isHovered 
          ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.02, 1.02, 1.02)`
          : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        boxShadow: isHovered 
          ? '0 20px 45px rgba(0, 0, 0, 0.7), 0 0 30px rgba(197, 160, 89, 0.1)' 
          : '0 4px 20px rgba(0, 0, 0, 0.3)',
        transition: isHovered ? 'box-shadow 0.1s ease' : 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
      }}
    >
      {/* 3D Inner Content wrapper with preserve-3d */}
      <div 
        style={{ 
          transformStyle: 'preserve-3d',
          display: 'flex',
          flexDirection: 'column',
          flex: 1
        }}
      >
        <Link 
          to={`/products/${product._id}`} 
          className="block aspect-[4/5] overflow-hidden relative rounded-t-2xl"
          style={{ 
            transform: isHovered ? 'translateZ(30px)' : 'translateZ(0px)',
            transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
        
        <div 
          className="flex flex-1 flex-col p-6"
          style={{ 
            transform: isHovered ? 'translateZ(45px)' : 'translateZ(0px)',
            transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        >
          <div className="flex justify-between items-start mb-2">
            <Link to={`/products/${product._id}`}>
              <h3 className="text-xl font-serif text-white group-hover:text-[#c5a059] transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>
            <p className="text-lg font-medium text-[#c5a059]">₹{product.price}</p>
          </div>
          
          <p className="text-sm text-white/70 line-clamp-2 mb-6 flex-1">
            {product.description}
          </p>
          
          <button
            onClick={() => onRequest(product)}
            className="w-full py-3 px-4 border border-white/20 rounded-full text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
            style={{ 
              transform: isHovered ? 'translateZ(20px)' : 'translateZ(0px)',
              transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
          >
            Request Product
          </button>
        </div>
      </div>
    </motion.div>
  );
}
