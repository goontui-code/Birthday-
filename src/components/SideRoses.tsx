import { motion } from 'motion/react';

export function SideRoses() {
  const leftRoses = [
    { icon: '🎈', size: 'text-7xl md:text-9xl', top: '10%', left: '-2%', delay: 0, duration: 6 },
    { icon: '✨', size: 'text-5xl md:text-7xl', top: '35%', left: '4%', delay: 1, duration: 7 },
    { icon: '🎈', size: 'text-8xl md:text-[10rem]', top: '65%', left: '-4%', delay: 2, duration: 8 },
    { icon: '🎈', size: 'text-4xl md:text-6xl', top: '85%', left: '2%', delay: 3, duration: 5 },
  ];

  const rightRoses = [
    { icon: '🎈', size: 'text-7xl md:text-9xl', top: '15%', right: '-2%', delay: 0.5, duration: 6.5 },
    { icon: '✨', size: 'text-5xl md:text-7xl', top: '40%', right: '4%', delay: 1.5, duration: 6 },
    { icon: '🎈', size: 'text-8xl md:text-[10rem]', top: '70%', right: '-4%', delay: 0.8, duration: 7.5 },
    { icon: '🎈', size: 'text-4xl md:text-6xl', top: '88%', right: '3%', delay: 2.5, duration: 5.5 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Left Side */}
      {leftRoses.map((item, i) => (
        <motion.div
          key={`left-${i}`}
          animate={{ 
            rotate: [-5, 5, -5], 
            y: [-15, 15, -15],
            x: [-5, 5, -5]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: item.duration, 
            ease: "easeInOut", 
            delay: item.delay 
          }}
          className={`absolute opacity-70 filter drop-shadow-xl ${item.size}`}
          style={{ top: item.top, left: item.left }}
        >
          {item.icon}
        </motion.div>
      ))}

      {/* Right Side */}
      {rightRoses.map((item, i) => (
        <motion.div
          key={`right-${i}`}
          animate={{ 
            rotate: [5, -5, 5], 
            y: [15, -15, 15],
            x: [5, -5, 5]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: item.duration, 
            ease: "easeInOut", 
            delay: item.delay 
          }}
          className={`absolute opacity-70 filter drop-shadow-xl ${item.size} transform -scale-x-100`}
          style={{ top: item.top, right: item.right }}
        >
          {item.icon}
        </motion.div>
      ))}
    </div>
  );
}
