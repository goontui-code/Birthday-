import React, { useState, useEffect } from 'react';
import { Palette, Sparkles, Check, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  brand: string;
  brandHover: string;
  brandLight: string;
  brandBorder: string;
  brandDark: string;
  textMain: string;
  textSoft: string;
  bgPage: string;
  bgGradient: string;
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'blossom',
    name: 'Cherry Blossom',
    description: 'Sweet, romantic warm pink paper canvas',
    brand: '#ff758f',
    brandHover: '#ff607d',
    brandLight: '#fff0f3',
    brandBorder: '#ffccd5',
    brandDark: '#ff4d6d',
    textMain: '#2d3436',
    textSoft: '#636e72',
    bgPage: '#fff9fb',
    bgGradient: 'linear-gradient(135deg, #fff9fb 0%, #fff0f3 100%)',
  },
  {
    id: 'vintage',
    name: 'Vintage Cream',
    description: 'Chic classic golden cream with espresso letters',
    brand: '#b8860b',
    brandHover: '#996515',
    brandLight: '#fdfbf7',
    brandBorder: '#ebdcb0',
    brandDark: '#8b6508',
    textMain: '#3e2723',
    textSoft: '#795548',
    bgPage: '#fdfbf7',
    bgGradient: 'linear-gradient(135deg, #fdfbf7 0%, #f7f3e3 100%)',
  },
  {
    id: 'lavender',
    name: 'Midnight Lilac',
    description: 'Dreamy stardust indigo and misty purple hues',
    brand: '#7050e8',
    brandHover: '#5d3fe1',
    brandLight: '#f5f3ff',
    brandBorder: '#d6ceff',
    brandDark: '#4f35b2',
    textMain: '#1a1a3a',
    textSoft: '#58508d',
    bgPage: '#faf9ff',
    bgGradient: 'linear-gradient(135deg, #faf9ff 0%, #f3f0ff 100%)',
  },
  {
    id: 'sage',
    name: 'Matcha Moss',
    description: 'Earthy organic forest sage with herbal elements',
    brand: '#2e7d32',
    brandHover: '#1b5e20',
    brandLight: '#f1f8e9',
    brandBorder: '#c5e1a5',
    brandDark: '#0d5302',
    textMain: '#1b3022',
    textSoft: '#4f6d53',
    bgPage: '#f9fbf7',
    bgGradient: 'linear-gradient(135deg, #f9fbf7 0%, #e8f5e9 100%)',
  },
  {
    id: 'sunset',
    name: 'Aura Sunset',
    description: 'Warm glowing terracotta with clay bark notes',
    brand: '#e05a47',
    brandHover: '#c23f2e',
    brandLight: '#fff5f2',
    brandBorder: '#fcd3c1',
    brandDark: '#a82b1c',
    textMain: '#3a211c',
    textSoft: '#7c5148',
    bgPage: '#fffaf6',
    bgGradient: 'linear-gradient(135deg, #fffaf6 0%, #ffece3 100%)',
  },
];

export function ThemePicker() {
  const [activeTheme, setActiveTheme] = useState<string>('blossom');
  const [isOpen, setIsOpen] = useState(false);

  // Sync theme to localstorage & set :root css variables instantly
  useEffect(() => {
    const saved = localStorage.getItem('website-aesthetic-theme');
    if (saved && THEMES.some(t => t.id === saved)) {
      setActiveTheme(saved);
      applyTheme(saved);
    } else {
      applyTheme('blossom');
    }
  }, []);

  const applyTheme = (themeId: string) => {
    const theme = THEMES.find(t => t.id === themeId);
    if (!theme) return;

    const root = document.documentElement;
    root.style.setProperty('--theme-brand', theme.brand);
    root.style.setProperty('--theme-brand-hover', theme.brandHover);
    root.style.setProperty('--theme-brand-light', theme.brandLight);
    root.style.setProperty('--theme-brand-border', theme.brandBorder);
    root.style.setProperty('--theme-brand-dark', theme.brandDark);
    root.style.setProperty('--theme-text-main', theme.textMain);
    root.style.setProperty('--theme-text-soft', theme.textSoft);
    root.style.setProperty('--theme-bg-page', theme.bgPage);
    root.style.setProperty('--theme-bg-gradient', theme.bgGradient);

    localStorage.setItem('website-aesthetic-theme', themeId);
  };

  const handleThemeChange = (themeId: string) => {
    setActiveTheme(themeId);
    applyTheme(themeId);
  };

  return (
    <div className="relative z-50">
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white/70 backdrop-blur-md border border-[#ffccd5]/50 px-5 py-3.5 rounded-2xl gap-3 shadow-sm text-xs font-medium w-full">
        <div className="flex items-center gap-2.5">
          <Palette className="w-4 h-4 text-[var(--theme-brand)] animate-bounce" />
          <div>
            <span className="text-gray-400 font-bold tracking-wider uppercase text-[9px] block">Aesthetic Layout Customizer</span>
            <span className="text-gray-700 font-bold text-xs">
              Theme: <span style={{ color: 'var(--theme-brand)' }}>{THEMES.find(t => t.id === activeTheme)?.name}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={`relative px-3.5 py-1.5 rounded-xl text-[11px] font-bold tracking-wide transition-all border flex items-center gap-1.5 ${
                activeTheme === theme.id
                  ? 'border-[var(--theme-brand)] bg-[var(--theme-brand-light)] text-[var(--theme-brand-dark)] shadow-sm'
                  : 'border-gray-150 bg-white hover:border-gray-300 text-gray-500'
              }`}
            >
              <span 
                className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block" 
                style={{ backgroundColor: theme.brand }} 
              />
              {theme.name}
              {activeTheme === theme.id && <Check className="w-3 h-3" />}
            </button>
          ))}
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ml-1"
            title="Show details"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-gray-150 rounded-2xl p-4 shadow-xl z-50 text-left"
          >
            <h4 className="font-serif italic text-sm text-gray-800 font-bold mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
              Design & Typography Refresh Description
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {THEMES.map((theme) => (
                <div 
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    activeTheme === theme.id 
                      ? 'border-[var(--theme-brand)] bg-[var(--theme-brand-light)]/40 ring-1 ring-[var(--theme-brand)]' 
                      : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col gap-1 items-center shrink-0">
                    <span className="w-6 h-6 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: theme.brand }} />
                    <span className="text-[10px] font-bold font-mono text-gray-400">AA</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-gray-800">{theme.name}</span>
                      <span className="text-[9px] uppercase tracking-wider font-bold" style={{ color: theme.brandDark }}>Live Preview</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed font-sans">{theme.description}</p>
                    <div className="flex gap-2.5 mt-2">
                      <div className="text-[9px] font-mono border border-gray-100 px-1.5 py-0.5 rounded bg-white text-gray-600">
                        Main: <span className="font-bold" style={{ color: theme.textMain }}>{theme.textMain}</span>
                      </div>
                      <div className="text-[9px] font-mono border border-gray-100 px-1.5 py-0.5 rounded bg-white text-gray-600">
                        Brand: <span className="font-bold" style={{ color: theme.brand }}>{theme.brand}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
