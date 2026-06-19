import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Heart {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export function ClickHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Don't add a heart if clicking on interactive elements that might be blocked or need visual clarity?
      // Actually it's just fine everywhere, the component is pointer-events-none anyway.
      const newHeart: Heart = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        rotation: Math.random() * 40 - 20, // -20deg to 20deg
        scale: Math.random() * 0.5 + 0.8, // 0.8 to 1.3
      };
      
      setHearts((prev) => [...prev, newHeart]);

      // Remove after animation finishes
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, 1000);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ 
              opacity: 1, 
              scale: 0, 
              x: heart.x - 24, // Center roughly (assuming font-size ~48px)
              y: heart.y - 24, 
              rotate: heart.rotation 
            }}
            animate={{ 
              opacity: 0, 
              scale: heart.scale * 1.5, 
              y: heart.y - 120 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute text-5xl select-none"
          >
            💗
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
