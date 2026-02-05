
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Package,
  Sparkles,
  Zap,
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  Clock,
  ArrowRight,
  MapPin,
  Heart,
  MessageCircle,
  Headphones
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, Category, CartItem, User, ProductVariation, Order } from './types';

// Components
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductDetails from './components/ProductDetails';
import AdminPanel from './components/AdminPanel';
import AuthModal from './components/AuthModal';
import AdminLogin from './components/AdminLogin';
import UserProfile from './components/UserProfile';
import CheckoutModal from './components/CheckoutModal';

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Elegant Crystal Vase',
    description: 'A handcrafted crystal vase perfect for any living room setting. Unique patterns that reflect light beautifully.',
    price: 1500,
    oldPrice: 1800,
    category: 'Home Decor',
    media: [
      { url: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=800', type: 'image' },
      { url: 'https://images.unsplash.com/photo-1612117180556-34070a25287e?auto=format&fit=crop&q=80&w=800', type: 'image' }
    ],
    primaryIndex: 0,
    rating: 4.8,
    reviewsCount: 12,
    stock: 5,
    createdAt: Date.now(),
    isFlashSale: true,
    variations: [
        { id: 'v1', name: 'Transparent', stock: 5 },
        { id: 'v2', name: 'Smoky Grey', price: 1700, stock: 2 }
    ]
  },
  {
    id: '2',
    name: 'Custom Wooden Photo Frame',
    description: 'Engrave your special date or message on this premium oak wood photo frame.',
    price: 850,
    category: 'Personalized',
    media: [
      { url: 'https://images.unsplash.com/photo-1531233076846-930430d4737f?auto=format&fit=crop&q=80&w=800', type: 'image' }
    ],
    primaryIndex: 0,
    rating: 4.9,
    reviewsCount: 24,
    stock: 15,
    createdAt: Date.now() - 100000
  },
  {
    id: '3',
    name: 'Motion Art Lava Lamp',
    description: 'A soothing motion art lamp for your bedside table. Perfect for creating a relaxing atmosphere.',
    price: 2200,
    oldPrice: 2500,
    category: 'Home Decor',
    media: [
      { url: 'https://assets.mixkit.co/videos/preview/mixkit-lava-lamp-close-up-1658-large.mp4', type: 'video' },
      { url: 'https://images.unsplash.com/photo-1574632510257-2e2930263628?auto=format&fit=crop&q=80&w=800', type: 'image' }
    ],
    primaryIndex: 0,
    rating: 4.7,
    reviewsCount: 8,
    stock: 3,
    createdAt: Date.now() - 200000,
    isFlashSale: true
  }
];

const CATEGORIES: Category[] = ['All', 'Personalized', 'Birthday', 'Wedding', 'Home Decor', 'Accessories'];

