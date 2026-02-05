
import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Image as ImageIcon, Video, DollarSign, 
  Package, ShoppingCart, User, MapPin, CheckCircle, 
  Truck, Clock, LogOut, ArrowRight, ShieldCheck, 
  LayoutDashboard, List, Settings, Wand2, Sparkles,
  Camera, Save, X, Eye, TrendingUp, Search, Info,
  AlertCircle, Layers, Settings2, Play, BarChart3, PieChart,
  Download, FileImage, Palette, Share2, Globe, FileCode,
  Smartphone, ExternalLink
} from 'lucide-react';
import { Product, CATEGORIES, Category, ProductVariation, SHOP_INFO } from '../types';

interface AdminPanelProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ products, onAddProduct, onDeleteProduct, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'add-product' | 'analytics'>('dashboard');
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    oldPrice: '',
    description: '',
    category: CATEGORIES[1],
    stock: '10',
    media: [] as {url: string, type: 'image' | 'video'}[],
    variations: [] as ProductVariation[]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = useMemo(() => {
    const totalRevenue = products.reduce((acc, p) => acc + (p.price * (p.stock || 0)), 0);
    const lowStock = products.filter(p => p.stock < 5).length;
    return { 
      totalProducts: products.length,
      totalValue: totalRevenue, 
      lowStockItems: lowStock,
      recentActivity: 12
    };
  }, [products]);

  // POWERFUL HTML EXPORT ENGINE
  const exportDigitalCatalog = () => {
    const serializedProducts = JSON.stringify(products);
    const serializedCategories = JSON.stringify(CATEGORIES);
    
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${SHOP_INFO.name} - Official Catalog</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background: #fbfcfd; color: #0f172a; }
        .font-serif { font-family: 'Playfair Display', serif; }
        .product-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .product-card:hover { transform: translateY(-8px); box-shadow: 0 30px 60px -12px rgba(0,0,0,0.1); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
    </style>
</head>
<body class="selection:bg-cyan-100">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div class="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                </div>
                <div>
                    <h1 class="text-2xl font-serif font-bold">${SHOP_INFO.name}</h1>
                    <p class="text-[10px] uppercase tracking-[0.3em] font-black text-cyan-500">Digital Showroom 2025</p>
                </div>
            </div>
            
            <div class="flex items-center gap-4 w-full md:w-auto">
                <div class="relative flex-grow md:flex-grow-0">
                    <input type="text" id="searchInput" placeholder="Search treasures..." class="w-full md:w-64 pl-10 pr-4 py-3 rounded-full bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-cyan-500/5 transition-all text-sm font-medium">
                    <div class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Category Filter -->
        <div class="max-w-7xl mx-auto px-6 pb-6 overflow-x-auto no-scrollbar flex gap-3" id="categoryTabs">
            <!-- Dynamically injected -->
        </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 py-16">
        <div id="productGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <!-- Dynamically injected -->
        </div>
    </main>

    <footer class="bg-slate-900 text-white py-20 px-6 mt-20">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
                <h3 class="font-serif text-3xl mb-6">${SHOP_INFO.name}</h3>
                <p class="text-slate-400 leading-relaxed mb-8">Bringing magic to your gift-giving experience through curated treasures and personalized service.</p>
            </div>
            <div>
                <h4 class="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-6">Connect</h4>
                <div class="space-y-4 text-slate-300">
                    <p class="flex items-center gap-3">📍 ${SHOP_INFO.address}</p>
                    <p class="flex items-center gap-3">📞 ${SHOP_INFO.phone}</p>
                </div>
            </div>
            <div>
                <a href="https://wa.me/${SHOP_INFO.whatsapp.replace('+', '')}" class="inline-flex items-center gap-3 px-8 py-4 bg-cyan-500 text-white rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-cyan-600 transition-all">
                    Message Consultant
                </a>
            </div>
        </div>
    </footer>

    <script>
        const products = ${serializedProducts};
        const categories = ${serializedCategories};
        const whatsapp = "${SHOP_INFO.whatsapp.replace('+', '')}";
        
        let activeCategory = 'All';
        let searchQuery = '';

        function renderCategories() {
            const container = document.getElementById('categoryTabs');
            container.innerHTML = categories.map(c => \`
                <button onclick="setCategory('\${c}')" class="px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all \${activeCategory === c ? 'bg-cyan-500 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}">\${c}</button>
            \`).join('');
        }

        function setCategory(cat) {
            activeCategory = cat;
            renderCategories();
            renderProducts();
        }

        function renderProducts() {
            const grid = document.getElementById('productGrid');
            const filtered = products.filter(p => {
                const matchesCat = activeCategory === 'All' || p.category === activeCategory;
                const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesCat && matchesSearch;
            });

            if (filtered.length === 0) {
                grid.innerHTML = '<div class="col-span-full py-20 text-center"><p class="text-slate-400 font-bold">No products found in this category.</p></div>';
                return;
            }

            grid.innerHTML = filtered.map(p => \`
                <div class="product-card bg-white rounded-[2.5rem] overflow-hidden border border-slate-50 flex flex-col group">
                    <div class="aspect-square overflow-hidden bg-slate-100 relative">
                        <img src="\${p.media[0].url}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                        <div class="absolute top-6 left-6">
                            <span class="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border border-white shadow-sm">\${p.category}</span>
                        </div>
                    </div>
                    <div class="p-8 flex-grow flex flex-col">
                        <h3 class="text-xl font-bold mb-4 line-clamp-2 min-h-[3.5rem]">\${p.name}</h3>
                        <div class="mt-auto flex items-center justify-between">
                            <span class="text-2xl font-black text-cyan-500 tracking-tighter">৳\${p.price.toLocaleString()}</span>
                            <a href="https://wa.me/\${whatsapp}?text=Hello! I want to order \${encodeURIComponent(p.name)} - Price: ৳\${p.price}" class="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-cyan-500 transition-all shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                            </a>
                        </div>
                    </div>
                </div>
            \`).join('');
        }

        document.getElementById('searchInput').addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderProducts();
        });

        renderCategories();
        renderProducts();
    </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PreciousMoments_DigitalShop_${new Date().toLocaleDateString().replace(/\//g, '-')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadAsWebP = async (url: string, filename: string) => {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url;
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
        link.download = `${filename.replace(/\s+/g, '_').toLowerCase()}.webp`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(webpUrl);
      }, 'image/webp', 0.9);
    } catch (error) {
      console.error("Failed to download WebP image:", error);
      alert("Could not convert this image to WebP. It might be due to security restrictions on the source URL.");
    }
  };

  const generateVisualCatalog = async () => {
    setIsGeneratingImage(true);
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1200;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, 1200, 1200);
    grad.addColorStop(0, '#7d2ae8'); 
    grad.addColorStop(1, '#00c4cc'); 
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 1200);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.roundRect(50, 50, 1100, 1100, 60);
    ctx.fill();

    ctx.fillStyle = '#0f172a'; 
    ctx.font = 'bold 80px serif';
    ctx.textAlign = 'center';
    ctx.fillText('Precious Moments', 600, 180);
    
    ctx.fillStyle = '#00c4cc';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('EXQUISITE GIFT COLLECTION 2025', 600, 230);

    const featured = products.slice(0, 4);
    const imagePromises = featured.map(p => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = p.media[0].url;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });
    });

    try {
      const images = await Promise.all(imagePromises);
      const positions = [
        { x: 100, y: 300 }, { x: 620, y: 300 },
        { x: 100, y: 720 }, { x: 620, y: 720 }
      ];

      images.forEach((img, i) => {
        const pos = positions[i];
        const size = 480;
        
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.roundRect(pos.x, pos.y, size, size, 40);
        ctx.fill();

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(pos.x + 10, pos.y + 10, size - 20, size - 20, 30);
        ctx.clip();
        
        const scale = Math.max(size / img.width, size / img.height);
        const x = pos.x + 10 + (size - 20 - img.width * scale) / 2;
        const y = pos.y + 10 + (size - 20 - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        ctx.restore();

        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(featured[i].name, pos.x + 20, pos.y + size - 40);
      });

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('DESIGNED AT PRECIOUSMOMENTS.SHOP', 600, 1100);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const webpUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = webpUrl;
        link.download = `PreciousMoments_VisualCatalog_2025.webp`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(webpUrl);
        setIsGeneratingImage(false);
      }, 'image/webp', 1.0);

    } catch (err) {
      console.error(err);
      alert("Error generating visual catalog.");
      setIsGeneratingImage(false);
    }
  };

  const handleExportCatalog = () => {
    const headers = ['ID', 'Product Name', 'Price (BDT)', 'Category', 'Current Stock', 'Total Value'];
    const rows = products.map(p => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.price,
      p.category,
      p.stock,
      p.price * p.stock
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `precious_moments_catalog_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: any) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewProduct(prev => ({
            ...prev,
            media: [...prev.media, { 
              url: reader.result as string, 
              type: file.type.startsWith('video') ? 'video' : 'image' 
            }]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeMedia = (index: number) => {
    setNewProduct(prev => ({ ...prev, media: prev.media.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.description || newProduct.media.length === 0) {
      return alert('Missing critical product information.');
    }
    setIsSubmitting(true);
    const product: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      oldPrice: newProduct.oldPrice ? parseFloat(newProduct.oldPrice) : undefined,
      description: newProduct.description,
      category: newProduct.category as Category,
      media: newProduct.media,
      primaryIndex: 0,
      rating: 5.0,
      reviewsCount: 0,
      stock: parseInt(newProduct.stock),
      createdAt: Date.now(),
      variations: newProduct.variations.length > 0 ? newProduct.variations : undefined
    };
    setTimeout(() => {
      onAddProduct(product);
      setNewProduct({ name: '', price: '', oldPrice: '', description: '', category: CATEGORIES[1], stock: '10', media: [], variations: [] });
      setActiveTab('inventory');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f4f7f6]">
      {/* Workspace Sidebar - Improved Mobile Navigation */}
      <aside className="w-full lg:w-[320px] bg-white border-b lg:border-r border-slate-200 flex flex-col p-4 md:p-6 lg:p-8 z-50 overflow-x-auto lg:overflow-x-visible no-scrollbar sticky top-0 md:relative">
        <div className="mb-4 lg:mb-14 px-2 flex items-center gap-3 lg:gap-5 flex-shrink-0">
          <div className="w-8 h-8 md:w-14 md:h-14 bg-gradient-to-tr from-[#7d2ae8] to-[#00c4cc] rounded-lg md:rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#7d2ae8]/20">
            <ShieldCheck className="w-5 h-5 md:w-7 md:h-7" />
          </div>
          <div>
            <h2 className="text-sm md:text-xl font-black text-black tracking-tight">Workspace</h2>
            <p className="hidden lg:block text-[10px] text-black font-black uppercase tracking-[0.2em]">Merchant Console</p>
          </div>
        </div>
        
        <nav className="flex flex-row lg:flex-col gap-2 lg:gap-3 lg:flex-grow pb-1 lg:pb-0 overflow-x-auto no-scrollbar scroll-smooth snap-x">
          {[
            { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={16} /> },
            { id: 'inventory', label: 'Items', icon: <List size={16} /> },
            { id: 'add-product', label: 'Publish', icon: <Plus size={16} /> },
            { id: 'analytics', label: 'Insights', icon: <BarChart3 size={16} /> }
          ].map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id as any)} 
              className={`flex-shrink-0 lg:w-full flex items-center gap-2.5 lg:gap-5 px-4 lg:px-8 py-2.5 lg:py-5 rounded-lg lg:rounded-[1.5rem] transition-all text-[9px] lg:text-xs font-black uppercase tracking-[0.2em] snap-start ${
                activeTab === item.id 
                ? 'bg-[#00c4cc] text-white shadow-xl shadow-[#00c4cc]/30' 
                : 'text-black hover:bg-slate-50 border border-transparent hover:border-slate-100'
              }`}
            >
              {item.icon}
              <span className="whitespace-nowrap">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="hidden lg:block mt-8 pt-8 border-t border-slate-100">
          <button 
            onClick={onLogout} 
            className="w-full flex items-center gap-5 px-8 py-5 text-black hover:text-red-500 hover:bg-red-50 rounded-[1.5rem] transition-all text-xs font-black uppercase tracking-[0.2em]"
          >
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-4 md:p-10 lg:p-20 overflow-y-auto max-h-screen no-scrollbar">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-6 lg:space-y-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="text-2xl md:text-5xl font-black text-black tracking-tight">Welcome, Merchant.</h1>
                  <p className="text-black text-xs md:text-lg font-medium mt-2">Manage and share your digital assets.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 lg:gap-4">
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={exportDigitalCatalog}
                    className="flex-grow md:flex-grow-0 flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-[#00c4cc] transition-all border border-white/10"
                  >
                    <Smartphone size={18} /> Download Standalone Shop
                  </motion.button>
                  <button 
                    onClick={generateVisualCatalog}
                    disabled={isGeneratingImage || products.length === 0}
                    className="flex-grow md:flex-grow-0 flex items-center justify-center gap-2 px-8 py-4 bg-white border border-slate-100 text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-slate-50 transition-all disabled:opacity-50"
                  >
                    <FileImage size={18} /> {isGeneratingImage ? 'Syncing...' : 'Export Poster'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
                {[
                  { label: 'Catalog', value: stats.totalProducts, icon: <Package />, color: '#7d2ae8' },
                  { label: 'Value', value: `৳${stats.totalValue >= 1000 ? (stats.totalValue/1000).toFixed(1)+'k' : stats.totalValue}`, icon: <TrendingUp />, color: '#00c4cc' },
                  { label: 'Alerts', value: stats.lowStockItems, icon: <AlertCircle />, color: '#ff4d4d' },
                  { label: 'Trust', value: 'Master', icon: <Sparkles />, color: '#ffd700' }
                ].map((stat, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: i * 0.1 }} 
                    key={i} 
                    className="bg-white p-4 md:p-10 rounded-xl md:rounded-[3rem] border border-slate-100 shadow-sm"
                  >
                    <div className="w-8 h-8 md:w-14 md:h-14 rounded-lg flex items-center justify-center mb-3 md:mb-8" style={{ backgroundColor: `${stat.color}10`, color: stat.color }}>
                      {stat.icon}
                    </div>
                    <p className="text-[8px] md:text-[11px] font-black text-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                    <h4 className="text-base md:text-4xl font-black text-black tracking-tighter">{stat.value}</h4>
                  </motion.div>
                ))}
              </div>

              {/* Tips & Quick Actions */}
              <div className="bg-[#00c4cc] rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                   <Globe size={240} />
                </div>
                <div className="relative z-10 max-w-2xl">
                    <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">New Feature</span>
                    <h3 className="text-3xl md:text-5xl font-black mb-6 leading-tight">Your shop is now portable.</h3>
                    <p className="text-white/80 text-lg font-medium mb-10 leading-relaxed">
                      Download your standalone shop file and send it via WhatsApp or Email. Customers can browse your entire catalog offline and place orders directly.
                    </p>
                    <button onClick={exportDigitalCatalog} className="px-10 py-5 bg-white text-slate-900 rounded-full font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all shadow-2xl flex items-center gap-3">
                       <Download size={18} /> Generate Package
                    </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-6 lg:space-y-12">
              <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                <h2 className="text-2xl lg:text-5xl font-black text-black tracking-tight">Catalog.</h2>
                <div className="flex flex-col md:flex-row gap-3">
                  <button 
                    onClick={handleExportCatalog}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-widest"
                  >
                    <Download size={14} /> CSV Report
                  </button>
                  <div className="relative">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={14} />
                     <input type="text" placeholder="Search items..." className="w-full pl-10 pr-6 py-2.5 rounded-full bg-white border border-slate-100 focus:outline-none text-[10px] font-bold text-black" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl lg:rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left min-w-[500px]">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 lg:px-10 py-4 lg:py-8 text-[9px] lg:text-[11px] font-black text-black uppercase tracking-[0.2em]">Item</th>
                        <th className="hidden lg:table-cell px-6 lg:px-10 py-8 text-[11px] font-black text-black uppercase tracking-[0.3em]">Class</th>
                        <th className="px-6 lg:px-10 py-4 lg:py-8 text-[9px] lg:text-[11px] font-black text-black uppercase tracking-[0.2em]">Price</th>
                        <th className="px-6 lg:px-10 py-4 lg:py-8 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 lg:px-10 py-4 flex items-center gap-3 lg:gap-6">
                            <img src={p.media[0].url} className="w-10 h-10 lg:w-16 lg:h-16 rounded-lg object-cover shadow-sm"/>
                            <div>
                              <span className="font-black text-[11px] lg:text-base text-black block truncate max-w-[120px] lg:max-w-none">{p.name}</span>
                            </div>
                          </td>
                          <td className="hidden lg:table-cell px-10 py-6">
                            <span className="text-[10px] font-black uppercase text-black px-4 py-2 bg-slate-100 rounded-full">{p.category}</span>
                          </td>
                          <td className="px-6 lg:px-10 py-4 font-black text-xs lg:text-lg text-black">৳{p.price}</td>
                          <td className="px-6 lg:px-10 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                               <button onClick={() => downloadAsWebP(p.media[0].url, p.name)} className="p-2.5 bg-white text-black rounded-lg hover:text-[#00c4cc] border border-slate-100 shadow-sm"><FileImage size={14}/></button>
                               <button onClick={() => onDeleteProduct(p.id)} className="p-2.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14}/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'add-product' && (
            <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-12 pb-20">
              <h2 className="text-2xl lg:text-5xl font-black text-black tracking-tight">Publish Item.</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
                <div className="space-y-5 bg-white p-5 md:p-8 lg:p-12 rounded-xl lg:rounded-[4rem] border border-slate-100 shadow-sm">
                  <div className="space-y-2">
                    <label className="text-[9px] lg:text-[11px] font-black text-black uppercase tracking-[0.2em] ml-2">Name</label>
                    <input type="text" className="w-full px-5 py-3 rounded-lg lg:rounded-[2rem] bg-slate-50 focus:bg-white outline-none font-bold text-black border border-transparent focus:border-[#00c4cc]/20" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})}/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] lg:text-[11px] font-black text-black uppercase tracking-[0.2em] ml-2">Price</label>
                      <input type="number" className="w-full px-5 py-3 rounded-lg lg:rounded-[2rem] bg-slate-50 focus:bg-white outline-none font-black text-black border border-transparent focus:border-[#00c4cc]/20" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})}/>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] lg:text-[11px] font-black text-black uppercase tracking-[0.2em] ml-2">Category</label>
                      <select className="w-full px-5 py-3 rounded-lg lg:rounded-[2rem] bg-slate-50 focus:bg-white outline-none font-black text-[9px] uppercase text-black border border-transparent focus:border-[#00c4cc]/20" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value as Category})}>
                        {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] lg:text-[11px] font-black text-black uppercase tracking-[0.2em] ml-2">Description</label>
                    <textarea className="w-full px-5 py-3 rounded-lg lg:rounded-[2rem] bg-slate-50 focus:bg-white outline-none font-medium h-24 lg:h-48 resize-none text-black border border-transparent focus:border-[#00c4cc]/20" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}/>
                  </div>
                </div>

                <div className="space-y-5 bg-white p-5 md:p-8 lg:p-12 rounded-xl lg:rounded-[4rem] border border-slate-100 shadow-sm">
                  <div onClick={() => fileInputRef.current?.click()} className="border-2 md:border-4 border-dashed border-slate-100 bg-slate-50 rounded-xl lg:rounded-[3rem] h-40 md:h-80 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all">
                    <ImageIcon className="w-8 h-8 md:w-12 md:h-12 text-black mb-3" />
                    <p className="text-[9px] md:text-[10px] font-black text-black uppercase tracking-[0.2em]">Select Assets</p>
                    <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileUpload}/>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {newProduct.media.map((m, i) => (
                      <div key={i} className="aspect-square bg-slate-100 rounded-lg lg:rounded-[1.5rem] overflow-hidden relative group">
                        <img src={m.url} className="w-full h-full object-cover"/>
                        <button type="button" onClick={() => removeMedia(i)} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><X size={16}/></button>
                      </div>
                    ))}
                  </div>

                  <button 
                    disabled={isSubmitting} 
                    type="submit" 
                    className="w-full py-4 md:py-6 bg-slate-900 text-white rounded-lg lg:rounded-[2rem] font-black uppercase tracking-[0.3em] text-[9px] md:text-[10px] shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? 'Syncing...' : 'Confirm Listing'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6 lg:space-y-12">
              <h2 className="text-2xl lg:text-5xl font-black text-black tracking-tight">Intelligence.</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12">
                <div className="bg-white p-6 md:p-16 rounded-xl lg:rounded-[4rem] border border-slate-100">
                  <h3 className="text-base lg:text-2xl font-black text-black tracking-tight mb-8">Performance Funnel</h3>
                  <div className="space-y-6">
                    {['Views', 'Clicks', 'Orders'].map((step, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-[8px] md:text-[9px] font-black uppercase tracking-widest text-black">
                          <span>{step}</span>
                          <span>{100 - i * 30}%</span>
                        </div>
                        <div className="h-2 md:h-3 bg-slate-50 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${100 - i * 30}%` }} className="h-full bg-[#00c4cc]"/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
