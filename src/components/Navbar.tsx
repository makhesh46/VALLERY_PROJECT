import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore.js';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#0a0a0a]/85 backdrop-blur-md border-b border-white/10' 
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-3">
            {settings?.logoUrl && (
              <img 
                src={settings.logoUrl} 
                alt="Logo" 
                className="h-10 w-auto rounded" 
                style={{ mixBlendMode: 'screen' }}
              />
            )}
            <span className="text-2xl font-serif tracking-wider text-white">
              {settings?.websiteTitle || 'METAL ART'}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm uppercase tracking-widest hover:text-[#c5a059] transition-colors">Home</Link>
            <Link to="/products" className="text-sm uppercase tracking-widest hover:text-[#c5a059] transition-colors">Collection</Link>
            <Link to="/about" className="text-sm uppercase tracking-widest hover:text-[#c5a059] transition-colors">Atelier</Link>
            <Link to="/contact" className="text-sm uppercase tracking-widest hover:text-[#c5a059] transition-colors">Contact</Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-[#c5a059]">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-lg border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            <Link to="/" onClick={() => setIsOpen(false)} className="px-3 py-2 text-sm uppercase tracking-widest hover:text-[#c5a059]">Home</Link>
            <Link to="/products" onClick={() => setIsOpen(false)} className="px-3 py-2 text-sm uppercase tracking-widest hover:text-[#c5a059]">Collection</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="px-3 py-2 text-sm uppercase tracking-widest hover:text-[#c5a059]">Atelier</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="px-3 py-2 text-sm uppercase tracking-widest hover:text-[#c5a059]">Contact</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
