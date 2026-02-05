
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User as UserIcon, 
  ShoppingBag, 
  Heart, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Star, 
  Package, 
  Clock, 
  CreditCard,
  Bell,
  MapPin,
  ShieldCheck,
  Gift,
  Sparkles
} from 'lucide-react';
import { User, Product } from '../types';

interface UserProfileProps {
  user: User;
  onLogout: () => void;
  onClose: () => void;
  products: Product[];
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout, onClose, products }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wishlist' | 'settings'>('overview');

  const wishlistProducts = products.filter(p => user.wishlist?.includes(p.id));
  
  const displayOrders = user.orders || [
    { id: 'ORD-5542', date: Date.now() - 86400000, status: 'Shipped', total: 2500, items: 2, image: products[0]?.media[0]?.url },
    { id: 'ORD-9912', date: Date.now() - 500000000, status: 'Delivered', total: 850, items: 1, image: products[1]?.media[0]?.url }
  ];

  const stats = [
    { label: 'Active Orders', value: '02', icon: <Package />, color: 'rose' },
    { label: 'Wishlist', value: wishlistProducts.length.toString().padStart(2, '0'), icon: <Heart />, color: 'rose' },
    { label: 'Precious Points', value: (user.points || 450).toString(), icon: <Gift />, color: 'emerald' }
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#f8fafc] w-full max-w-5xl h-[85vh] rounded-[3rem] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white"
      >
        <div className="w-full md:w-72 bg-white border-r border-slate-100 flex flex-col p-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
              <UserIcon size={28} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 leading-tight">{user.name}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Premium Member</p>
            </div>
          </div>

          <nav className="flex-grow space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: <UserIcon size={18} /> },
              { id: 'orders', label: 'My Orders', icon: <ShoppingBag size={18} /> },
              { id: 'wishlist', label: 'Wishlist', icon: <Heart size={18} /> },
              { id: 'settings', label: 'Account Settings', icon: <Settings size={18} /> }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                  activeTab === item.id 
                  ? 'bg-rose-500 text-white shadow-xl shadow-rose-200' 
                  : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                </div>
                <ChevronRight size={14} className={activeTab === item.id ? 'opacity-100' : 'opacity-0'} />
              </button>
            ))}
          </nav>

          <div className="pt-8 border-t border-slate-100 space-y-3">
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 p-4 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all text-xs font-black uppercase tracking-widest"
            >
              <LogOut size={18} /> Sign Out
            </button>
            <button 
              onClick={onClose}
              className="w-full p-4 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
            >
              Back to Shop
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-8 md:p-12 no-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Profile Overview</h2>
                  <div className="flex items-center gap-4">
                    <button className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 hover:text-rose-500 transition-colors">
                      <Bell size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {stats.map((stat, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 text-${stat.color}-500 flex items-center justify-center mb-6`}>
                        {stat.icon}
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                      <h4 className="text-3xl font-black text-slate-900">{stat.value}</h4>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Sparkles size={200} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                      <ShieldCheck className="text-rose-500" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">Elite Tier Membership</span>
                    </div>
                    <h3 className="text-4xl font-black mb-4">Loyalty Progress</h3>
                    <p className="text-slate-400 mb-10 max-w-sm text-sm font-medium">Earn 50 more points to unlock a ৳500 Discount Voucher for your next purchase!</p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span>Silver Level</span>
                        <span>450 / 500 PTS</span>
                      </div>
                      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '90%' }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-rose-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div 
                key="orders"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Recent Orders</h2>
                <div className="space-y-4">
                  {displayOrders.map((order, i) => (
                    <motion.div 
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6 group hover:shadow-xl transition-all"
                    >
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50">
                        <img src={order.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-black text-slate-900">{order.id}</span>
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-400 text-xs font-bold">
                          <span className="flex items-center gap-1"><Clock size={14} /> {new Date(order.date).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><Package size={14} /> {order.items} Items</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Grand Total</p>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tighter">৳{order.total}</h4>
                      </div>
                      <button className="p-4 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-rose-500 group-hover:text-white transition-all">
                        <ChevronRight size={20} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'wishlist' && (
              <motion.div 
                key="wishlist"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Saved Treasures</h2>
                  <span className="text-[10px] font-black bg-rose-50 text-rose-500 px-4 py-2 rounded-xl uppercase tracking-widest">
                    {wishlistProducts.length} Items
                  </span>
                </div>
                
                {wishlistProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {wishlistProducts.map(p => (
                      <div key={p.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex gap-5">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                          <img src={p.media[0].url} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-grow flex flex-col justify-center">
                          <h4 className="font-bold text-slate-900 text-sm mb-2">{p.name}</h4>
                          <span className="text-rose-500 font-black">৳{p.price}</span>
                          <div className="flex gap-2 mt-3">
                            <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 transition-all">Move to Cart</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                    <Heart size={48} className="text-slate-200 mx-auto mb-4" />
                    <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Your wishlist is empty</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="space-y-10"
              >
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
                      <input 
                        defaultValue={user.name}
                        className="w-full px-8 py-5 rounded-[1.5rem] bg-white border border-slate-100 focus:border-rose-500 transition-all outline-none font-bold text-slate-900 shadow-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
                      <input 
                        disabled
                        defaultValue={user.email}
                        className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 opacity-50 font-bold text-slate-900 shadow-sm cursor-not-allowed"
                      />
                    </div>
                    <button className="bg-slate-900 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-rose-500 transition-all">Save Changes</button>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                      <h4 className="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2">
                        <CreditCard size={14} /> Payment Methods
                      </h4>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-6 bg-slate-900 rounded-md"></div>
                          <span className="text-xs font-bold text-slate-600">•••• 4412</span>
                        </div>
                        <span className="text-[9px] font-black text-slate-400">EXPIRED</span>
                      </div>
                      <button className="text-[10px] font-black uppercase text-rose-500 hover:underline">+ Add New Card</button>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                      <h4 className="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2">
                        <MapPin size={14} /> Saved Addresses
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mb-4">{user.name}, House 45, Road 12, Uttara, Dhaka</p>
                      <button className="text-[10px] font-black uppercase text-rose-500 hover:underline">Edit Address</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;
