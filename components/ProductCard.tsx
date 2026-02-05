
import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Play, Star, Zap, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  onAddToCart: (e: React.MouseEvent) => void;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onAddToCart, index }) => {
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
  const primaryMedia = product.media[product.primaryIndex] || product.media[0];

  // Mouse tilt effect logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) return; // Disable tilt on mobile for better performance
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.98 },
        visible: { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          transition: { 
            type: 'spring', 
            damping: 25, 
            stiffness: 100,
            delay: index * 0.05
          } 
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="bg-white rounded-2xl md:rounded-[3rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] transition-shadow duration-700 group relative border border-slate-50 flex flex-col h-full w-full"
    >
      <div 
        className="aspect-[4/5] relative overflow-hidden bg-slate-100" 
        onClick={onClick}
        style={{ transform: "translateZ(30px)" }}
      >
        {primaryMedia.type === 'image' ? (
          <motion.img 
            src={primaryMedia.url} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out"
          />
        ) : (
          <div className="relative w-full h-full">
            <video 
              src={primaryMedia.url} 
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
              onMouseOver={e => e.currentTarget.play()}
              onMouseOut={e => {
                e.currentTarget.pause();
                e.currentTarget.currentTime = 0;
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-transparent transition-colors">
              <div className="bg-white/95 backdrop-blur-xl p-3 md:p-5 rounded-full shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                {/* Fix: Replace custom md:size prop with Tailwind classes */}
                <Play className="w-[18px] h-[18px] md:w-6 md:h-6 text-[#00c4cc] fill-[#00c4cc]" />
              </div>
            </div>
          </div>
        )}
        
        {/* Quick Action Overlay - Hidden on mobile, only desktop */}
        <div className="absolute inset-0 bg-slate-900/40 opacity-0 md:group-hover:opacity-100 transition-all duration-500 hidden md:flex items-center justify-center gap-5 z-20 backdrop-blur-[4px]">
          <motion.button 
            whileHover={{ scale: 1.15, rotate: -3 }} 
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onAddToCart(e); }}
            className="bg-[#00c4cc] text-white p-6 rounded-[1.8rem] shadow-2xl hover:bg-[#7d2ae8] transition-all"
          >
            <ShoppingCart size={28} strokeWidth={3} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.15, rotate: 3 }} 
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="bg-white text-slate-900 p-6 rounded-[1.8rem] shadow-2xl hover:bg-slate-50 transition-all"
          >
            <Eye size={28} strokeWidth={3} />
          </motion.button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 md:top-8 md:left-8 flex flex-col gap-1.5 md:gap-3 z-10" style={{ transform: "translateZ(20px)" }}>
          {discount > 0 && (
            <div className="bg-[#7d2ae8] text-white text-[7px] md:text-[10px] font-black px-2.5 py-1 md:px-5 md:py-2.5 rounded-full shadow-2xl uppercase tracking-[0.1em] md:tracking-[0.2em]">
              {discount}% Saving
            </div>
          )}
          {product.isFlashSale && (
            <div className="bg-white/95 backdrop-blur-xl text-slate-900 text-[7px] md:text-[10px] font-black px-2.5 py-1 md:px-5 md:py-2.5 rounded-full shadow-2xl flex items-center gap-1 md:gap-2 uppercase tracking-[0.1em] md:tracking-[0.2em] border border-white">
              {/* Fix: Replace custom md:size prop with Tailwind classes */}
              <Zap fill="currentColor" className="w-[10px] h-[10px] md:w-[14px] md:h-[14px] text-amber-500" /> Priority
            </div>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3 md:bottom-8 md:left-8 md:right-8 z-10" style={{ transform: "translateZ(20px)" }}>
           <span className="inline-block text-[7px] md:text-[10px] bg-white/20 text-white font-black px-2.5 py-1 md:px-5 md:py-2.5 rounded-full uppercase backdrop-blur-xl tracking-[0.2em] md:tracking-[0.3em] border border-white/30 truncate max-w-full">
             {product.category}
           </span>
        </div>
      </div>

      <div className="p-4 md:p-10 flex flex-col flex-grow" style={{ transform: "translateZ(15px)" }}>
        <h3 className="font-bold text-slate-900 text-sm md:text-2xl line-clamp-2 min-h-[2.5rem] md:min-h-[4rem] group-hover:text-[#00c4cc] transition-colors leading-tight tracking-tight">
          {product.name}
        </h3>
        
        <div className="mt-auto pt-4 md:pt-8 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[#00c4cc] font-black text-lg md:text-3xl tracking-tighter tabular-nums">৳{product.price.toLocaleString()}</span>
              {product.oldPrice && (
                <span className="text-slate-300 text-[10px] md:text-sm line-through font-bold tracking-tight">৳{product.oldPrice.toLocaleString()}</span>
              )}
            </div>
            <div className="flex items-center gap-1 md:gap-2 bg-[#f4f7f6] px-2 py-1 md:px-4 md:py-2 rounded-lg md:rounded-2xl">
              {/* Fix: Replace custom md:size prop with Tailwind classes */}
              <Star fill="currentColor" className="w-[10px] h-[10px] md:w-4 md:h-4 text-amber-500" />
              <span className="text-[10px] md:text-sm font-black text-slate-700">{product.rating}</span>
            </div>
          </div>
          
          <div className="mt-4 md:mt-8 flex items-center justify-between border-t border-slate-100 pt-4 md:pt-8">
             <div className="flex items-center gap-1.5 md:gap-3">
               <div className={`w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full ${product.stock > 0 ? 'bg-[#00c4cc] animate-pulse' : 'bg-red-500'}`} />
               <span className="text-[7px] md:text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">{product.stock > 0 ? 'Verified' : 'Sold Out'}</span>
             </div>
             <span className="text-[7px] md:text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">
               {product.reviewsCount} Trusted
             </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