const fuzzyMatch = (text: string, query: string): number => {
  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  if (normalizedText.includes(normalizedQuery)) return 100;
  const keywords = normalizedQuery.split(/\s+/).filter(k => k.length > 1);
  if (keywords.length === 0) return 0;
  let score = 0;
  keywords.forEach(keyword => {
    if (normalizedText.includes(keyword)) {
      score += 25;
    } else {
      let textIdx = 0;
      let matches = 0;
      for (let char of keyword) {
        const foundIdx = normalizedText.indexOf(char, textIdx);
        if (foundIdx !== -1) {
          matches++;
          textIdx = foundIdx + 1;
        }
      }
      if (matches >= keyword.length - 1 && keyword.length > 3) {
        score += 10;
      }
    }
  });
  return score;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ h: 12, m: 45, s: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else {
          s = 59;
          if (m > 0) m--;
          else {
            m = 59;
            if (h > 0) h--;
          }
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedProducts = localStorage.getItem('pm_products');
    const savedCart = localStorage.getItem('pm_cart');
    const savedUser = localStorage.getItem('pm_user');
    const savedAdmin = localStorage.getItem('pm_admin_auth');

    if (savedProducts) setProducts(JSON.parse(savedProducts));
    else {
      setProducts(DEFAULT_PRODUCTS);
      localStorage.setItem('pm_products', JSON.stringify(DEFAULT_PRODUCTS));
    }
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedAdmin === 'true') {
      setIsAdminAuthenticated(true);
      setIsAdminMode(true);
    }
    
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  const addToCart = (product: Product, variation?: ProductVariation) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && (item.selectedVariation?.id === variation?.id));
      let updated;
      if (existing) {
        updated = prev.map(item => (item.id === product.id && item.selectedVariation?.id === variation?.id) ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        const actualPrice = variation?.price || product.price;
        updated = [...prev, { ...product, price: actualPrice, quantity: 1, selectedVariation: variation }];
      }
      localStorage.setItem('pm_cart', JSON.stringify(updated));
      return updated;
    });
    setIsCartOpen(true);
  };

  const handleBuyNow = (product: Product, variation?: ProductVariation) => {
    addToCart(product, variation);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const removeFromCart = (cartItemId: string, variationId?: string) => {
    setCart(prev => {
      const updated = prev.filter(item => !(item.id === cartItemId && item.selectedVariation?.id === variationId));
      localStorage.setItem('pm_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const updateQuantity = (cartItemId: string, variationId: string | undefined, delta: number) => {
    setCart(prev => {
      const updated = prev.map(item => {
        if (item.id === cartItemId && item.selectedVariation?.id === variationId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      });
      localStorage.setItem('pm_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const handleOrderSuccess = (order: Order) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        orders: [order, ...(currentUser.orders || [])],
        points: (currentUser.points || 0) + Math.floor(order.totalAmount / 100)
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('pm_user', JSON.stringify(updatedUser));
    }
    setCart([]);
    localStorage.removeItem('pm_cart');
    setIsCheckoutOpen(false);
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim();
    let baseFiltered = products.filter(p => selectedCategory === 'All' || p.category === selectedCategory);
    if (!query) return baseFiltered;
    const scoredProducts = baseFiltered.map(p => {
      const nameScore = fuzzyMatch(p.name, query);
      const descScore = fuzzyMatch(p.description, query) * 0.5;
      const categoryScore = fuzzyMatch(p.category, query) * 0.3;
      return { product: p, score: nameScore + descScore + categoryScore };
    });
    return scoredProducts
      .filter(sp => sp.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(sp => sp.product);
  }, [products, searchQuery, selectedCategory]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-tr from-[#7d2ae8] to-[#00c4cc] rounded-[2rem] shadow-xl flex items-center justify-center">
            <ShoppingBag className="text-white w-10 h-10" />
          </div>
          <p className="font-serif italic text-slate-400 text-base">Curating moments of joy...</p>
        </motion.div>
      </div>
    );
  }

  if (isAdminMode) {
    if (!isAdminAuthenticated) {
      return <AdminLogin onSuccess={() => { setIsAdminAuthenticated(true); setIsAdminMode(true); localStorage.setItem('pm_admin_auth', 'true'); }} onCancel={() => setIsAdminMode(false)} />;
    }
    return <AdminPanel products={products} onAddProduct={(p) => setProducts([p, ...products])} onDeleteProduct={(id) => setProducts(products.filter(p => p.id !== id))} onLogout={() => { setIsAdminAuthenticated(false); setIsAdminMode(false); localStorage.removeItem('pm_admin_auth'); }} />;
  }

  return (
    <div className="min-h-screen bg-[#fdfdfd] text-slate-900 selection:bg-[#00c4cc]/20 selection:text-[#00c4cc] overflow-x-hidden w-full">
      <Header 
        isAdmin={false} 
        onToggleAdmin={() => setIsAdminMode(true)} 
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        currentUser={currentUser}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogout={() => { setCurrentUser(null); localStorage.removeItem('pm_user'); }}
        onProfileClick={() => setIsProfileOpen(true)}
      />
      
      <section className="max-w-[1600px] mx-auto px-4 md:px-12 pt-4 md:pt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative min-h-[400px] md:h-[750px] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl bg-slate-900 group">
          <motion.img 
            initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 15, ease: "linear" }}
            src="https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=2000" 
            className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-[2s]" 
            alt="Hero" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent"></div>
          <div className="absolute inset-0 flex items-center px-6 md:px-16 lg:px-32">
            <div className="max-w-2xl text-white">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-3 md:gap-4 mb-4 md:mb-8">
                <span className="w-10 md:w-16 h-1 md:h-1.5 bg-[#00c4cc] rounded-full"></span>
                <span className="text-[10px] md:text-sm font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-[#00c4cc]">Design Your Memories</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-4xl md:text-7xl lg:text-9xl font-serif font-bold leading-[1.1] md:leading-[0.95] mb-6 md:mb-12">
                Uniquely <br className="hidden md:block" /> <span className="text-white/40 italic">Yours.</span>
              </motion.h1>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-wrap gap-4 md:gap-8">
                <button 
                  onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 md:px-14 py-4 md:py-6 bg-white text-slate-900 rounded-full font-black uppercase tracking-widest hover:bg-[#00c4cc] hover:text-white transition-all shadow-2xl text-[10px] md:text-sm"
                >
                  Discover Treasures
                </button>
                <div className="flex items-center gap-3 md:gap-5 bg-white/10 backdrop-blur-xl px-6 md:px-10 py-3 md:py-6 rounded-full border border-white/20">
                  <div className="text-[#00c4cc]"><Clock size={18} className="animate-pulse md:w-6 md:h-6" /></div>
                  <div className="border-l border-white/20 pl-3 md:pl-5">
                    <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-60 mb-0 md:mb-1">Limited Offers</p>
                    <p className="text-sm md:text-2xl font-bold tracking-tight tabular-nums">{timeLeft.h}:{timeLeft.m}:{timeLeft.s}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      <main id="catalog" className="max-w-[1600px] mx-auto px-4 md:px-12 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-10 items-center justify-between mb-12 md:20">
          <div className="w-full lg:w-1/2 relative group">
            <Search className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#00c4cc] transition-colors size-5 md:size-7" />
            <input 
              type="text" placeholder="Dreaming of something?..." 
              className="w-full pl-14 md:pl-20 pr-6 md:pr-10 py-5 md:py-8 bg-white border-2 border-slate-50 rounded-2xl md:rounded-[3rem] shadow-lg shadow-slate-200/40 focus:outline-none focus:border-[#00c4cc]/20 focus:ring-4 md:focus:ring-[12px] focus:ring-[#00c4cc]/5 transition-all text-base md:text-xl font-medium"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 md:gap-4 overflow-x-auto no-scrollbar w-full lg:w-auto pb-4 lg:pb-0 scroll-smooth">
            {CATEGORIES.map(c => (
              <button 
                key={c} onClick={() => setSelectedCategory(c)}
                className={`px-6 md:px-10 py-3 md:py-5 rounded-xl md:rounded-2xl whitespace-nowrap text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all ${
                  selectedCategory === c ? 'bg-[#00c4cc] text-white shadow-xl shadow-[#00c4cc]/20' : 'bg-white text-slate-400 hover:text-[#00c4cc] border border-slate-100 shadow-sm'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          {filteredProducts.length > 0 ? (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-10">
              {filteredProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} onClick={() => setSelectedProduct(p)} onAddToCart={(e) => { e.stopPropagation(); addToCart(p); }} />
              ))}
            </motion.div>
          ) : (
            <div className="py-24 md:py-48 text-center bg-slate-50 rounded-[3rem] md:rounded-[5rem] border-2 md:border-4 border-dashed border-slate-200 px-6">
              <Package size={48} className="md:size-20 mx-auto text-slate-200 mb-4 md:mb-8" />
              <h3 className="text-xl md:text-3xl font-black text-slate-900 mb-2 tracking-tight">Empty Workspace.</h3>
              <p className="text-slate-400 text-sm md:text-lg">No treasures match your search.</p>
            </div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-slate-900/70 backdrop-blur-xl z-[100]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 200 }} className="fixed right-0 top-0 bottom-0 w-full max-w-full md:max-w-xl bg-white shadow-2xl z-[101] flex flex-col md:rounded-l-[4rem] overflow-hidden">
              <div className="p-6 md:p-12 flex items-center justify-between border-b border-slate-50 bg-slate-50/30">
                <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">Bag.</h2>
                {/* Fix: Replace custom md:size prop with Tailwind classes */}
                <button onClick={() => setIsCartOpen(false)} className="p-3 md:p-5 rounded-2xl md:rounded-3xl bg-white shadow-sm border border-slate-100 text-slate-400 hover:text-[#00c4cc] transition-all"><X className="w-5 h-5 md:w-7 md:h-7" /></button>
              </div>
              <div className="flex-grow overflow-y-auto p-6 md:p-12 space-y-6 md:space-y-10 no-scrollbar">
                {cart.length > 0 ? cart.map(item => (
                  <motion.div layout key={`${item.id}-${item.selectedVariation?.id || 'none'}`} className="flex gap-4 md:gap-8 group">
                    <div className="w-20 h-20 md:w-32 md:h-32 bg-slate-50 rounded-xl md:rounded-[2rem] overflow-hidden flex-shrink-0 shadow-sm border border-slate-100">
                      <img src={item.media[item.selectedVariation?.mediaIndex || 0].url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                    </div>
                    <div className="flex-grow flex flex-col justify-center min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm md:text-xl leading-tight group-hover:text-[#00c4cc] transition-colors truncate">{item.name}</h4>
                      {item.selectedVariation && <p className="text-[8px] md:text-[10px] font-black text-[#00c4cc] uppercase mt-1 md:mt-2 tracking-widest">{item.selectedVariation.name}</p>}
                      <div className="flex items-center justify-between mt-3 md:mt-6">
                        <div className="flex items-center gap-3 md:gap-5 bg-slate-50 rounded-xl md:rounded-2xl px-3 md:px-5 py-2 md:py-3 border border-slate-100 shadow-inner">
                          {/* Fix: Replace custom md:size prop with Tailwind classes */}
                          <button onClick={() => updateQuantity(item.id, item.selectedVariation?.id, -1)} className="text-slate-400 hover:text-[#00c4cc]"><Minus className="w-3 h-3 md:w-4 md:h-4" /></button>
                          <span className="text-sm md:text-lg font-black w-4 md:w-6 text-center tabular-nums">{item.quantity}</span>
                          {/* Fix: Replace custom md:size prop with Tailwind classes */}
                          <button onClick={() => updateQuantity(item.id, item.selectedVariation?.id, 1)} className="text-slate-400 hover:text-[#00c4cc]"><Plus className="w-3 h-3 md:w-4 md:h-4" /></button>
                        </div>
                        <span className="font-black text-base md:text-2xl text-slate-900 tracking-tighter tabular-nums">৳{(item.price * item.quantity).toLocaleString()}</span>
                        {/* Fix: Replace custom md:size prop with Tailwind classes */}
                        <button onClick={() => removeFromCart(item.id, item.selectedVariation?.id)} className="text-slate-200 hover:text-red-500 transition-colors"><Trash2 className="w-[18px] h-[18px] md:w-[22px] md:h-[22px]" /></button>
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-10 md:py-20">
                    {/* Fix: Replace custom md:size prop with Tailwind classes */}
                    <ShoppingBag className="w-12 h-12 md:w-16 h-16 text-slate-100 mb-4 md:mb-8" />
                    <p className="font-black text-slate-400 uppercase tracking-[0.3em] md:tracking-[0.4em] text-[9px] md:text-xs">Bag is Empty</p>
                  </div>
                )}
              </div>
              <div className="p-6 md:p-12 bg-slate-50/50 border-t border-slate-50 backdrop-blur-md">
                <div className="flex items-center justify-between mb-6 md:mb-10">
                  <span className="text-slate-400 font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[8px] md:text-[10px]">Total Investment</span>
                  <span className="text-2xl md:text-5xl font-black text-slate-900 tabular-nums tracking-tighter">৳{cartTotal.toLocaleString()}</span>
                </div>
                <button 
                  disabled={cart.length === 0}
                  onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                  className="w-full bg-slate-900 text-white py-5 md:py-8 rounded-2xl md:rounded-[2.5rem] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-[10px] md:text-xs hover:bg-[#00c4cc] transition-all shadow-xl disabled:opacity-50"
                >
                  Confirm Purchase
                </button>
              </div>
            </motion.div>
          </>
        )}

        {isCheckoutOpen && (
          <CheckoutModal 
            cart={cart} 
            total={cartTotal} 
            onClose={() => setIsCheckoutOpen(false)} 
            onSuccess={handleOrderSuccess}
            user={currentUser}
          />
        )}

        {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} onLogin={setCurrentUser} />}
        {isProfileOpen && currentUser && <UserProfile user={currentUser} products={products} onClose={() => setIsProfileOpen(false)} onLogout={() => { setCurrentUser(null); localStorage.removeItem('pm_user'); }} />}
        {selectedProduct && <ProductDetails product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={(v) => addToCart(selectedProduct, v)} onBuyNow={(v) => handleBuyNow(selectedProduct, v)} />}
      </AnimatePresence>
    </div>
  );
}
