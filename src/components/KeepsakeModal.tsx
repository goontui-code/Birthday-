import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Loader2, Sparkles, Heart, FileText, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { messages } from './Messages';

// Converts any OKLCH/OKLAB color space string to standard RGB/RGBA via the browser's Canvas Context API
function convertToRgb(colorStr: string): string {
  if (!colorStr || colorStr === 'transparent' || colorStr === 'none') return colorStr;
  
  if (
    !colorStr.includes('oklch') && 
    !colorStr.includes('oklab') && 
    !colorStr.includes('color(')
  ) {
    return colorStr;
  }

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) return colorStr;
    
    ctx.fillStyle = colorStr;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    
    if (a === 255) {
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`;
    }
  } catch (e) {
    console.warn('Failed to convert color:', colorStr, e);
    return colorStr;
  }
}

// Replaces all modern colors within a gradient or complex CSS color style string
function replaceColorsInString(str: string): string {
  if (!str) return str;
  if (!str.includes('oklch') && !str.includes('oklab') && !str.includes('color(')) {
    return str;
  }
  
  let result = str.replace(/oklch\([^)]+\)/g, (match) => {
    return convertToRgb(match);
  });
  
  result = result.replace(/oklab\([^)]+\)/g, (match) => {
    return convertToRgb(match);
  });
  
  result = result.replace(/color\([^)]+\)/g, (match) => {
    return convertToRgb(match);
  });
  
  return result;
}

interface KeepsakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: string;
}

type KeepsakeTheme = 'blossom' | 'vintage' | 'lavender';

export function KeepsakeModal({ isOpen, onClose, note }: KeepsakeModalProps) {
  const [selectedTheme, setSelectedTheme] = useState<KeepsakeTheme>('blossom');
  const [customTitle, setCustomTitle] = useState('Our Keepsake Story 🌸');
  const [isExporting, setIsExporting] = useState(false);
  const [exportedSuccess, setExportedSuccess] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  const themes = {
    blossom: {
      name: 'Blossom Pink',
      bgClass: 'bg-gradient-to-br from-[#fff0f3] via-[#fff9fb] to-[#fff0f3]',
      borderClass: 'border-2 border-[#ffccd5]',
      accentText: 'text-[#ff758f]',
      bulletColor: 'text-[#ffb3c1]',
      floralColor: '#ffccd5',
      letterBg: 'bg-white/80',
    },
    vintage: {
      name: 'Vintage Gold',
      bgClass: 'bg-gradient-to-br from-[#fdfbf7] via-[#fffdf9] to-[#f9f6ea]',
      borderClass: 'border-2 border-[#d4af37]/30',
      accentText: 'text-[#b8860b]',
      bulletColor: 'text-[#d4af37]',
      floralColor: '#e5d19e',
      letterBg: 'bg-[#faf6f0]/90',
    },
    lavender: {
      name: 'Misty Lavender',
      bgClass: 'bg-gradient-to-br from-[#f3f0ff] via-[#faf9ff] to-[#f3f0ff]',
      borderClass: 'border-2 border-[#d6ceff]',
      accentText: 'text-[#7050e8]',
      bulletColor: 'text-[#c0b3ff]',
      floralColor: '#d6ceff',
      letterBg: 'bg-white/80',
    }
  };

  const currentTheme = themes[selectedTheme];

  const handleExport = async () => {
    if (!captureRef.current) return;
    setIsExporting(true);
    setExportedSuccess(false);

    try {
      // Small timeout to allow state/rendering changes if any
      await new Promise(resolve => setTimeout(resolve, 300));

      const element = captureRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution rendering
        useCORS: true,
        backgroundColor: null,
        logging: false,
        windowWidth: 620, // Lock window dimensions for reliable capturing
        windowHeight: 900,
        onclone: (clonedDoc) => {
          // Pre-emptively convert any oklch/oklab color computed strings to plain RGB in the DOM tree clones
          const elements = clonedDoc.getElementsByTagName('*');
          for (let i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;
            try {
              const style = window.getComputedStyle(el);
              
              const colorProps = [
                'color',
                'backgroundColor',
                'borderColor',
                'borderTopColor',
                'borderRightColor',
                'borderBottomColor',
                'borderLeftColor',
                'fill',
                'stroke'
              ];
              
              colorProps.forEach(prop => {
                const val = style[prop as any];
                if (val && (val.includes('oklch') || val.includes('oklab') || val.includes('color('))) {
                  el.style[prop as any] = convertToRgb(val);
                }
              });
              
              // Handle active gradient color spaces inside background-image
              const bgImg = style.backgroundImage;
              if (bgImg && (bgImg.includes('oklch') || bgImg.includes('oklab') || bgImg.includes('color('))) {
                el.style.backgroundImage = replaceColorsInString(bgImg);
              }
            } catch (err) {
              console.warn('Error rewriting modern styles for html2canvas:', err);
            }
          }
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2],
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save('Birthday_Keepsake_Memory.pdf');
      
      setExportedSuccess(true);
      setTimeout(() => setExportedSuccess(false), 3000);
    } catch (error) {
      console.error('Error generating PDF keepsake:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-[2rem] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col lg:flex-row h-full max-h-[90vh]"
        >
          {/* Left panel: Controls */}
          <div className="p-6 md:p-8 lg:w-96 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col justify-between shrink-0 bg-gray-50/50">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#ff758f]" />
                  <h3 className="font-serif text-xl text-[#2d3436]">Keepsake Maker</h3>
                </div>
                <button 
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors lg:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Export your beautifully written digital letter and best friend messages combined into a high-quality decorative PDF sheet to preserve forever.
              </p>

              {/* Title input */}
              <div className="space-y-2 mb-6">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Card Header Title</label>
                <input
                  type="text"
                  maxLength={40}
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffb3c1] text-sm text-gray-700 bg-white"
                />
              </div>

              {/* Theme select */}
              <div className="space-y-3 mb-8">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 select-none">Stationery Vibe</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(themes) as KeepsakeTheme[]).map((themeKey) => (
                    <button
                      key={themeKey}
                      onClick={() => setSelectedTheme(themeKey)}
                      className={`py-3 px-2 rounded-xl text-xs font-medium border-2 transition-all flex flex-col items-center gap-1 ${
                        selectedTheme === themeKey
                          ? 'border-[#ff758f] bg-[#fff0f3] text-[#ff758f]'
                          : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full ${
                        themeKey === 'blossom' ? 'bg-[#ffccd5]' : themeKey === 'vintage' ? 'bg-[#ecdcb0]' : 'bg-[#d6ceff]'
                      }`} />
                      {themes[themeKey].name.split(' ')[1]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#ff758f] text-white rounded-full text-xs font-bold tracking-widest hover:bg-[#ff607d] transition-colors shadow-lg shadow-pink-100 disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    GENERATING KEPSAKE...
                  </>
                ) : exportedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    DOWNLOADED! ✨
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    DOWNLOAD PDF KEEPSAKE
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="w-full text-center py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors hidden lg:block"
              >
                Cancel and return
              </button>
            </div>
          </div>

          {/* Right panel: Printable layout preview */}
          <div className="flex-1 bg-gray-100/60 p-4 md:p-8 flex items-center justify-center overflow-auto relative rounded-r-[2rem]">
            {/* Desktop close button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-gray-600 hover:scale-105 transition-all z-20 hidden lg:block"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Simulated physical layout container scaled nicely */}
            <div className="scale-[0.55] sm:scale-[0.7] md:scale-[0.8] lg:scale-[0.85] xl:scale-95 origin-center shrink-0 shadow-2xl rounded-2xl overflow-hidden bg-white">
              <div 
                id="keepsake-card-capture"
                ref={captureRef}
                className={`w-[600px] min-h-[850px] p-8 ${currentTheme.bgClass} flex flex-col justify-between relative relative-gp overflow-hidden selection:bg-transparent`}
                style={{ fontFamily: 'var(--font-sans)', contentVisibility: 'auto' }}
              >
                {/* Vintage/floral watercolor background decor elements */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-pink-100/40 rounded-full blur-3xl pointer-events-none -translate-y-12 translate-x-12" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-100/40 rounded-full blur-3xl pointer-events-none translate-y-12 -translate-x-12" />

                {/* Decorative border vector outlines */}
                <div className={`absolute inset-4 ${currentTheme.borderClass} rounded-[1.5rem] pointer-events-none z-10 flex flex-col justify-between p-4`}>
                  {/* Small decorative corner florals */}
                  <div className="flex justify-between w-full">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={currentTheme.floralColor} strokeWidth="1.5">
                      <path d="M4 20h2a8 8 0 0 0 8-8V4" />
                      <circle cx="14" cy="4" r="2" fill={currentTheme.floralColor} />
                      <circle cx="4" cy="20" r="2" fill={currentTheme.floralColor} />
                    </svg>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={currentTheme.floralColor} strokeWidth="1.5" className="rotate-90">
                      <path d="M4 20h2a8 8 0 0 0 8-8V4" />
                      <circle cx="14" cy="4" r="2" fill={currentTheme.floralColor} />
                      <circle cx="4" cy="20" r="2" fill={currentTheme.floralColor} />
                    </svg>
                  </div>
                  <div className="flex justify-between w-full rotate-180">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={currentTheme.floralColor} strokeWidth="1.5">
                      <path d="M4 20h2a8 8 0 0 0 8-8V4" />
                      <circle cx="14" cy="4" r="2" fill={currentTheme.floralColor} />
                      <circle cx="4" cy="20" r="2" fill={currentTheme.floralColor} />
                    </svg>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={currentTheme.floralColor} strokeWidth="1.5" className="rotate-90">
                      <path d="M4 20h2a8 8 0 0 0 8-8V4" />
                      <circle cx="14" cy="4" r="2" fill={currentTheme.floralColor} />
                      <circle cx="4" cy="20" r="2" fill={currentTheme.floralColor} />
                    </svg>
                  </div>
                </div>

                {/* Card Content Area - ensures elegant static flow */}
                <div className="relative z-10 p-4 space-y-6">
                  {/* Header info */}
                  <div className="text-center pt-4">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${currentTheme.letterBg} mb-3`}>
                      <Heart className={`w-6 h-6 ${currentTheme.accentText} fill-current`} />
                    </div>
                    <h1 className="font-serif text-3xl font-bold tracking-tight text-gray-800 leading-normal">
                      {customTitle || 'Our Keepsake Story'}
                    </h1>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <span className={`h-[1px] w-12 ${currentTheme.bulletColor} bg-current`} />
                      <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-bold">Memorabilia Specimen</span>
                      <span className={`h-[1px] w-12 ${currentTheme.bulletColor} bg-current`} />
                    </div>
                  </div>

                  {/* Section A: Digital Note (Handwritten) */}
                  <div className={`${currentTheme.letterBg} border border-white/40 shadow-sm rounded-2xl p-6 relative`}>
                    <div className="absolute top-3 left-4 flex gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-100" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-105" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-100" />
                    </div>
                    <h2 className={`text-[10px] font-bold tracking-[0.15em] mb-4 text-center uppercase text-gray-400`}>A Letter From The Heart</h2>
                    <p className="font-handwriting text-2xl text-gray-850 leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-hidden">
                      {note}
                    </p>
                  </div>

                  {/* Section B: Sweet Messages */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className={`w-3.5 h-3.5 ${currentTheme.accentText}`} />
                      <h3 className="font-serif text-sm font-bold text-gray-700 tracking-wide">Included Sentiment Gems</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {messages.map((item, idx) => (
                        <div 
                          key={idx}
                          className={`${currentTheme.letterBg} border border-white/30 backdrop-blur-sm p-4 rounded-xl shadow-sm`}
                        >
                          <div className="flex items-start gap-2">
                            <span className={`mt-0.5 shrink-0 ${currentTheme.bulletColor}`}>✦</span>
                            <div>
                              <p className="text-xs text-gray-700 leading-relaxed italic">
                                "{item.content}"
                              </p>
                              <p className={`text-[9px] font-bold uppercase ${currentTheme.accentText} mt-1.5 inline-flex items-center gap-1`}>
                                <span className={`w-2 h-[1px] bg-current opacity-60`} />
                                {item.title}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer sign */}
                <div className="text-center z-10 mt-6 pb-2">
                  <p className="text-[9px] uppercase tracking-[0.2em] font-medium text-gray-400">
                    A Keepsake to Hold Close to Your Heart Forever 🌹
                  </p>
                  <p className="text-[8px] font-mono text-gray-300 mt-1">
                    Generated securely from Best Friend Tribute Website
                  </p>
                </div>

              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
