import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock } from 'lucide-react';

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      
      // Targetting June 20, 2026
      const birthday = new Date(2026, 5, 20); // Month is 0-indexed (5 = June)
      
      const difference = birthday.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeBlocks = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.minutes },
    { label: 'Secs', value: timeLeft.seconds },
  ];

  return (
    <section className="w-full mt-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center p-8 md:p-12 bg-white rounded-3xl border border-[var(--theme-brand-light)] shadow-sm relative overflow-hidden group transition-all duration-500"
      >
        {/* Decorative Background Accents */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--theme-brand-light)] rounded-full filter blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--theme-brand-light)] rounded-full filter blur-3xl opacity-30 -translate-x-1/2 translate-y-1/2 group-hover:scale-110 transition-transform duration-700"></div>

        <div className="p-4 bg-[var(--theme-brand-light)] rounded-full mb-6 shadow-sm border border-white z-10 relative">
          <Clock className="w-6 h-6 text-[var(--theme-brand)] transition-colors duration-500" />
        </div>
        
        <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-[var(--theme-brand)] mb-2 z-10 relative transition-colors duration-500">Until The Next Era</h2>
        <p className="font-serif italic text-2xl md:text-3xl text-[var(--theme-text-main)] mb-10 z-10 relative text-center transition-colors duration-500">Counting down to your next birthday...</p>

        <div className="flex flex-wrap justify-center gap-4 md:gap-8 z-10 relative w-full mb-10">
          {timeBlocks.map((block, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-[#f8f9fa] rounded-2xl border-4 border-white shadow-md flex items-center justify-center mb-3 transform hover:-translate-y-2 hover:shadow-lg transition-all duration-300">
                <span className="font-serif italic text-3xl md:text-5xl text-[var(--theme-text-main)] transition-colors duration-500">
                  {block.value.toString().padStart(2, '0')}
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold text-[#b2bec3] tracking-widest">{block.label}</span>
            </div>
          ))}
        </div>

        <p className="font-serif italic text-lg text-[var(--theme-text-soft)] max-w-lg text-center z-10 relative transition-colors duration-500">
          "Because every second until we celebrate you again is a second worth counting. I can't wait for all the memories we'll make before then."
        </p>
      </motion.div>
    </section>
  );
}
