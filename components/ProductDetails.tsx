
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Phone, MessageCircle, Info, Truck, Calendar, ShoppingBag, Edit3, 
  PlayCircle, Star, ShoppingCart, ChevronRight, UserCircle, Sparkles, ShieldCheck,
  Zap, FileImage, Download
} from 'lucide-react';
import { Product, SHOP_INFO, Review, ProductVariation } from '../types';

interface ProductDetailsProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (variation?: ProductVariation) => void;
  onBuyNow: (variation?: ProductVariation) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onClose, onAddToCart, onBuyNow }) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(product.primaryIndex);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [customMessage, setCustomMessage] = useState('');
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(
    product.variations && product.variations.length > 0 ? product.variations[0] : null
  );
  
  useEffect(() => {
    if (selectedVariation?.mediaIndex !== undefined && product.media[selectedVariation.mediaIndex]) {
        setActiveMediaIndex(selectedVariation.mediaIndex);
    }

    const productUrl = window.location.origin + '?product=' + product.id;
    const variationPart = selectedVariation ? `\n*Option:* ${selectedVariation.name}` : '';
    setCustomMessage(`Hello! I am interested in this product from your shop:\n\n*Product:* ${product.name}${variationPart}\n*Price:* ৳${selectedVariation?.price || product.price}\n*Link:* ${productUrl}\n\nPlease let me know if it's available. Thanks!`);
  }, [product, selectedVariation]);

  const activeMedia = product.media[activeMediaIndex] || product.media[0];

  const handleWhatsApp = () => {
    const encodedMsg = encodeURIComponent(customMessage);
    window.open(`https://wa.me/${SHOP_INFO.whatsapp.replace('+', '')}?text=${encodedMsg}`, '_blank');
  };

  const downloadAsWebP = async () => {
    if (activeMedia.type !== 'image') return;
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = activeMedia.url;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const webpUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = webpUrl;
        link.download = `${product.name.replace(/\s+/g, '_').toLowerCase()}.webp`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(webpUrl);
      }, 'image/webp', 0.9);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const dummyReviews: Review[] = [
    { id: '1', userName: 'Anika Rahman', rating: 5, comment: 'Absolutely beautiful! The packaging was premium and the product is high quality.', date: Date.now() - 50000000 },
    { id: '2', userName: 'Saiful Islam', rating: 4, comment: 'Good quality but shipping took 2 days extra. Still worth it.', date: Date.now() - 100000000 }
  ];

  const currentPrice = selectedVariation?.price || product.price;
  const currentStock = selectedVariation ? selectedVariation.stock : product.stock;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 50, opacity: 0 }} 
        animate={{ scale: 1, y: 0, opacity: 1 }} 
        exit={{ scale: 0.9, y: 50, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={e => e.stopPropagation()}
        className="bg-white w-full max-w-7xl max-h-[92vh] overflow-hidden rounded-[4rem] shadow-2xl relative flex flex-col lg:flex-row border border-white/20"
      >
        <div className="absolute top-8 right-8 z-30 flex items-center gap-4">
          {activeMedia.type === 'image' && (
            <motion.button 
              whileHover={{ scale: 1.1, backgroundColor: '#f0f9fa' }}
              whileTap={{ scale: 0.9 }}
              onClick={downloadAsWebP}
              className="p-4 bg-white/95 backdrop-blur-md rounded-3xl text-[#00c4cc] shadow-2xl border border-slate-100 flex items-center gap-3 font-black text-[10px] uppercase tracking-widest px-6"
            >
              <FileImage size={20} /> WebP
            </motion.button>
          )}
          <motion.button 
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose} 
            className="p-4 bg-white/95 backdrop-blur-md rounded-3xl text-slate-900 hover:text-[#7d2ae8] transition-all shadow-2xl border border-slate-100"
          >
            <X size={28} />
          </motion.button>
        </div>

        <div className="lg:w-7/12 bg-slate-50/50 p-8 flex flex-col border-r border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#7d2ae8] via-[#00c4cc] to-[#33e1ed]" />
          
          <div className="flex-grow aspect-square rounded-[3.5rem] bg-white shadow-inner overflow-hidden mb-8 flex items-center justify-center border-[12px] border-white relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMedia.url}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full"
              >
                {activeMedia.type === 'image' ? (
                  <img src={activeMedia.url} className="w-full h-full object-contain p-4" alt="" />
                ) : (
                  <video src={activeMedia.url} controls autoPlay muted playsInline className="w-full h-full object-contain" />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="flex gap-5 overflow-x-auto no-scrollbar py-2 justify-center">
            {product.media.map((m, idx) => (
              <motion.button
                key={idx}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveMediaIndex(idx)}
                className={`w-24 h-24 flex-shrink-0 rounded-[2rem] overflow-hidden border-4 transition-all shadow-lg ${
                  activeMediaIndex === idx ? 'border-[#00c4cc] ring-8 ring-[#00c4cc]/10' : 'border-white hover:border-[#00c4cc]/30'
                }`}
              >
                {m.type === 'image' ? (
                  <img src={m.url} className="w-full h-full object-cover" alt="" />
                ) : (
                  <div className="w-full h-full relative bg-slate-200 flex items-center justify-center">
                    <PlayCircle size={32} className="text-white drop-shadow-lg z-10" />
                    <img src={product.media[0].url} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="Video Placeholder" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="lg:w-5/12 p-10 lg:p-16 overflow-y-auto flex flex-col no-scrollbar bg-white">
          <div className="mb-10">
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-2 text-[#00c4cc] font-black text-[11px] uppercase tracking-[0.3em] mb-4"
            >
              <Sparkles size={16} /> {product.category}
            </motion.div>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-slate-900 mb-6 leading-[1.1]">{product.name}</h2>
            
            <div className="flex items-center gap-8 mb-8">
              <div>
                <p className="text-5xl font-black text-[#00c4cc] tracking-tighter tabular-nums">৳{currentPrice.toLocaleString()}</p>
                {product.oldPrice && <p className="text-lg font-bold text-slate-300 line-through tracking-tight mt-1">৳{product.oldPrice.toLocaleString()}</p>}
              </div>
              <div className="h-14 w-px bg-slate-100"></div>
              <div className="flex flex-col">
                <div className="flex items-center text-amber-500 gap-1.5 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />)}
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.reviewsCount} Trusted Reviews</span>
              </div>
            </div>

            {product.variations && product.variations.length > 0 && (
                <div className="mb-8">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Workspace Options</p>
                    <div className="flex flex-wrap gap-3">
                        {product.variations.map(v => (
                            <button
                                key={v.id}
                                onClick={() => setSelectedVariation(v)}
                                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2 ${
                                    selectedVariation?.id === v.id 
                                    ? 'bg-[#00c4cc] text-white border-[#00c4cc] shadow-lg shadow-[#00c4cc]/20' 
                                    : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-[#00c4cc]/30'
                                }`}
                            >
                                {v.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <p className="text-slate-500 text-lg leading-relaxed mb-10 font-medium">{product.description}</p>

            <div className="grid grid-cols-1 gap-4 mb-10">
              <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-xl hover:shadow-[#00c4cc]/5 transition-all">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#00c4cc] shadow-sm"><Truck size={24}/></div>
                <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Express Shipping</p><p className="text-sm font-bold text-slate-900">Dhaka: 24h | Outside: 2-3 Days</p></div>
              </div>
              <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-xl hover:shadow-[#7d2ae8]/5 transition-all">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#7d2ae8] shadow-sm"><ShieldCheck size={24}/></div>
                <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Merchant Trust</p><p className="text-sm font-bold text-slate-900">Verified Quality & Secure Packing</p></div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
               <div className="flex gap-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => onAddToCart(selectedVariation || undefined)}
                    className="flex-grow py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 hover:bg-[#7d2ae8] transition-all shadow-2xl"
                  >
                    <ShoppingCart size={20} /> Add to Bag
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={handleWhatsApp}
                    className="p-6 bg-emerald-500 text-white rounded-[2rem] shadow-2xl hover:bg-emerald-600 transition-all"
                  >
                    <MessageCircle size={24} />
                  </motion.button>
               </div>
               <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: '#00c4cc' }} whileTap={{ scale: 0.98 }}
                  onClick={() => onBuyNow(selectedVariation || undefined)}
                  className="w-full py-6 bg-[#00c4cc]/10 text-[#00c4cc] border-2 border-[#00c4cc] rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 hover:text-white transition-all"
                >
                  <Zap size={20} fill="currentColor" /> Purchase Instant
                </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductDetails;
