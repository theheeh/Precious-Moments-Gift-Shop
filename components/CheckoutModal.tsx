
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, CreditCard, ShieldCheck, Truck, CheckCircle2, ChevronRight, Phone, Mail, User } from 'lucide-react';
import { CartItem, Order, User as UserType } from '../types';

interface CheckoutModalProps {
  cart: CartItem[];
  total: number;
  onClose: () => void;
  onSuccess: (order: Order) => void;
  user: UserType | null;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ cart, total, onClose, onSuccess, user }) => {
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirm'>('shipping');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    payment: 'COD' as 'Card' | 'Mobile Banking' | 'COD'
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newOrder: Order = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        date: Date.now(),
        status: 'Pending',
        totalAmount: total,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: formData.address,
        paymentMethod: formData.payment,
        productNames: cart.map(i => i.name),
        items: cart.reduce((acc, i) => acc + i.quantity, 0),
        image: cart[0].media[0].url
      };
      setIsProcessing(false);
      setStep('confirm');
      setTimeout(() => onSuccess(newOrder), 2500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-10 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white"><ShieldCheck size={20}/></div>
            <h2 className="text-2xl font-black text-slate-900">Secure Checkout</h2>
          </div>
          <button onClick={onClose} className="p-3 hover:text-rose-500 transition-colors"><X/></button>
        </div>

        <div className="flex-grow overflow-y-auto p-10 no-scrollbar">
          <AnimatePresence mode="wait">
            {step === 'shipping' && (
              <motion.form key="ship" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleSubmitShipping} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Shipping Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest ml-4">Full Name</label>
                      <input required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}/>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest ml-4">Phone Number</label>
                      <input required type="tel" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none font-bold" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}/>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest ml-4">Email Address</label>
                    <input required type="email" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none font-bold" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest ml-4">Full Delivery Address</label>
                    <textarea required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none font-medium h-32 resize-none" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}/>
                  </div>
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3">Continue to Payment <ChevronRight size={16}/></button>
              </motion.form>
            )}

            {step === 'payment' && (
              <motion.div key="pay" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Select Payment Method</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { id: 'Card', label: 'Credit / Debit Card', icon: <CreditCard/> },
                      { id: 'Mobile Banking', label: 'bKash / Nagad', icon: <Phone/> },
                      { id: 'COD', label: 'Cash on Delivery', icon: <Truck/> }
                    ].map(method => (
                      <button key={method.id} onClick={() => setFormData({...formData, payment: method.id as any})} className={`w-full p-6 rounded-3xl border-2 flex items-center justify-between transition-all ${formData.payment === method.id ? 'border-rose-500 bg-rose-50/50' : 'border-slate-50 bg-slate-50/30 hover:border-slate-200'}`}>
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${formData.payment === method.id ? 'bg-rose-500 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>{method.icon}</div>
                          <span className="font-bold text-slate-900">{method.label}</span>
                        </div>
                        {formData.payment === method.id && <CheckCircle2 size={24} className="text-rose-500"/>}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
                  <div className="flex justify-between items-center mb-4"><span className="text-xs font-black uppercase tracking-widest opacity-60">Subtotal</span><span className="font-bold">৳{total}</span></div>
                  <div className="flex justify-between items-center mb-8 border-t border-white/10 pt-4"><span className="text-xs font-black uppercase tracking-widest opacity-60">Delivery Fee</span><span className="font-bold">৳100</span></div>
                  <div className="flex justify-between items-end"><span className="text-lg font-black uppercase tracking-widest">Total Payable</span><span className="text-3xl font-black tabular-nums">৳{total + 100}</span></div>
                </div>
                <button disabled={isProcessing} onClick={handlePlaceOrder} className="w-full bg-rose-500 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-rose-200">{isProcessing ? 'Processing Secure Transaction...' : 'Complete Purchase'}</button>
              </motion.div>
            )}

            {step === 'confirm' && (
              <motion.div key="confirm" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-8"><CheckCircle2 size={48} className="animate-bounce"/></div>
                <h3 className="text-4xl font-black text-slate-900 mb-4">Treasure Secured!</h3>
                <p className="text-slate-400 max-w-xs mx-auto mb-10">Your order has been placed successfully. We've sent a confirmation to your email.</p>
                <div className="bg-slate-50 p-6 rounded-2xl w-full max-w-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Delivery</p><p className="font-bold text-slate-900">3-5 Business Days</p></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutModal;
