import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Sparkles } from 'lucide-react';
import { playBirthdaySong } from '../lib/song';
import { fireConfetti } from '../lib/confetti';

interface FloatingChocolate {
  id: number;
  x: number;
  y: number;
  icon: string;
  size: number;
  rotate: number;
}

export function BirthdayCake() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [chocolateType, setChocolateType] = useState<'dark' | 'milk' | 'caramel'>('dark');
  const [floatingChocs, setFloatingChocs] = useState<FloatingChocolate[]>([]);

  // Get color variables based on selected chocolate type
  const getChocolateColors = () => {
    switch (chocolateType) {
      case 'milk':
        return {
          primary: 'bg-[#7c5135]', // Milk chocolate brown
          secondary: 'bg-[#916244]', // Lighter creamy brown
          drip: 'bg-[#5c371f]', // Deep syrup
          accent: 'border-[#dfb495]',
          plate: 'from-[#dfb495] via-[#f1dcd0] to-[#dfb495]',
          label: 'Milk Chocolate 🥛'
        };
      case 'caramel':
        return {
          primary: 'bg-[#b47a3e]', // Warm caramel/toffee brown
          secondary: 'bg-[#ca8e4d]', // Sweet caramel amber
          drip: 'bg-[#835221]', // Deep caramel glaze
          accent: 'border-[#fbe4c5]',
          plate: 'from-[#f5cca0] via-[#fbe4c5] to-[#f5cca0]',
          label: 'Salted Caramel 🍯'
        };
      case 'dark':
      default:
        return {
          primary: 'bg-[#2b170c]', // Darkest cacao
          secondary: 'bg-[#3d2314]', // Rich brown
          drip: 'bg-[#1b0c05]', // Velvet dark fudge
          accent: 'border-[#7a5441]',
          plate: 'from-[#c3a492] via-[#e8dcd5] to-[#c3a492]',
          label: 'Rich Dark Cacao 🍫'
        };
    }
  };

  const colors = getChocolateColors();

  const handleCelebrate = (e?: React.MouseEvent) => {
    // Generate floating treats
    const treats = ['🍫', '🍩', '🍪', '🍬', '🍭', '🧁', '🍓'];
    const newChoc: FloatingChocolate = {
      id: Date.now() + Math.random(),
      // Position relative to click, or centered
      x: e ? e.clientX - window.innerWidth / 2 + (Math.random() * 80 - 40) : (Math.random() * 200 - 100),
      y: e ? -50 : -80,
      icon: treats[Math.floor(Math.random() * treats.length)],
      size: Math.random() * 1.5 + 1, // 1x to 2.5x size
      rotate: Math.random() * 360,
    };

    setFloatingChocs(prev => [...prev.slice(-30), newChoc]); // Keep last 30 for performance

    if (clicks < 20) {
      setClicks(prev => prev + 1);
      return;
    }
    
    if (clicks === 20) {
      setClicks(21);
      fireConfetti();
      if (!isPlaying) {
        setIsPlaying(true);
        playBirthdaySong();
        setTimeout(() => setIsPlaying(false), 9000); // 9 sec approx
      }
    } else {
      fireConfetti();
      if (!isPlaying) {
        setIsPlaying(true);
        playBirthdaySong();
        setTimeout(() => setIsPlaying(false), 9000);
      }
    }
  };

  return (
    <section className="w-full mt-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-white to-[#fffbfa] rounded-3xl border border-[#ede1df] shadow-sm relative overflow-hidden group mb-8"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#f5ebe8] rounded-full filter blur-3xl opacity-45 translate-x-1/2 -translate-y-1/2 z-0 group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#fdf8f5] rounded-full filter blur-3xl opacity-45 -translate-x-1/2 translate-y-1/2 group-hover:scale-110 transition-transform duration-700 z-0"></div>
        
        <div className="z-10 relative text-center">
          <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-amber-800/80 mb-1">Make a Wish</h2>
          <p className="text-[10px] text-gray-400 font-serif italic">Tap the cake or chocolates below to sprinkle love!</p>
        </div>

        {/* Dynamic Chocolate Glaze Switcher */}
        <div className="flex gap-2.5 my-5 z-10 relative bg-amber-50/50 p-1.5 rounded-full border border-amber-100/60 backdrop-blur-sm shadow-inner">
          {(['dark', 'milk', 'caramel'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setChocolateType(type)}
              className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                chocolateType === type
                  ? 'bg-[#3d2314] text-[#fff6f0] shadow-md scale-105'
                  : 'text-[#8c6751] hover:bg-amber-100/30'
              }`}
            >
              {type === 'dark' ? '🍫 Dark' : type === 'milk' ? '🥛 Milk' : '🍯 Caramel'}
            </button>
          ))}
        </div>
        
        {/* The Cake Scene Container */}
        <div 
          onClick={handleCelebrate}
          className="relative mt-4 mb-8 z-10 flex flex-col items-center cursor-pointer select-none"
          title="Click to celebrate and pop chocolates!"
        >
          {/* Flame/Glitter Glow Effect */}
          <div className="absolute top-0 w-40 h-40 bg-orange-400/10 rounded-full filter blur-2xl -translate-y-12 animate-pulse pointer-events-none"></div>

          {/* Candle */}
          <div className="relative bottom-[-2px] w-4.5 h-18 bg-gradient-to-r from-amber-400 via-[#fffbeb] to-amber-400 border border-amber-300 rounded-md z-30 flex flex-col items-center shadow-lg">
            {/* Flame */}
            <motion.div 
              animate={{ 
                scale: [1, 1.15, 0.95, 1.2, 0.9, 1.1],
                rotate: [-3, 3, -1.5, 4, -2, 1],
              }}
              transition={{ 
                repeat: Infinity,
                duration: 0.35
              }}
              className="absolute -top-7 w-6 h-9 bg-gradient-to-b from-yellow-100 via-amber-300 to-orange-600 rounded-[50%_50%_20%_20%] shadow-[0_0_25px_8px_rgba(251,191,36,0.75)]"
            >
              {/* Core of the flame */}
              <div className="absolute inset-1.5 bg-white rounded-full opacity-80 blur-[1px]"></div>
            </motion.div>
            
            {/* Candle Striping */}
            <div className="w-full h-full flex flex-col justify-around py-1 opacity-70 pointer-events-none">
              <div className="h-1.5 w-full bg-red-400 -skew-y-12"></div>
              <div className="h-1.5 w-full bg-red-400 -skew-y-12"></div>
              <div className="h-1.5 w-full bg-red-400 -skew-y-12"></div>
            </div>
            
            {/* Wick */}
            <div className="absolute -top-1 w-0.5 h-2 bg-slate-900"></div>
          </div>

          {/* LAYER 1: Top Chocolate Cream Tier */}
          <div className={`w-36 h-14 ${colors.secondary} rounded-[50%] border-2 border-white -mb-8 z-20 shadow-md relative overflow-hidden transition-all duration-500`}>
             {/* frosting spill / details */}
             <div className="absolute top-0 left-2 w-5 h-5 bg-white/20 rounded-full"></div>
             <div className="absolute top-0 left-10 w-8 h-8 bg-white/20 rounded-full"></div>
             <div className="absolute top-0 right-6 w-6 h-6 bg-white/20 rounded-full"></div>
             
             {/* Chocolate shavings / toppings on the top surface */}
             <div className="absolute top-3 w-full flex justify-center gap-1.5 opacity-90">
               <span className="text-[10px]">🍓</span>
               <span className="text-[10px]">🍫</span>
               <span className="text-[10px]">🍓</span>
             </div>
          </div>
          
          <div className={`w-36 h-18 ${colors.primary} border-x-2 border-b-2 border-white rounded-b-2xl z-20 flex flex-col justify-between overflow-hidden transition-all duration-500`}>
             {/* Fudge Drips hanging down */}
             <div className="flex justify-around w-full relative -top-0.5 pointer-events-none">
               <div className={`w-4 h-6 ${colors.drip} rounded-b-full shadow-inner`}></div>
               <div className={`w-5 h-8 ${colors.drip} rounded-b-full shadow-inner`}></div>
               <div className={`w-3 h-4 ${colors.drip} rounded-b-full shadow-inner`}></div>
               <div className={`w-6 h-7 ${colors.drip} rounded-b-full shadow-inner`}></div>
               <div className={`w-4 h-5 ${colors.drip} rounded-b-full shadow-inner`}></div>
             </div>
             
             {/* Chocolate stars / gold sprinkles in middle of tier */}
             <div className="flex justify-center gap-4 pb-2.5">
               <div className="w-1.5 h-3 bg-amber-300 rounded-full rotate-45 animate-pulse"></div>
               <div className="w-1.5 h-3 bg-white/85 rounded-full -rotate-12"></div>
               <div className="w-3 h-3 bg-yellow-400 rotate-12 flex items-center justify-center text-[6px] font-bold text-amber-900 rounded-sm">★</div>
               <div className="w-1.5 h-4 bg-amber-100 rounded-full rotate-12"></div>
             </div>
          </div>

          {/* LAYER 2: Middle Cream Ring (Cream filling visual) */}
          <div className="w-44 h-5 bg-gradient-to-r from-rose-100 via-white to-rose-100 rounded-full -my-3.5 border-y border-white shadow-inner z-15 relative flex justify-around items-center px-4 overflow-hidden">
             {/* Cream swirls */}
             <div className="w-2 h-2 bg-rose-400/40 rounded-full"></div>
             <div className="w-2.5 h-2.5 bg-rose-300/40 rounded-full animate-ping"></div>
             <div className="w-2 h-2 bg-rose-400/40 rounded-full"></div>
             <div className="w-2 h-2 bg-rose-400/40 rounded-full"></div>
          </div>

          {/* LAYER 3: Large Bottom Chocolate Tier */}
          <div className={`w-52 h-16 ${colors.secondary} rounded-[50%] border-2 border-white -mb-10 z-10 shadow-md relative transition-all duration-500`}>
             {/* Edge decoration - Whipped chocolate cream dollops */}
             <div className="absolute top-1 left-4 w-4 h-4 bg-amber-950/40 rounded-full"></div>
             <div className="absolute top-1.5 left-14 w-4.5 h-4.5 bg-amber-950/40 rounded-full"></div>
             <div className="absolute top-2.5 right-12 w-4 h-4 bg-amber-950/40 rounded-full"></div>
             <div className="absolute top-1 right-3 w-4.5 h-4.5 bg-amber-950/40 rounded-full"></div>
          </div>
          
          <div className={`w-52 h-22 ${colors.primary} border-x-2 border-b-2 border-white rounded-b-3xl z-10 flex flex-col justify-between overflow-hidden transition-all duration-500`}>
             {/* Large Fudge Glaze Drips */}
             <div className="flex justify-around w-full relative -top-0.5 pointer-events-none">
               <div className={`w-5 h-8 ${colors.drip} rounded-b-full shadow-inner`}></div>
               <div className={`w-3 h-4 ${colors.drip} rounded-b-full shadow-inner`}></div>
               <div className={`w-6 h-10 ${colors.drip} rounded-b-full shadow-inner`}></div>
               <div className={`w-4 h-5 ${colors.drip} rounded-b-full shadow-inner`}></div>
               <div className={`w-5 h-7 ${colors.drip} rounded-b-full shadow-inner`}></div>
               <div className={`w-3.5 h-9 ${colors.drip} rounded-b-full shadow-inner`}></div>
             </div>
             
             {/* Rich visual chocolates embedded inside bottom tier */}
             <div className="flex justify-center items-center gap-5 pb-3">
               <span className="text-xs filter drop-shadow hover:scale-125 transition-transform">🍫</span>
               <div className="w-2 h-2.5 bg-amber-200 rounded-full rotate-[60deg]"></div>
               <span className="text-xs filter drop-shadow hover:scale-125 transition-transform" role="img" aria-label="cherry">🍒</span>
               <div className="w-2.5 h-2 bg-amber-400 rounded-full -rotate-[20deg] animate-pulse"></div>
               <span className="text-xs filter drop-shadow hover:scale-125 transition-transform">🍩</span>
             </div>
          </div>
          
          {/* Plate / Stand and extra scattered treats */}
          <div className="relative w-68 h-10 -mt-3.5 -z-10 flex items-center justify-center">
            {/* Serving Stand Base */}
            <div className="absolute bottom-[-16px] w-28 h-10 bg-gradient-to-b from-slate-200 to-slate-400 border-x border-b border-slate-300 rounded-b-full shadow-md"></div>
            
            {/* Serving Stand Plate */}
            <div className={`w-full h-full bg-gradient-to-r ${colors.plate} rounded-[50%] border-2 border-white shadow-lg flex items-center justify-between px-6 transition-all duration-500`}>
               {/* Scattered Chocolates on plate */}
               <span className="text-sm filter drop-shadow animate-bounce delay-100">🍫</span>
               <span className="text-sm filter drop-shadow hover:rotate-12 transition-transform">🍪</span>
               <span className="text-sm filter drop-shadow select-none opacity-0">🍮</span> {/* spacer */}
               <span className="text-sm filter drop-shadow select-none opacity-0">🍮</span> {/* spacer */}
               <span className="text-sm filter drop-shadow hover:scale-110 transition-transform">🍓</span>
               <span className="text-sm filter drop-shadow animate-bounce">🍬</span>
            </div>
          </div>

          {/* Interactive Floating Chocolates Portal */}
          <AnimatePresence>
            {floatingChocs.map(choc => (
              <motion.div
                key={choc.id}
                initial={{ opacity: 1, scale: 0.2, x: choc.x, y: choc.y, rotate: 0 }}
                animate={{ 
                  opacity: [1, 1, 0],
                  scale: [choc.size * 0.6, choc.size * 1.2, choc.size * 1],
                  y: choc.y - 250 - Math.random() * 100,
                  x: choc.x + (Math.random() * 120 - 60),
                  rotate: choc.rotate
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.2, ease: "easeOut" }}
                className="absolute text-2xl pointer-events-none z-50 select-none filter drop-shadow-md"
              >
                {choc.icon}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Informative text bubble */}
        <div className="z-10 relative mb-5 flex items-center gap-1 bg-[#fff6f0] dark:bg-amber-950/20 px-3 py-1.5 rounded-xl border border-amber-100/50">
          <Sparkles className="w-3 h-3 text-amber-500 animate-spin" />
          <p className="text-[10px] text-[#8c6751] font-mono tracking-wide">
            Selected styling: <strong className="text-amber-800">{colors.label}</strong>
          </p>
        </div>

        <button 
          onClick={(e) => handleCelebrate(e)}
          className="z-10 group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#4a2c1b] text-white rounded-full text-xs font-bold tracking-widest shadow-xl shadow-amber-900/40 hover:bg-[#5c3a21] transition-all focus:outline-none focus:ring-4 focus:ring-amber-200 hover:-translate-y-1 active:scale-95 uppercase"
        >
          <Music className="w-4 h-4 group-hover:rotate-12 transition-transform text-amber-300" />
          {clicks < 21 ? `CLICK ${21 - clicks} TIMES TO CELEBRATE!` : 'CELEBRATE AGAIN!'}
        </button>
      </motion.div>
    </section>
  );
}
