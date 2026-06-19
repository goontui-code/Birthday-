import { motion } from 'motion/react';
import { Award, Sparkles, Zap, HeartHandshake, Coffee, Star } from 'lucide-react';

const badges = [
  { icon: Award, label: "Best Listener", desc: "Open ears, judgment-free.", color: "bg-[#fce4ec]", iconColor: "text-[#ff758f]" },
  { icon: Sparkles, label: "Fashion Icon", desc: "Slaying every outfit.", color: "bg-[#e8f5e9]", iconColor: "text-[#b2f2bb]" },
  { icon: Zap, label: "Vibe Curator", desc: "Impeccable taste & fun.", color: "bg-[#fdf2f2]", iconColor: "text-[#ffb3c1]" },
  { icon: HeartHandshake, label: "Elite Hype", desc: "Biggest cheerleader.", color: "bg-[#f0f3ff]", iconColor: "text-[#c1e7ff]" },
  { icon: Coffee, label: "2AM Confidante", desc: "Late-night talks.", color: "bg-[#fff0f3]", iconColor: "text-[#ff8fa3]" },
  { icon: Star, label: "Sister by Choice", desc: "More than a bestie.", color: "bg-[#f8f9fa]", iconColor: "text-[#bdc3c7]" },
];

export function Badges() {
  return (
    <section className="w-full mt-4 md:mt-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-6 flex justify-between items-end border-b border-[#f1f2f6] pb-4"
      >
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--theme-brand)] mb-1">Official Badges</span>
          <h2 className="font-serif italic text-2xl text-[var(--theme-text-main)] transition-colors duration-500">Unlocked Achievements</h2>
        </div>
      </motion.div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {badges.map((badge, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.8, opacity: 0, rotate: index % 2 === 0 ? -3 : 3 }}
            whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1, type: "spring", bounce: 0.4 }}
            className={`flex flex-col items-center p-6 rounded-2xl border-4 border-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group ${badge.color}`}
          >
            <div className={`p-4 bg-white rounded-full mb-4 shadow-sm group-hover:scale-110 transition-transform ${badge.iconColor}`}>
              <badge.icon className="w-6 h-6" />
            </div>
            <h3 className="font-serif italic text-sm text-[var(--theme-text-main)] font-bold text-center mb-1 transition-colors duration-500">{badge.label}</h3>
            <p className="text-[10px] uppercase font-bold text-center text-[#95a5a6] tracking-wider leading-relaxed">{badge.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
