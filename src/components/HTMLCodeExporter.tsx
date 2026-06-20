import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Code, Copy, Check, ExternalLink, HelpCircle, FileText, ArrowLeft, Heart, Sparkles } from 'lucide-react';

interface HTMLCodeExporterProps {
  onBack: () => void;
}

export function HTMLCodeExporter({ onBack }: HTMLCodeExporterProps) {
  const [copied, setCopied] = useState(false);

  // The actual high-fidelity, standalone, single-file HTML source code!
  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Happy Birthday Bestie! 🎂✨</title>
    <!-- Google Fonts for premium typography -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        serif: ['Playfair Display', 'serif'],
                        mono: ['JetBrains Mono', 'monospace'],
                    },
                    animation: {
                        'spin-slow': 'spin 12s linear infinite',
                        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
                    }
                }
            }
        }
    </script>
    <style>
        /* Smooth transitions & custom theme styling variables */
        :root {
            --theme-brand: #ff758f;
            --theme-brand-dark: #e65c78;
            --theme-brand-light: #fff0f3;
            --theme-brand-border: #ffccd5;
            --theme-bg-page: #fffbfb;
            --theme-text-soft: #5c4a4c;
        }
        body {
            background-color: var(--theme-bg-page);
            color: var(--theme-text-soft);
            background-image: radial-gradient(circle at 10% 20%, rgba(255, 117, 143, 0.03) 0%, transparent 40%),
                              radial-gradient(circle at 90% 80%, rgba(255, 117, 143, 0.03) 0%, transparent 45%);
            background-attachment: fixed;
        }
        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #fff8f8;
        }
        ::-webkit-scrollbar-thumb {
            background: #ffccd5;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #ffb3c1;
        }
    </style>
