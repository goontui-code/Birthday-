import { motion } from 'motion/react';
import { Star, Smile, Sparkles } from 'lucide-react';

export const messages = [
  {
    title: "Forever Grateful",
    content: "For all the late-night talks, the endless laughs, and simply being there through every up and down. You're the sister I got to choose.",
    icon: Star,
  },
  {
    title: "Brighter Days",
    content: "You have this amazing ability to make every room you walk into so much brighter. Your energy is contagious and your heart is gold.",
    icon: Smile,
  },
  {
    title: "To More Adventures",
    content: "We've made so many incredible memories together, and I know the best is yet to come. Cheers to another year of us taking on the world!",
    icon: Sparkles,
  }
];

export function Messages() {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--theme-brand-light)] flex flex-col h-full transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-6"
      >
        <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--theme-brand)]">Sweet Messages</h2>
      </motion.div>
      <div className="space-y-6 flex-1 flex flex-col justify-center">
        {messages.map((item, index) => (
          <motion.div
            key={index}
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="border-l-2 border-[var(--theme-brand-border)] pl-4 group"
          >
            <p className="text-sm leading-relaxed italic text-[var(--theme-text-soft)]">
              "{item.content}"
            </p>
            <p className="text-[10px] uppercase font-bold mt-2 text-[#b2bec3] flex items-center gap-1">
              <span className="w-4 h-[1px] bg-[var(--theme-brand-border)]"></span>
              {item.title}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
