
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, Facebook, Phone } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: UserType) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin && !formData.name) {
      setError('Please enter your name');
      return;
    }

    // Simulating authentication
    const mockUser: UserType = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      role: 'user'
    };

    onLogin(mockUser);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-rose-500 transition-colors z-10"
        >
          <X size={24} />
        </button>

        <div className="p-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Join the Club'}
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              {isLogin ? 'Login to access your saved gifts' : 'Create an account for personalized updates'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-rose-500/10 font-bold text-slate-900 placeholder:text-slate-400 transition-all outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-rose-500/10 font-bold text-slate-900 placeholder:text-slate-400 transition-all outline-none"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-rose-500/10 font-bold text-slate-900 placeholder:text-slate-400 transition-all outline-none"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            {error && <p className="text-rose-500 text-xs font-bold text-center">{error}</p>}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-rose-500 transition-all shadow-xl shadow-slate-200"
            >
              {isLogin ? 'Login' : 'Sign Up'} <ArrowRight size={16} />
            </motion.button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4 w-full">
              <div className="h-px bg-slate-100 flex-grow"></div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Or continue with</span>
              <div className="h-px bg-slate-100 flex-grow"></div>
            </div>

            <div className="flex gap-4">
              <button 
                title="Continue with Facebook"
                className="p-4 bg-slate-50 rounded-2xl text-[#1877F2] hover:bg-slate-100 transition-all shadow-sm"
              >
                <Facebook size={20} />
              </button>
              <button 
                title="Continue with Phone Number"
                className="p-4 bg-slate-50 rounded-2xl text-slate-600 hover:bg-slate-100 transition-all shadow-sm"
              >
                <Phone size={20} />
              </button>
            </div>

            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-bold text-slate-500 hover:text-rose-500 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AuthModal;
