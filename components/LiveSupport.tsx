
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Sparkles, Headphones, Clock } from 'lucide-react';
import { SHOP_INFO } from '../types';

const LiveSupport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<{from: 'bot' | 'user', text: string}[]>([
    { from: 'bot', text: 'Hi there! 👋 How can we help you find the perfect gift today?' }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    const userMsg = message;
    setChat([...chat, { from: 'user', text: userMsg }]);
    setMessage('');
    
    // Simulated response
    setTimeout(() => {
      setChat(prev => [...prev, { from: 'bot', text: "Thanks for reaching out! One of our gift consultants will be with you shortly. Or you can WhatsApp us for an instant reply! ✨" }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[150] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[380px] h-[550px] bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col mb-6"
          >
            <div className="bg-slate-900 p-8 text-white relative">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles size={100}/></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center"><Headphones size={24}/></div>
                <div><h3 className="font-black text-lg">Gift Assistant</h3><div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/> Online Now</div></div>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-8 space-y-6 no-scrollbar bg-slate-50/30">
              <div className="text-center mb-8"><span className="px-4 py-2 bg-white rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400 shadow-sm border border-slate-100 flex items-center gap-2 w-fit mx-auto"><Clock size={12}/> Average reply: < 2 mins</span></div>
              {chat.map((m, i) => (
                <motion.div initial={{ opacity: 0, x: m.from === 'bot' ? -10 : 10 }} animate={{ opacity: 1, x: 0 }} key={i} className={`flex ${m.from === 'bot' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] p-5 rounded-[1.8rem] text-sm font-medium ${m.from === 'bot' ? 'bg-white text-slate-600 rounded-bl-none shadow-sm' : 'bg-rose-500 text-white rounded-br-none shadow-lg shadow-rose-200'}`}>{m.text}</div>
                </motion.div>
              ))}
            </div>

            <form onSubmit={handleSend} className="p-8 bg-white border-t border-slate-100 flex gap-3">
              <input type="text" placeholder="Type your question..." className="flex-grow bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-rose-500/5 transition-all outline-none" value={message} onChange={e => setMessage(e.target.value)}/>
              <button type="submit" className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-rose-500 transition-all shadow-xl"><Send size={20}/></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-20 h-20 rounded-[2.2rem] flex items-center justify-center shadow-2xl transition-all duration-500 ${isOpen ? 'bg-slate-900 text-white rotate-90' : 'bg-rose-500 text-white shadow-rose-200'}`}
      >
        {isOpen ? <X size={32} /> : <MessageCircle size={32} strokeWidth={2.5} />}
      </motion.button>
    </div>
  );
};

export default LiveSupport;
