
import React from 'react';
import { motion } from 'framer-motion';

interface FloatingParticlesProps {
  count?: number;
  colors?: string[];
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 15,
  colors = ['bg-blue-400/20', 'bg-purple-400/20', 'bg-pink-400/20', 'bg-yellow-400/20']
}) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    initialX: Math.random() * window.innerWidth,
    initialY: Math.random() * window.innerHeight,
    color: colors[Math.floor(Math.random() * colors.length)],
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${particle.color} blur-sm`}
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.initialX,
            top: particle.initialY,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.sin(particle.id) * 50, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;
