
import React from 'react';
import { BookOpen, ArrowRight, Layers, Feather, Compass, Sparkles, Quote, Scan, Zap, Clock, MousePointer2 } from 'lucide-react';
import { Button } from './ui/Button';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';

interface LandingPageProps {
  onStart: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] as [number, number, number, number] },
  },
};

const OrchidTexture = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
    <path d="M50 10C60 40 90 50 50 90C10 50 40 40 50 10Z" fill="currentColor" fillOpacity="0.05" />
  </svg>
);

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const folioScale = useTransform(scrollYProgress, [0.2, 0.4], [0.8, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.3, 0.4], [0, 1]);

  const masterpieceFolios = [
    { title: "The Alchemist", author: "Paulo Coelho", color: "bg-pink-100", accent: "text-pink-600", tag: "Wisdom" },
    { title: "Atomic Habits", author: "James Clear", color: "bg-[#0F172A]", accent: "text-pink-400", tag: "System" },
    { title: "Meditations", author: "Marcus Aurelius", color: "bg-white", accent: "text-gray-400", tag: "Philosophy" },
    { title: "Deep Work", author: "Cal Newport", color: "bg-pink-50", accent: "text-pink-500", tag: "Focus" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] selection:bg-pink-100 selection:text-pink-700 overflow-x-hidden">
      {/* Dynamic Background Decor */}
      <motion.div style={{ y: yParallax }} className="fixed inset-0 pointer-events-none -z-10">
        <OrchidTexture className="absolute -top-20 -right-20 w-[600px] h-[600px] text-pink-200 opacity-20 rotate-12" />
        <OrchidTexture className="absolute top-1/2 -left-40 w-[500px] h-[500px] text-pink-100 opacity-10 -rotate-45" />
      </motion.div>

      {/* Premium Floating Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50 glass border border-gray-100/50 h-16 rounded-full flex items-center justify-between px-6 md:px-10 shadow-2xl transition-all duration-500 hover:w-[92%]">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={onStart}>
          <div className="w-9 h-9 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
            <BookOpen className="w-4 h-4 text-[#0F172A]" />
          </div>
          <span className="font-bold tracking-tighter text-xl lowercase">readle.</span>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={onStart} variant="primary" className="!px-6 !py-2 !text-[9px] !h-10 uppercase tracking-widest !rounded-full">Enter</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 md:pt-48 pb-24 md:pb-40 px-6 md:px-16 max-w-7xl mx-auto">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-12">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-4">
              <div className="w-12 h-px bg-pink-300"></div>
              <span className="text-[10px] font-black text-pink-600 uppercase tracking-[0.4em]">Curated Intelligence</span>
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-[100px] font-medium tracking-tighter leading-[0.9] text-[#0F172A]">
              Read less. <br />
              <span className="text-gray-200 italic font-light">Know everything.</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg md:text-2xl text-gray-500 max-w-xl leading-relaxed font-light">
              readle distills knowledge into <span className="text-pink-600 font-medium">elegant folios</span>.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 pt-4">
              <Button onClick={onStart} className="!px-12 !py-6 group shadow-2xl shadow-pink-200/50">
                Begin Distillation <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>
          <motion.div variants={itemVariants} className="lg:col-span-5 relative">
            <div className="aspect-[4/5] bg-white rounded-[64px] p-12 shadow-2xl border border-gray-50 flex flex-col justify-between overflow-hidden group">
              <div className="space-y-12">
                <div className="w-16 h-2 bg-pink-100 rounded-full"></div>
                <div className="space-y-6">
                  <div className="h-6 bg-gray-50 rounded-lg w-full"></div>
                  <div className="h-6 bg-gray-50 rounded-lg w-5/6"></div>
                </div>
              </div>
              <div className="pt-12 flex items-center justify-between border-t border-gray-50">
                <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-pink-50"></div><div className="h-3 bg-gray-100 rounded-full w-24"></div></div>
                <div className="text-[10px] font-black uppercase text-pink-500">Folio #042</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </header>

      {/* Masterpiece Showcase */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-16 mb-24">
           <div className="space-y-4 max-w-xl">
             <div className="inline-block px-3 py-1 bg-pink-50 rounded-full text-pink-600 text-[10px] font-black uppercase tracking-widest">Collections</div>
             <h2 className="text-4xl md:text-6xl font-medium tracking-tighter text-[#0F172A]">Masterpiece <span className="italic text-gray-300">Folios.</span></h2>
           </div>
        </div>
        <div className="relative overflow-x-auto no-scrollbar pb-12 px-6 md:px-16">
          <div className="flex gap-8 min-w-max">
            {masterpieceFolios.map((folio, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} className={`w-[320px] aspect-[3/4] rounded-[48px] ${folio.color} border border-gray-50 p-10 flex flex-col justify-between shadow-sm transition-all duration-700`}>
                <div className={`text-[10px] font-black uppercase tracking-widest opacity-30`}>{folio.tag}</div>
                <div className="space-y-4">
                  <h3 className={`text-3xl font-medium tracking-tighter leading-tight ${folio.color.includes('0F172A') ? 'text-white' : 'text-[#0F172A]'}`}>{folio.title}</h3>
                  <p className="text-sm font-light italic text-gray-400">by {folio.author}</p>
                </div>
                <div className={`w-8 h-px ${folio.color.includes('0F172A') ? 'bg-pink-400' : 'bg-pink-100'}`}></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Anatomy Section */}
      <section className="py-40 px-6 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-32 items-center">
          <div className="relative h-[600px] flex items-center justify-center">
            <motion.div style={{ scale: folioScale }} className="relative w-full max-w-[400px] aspect-[3/4] bg-white rounded-[48px] border border-pink-100 shadow-2xl p-12 z-20 flex flex-col justify-between">
              <div className="space-y-8"><div className="w-20 h-2 bg-pink-50 rounded-full"></div><div className="space-y-4"><div className="h-4 bg-gray-50 rounded-full w-full"></div><div className="h-4 bg-gray-50 rounded-full w-5/6"></div></div></div>
              <div className="h-32 bg-pink-50/30 rounded-3xl border border-pink-50 flex items-center justify-center italic text-pink-300 text-xs">Essential Insight Layer</div>
            </motion.div>
          </div>
          <div className="space-y-12">
            <h2 className="text-4xl md:text-7xl font-medium tracking-tighter text-[#0F172A]">The Anatomy of a <br/><span className="italic text-pink-600">Folio.</span></h2>
            <div className="grid grid-cols-2 gap-8">
              <div className="p-8 bg-[#FAF9F6] rounded-[32px] space-y-4">
                <Scan size={24} className="text-pink-600" />
                <h4 className="text-xs font-black uppercase tracking-widest">Semantic Scan</h4>
              </div>
              <div className="p-8 bg-[#FAF9F6] rounded-[32px] space-y-4">
                <MousePointer2 size={24} className="text-pink-600" />
                <h4 className="text-xs font-black uppercase tracking-widest">Focus Mapping</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-48 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-24 items-center">
          <div className="space-y-16">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-[#0F172A]">The Architecture of <br/><span className="italic text-pink-600 font-light">Concentrated Wisdom</span></h2>
            <div className="space-y-12">
              {[
                { icon: <Zap className="text-pink-500" size={20} />, title: "Reading Time Optimization", desc: "Save 85% of reading time." },
                { icon: <Clock className="text-pink-500" size={20} />, title: "Key Insight Extraction", desc: "Actionable wisdom prioritized." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start group">
                  <div className="mt-1 transition-transform group-hover:scale-125">{item.icon}</div>
                  <div className="space-y-2"><h4 className="text-sm font-bold uppercase tracking-widest text-[#0F172A]">{item.title}</h4><p className="text-gray-400 text-sm font-light">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
             <div className="space-y-8 mt-12"><div className="aspect-square bg-[#FAF9F6] rounded-[48px] p-8 flex flex-col justify-end gap-4 shadow-sm hover:shadow-xl transition-all duration-700"><Layers size={28} className="text-pink-600" /><p className="text-[10px] font-black uppercase tracking-widest">Distillation</p></div></div>
             <div className="space-y-8"><div className="aspect-[3/4] bg-[#0F172A] rounded-[48px] p-8 flex flex-col justify-between text-white shadow-2xl transition-all duration-700"><Compass size={28} className="text-pink-400" /><div className="space-y-4"><h3 className="text-5xl font-medium tracking-tighter">1.2M</h3><p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Words Distilled</p></div></div></div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-40 px-6 bg-[#FAF9F6] text-center">
        <div className="max-w-4xl mx-auto space-y-12">
          <Quote className="mx-auto text-pink-500 opacity-50 w-16 h-16" />
          <h3 className="text-3xl md:text-5xl font-light leading-snug tracking-tight">"readle has fundamentally changed how I approach my morning routine."</h3>
          <p className="text-sm font-black uppercase tracking-widest">Saif C — Co-Founder</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-48 px-6 bg-white text-center">
        <div className="max-w-4xl mx-auto space-y-16">
          <h2 className="text-5xl md:text-8xl font-medium tracking-tighter text-[#0F172A] leading-tight">Your library is <br/><span className="italic font-light text-gray-300">waiting to bloom.</span></h2>
          <div className="flex justify-center">
            <Button onClick={onStart} className="!px-12 !py-6 !text-[11px] !rounded-full group relative overflow-hidden shadow-2xl shadow-pink-200/50">
              Open Your Vault <ArrowRight className="ml-4 transition-transform group-hover:translate-x-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 px-6 border-t border-gray-100 flex flex-col items-center gap-12 bg-white">
        <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center shadow-xl shadow-pink-200/50"><BookOpen className="w-8 h-8 text-[#0F172A]" /></div>
        <span className="font-bold tracking-[0.5em] lowercase text-2xl">readle.</span>
        <p className="text-gray-300 text-[10px] font-bold uppercase tracking-widest">© 2024 Distilled Wisdom Studio</p>
      </footer>
    </div>
  );
};

export default LandingPage;
