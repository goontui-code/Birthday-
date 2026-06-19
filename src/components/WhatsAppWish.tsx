import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Send, Sparkles, AlertCircle } from 'lucide-react';

export function WhatsAppWish() {
  const WHATSAPP_NUMBER = '+918630936140';
  
  const presets = [
    {
      id: 'sweet',
      label: 'Warm 💖',
      text: 'Wishing the sweetest birthday to my dearest friend! You make every single moment brighter. Have a wonderful year ahead! 🎉🎂🎁'
    },
    {
      id: 'divine',
      label: 'Divine 🔱',
      text: 'Har Har Mahadev! 🔱 Sending you divine blessings and warmest wishes on your auspicious birthday. May you always shine bright! ✨🌸'
    },
    {
      id: 'classic',
      label: 'Classic 🍰',
      text: 'Happy Birthday! 🎂 May your day be filled with endless laughter, sweet surprises, and lots of delicious chocolate cake! 🍫✨'
    }
  ];

  const [message, setMessage] = useState(presets[0].text);

  const handleSendWish = () => {
    if (!message.trim()) return;
    
    // Clean phone number format for WhatsApp link
    const cleanNumber = WHATSAPP_NUMBER.replace(/[^0-9]/g, '');
    const url = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodeURIComponent(message)}`;
    
    // Open in a new tab securely
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--theme-brand-light)] flex flex-col transition-all duration-500 hover:shadow-md"
    >
      <div className="mb-4">
        <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--theme-brand)] flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" />
          Send WhatsApp Wish
        </h2>
        <p className="font-serif italic text-[11px] text-gray-400 mt-1">
          Have a heartfelt wish? Send it directly to +91 86309 36140!
        </p>
      </div>

      {/* Preset Selectors */}
      <div className="flex flex-wrap gap-1.5 mb-3.5">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => setMessage(preset.text)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all duration-300 ${
              message === preset.text
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm scale-102'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-100/50'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Message Text area field */}
      <div className="relative mb-4">
        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your heartwarming birthday wish here..."
          className="w-full text-xs p-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all resize-none shadow-inner text-gray-700"
        />
        <div className="absolute right-2.5 bottom-2.5 pointer-events-none">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* Call To Action Send Button */}
      <button
        onClick={handleSendWish}
        disabled={!message.trim()}
        className="w-full group inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-[var(--theme-brand)] hover:bg-[var(--theme-brand-dark)] disabled:opacity-50 text-white rounded-xl text-[11px] font-extrabold tracking-widest shadow-md hover:shadow-lg active:scale-98 transition-all uppercase"
      >
        <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        Send Wish to WhatsApp
      </button>

      {/* Subtext info */}
      <span className="text-[9px] text-center text-gray-400 mt-2 flex items-center justify-center gap-1">
        <AlertCircle className="w-2.5 h-2.5 text-neutral-300" />
        This will open WhatsApp or WhatsApp Web application
      </span>
    </motion.section>
  );
}
