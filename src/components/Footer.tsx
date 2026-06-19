import { Heart } from 'lucide-react';
import { motion } from 'motion/react';

export function Footer() {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="pt-6 border-t border-[#f1f2f6] flex flex-col md:flex-row justify-between items-center relative z-10 w-full gap-6"
    >
      <p className="text-[11px] uppercase tracking-[0.4em] font-medium text-[#95a5a6] text-center md:text-left text-balance flex items-center justify-center gap-2">
        Made with <Heart className="w-3 h-3 text-[#ff758f] fill-[#ff758f]" /> for my bestie
      </p>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎂</span>
          <span className="text-xs font-bold text-[#636e72]">MAKE A WISH</span>
        </div>
      </div>
    </motion.footer>
  );
}
