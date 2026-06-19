import { motion } from 'motion/react';
import { Hero } from './components/Hero';
import { Messages } from './components/Messages';
import { Gallery } from './components/Gallery';
import { Badges } from './components/Badges';
import { Countdown } from './components/Countdown';
import { BirthdayCake } from './components/BirthdayCake';
import { PopImages } from './components/PopImages';
import { DigitalCard } from './components/DigitalCard';
import { InstagramFeed } from './components/InstagramFeed';
import { ArijitHighlights } from './components/ArijitHighlights';
import { ClickHearts } from './components/ClickHearts';
import { Footer } from './components/Footer';
import { SideRoses } from './components/SideRoses';
import { ThemePicker } from './components/ThemePicker';
import { WhatsAppWish } from './components/WhatsAppWish';

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--theme-bg-page)] text-[var(--theme-text-soft)] font-sans overflow-x-hidden selection:bg-[#ffccd5] relative transition-colors duration-500">
      <ClickHearts />
      <SideRoses />
      <div className="absolute top-10 left-10 md:left-20 w-4 h-4 bg-[#ffccd5] rounded-full rotate-45 pointer-events-none opacity-40"></div>
      <div className="absolute top-40 right-4 md:right-10 w-3 h-6 bg-[#c1e7ff] rounded-full -rotate-12 pointer-events-none opacity-40"></div>
      <div className="absolute top-[30%] left-6 md:left-10 w-6 h-2 bg-[#ffeb3b] rounded-full rotate-12 pointer-events-none opacity-40"></div>
      <div className="absolute top-[50%] right-[20%] w-3 h-3 bg-[#b2f2bb] rounded-full pointer-events-none opacity-40"></div>
      <div className="absolute bottom-20 left-10 md:left-20 w-5 h-5 border-2 border-[#ffc9c9] rounded-sm rotate-45 pointer-events-none opacity-40"></div>

      <div className="max-w-[1024px] mx-auto px-6 py-10 flex flex-col gap-8 relative z-10 min-h-screen">
        {/* Top Center Mahadev Blessing */}
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 90, damping: 14 }}
          className="w-full flex justify-center -mb-4"
        >
          <div className="relative overflow-hidden bg-gradient-to-r from-[#fff5f5] via-[#fffbeb] to-[#fff5f5] dark:from-[#3a2010] dark:via-[#2a1a10] dark:to-[#3a2010] border border-orange-200/50 dark:border-orange-500/20 shadow-md hover:shadow-lg dark:shadow-orange-950/10 px-8 py-2.5 rounded-full flex items-center gap-2.5 hover:scale-105 transition-all text-orange-600 dark:text-orange-400">
            <span className="text-sm font-semibold select-none">🔱</span>
            <span className="font-serif italic font-extrabold tracking-widest text-xs uppercase bg-gradient-to-r from-yellow-600 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]">
              MAHADEV
            </span>
            <span className="text-xs text-rose-500 animate-pulse">💟</span>
            <span className="text-xs text-amber-400 animate-bounce">💫</span>
          </div>
        </motion.div>

        {/* Top-Down Friend Banner */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 15, delay: 0.1 }}
          className="w-full flex justify-center -mb-2"
        >
          <div className="relative group overflow-hidden bg-gradient-to-r from-[var(--theme-brand)] to-[var(--theme-brand-dark)] text-white px-8 py-3 rounded-2xl shadow-lg border border-[var(--theme-brand-border)]/20 flex items-center gap-3">
            <span className="text-xl animate-pulse">👑</span>
            <span className="font-serif italic text-base font-bold tracking-wide">
              Your Best Friend 😉
            </span>
            <span className="text-xl animate-pulse">✨</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
        </motion.div>

        <ThemePicker />
        <Hero />
        <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
          <div className="md:col-span-7 flex flex-col h-full">
            <Gallery />
          </div>
          <div className="md:col-span-5 flex flex-col h-full gap-6">
            <Messages />
            <WhatsAppWish />
          </div>
        </main>
        <Badges />
        <Countdown />
        <BirthdayCake />
        <DigitalCard />
        <InstagramFeed />
        <ArijitHighlights />
        <PopImages />
        <Footer />
      </div>
    </div>
  );
}


