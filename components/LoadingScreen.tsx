import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OrchidBloom = () => (
  <div className="relative flex items-center justify-center">
    {/* Outer Rotating Ring */}
    <motion.div 
      className="absolute w-72 h-72 border border-white/10 rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_20px_white]"></div>
    </motion.div>

    {/* Inner Pulsing Ring */}
    <motion.div 
      className="absolute w-56 h-56 border border-white/5 rounded-full"
      animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.3, 0.1] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* The Orchid */}
    <motion.svg 
      viewBox="0 0 100 100" 
      className="w-36 h-36 text-white fill-current relative z-10 filter drop-shadow-2xl" 
      xmlns="http://www.w3.org/2000/svg"
      animate={{ rotate: [0, 3, 0, -3, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Petal 1 */}
      <motion.path 
        d="M50 50 C65 20 85 20 85 45 C85 70 65 65 50 50 Z" 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.8 }}
        transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />
      {/* Petal 2 */}
      <motion.path 
        d="M50 50 C35 20 15 20 15 45 C15 70 35 65 50 50 Z" 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.8 }}
        transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.4 }}
      />
      {/* Center Detail */}
      <motion.path 
        d="M50 50 C70 80 50 95 30 80 C20 70 40 60 50 50 Z" 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.8 }}
      />
      <motion.circle 
        cx="50" cy="50" r="3" 
        className="text-pink-100"
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.svg>
  </div>
);

export const LoadingScreen: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "Cultivating the garden of thought...",
    "Tracing the invisible lines of wisdom...",
    "Distilling the essence of the written word...",
    "Arranging your private sanctuary of ideas..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#db2777] z-[100] flex flex-col items-center justify-center overflow-hidden">
      {/* Deep Atmosphere Grains & Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-[15%] -left-[10%] w-[70%] h-[70%] bg-pink-400 rounded-full blur-[140px]"
          animate={{ 
            x: [0, 40, 0], 
            y: [0, 20, 0],
            opacity: [0.4, 0.6, 0.4] 
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -bottom-[15%] -right-[10%] w-[70%] h-[70%] bg-pink-700 rounded-full blur-[140px]"
          animate={{ 
            x: [0, -30, 0], 
            y: [0, -15, 0],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-28">
        <OrchidBloom />

        <div className="space-y-12 text-center max-w-xl px-8">
          <div className="space-y-3">
             <p className="text-white/40 text-[9px] font-bold uppercase tracking-[0.5em] font-sans">Distilling Knowledge</p>
             <AnimatePresence mode="wait">
                <motion.h2
                  key={messageIndex}
                  initial={{ opacity: 0, y: 15, rotateX: 20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -15, rotateX: -20 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="font-serif-premium text-3xl md:text-5xl text-white italic font-light tracking-tight leading-tight"
                >
                  {messages[messageIndex]}
                </motion.h2>
              </AnimatePresence>
          </div>
          
          <div className="flex flex-col items-center gap-6">
            <div className="w-48 h-px bg-white/10 rounded-full overflow-hidden relative">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_20px_white]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, ease: "linear" }}
              />
            </div>
            <p className="text-white/20 text-[8px] font-black uppercase tracking-[0.8em]">readle.</p>
          </div>
        </div>
      </div>

      {/* Luxury Noise Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
};