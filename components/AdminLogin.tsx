
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, ChevronLeft } from 'lucide-react';
import { User as UserType } from '../types';

interface AdminLoginProps {
  onSuccess: (admin: UserType) => void;
  onCancel: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Updated Merchant Credentials
    const ADMIN_EMAIL = 'provatkarmoker44@gmail.com';
    const ADMIN_PASSWORD = 'moment@2025';

    setTimeout(() => {
      if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminUser: UserType = {
          id: 'admin_master',
          name: 'Chief Merchant',
          email: ADMIN_EMAIL,
          role: 'admin'
        };
        onSuccess(adminUser);
      } else {
        setError('Unauthorized: Incorrect Admin Email or Security Key.');
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-[#f4f7f6] flex items-center justify-center p-4 z-[1000]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-[#7d2ae8]/20 to-[#00c4cc]/20 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00c4cc]/10 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-5xl rounded-[3rem] shadow-[0_32px_120px_-20px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col md:flex-row relative z-10 border border-white"
      >
        {/* Left Panel: Brand Experience */}
        <div className="md:w-5/12 bg-gradient-to-br from-[#7d2ae8] via-[#00c4cc] to-[#33e1ed] p-16 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <button 
              onClick={onCancel}
              className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-white/80 hover:text-white transition-all mb-16 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20"
            >
              <ChevronLeft size={14} /> Back to Storefront
            </button>
            <div className="w-20 h-20 bg-white rounded-[1.8rem] flex items-center justify-center mb-10 shadow-2xl">
              <Shield size={32} className="text-[#7d2ae8]" />
            </div>
            <h2 className="text-5xl font-serif font-bold mb-6 leading-tight">Merchant<br />Hub.</h2>
            <p className="text-white/80 text-lg font-medium leading-relaxed max-w-[280px]">
              Access your workspace to manage your unique gift collection.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Security: AES-256 Active</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Auth Form */}
        <div className="w-full md:w-7/12 p-12 md:p-24 bg-white flex flex-col justify-center">
          <div className="mb-14 text-center md:text-left">
            <h3 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Login</h3>
            <p className="text-slate-400 text-lg font-medium">Verify your merchant credentials.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Admin Email</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#00c4cc] transition-all" size={20} />
                <input
                  type="email"
                  required
                  placeholder="admin@example.com"
                  className="w-full pl-16 pr-8 py-6 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-[#00c4cc]/30 focus:bg-white text-slate-900 font-bold transition-all outline-none shadow-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Security Key</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#7d2ae8] transition-all" size={20} />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-16 pr-8 py-6 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-[#7d2ae8]/30 focus:bg-white text-slate-900 font-bold transition-all outline-none shadow-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-4 p-6 bg-red-50 border border-red-100 rounded-[1.5rem] text-red-600 text-sm font-black uppercase tracking-widest"
                >
                  <AlertCircle size={20} /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                type="submit"
                className="w-full bg-slate-900 text-white py-7 rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs flex items-center justify-center gap-4 hover:bg-[#7d2ae8] transition-all shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Enter Workspace'} <ArrowRight size={22} />
              </motion.button>
              
              <p className="mt-12 text-center text-[10px] text-slate-300 font-black uppercase tracking-[0.4em]">
                Protected by Precious Moments Security Engine
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
