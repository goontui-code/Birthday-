import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { PartyPopper, Heart, LogIn, LogOut, CheckCircle2, ShieldCheck, Database } from 'lucide-react';
import { fireConfetti } from '../lib/confetti';
import { useAuthState } from '../hooks/useAuthState';
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

export function Hero() {
  const { user } = useAuthState();
  const [isConnecting, setIsConnecting] = useState(false);
  const [dbStatus, setDbStatus] = useState<'connected' | 'error'>('connected');

  useEffect(() => {
    // Fire confetti on load for a surprise!
    const timer = setTimeout(fireConfetti, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async () => {
    setIsConnecting(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Firebase Login failed:", err);
      setDbStatus('error');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <section className="flex flex-col gap-8 mb-8 relative z-10 w-full">
      {/* Visual Firebase Connection Status Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-center bg-white/70 backdrop-blur-md border border-[var(--theme-brand-border)]/50 px-5 py-3 rounded-2xl gap-3 shadow-sm text-xs font-medium"
      >
        <div className="flex items-center gap-2.5">
          <Database className="w-4 h-4 text-[var(--theme-brand)]" />
          <span className="text-gray-400 font-bold tracking-wider uppercase text-[10px]">Cloud Infrastructure</span>
          <div className="flex items-center gap-1.5 bg-white/10 px-2 py-0.5 rounded-full border border-gray-100">
            <span className={`w-2 h-2 rounded-full ${dbStatus === 'connected' ? 'bg-[#2ecc71] animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-[11px] font-semibold text-gray-600">
              {dbStatus === 'connected' ? 'Firebase Database Connected' : 'Firebase Offline'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-[var(--theme-brand-border)]/30">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'Contributor'} 
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-full ring-2 ring-[var(--theme-brand)]/40"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-[var(--theme-brand)]/10 text-[var(--theme-brand)] flex items-center justify-center text-[10px] font-bold">
                  {user.displayName ? user.displayName[0] : 'U'}
                </div>
              )}
              <div className="text-left hidden xs:block">
                <span className="text-gray-700 block font-semibold text-[11px] leading-tight">
                  {user.displayName || 'Authorized Author'}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[var(--theme-brand)] font-bold flex items-center gap-0.5 leading-none mt-0.5">
                  <ShieldCheck className="w-2.5 h-2.5" /> Core Member
                </span>
              </div>
              <button
                onClick={handleLogout}
                title="Sign Out of Firebase"
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-55 hover:scale-105 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              disabled={isConnecting}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[var(--theme-brand)] to-[var(--theme-brand-dark)] text-white rounded-xl text-[11px] font-bold tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-sm disabled:opacity-50"
            >
              <LogIn className="w-3.5 h-3.5" />
              {isConnecting ? 'CONNECTING...' : 'SYNC GOOGLE CLOUD'}
            </button>
          )}
        </div>
      </motion.div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 w-full">
        <div className="flex flex-col text-left">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="inline-block"
          >
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[var(--theme-brand-dark)] mb-2 block flex items-center gap-2">
              <Heart className="w-4 h-4 fill-[var(--theme-brand)] text-[var(--theme-brand)]" />
              Happy Birthday Bestie!
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-serif italic text-[var(--theme-text-main)] tracking-tight leading-tight transition-colors duration-500"
          >
            To my absolute <br className="hidden md:block" />
            <span className="text-[var(--theme-brand)] transition-colors duration-500">favorite person</span>
          </motion.h1>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-serif italic text-lg text-[var(--theme-text-soft)] mt-4 max-w-xl leading-relaxed transition-colors duration-500"
          >
            Another year older, another year of being completely fabulous. 
            I am so incredibly lucky to have you as my best friend.
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex-shrink-0"
        >
          <button 
            onClick={fireConfetti}
            className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--theme-brand)] text-white rounded-full text-xs font-bold tracking-widest shadow-lg hover:bg-[var(--theme-brand-hover)] transition-all focus:outline-none focus:ring-4 focus:ring-[var(--theme-brand-border)]"
          >
            <PartyPopper className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            CELEBRATE!
          </button>
        </motion.div>
      </div>
    </section>
  );
}