</head>
<body class="min-h-screen relative overflow-x-hidden font-sans antialiased text-[#5c4a4c] pb-24">

    <!-- Ambient falling hearts floating in background -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0" id="hearts-container"></div>

    <!-- MAIN CONTAINER -->
    <div class="max-w-[700px] mx-auto px-5 py-8 flex flex-col gap-8 relative z-10">

        <!-- Top Center Mahadev Blessing -->
        <div class="w-full flex justify-center mt-2">
            <div class="relative overflow-hidden bg-gradient-to-r from-[#fff5f5] via-[#fffbeb] to-[#fff5f5] border border-orange-200/50 shadow-md hover:shadow-lg px-8 py-2.5 rounded-full flex items-center gap-2.5 transition-all text-orange-600 scale-100 hover:scale-105 active:scale-95 duration-300">
                <span class="text-sm font-semibold select-none">🔱</span>
                <span class="font-serif italic font-extrabold tracking-widest text-xs uppercase bg-gradient-to-r from-yellow-600 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]">
                    MAHADEV
                </span>
                <span class="text-xs text-rose-500 animate-pulse">💟</span>
                <span class="text-xs text-amber-400">💫</span>
            </div>
        </div>

        <!-- Top-Down Friend Banner -->
        <div class="w-full flex justify-center -mb-2">
            <div class="relative group overflow-hidden bg-gradient-to-r from-[#ff758f] to-[#e65c78] text-white px-8 py-3 rounded-2xl shadow-lg border border-white/10 flex items-center gap-3">
                <span class="text-xl">👑</span>
                <span class="font-serif italic text-base font-bold tracking-wide">
                    Your Best Friend 😉
                </span>
                <span class="text-xl">✨</span>
            </div>
        </div>

        <!-- HERO SECTION -->
        <header class="text-center py-6 mt-2 relative">
            <div class="absolute inline-flex items-center justify-center p-2.5 bg-rose-50 border border-rose-100/50 rounded-2xl -top-6 left-1/2 -translate-x-1/2 shadow-sm animate-bounce">
                <span class="text-2xl">🍰</span>
            </div>
            
            <h1 class="text-5xl font-extrabold tracking-tight text-slate-800 leading-none mt-4 drop-shadow-sm font-serif">
                Happy Birthday! 🎈
            </h1>
            
            <p class="text-sm font-serif italic text-rose-500 mt-2 tracking-wide">
                "May your day be filled with warm smiles and sweet treats!" ✨
            </p>
        </header>

        <!-- COUNTDOWN TIMER -->
        <section class="bg-white rounded-3xl p-6 border border-[#ffe3e8] shadow-sm text-center relative overflow-hidden">
            <span class="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#ff758f]">The Celebration Clock</span>
            <h3 class="text-2xl font-serif text-slate-800 font-bold mt-1.5 mb-4">Countdown to Your Special Day</h3>
            
            <div class="grid grid-cols-4 gap-2 max-w-sm mx-auto" id="countdown-grid">
                <div class="bg-rose-50/50 p-3 rounded-2xl border border-rose-100/40">
                    <span id="days" class="block text-2xl font-mono font-bold text-rose-600">00</span>
                    <span class="text-[9px] text-rose-400 font-bold uppercase tracking-wider">Days</span>
                </div>
                <div class="bg-rose-50/50 p-3 rounded-2xl border border-rose-100/40">
                    <span id="hours" class="block text-2xl font-mono font-bold text-rose-600">00</span>
                    <span class="text-[9px] text-rose-400 font-bold uppercase tracking-wider">Hours</span>
                </div>
                <div class="bg-rose-50/50 p-3 rounded-2xl border border-rose-100/40">
                    <span id="minutes" class="block text-2xl font-mono font-bold text-rose-600">00</span>
                    <span class="text-[9px] text-rose-400 font-bold uppercase tracking-wider">Mins</span>
                </div>
                <div class="bg-rose-50/50 p-3 rounded-2xl border border-rose-100/40">
                    <span id="seconds" class="block text-2xl font-mono font-bold text-rose-600">00</span>
                    <span class="text-[9px] text-rose-400 font-bold uppercase tracking-wider">Secs</span>
                </div>
            </div>
        </section>

        <!-- BIRTHDAY CAKE SECTION (INTERACTIVE) -->
        <section class="w-full">
            <div class="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-white to-[#fffbfa] rounded-3xl border border-[#ede1df] shadow-sm relative overflow-hidden group">
                <div class="z-10 relative text-center">
                    <h2 class="text-xs uppercase tracking-[0.3em] font-bold text-amber-800/80 mb-1">Make a Wish</h2>
                    <p class="text-[10px] text-gray-400 font-serif italic">Tap the cake or chocolates below to sprinkle love!</p>
                </div>

                <!-- Dynamic Chocolate Glaze Switcher -->
                <div class="flex gap-2.5 my-5 z-10 relative bg-amber-50/50 p-1.5 rounded-full border border-amber-100/60 backdrop-blur-sm shadow-inner">
                    <button onclick="setChocolate('dark')" id="btn-dark" class="px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 bg-[#3d2314] text-[#fff6f0] shadow-md scale-105">
                        🍫 Dark
                    </button>
                    <button onclick="setChocolate('milk')" id="btn-milk" class="px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 text-[#8c6751] hover:bg-amber-100/30">
                        🥛 Milk
                    </button>
                    <button onclick="setChocolate('caramel')" id="btn-caramel" class="px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 text-[#8c6751] hover:bg-amber-100/30">
                        🍯 Caramel
                    </button>
                </div>
                
                <!-- The Cake Scene Container -->
                <div onclick="handleCakeClick(event)" class="relative mt-4 mb-8 z-10 flex flex-col items-center cursor-pointer select-none" id="cake-renderer">
                    <div class="absolute top-0 w-40 h-40 bg-orange-400/10 rounded-full filter blur-2xl -translate-y-12 animate-pulse pointer-events-none"></div>

                    <!-- Candle -->
                    <div class="relative bottom-[-2px] w-4.5 h-18 bg-gradient-to-r from-amber-400 via-[#fffbeb] to-amber-400 border border-amber-300 rounded-md z-30 flex flex-col items-center shadow-lg">
                        <!-- Flame -->
                        <div class="absolute -top-7 w-6 h-9 bg-gradient-to-b from-yellow-100 via-amber-300 to-orange-600 rounded-[50%_50%_20%_20%] shadow-[0_0_25px_8px_rgba(251,191,36,0.75)] animate-bounce">
                            <div class="absolute inset-1.5 bg-white rounded-full opacity-80 blur-[1px]"></div>
                        </div>
                        <div class="w-full h-full flex flex-col justify-around py-1 opacity-70 pointer-events-none">
                            <div class="h-1.5 w-full bg-red-400 -skew-y-12"></div>
                            <div class="h-1.5 w-full bg-red-400 -skew-y-12"></div>
                        </div>
                        <div class="absolute -top-1 w-0.5 h-2 bg-slate-900"></div>
                    </div>

                    <!-- LAYER 1: Top Chocolate Tier -->
                    <div class="w-36 h-14 bg-[#3d2314] rounded-[50%] border-2 border-white -mb-8 z-20 shadow-md relative overflow-hidden transition-all duration-500" id="layer-top">
                        <div class="absolute top-3 w-full flex justify-center gap-1.5 opacity-90">
                            <span class="text-[10px]">🍓</span>
                            <span class="text-[10px]">🍫</span>
                            <span class="text-[10px]">🍓</span>
                        </div>
                    </div>
                    <div class="w-36 h-18 bg-[#2b170c] border-x-2 border-b-2 border-white rounded-b-2xl z-20 flex flex-col justify-between overflow-hidden transition-all duration-500" id="layer-top-body">
                        <div class="flex justify-around w-full relative -top-0.5 pointer-events-none">
                            <div class="w-4 h-6 bg-[#1b0c05] rounded-b-full shadow-inner" id="top-drip-1"></div>
                            <div class="w-5 h-8 bg-[#1b0c05] rounded-b-full shadow-inner" id="top-drip-2"></div>
                            <div class="w-3 h-4 bg-[#1b0c05] rounded-b-full shadow-inner" id="top-drip-3"></div>
                        </div>
                    </div>

                    <!-- LAYER 2: Cream Filling -->
                    <div class="w-44 h-5 bg-gradient-to-r from-rose-100 via-white to-rose-100 rounded-full -my-3.5 border-y border-white shadow-inner z-15 relative flex justify-around items-center px-4 overflow-hidden">
                        <div class="w-2 h-2 bg-rose-400/40 rounded-full animate-ping"></div>
                    </div>

                    <!-- LAYER 3: Large Bottom Chocolate Tier -->
                    <div class="w-52 h-16 bg-[#3d2314] rounded-[50%] border-2 border-white -mb-10 z-10 shadow-md relative transition-all duration-500" id="layer-bottom"></div>
                    <div class="w-52 h-22 bg-[#2b170c] border-x-2 border-b-2 border-white rounded-b-3xl z-10 flex flex-col justify-between overflow-hidden transition-all duration-500" id="layer-bottom-body">
                        <div class="flex justify-center items-center gap-5 pb-3">
                            <span class="text-xs">🍫</span>
                            <span class="text-xs">🍒</span>
                            <span class="text-xs">🍩</span>
                        </div>
                    </div>
                    
                    <!-- Plate -->
                    <div class="relative w-68 h-10 -mt-3.5 -z-10 flex items-center justify-center">
                        <div class="absolute bottom-[-16px] w-28 h-10 bg-gradient-to-b from-slate-200 to-slate-400 border-x border-b border-slate-300 rounded-b-full shadow-md"></div>
                        <div class="w-full h-full bg-gradient-to-r from-[#c3a492] via-[#e8dcd5] to-[#c3a492] rounded-[50%] border-2 border-white shadow-lg flex items-center justify-between px-6 transition-all duration-500" id="plate">
                            <span class="text-sm">🍰</span>
                            <span class="text-sm">🍓</span>
                            <span class="text-sm">🍬</span>
                        </div>
                    </div>
                </div>

                <!-- Selected Label -->
                <div class="z-10 relative mb-5 flex items-center gap-1 bg-[#fff6f0] px-3 py-1.5 rounded-xl border border-amber-100/50">
                    <span class="animate-spin text-amber-500 text-xs">✨</span>
                    <p class="text-[10px] text-[#8c6751] font-mono tracking-wide">
                        Selected: <strong class="text-amber-800" id="chocolate-label">Rich Dark Cacao 🍫</strong>
                    </p>
                </div>

                <!-- Celebration Button -->
                <button onclick="handleCakeClick(null)" class="z-10 relative inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#4a2c1b] text-white rounded-full text-xs font-bold tracking-widest shadow-xl shadow-amber-900/40 hover:bg-[#5c3a21] transition-all hover:-translate-y-1 active:scale-95 uppercase">
                    🎵 CLICK TO CELEBRATE!
                </button>
            </div>
        </section>

        <!-- DIGITAL GREETING NOTE -->
        <section class="bg-gradient-to-br from-rose-50/50 via-white to-pink-50/30 rounded-3xl p-6 border border-pink-100/30 shadow-sm relative">
            <h3 class="text-xl font-serif text-slate-800 font-bold mb-3 pl-1.5 border-l-4 border-[#ff758f]">Our Bestie Note 📝</h3>
            <div class="bg-amber-50/40 p-5 rounded-2xl border border-amber-100/60 font-serif italic text-sm text-slate-700 leading-relaxed shadow-inner">
                "Dear Bestie,<br><br>
                Happy Birthday! So grateful for all our memories together. You make every day brighter.<br><br>
                Here's to another year of us taking on the world!<br><br>
                Love always,<br>
                Your Best Friend"
            </div>
        </section>

        <!-- WHATSAPP WISH SECTION -->
        <section class="bg-white rounded-2xl p-6 shadow-sm border border-pink-100/40 flex flex-col transition-all duration-500 hover:shadow-md">
            <div>
                <h2 class="text-xs uppercase tracking-[0.2em] font-bold text-rose-500 flex items-center gap-1.5">
                    💬 Send WhatsApp Wish
                </h2>
                <p class="font-serif italic text-[11px] text-gray-400 mt-1">
                    Have a heartfelt wish? Send it directly to +91 86309 36140!
                </p>
            </div>

            <!-- Messages preset selectors -->
            <div class="flex flex-wrap gap-1.5 my-3">
                <button onclick="setPreset('Dear Bestie, wishing the sweetest birthday! You make every single moment brighter. 🎉🎂')" class="px-3 py-1 bg-emerald-50 text-emerald-800 font-bold text-[10px] rounded-lg border border-emerald-100 hover:bg-emerald-100">
                    Sweet
                </button>
                <button onclick="setPreset('Har Har Mahadev! 🔱 Sending you divine blessings and warmest wishes on your birthday! ✨')" class="px-3 py-1 bg-emerald-50 text-emerald-800 font-bold text-[10px] rounded-lg border border-emerald-100 hover:bg-emerald-100">
                    Blessing
                </button>
                <button onclick="setPreset('Happy Birthday! 🎂 May your day be filled with warm smiles and sweet treats! 🌸✨')" class="px-3 py-1 bg-emerald-50 text-emerald-800 font-bold text-[10px] rounded-lg border border-emerald-100 hover:bg-emerald-100">
                    Classic
                </button>
            </div>

            <!-- Text Area -->
            <textarea id="wish-message" rows="3" class="w-full text-xs p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none transition-all resize-none mb-3 text-slate-700">Dear Bestie, wishing the sweetest birthday! You make every single moment brighter. 🎉🎂</textarea>

            <button onclick="sendWish()" class="w-full py-3 bg-[#ff758f] hover:bg-[#e65c78] text-white rounded-xl text-[11px] font-extrabold tracking-widest shadow-md transition-all uppercase">
                🚀 Send Wish to WhatsApp
            </button>
        </section>

    </div>

    <!-- AUDIO BACKEND AUDIO SYNTH CODE -->
    <script>
        // Audiocontext synth for Birthday Melody!
        let audioCtx = null;
        
        function playTone(frequency, startTime, duration) {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.frequency.setValueAtTime(frequency, startTime);
            osc.type = 'sine';
            
            gain.gain.setValueAtTime(0.12, startTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
            
            osc.start(startTime);
            osc.stop(startTime + duration);
        }

        function playBirthdayMelody() {
            try {
                const now = audioCtx ? audioCtx.currentTime : 0;
                let time = now + 0.1;
                const notes = [
                    { f: 261.63, d: 0.3 }, { f: 261.63, d: 0.3 }, { f: 293.66, d: 0.6 },
                    { f: 261.63, d: 0.6 }, { f: 349.23, d: 0.6 }, { f: 329.63, d: 1.2 },
                    
                    { f: 261.63, d: 0.3 }, { f: 261.63, d: 0.3 }, { f: 293.66, d: 0.6 },
                    { f: 261.63, d: 0.6 }, { f: 392.00, d: 0.6 }, { f: 349.23, d: 1.2 }
                ];
                
                notes.forEach(note => {
                    playTone(note.f, time, note.d);
                    time += note.d + 0.05;
                });
            } catch(e) {
                console.log(e);
            }
        }
    </script>

    <!-- FLOATING INTERACTIVE FX COOKIE -->
    <script>
        // Drop chocolate items or sparkles dynamically on cake click
        function handleCakeClick(e) {
            const container = document.getElementById('hearts-container');
            const emojis = ['🟫', '🍫', '🍩', '🍪', '🍬', '✨', '🎂', '🍓', '🍒'];
            
            // Trigger 15 floating candy drops
            for (let i = 0; i < 15; i++) {
                const el = document.createElement('div');
                el.innerText = emojis[Math.floor(Math.random() * emojis.length)];
                el.style.position = 'fixed';
                el.style.fontSize = Math.random() * 20 + 16 + 'px';
                el.style.zIndex = '9999';
                el.style.pointerEvents = 'none';
                
                // Position
                const clientX = e ? e.clientX : window.innerWidth / 2;
                const clientY = e ? e.clientY : window.innerHeight / 2;
                
                el.style.left = clientX + (Math.random() * 100 - 50) + 'px';
                el.style.top = clientY + (Math.random() * 60 - 30) + 'px';
                
                document.body.appendChild(el);
                
                // Animation
                const duration = Math.random() * 1500 + 1200;
                const animation = el.animate([
                    { transform: 'translate3d(0, 0, 0) scale(0.3) rotate(0deg)', opacity: 1 },
                    { transform: \`translate3d(\${Math.random() * 200 - 100}px, \${Math.random() * -300 - 100}px, 0) scale(1.3) rotate(\${Math.random() * 360}deg)\`, opacity: 0 }
                ], {
                    duration: duration,
                    easing: 'ease-out'
                });
                
                animation.onfinish = () => el.remove();
            }

            // Init context and play audio
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            playBirthdayMelody();
        }

        // Preset switcher in text field
        function setPreset(text) {
            document.getElementById('wish-message').value = text;
        }

        // WhatsApp direct link builder
        function sendWish() {
            const msg = document.getElementById('wish-message').value;
            const number = '918630936140';
            const url = 'https://api.whatsapp.com/send?phone=' + number + '&text=' + encodeURIComponent(msg);
            window.open(url, '_blank');
        }

        // Chocolate Switcher function
        function setChocolate(type) {
            const top = document.getElementById('layer-top');
            const topBody = document.getElementById('layer-top-body');
            const bottom = document.getElementById('layer-bottom');
            const bottomBody = document.getElementById('layer-bottom-body');
            const plate = document.getElementById('plate');
            const label = document.getElementById('chocolate-label');

            const btnDark = document.getElementById('btn-dark');
            const btnMilk = document.getElementById('btn-milk');
            const btnCaramel = document.getElementById('btn-caramel');

            // Reset buttons
            [btnDark, btnMilk, btnCaramel].forEach(b => {
                b.className = "px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 text-[#8c6751] hover:bg-amber-100/30";
            });

            // Set active styles & switch chocolate type colors
            if (type === 'dark') {
                btnDark.className = "px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 bg-[#3d2314] text-[#fff6f0] shadow-md scale-105";
                top.className = "w-36 h-14 bg-[#3d2314] rounded-[50%] border-2 border-white -mb-8 z-20 shadow-md relative overflow-hidden transition-all duration-500";
                topBody.className = "w-36 h-18 bg-[#2b170c] border-x-2 border-b-2 border-white rounded-b-2xl z-20 flex flex-col justify-between overflow-hidden transition-all duration-500";
                bottom.className = "w-52 h-16 bg-[#3d2314] rounded-[50%] border-2 border-white -mb-10 z-10 shadow-md relative transition-all duration-500";
                bottomBody.className = "w-52 h-22 bg-[#2b170c] border-x-2 border-b-2 border-white rounded-b-3xl z-10 flex flex-col justify-between overflow-hidden transition-all duration-500";
                plate.className = "w-full h-full bg-gradient-to-r from-[#c3a492] via-[#e8dcd5] to-[#c3a492] rounded-[50%] border-2 border-white shadow-lg flex items-center justify-between px-6 transition-all duration-500";
                label.innerHTML = "Rich Dark Cacao 🍫";
            } else if (type === 'milk') {
                btnMilk.className = "px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 bg-[#3d2314] text-[#fff6f0] shadow-md scale-105";
                top.className = "w-36 h-14 bg-[#916244] rounded-[50%] border-2 border-white -mb-8 z-20 shadow-md relative overflow-hidden transition-all duration-500";
                topBody.className = "w-36 h-18 bg-[#7c5135] border-x-2 border-b-2 border-white rounded-b-2xl z-20 flex flex-col justify-between overflow-hidden transition-all duration-500";
                bottom.className = "w-52 h-16 bg-[#916244] rounded-[50%] border-2 border-white -mb-10 z-10 shadow-md relative transition-all duration-500";
                bottomBody.className = "w-52 h-22 bg-[#7c5135] border-x-2 border-b-2 border-white rounded-b-3xl z-10 flex flex-col justify-between overflow-hidden transition-all duration-500";
                plate.className = "w-full h-full bg-gradient-to-r from-[#dfb495] via-[#f1dcd0] to-[#dfb495] rounded-[50%] border-2 border-white shadow-lg flex items-center justify-between px-6 transition-all duration-500";
                label.innerHTML = "Milk Chocolate 🥛";
            } else if (type === 'caramel') {
                btnCaramel.className = "px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 bg-[#3d2314] text-[#fff6f0] shadow-md scale-105";
                top.className = "w-36 h-14 bg-[#ca8e4d] rounded-[50%] border-2 border-white -mb-8 z-20 shadow-md relative overflow-hidden transition-all duration-500";
                topBody.className = "w-36 h-18 bg-[#b47a3e] border-x-2 border-b-2 border-white rounded-b-2xl z-20 flex flex-col justify-between overflow-hidden transition-all duration-500";
                bottom.className = "w-52 h-16 bg-[#ca8e4d] rounded-[50%] border-2 border-white -mb-10 z-10 shadow-md relative transition-all duration-500";
                bottomBody.className = "w-52 h-22 bg-[#b47a3e] border-x-2 border-b-2 border-white rounded-b-3xl z-10 flex flex-col justify-between overflow-hidden transition-all duration-500";
                plate.className = "w-full h-full bg-gradient-to-r from-[#f5cca0] via-[#fbe4c5] to-[#f5cca0] rounded-[50%] border-2 border-white shadow-lg flex items-center justify-between px-6 transition-all duration-500";
                label.innerHTML = "Salted Caramel 🍯";
            }
        }
    </script>

    <!-- CLOCK COUNTDOWN CONTROLLER -->
    <script>
        function updateCountdown() {
            const nextBirthday = new Date("June 30, 2026 00:00:00").getTime();
            const now = new Date().getTime();
            let distance = nextBirthday - now;
            
            // Loop year if passed
            if (distance < 0) {
                const currentYear = new Date().getFullYear();
                const nextYearDate = new Date(\`June 30, \${currentYear + 1} 00:00:00\`).getTime();
                distance = nextYearDate - now;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById("days").innerText = days.toString().padStart(2, '0');
            document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
            document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
            document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');
        }
        setInterval(updateCountdown, 1000);
        updateCountdown();
    </script>
</body>
</html>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-900 text-slate-100 rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-800 flex flex-col gap-6 relative"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-850 pb-6">
        <div>
          <span className="text-[10px] font-bold text-blue-400 tracking-[0.2em] uppercase flex items-center gap-1">
            <Code className="w-3.5 h-3.5" /> Direct Standalone HTML Integration
          </span>
          <h2 className="text-2xl font-serif font-black text-white mt-1">Get Your Standalone Website</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-lg">
            This is your entire birthday card exported as a high-fidelity, interactive, single-file HTML page. All graphics, music, and styles work anywhere!
          </p>
        </div>

        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-full transition-all border border-slate-700/80 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Live Web View
        </button>
      </div>

      {/* Guide cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 flex gap-3">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl max-h-fit">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">How to play locally</h4>
            <ol className="text-[11px] text-slate-300 list-decimal pl-4 mt-1.5 space-y-1">
              <li>Click the <strong className="text-blue-300">Copy Code</strong> button below.</li>
              <li>Create a file named <code className="bg-slate-900 border border-slate-800 px-1 py-0.5 rounded text-rose-300 text-[10px]">index.html</code> on your desktop.</li>
              <li>Paste the code, save it, and double click to run instantly! 🚀</li>
            </ol>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 flex gap-3">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl max-h-fit">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-sans">Self-Contained Power</h4>
            <p className="text-[11px] text-slate-300 mt-1.5 leading-normal">
              Empowered with a real Web Audio Synthesizer, premium responsive layout, interactive chocolate picker, custom decorations, and direct click-to-WhatsApp messaging. No servers or packages needed!
            </p>
          </div>
        </div>
      </div>

      {/* The Code Box */}
      <div className="relative group rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
        {/* Code controls */}
        <div className="absolute top-3.5 right-3.5 z-10 flex gap-2">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all uppercase tracking-wider ${
              copied 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-103'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied to Clipboard!' : 'Copy HTML Code'}
          </button>
        </div>

        {/* Tab Indicator */}
        <div className="flex items-center gap-2 bg-slate-900 px-4 py-3.5 border-b border-slate-850">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
          </div>
          <span className="text-[10px] text-slate-400 font-mono italic ml-2">index.html</span>
        </div>

        {/* Dynamic preview block */}
        <div className="max-h-96 overflow-y-auto px-5 py-4 font-mono text-[11px] text-slate-300 antialiased leading-relaxed scrollbar-thin select-all">
          <pre>{htmlTemplate}</pre>
        </div>
      </div>
    </motion.div>
  );
}
