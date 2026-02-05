
import React, { useState, useEffect } from 'react';
import { MapPin, Shield, Store, ExternalLink, ShoppingCart, User as UserIcon, LogOut, ChevronDown, Lock } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { SHOP_INFO, User } from '../types';

interface HeaderProps {
  isAdmin: boolean;
  onToggleAdmin: () => void;
  cartCount: number;
  onCartClick: () => void;
  currentUser: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  isAdmin, 
  onToggleAdmin, 
  cartCount, 
  onCartClick, 
  currentUser, 
  onLoginClick,
  onLogout,
  onProfileClick
}) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const headerHeight = useTransform(scrollY, [0, 100], ['5.5rem', '4.5rem'], { clamp: true });
  const desktopHeaderHeight = useTransform(scrollY, [0, 100], ['7rem', '6rem'], { clamp: true });

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <header className="sticky top-0 z-[60] w-full">
      <AnimatePresence>
        {!isScrolled && (
          <motion.div 
            initial={{ height: 'auto', opacity: 1 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#00c4cc] text-white px-4 md:px-10 py-2.5 flex flex-col md:flex-row justify-between items-center text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] overflow-hidden gap-3 md:gap-0"
          >
            <div className="flex items-center justify-center gap-4 md:gap-10 w-full md:w-auto">
              <a 
                href={SHOP_INFO.googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 md:gap-3 hover:text-slate-900 transition-colors"
              >
                <MapPin size={12} className="text-white flex-shrink-0" /> 
                <span className="truncate max-w-[280px] md:max-w-none">{SHOP_INFO.address}</span>
              </a>
            </div>
            <div className="flex items-center justify-center gap-6 md:gap-10 border-t border-white/10 md:border-t-0 pt-2.5 md:pt-0 w-full md:w-auto">
              <button 
                onClick={onToggleAdmin}
                className="hover:text-slate-900 transition-colors flex items-center gap-2 md:gap-3 group border-r border-white/20 pr-6 md:pr-10"
              >
                <Lock size={12} className="text-white" /> Merchant Hub
              </button>
              <a 
                href={SHOP_INFO.googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-slate-900 transition-colors flex items-center gap-2 md:gap-3 group"
              >
                Directions <ExternalLink size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        style={{ 
          height: typeof window !== 'undefined' && window.innerWidth < 768 ? headerHeight : desktopHeaderHeight,
          backgroundColor: `rgba(255, 255, 255, ${isScrolled ? 0.98 : 0.9})`,
          backdropFilter: `blur(${isScrolled ? '48px' : '24px'})`
        }}
        className={`border-b border-slate-100 shadow-sm transition-shadow duration-500 ${isScrolled ? 'shadow-2xl shadow-[#00c4cc]/5' : ''}`}
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-10 h-full flex items-center justify-between">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2.5 md:gap-5 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-9 h-9 md:w-14 md:h-14 bg-gradient-to-tr from-[#7d2ae8] to-[#00c4cc] rounded-lg md:rounded-2xl flex items-center justify-center text-white shadow-xl">
              <Store strokeWidth={2.5} className="w-5 h-5 md:w-7 md:h-7" />
            </div>
            <div>
              <h1 className="text-base md:text-3xl font-bold font-serif text-slate-900 leading-tight">
                Precious<span className="text-[#00c4cc]">Moments</span>
              </h1>
            </div>
          </motion.div>

          <div className="flex items-center gap-2 md:gap-8">
            <div className="flex items-center md:pr-6 md:border-r md:border-slate-100">
              {currentUser ? (
                <div 
                  className="relative"
                  onMouseEnter={() => setShowUserMenu(true)}
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <button className="flex items-center gap-2 md:gap-5 group">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] md:text-[11px] font-black text-slate-900 uppercase group-hover:text-[#00c4cc] transition-colors">{currentUser.name}</p>
                      <p className="text-[8px] md:text-[9px] text-[#00c4cc] font-black uppercase tracking-widest">{currentUser.points || 450} Points</p>
                    </div>
                    <div className="w-9 h-9 md:w-12 md:h-12 bg-slate-50 rounded-lg md:rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-[#00c4cc] group-hover:text-white transition-all shadow-sm">
                      <UserIcon className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        className="absolute right-0 top-full pt-4 w-56 md:w-64 z-50"
                      >
                        <div className="bg-white rounded-xl md:rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] border border-slate-100 p-2 md:p-3 overflow-hidden">
                          <button 
                            onClick={onProfileClick}
                            className="w-full flex items-center gap-3 md:gap-4 p-3.5 md:p-5 rounded-lg md:rounded-2xl hover:bg-slate-50 text-slate-600 hover:text-[#00c4cc] transition-all text-[9px] md:text-xs font-black uppercase tracking-widest"
                          >
                            <UserIcon className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" /> Profile Workspace
                          </button>
                          {/* Mobile Admin Link inside user menu */}
                          <button 
                            onClick={onToggleAdmin}
                            className="md:hidden w-full flex items-center gap-3 p-3.5 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-[#7d2ae8] transition-all text-[9px] font-black uppercase tracking-widest"
                          >
                            <Lock className="w-3.5 h-3.5" /> Merchant Hub
                          </button>
                          <button 
                            onClick={onLogout}
                            className="w-full flex items-center gap-3 md:gap-4 p-3.5 md:p-5 rounded-lg md:rounded-2xl hover:bg-red-50 text-slate-600 hover:text-red-500 transition-all text-[9px] md:text-xs font-black uppercase tracking-widest"
                          >
                            <LogOut className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" /> Terminate Session
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {/* Compact Admin shortcut for mobile guests */}
                  <button 
                    onClick={onToggleAdmin}
                    className="md:hidden w-9 h-9 flex items-center justify-center bg-slate-50 text-slate-400 rounded-lg hover:bg-[#7d2ae8] hover:text-white transition-all"
                  >
                    <Lock size={16} />
                  </button>
                  <button 
                    onClick={onLoginClick}
                    className="px-4 md:px-10 py-2.5 md:py-4 rounded-lg md:rounded-full bg-slate-900 text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-[#7d2ae8] transition-all shadow-xl whitespace-nowrap"
                  >
                    Client Access
                  </button>
                </div>
              )}
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCartClick}
              className={`relative p-3 md:p-5 rounded-lg md:rounded-3xl transition-all group ${
                isScrolled ? 'bg-[#00c4cc] text-white shadow-2xl shadow-[#00c4cc]/30' : 'bg-slate-900 text-white shadow-xl shadow-slate-900/20'
              }`}
            >
              <ShoppingCart strokeWidth={2.5} className="w-[18px] h-[18px] md:w-7 md:h-7" />
              {cartCount > 0 && (
                <motion.span 
                  layoutId="cartBadge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`absolute -top-1 -right-1 md:-top-2 md:-right-2 text-[7px] md:text-[11px] font-black w-4 h-4 md:w-8 md:h-8 rounded-full flex items-center justify-center border-2 md:border-4 border-white shadow-2xl ${
                    isScrolled ? 'bg-slate-900 text-white' : 'bg-[#00c4cc] text-white'
                  }`}
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </header>
  );
};

export default Header;
