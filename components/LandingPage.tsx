
import React from 'react';
import { BookOpen, ArrowRight, Layers, Feather, Compass, Sparkles, CheckCircle2, Quote, Star, MousePointer2, Scan, Zap, Clock, ArrowUpRight } from 'lucide-react';
import { Button } from './ui/Button';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';

interface LandingPageProps {
  onStart: () => void;
}

// Explicitly type Variants to resolve TS errors with complex transition objects
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

// Use a tuple [number, number, number, number] for ease to satisfy Framer Motion's Easing type
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

  return (
    <div className="min-h-screen bg-[#FAF9F6] selection:bg-pink-100 selection:text-pink-700 overflow-x-hidden">
      {/* Dynamic Background Decor */}
      <motion.div style={{ y: yParallax }} className="fixed inset-0 pointer-events-none -z-10">
        <OrchidTexture className="absolute -top-20 -right-20 w-[600px] h-[600px] text-pink-200 opacity-20 rotate-12" />
        <OrchidTexture className="absolute top-1/2 -left-40 w-[500px] h-[500px] text-pink-100 opacity-10 -rotate-45" />
        <div className="absolute top-[20%] right-[15%] w-4 h-4 rounded-full bg-pink-300 blur-2xl opacity-20"></div>
      </motion.div>

      {/* Premium Floating Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50 glass border border-gray-100/50 h-16 rounded-full flex items-center justify-between px-6 md:px-10 shadow-2xl shadow-pink-200/20 transition-all duration-500 hover:w-[92%]">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={onStart}>
          <div className="w-9 h-9 bg-pink-500 rounded-full flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:bg-[#0F172A] shadow-lg shadow-pink-200/50">
            <BookOpen className="w-4 h-4 text-[#0F172A] group-hover:text-pink-400 transition-colors duration-500" />
          </div>
          <span className="font-bold tracking-tighter text-xl lowercase">readle.</span>
        </div>
        <div className="flex items-center gap-6 md:gap-8">
          <button onClick={onStart} className="hidden md:block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#0F172A] transition-colors">The Vault</button>
          <Button onClick={onStart} variant="primary" className="!px-6 !py-2 !text-[9px] !h-10 uppercase tracking-widest !rounded-full">Enter</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 md:pt-48 pb-24 md:pb-40 px-6 md:px-16 max-w-7xl mx-auto">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center lg:items-start"
        >
          <div className="lg:col-span-7 space-y-8 md:space-y-12 text-center lg:text-left">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-4 justify-center lg:justify-start">
              <div className="w-12 h-px bg-pink-300"></div>
              <span className="text-[10px] font-black text-pink-600 uppercase tracking-[0.4em]">Curated Intelligence</span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl sm:text-7xl md:text-[100px] font-medium tracking-tighter leading-[0.9] text-[#0F172A]">
              Read less. <br />
              <span className="text-gray-200 italic font-light">Know everything.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg md:text-2xl text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              readle distills the world's most dense knowledge into <span className="text-pink-600 font-medium">elegant folios</span>. Built for the modern mind that values time as much as wisdom.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 pt-4 items-center lg:items-start justify-center lg:justify-start">
              <Button onClick={onStart} className="text-sm !px-12 !py-6 w-full sm:w-auto shadow-2xl shadow-pink-200/50 hover:shadow-pink-400/30 group">
                Begin Distillation <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <div className="flex items-center gap-4 px-6 text-gray-400">
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-[#FAF9F6] bg-pink-100 shadow-sm"></div>)}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest italic whitespace-nowrap">Join 2,000+ thinkers</span>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-5 relative pt-8 lg:pt-0 max-w-[450px] mx-auto w-full"
          >
            <div className="relative z-10 aspect-[4/5] bg-white rounded-[40px] md:rounded-[64px] p-8 md:p-12 shadow-[0_100px_150px_-50px_rgba(0,0,0,0.1)] border border-gray-50 flex flex-col justify-between overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <div className="space-y-8 md:space-y-12">
                <div className="flex justify-between items-center">
                  <div className="w-16 h-2 bg-pink-100 rounded-full"></div>
                  <Sparkles size={16} className="text-pink-200" />
                </div>
                <div className="space-y-6">
                  <div className="h-6 bg-gray-50 rounded-lg w-full"></div>
                  <div className="h-6 bg-gray-50 rounded-lg w-5/6"></div>
                  <div className="h-6 bg-gray-50 rounded-lg w-full"></div>
                </div>
              </div>
              <div className="pt-8 md:pt-12 flex items-center justify-between border-t border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-pink-50 flex items-center justify-center">
                    <Feather size={20} className="text-pink-400" />
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full w-20 md:w-24"></div>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-pink-500">Folio #042</div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full bg-pink-100/30 rounded-[40px] md:rounded-[64px] -z-10 translate-x-4 translate-y-4 rotate-2"></div>
          </motion.div>
        </motion.div>
      </header>

      {/* The Anatomy Section */}
      <section className="py-24 md:py-40 lg:py-60 px-6 md:px-8 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          <div className="order-2 lg:order-1 relative h-[450px] sm:h-[600px] flex items-center justify-center">
            <motion.div 
              style={{ scale: folioScale }}
              className="relative w-full max-w-[320px] sm:max-w-[400px] aspect-[3/4] bg-white rounded-[40px] md:rounded-[48px] border border-pink-100 shadow-[0_50px_100px_rgba(0,0,0,0.05)] p-8 sm:p-12 z-20 flex flex-col justify-between"
            >
              <div className="space-y-8">
                <div className="w-20 h-2 bg-pink-50 rounded-full"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-50 rounded-full w-full"></div>
                  <div className="h-4 bg-gray-50 rounded-full w-5/6"></div>
                  <div className="h-4 bg-gray-50 rounded-full w-4/6"></div>
                </div>
              </div>
              <div className="h-24 sm:h-32 bg-pink-50/30 rounded-2xl md:rounded-3xl border border-pink-50 flex items-center justify-center italic text-pink-300 text-xs">Essential Insight Layer</div>
            </motion.div>

            {/* Exploded Callouts - Hidden on very small screens, responsive offsets on others */}
            <motion.div style={{ opacity: textOpacity }} className="absolute inset-0 z-30 pointer-events-none hidden sm:block">
              <div className="absolute top-[5%] left-[0%] lg:-left-20 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-50 max-w-[160px] sm:max-w-[200px] space-y-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-pink-600 text-white flex items-center justify-center text-[10px] sm:text-xs font-bold">1</div>
                <h4 className="text-[10px] font-black uppercase tracking-widest">Narrative Arc</h4>
                <p className="text-[9px] text-gray-400 font-medium">We preserve the emotional core and rhythm of the original work.</p>
              </div>
              <div className="absolute bottom-[10%] right-[0%] lg:-right-10 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-50 max-w-[180px] sm:max-w-[220px] space-y-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0F172A] text-white flex items-center justify-center text-[10px] sm:text-xs font-bold">2</div>
                <h4 className="text-[10px] font-black uppercase tracking-widest">Mental Frameworks</h4>
                <p className="text-[9px] text-gray-400 font-medium">Distilling abstract concepts into usable frameworks for your life.</p>
              </div>
              <div className="absolute top-[45%] right-[5%] lg:-right-32 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-50 max-w-[150px] sm:max-w-[180px] space-y-3 hidden md:block">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-[10px] sm:text-xs font-bold">3</div>
                <h4 className="text-[10px] font-black uppercase tracking-widest">Action Items</h4>
                <p className="text-[9px] text-gray-400 font-medium">Concrete steps derived from theoretical wisdom.</p>
              </div>
            </motion.div>

            {/* Connecting Lines Vector */}
            <svg className="absolute inset-0 w-full h-full text-pink-100 -z-10 opacity-30 sm:opacity-100" fill="none" viewBox="0 0 400 600">
               <motion.path d="M50 100 L150 200" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1 }} />
               <motion.path d="M350 450 L250 350" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.2 }} />
               <motion.path d="M320 250 L250 220" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.4 }} />
            </svg>
          </div>

          <div className="order-1 lg:order-2 space-y-8 md:space-y-12 text-center lg:text-left">
            <div className="space-y-6">
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-medium tracking-tighter text-[#0F172A] leading-tight">The Anatomy of a <br/><span className="italic text-pink-600">Folio.</span></h2>
              <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-md mx-auto lg:mx-0">Our algorithm doesn't just cut words; it reconstructs ideas. We use multi-layer analysis to ensure that every summary feels like a private briefing.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-4 p-6 sm:p-8 bg-[#FAF9F6] rounded-[24px] sm:rounded-[32px] border border-gray-100 text-left">
                <Scan size={24} className="text-pink-600" />
                <h4 className="text-xs font-black uppercase tracking-widest">Semantic Scan</h4>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed">Analyzing 15+ literary signals to identify the core message.</p>
              </div>
              <div className="space-y-4 p-6 sm:p-8 bg-[#FAF9F6] rounded-[24px] sm:rounded-[32px] border border-gray-100 text-left">
                <MousePointer2 size={24} className="text-pink-600" />
                <h4 className="text-xs font-black uppercase tracking-widest">Focus Mapping</h4>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed">Prioritizing the chapters that deliver 80% of the value.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Temporal Exchange */}
      <section className="py-24 md:py-40 px-6 md:px-8 bg-[#0F172A] text-white relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
           <div className="space-y-12 md:space-y-16 text-center lg:text-left">
              <div className="space-y-6 md:space-y-8">
                <h2 className="text-5xl sm:text-6xl md:text-8xl font-medium tracking-tighter leading-[0.95] md:leading-[0.9]">The weight of <span className="text-pink-400">old wisdom</span> is shifting.</h2>
                <p className="text-gray-400 text-lg font-light leading-relaxed max-w-sm mx-auto lg:mx-0">Yesterday required weeks of focused study. Today requires seconds of distilled clarity.</p>
              </div>
              <div className="flex justify-center lg:justify-start gap-8 md:gap-12">
                <div className="space-y-2">
                  <div className="text-3xl md:text-4xl font-medium tracking-tighter">8h</div>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Average Read</p>
                </div>
                <div className="flex items-center text-pink-400">
                  <ArrowRight size={24} className="md:w-8 md:h-8" />
                </div>
                <div className="space-y-2">
                  <div className="text-3xl md:text-4xl font-medium tracking-tighter text-pink-400">4m</div>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Readle Folio</p>
                </div>
              </div>
           </div>
           
           <div className="relative group perspective-1000 max-w-[450px] mx-auto w-full">
              <div className="aspect-[4/5] bg-gradient-to-br from-gray-800 to-gray-900 rounded-[40px] md:rounded-[64px] p-8 md:p-12 flex flex-col justify-center items-center gap-10 md:gap-12 border border-gray-700 transition-transform duration-1000 group-hover:rotate-y-12">
                 <div className="w-20 h-24 md:w-24 md:h-32 bg-gray-700/50 rounded-xl animate-pulse"></div>
                 <div className="space-y-4 text-center">
                   <p className="text-[10px] font-black uppercase tracking-[0.5em] text-pink-500">Processing Essence</p>
                   <div className="flex justify-center gap-1">
                      {[1,2,3,4,5].map(i => <div key={i} className="w-2 h-2 rounded-full bg-pink-600"></div>)}
                   </div>
                 </div>
              </div>
              <div className="absolute -inset-4 bg-pink-500/20 blur-[60px] md:blur-[100px] -z-10 group-hover:bg-pink-500/30 transition-colors"></div>
           </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-24 md:py-48 px-6 md:px-16 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="space-y-12 md:space-y-16">
              <div className="space-y-6 text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-[#0F172A] leading-tight">The Architecture of <br/><span className="italic text-pink-600 font-light">Concentrated Wisdom</span></h2>
                <p className="text-gray-400 text-lg font-light leading-relaxed max-w-md mx-auto md:mx-0">Our intelligence doesn't just summarize; it distills. Every folio is cross-referenced for accuracy and editorial tone.</p>
              </div>
              
              <div className="space-y-10 md:space-y-12">
                {[
                  { icon: <Zap className="text-pink-500" size={20} />, title: "Reading Time Optimization", desc: "Save up to 85% of reading time without losing core insights." },
                  { icon: <Clock className="text-pink-500" size={20} />, title: "Key Insight Extraction", desc: "We prioritize actionable wisdom over trivial filler." },
                  { icon: <Layers className="text-pink-500" size={20} />, title: "Knowledge Vaulting", desc: "Store your personal library of distilled thoughts forever." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start group text-left">
                    <div className="mt-1 transition-transform group-hover:scale-125 duration-500 flex-shrink-0">{item.icon}</div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-[#0F172A]">{item.title}</h4>
                      <p className="text-gray-400 text-sm font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 md:gap-8 relative max-w-[500px] mx-auto w-full">
               <div className="absolute -inset-10 bg-pink-50/30 rounded-full blur-[80px] md:blur-[100px] -z-10"></div>
               <div className="space-y-6 md:space-y-8 mt-12">
                  <div className="aspect-square bg-[#FAF9F6] rounded-[32px] md:rounded-[48px] p-6 md:p-8 flex flex-col justify-end gap-4 shadow-sm hover:shadow-xl transition-all duration-700">
                    <Layers size={28} className="text-pink-600" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Distillation</p>
                  </div>
                  <div className="aspect-[3/4] bg-pink-50 rounded-[32px] md:rounded-[48px] p-6 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-700">
                    <Feather size={28} className="text-pink-600" />
                    <p className="text-xs sm:text-sm font-light italic text-pink-900 leading-tight">"A masterpiece of brevity and insight."</p>
                  </div>
               </div>
               <div className="space-y-6 md:space-y-8">
                  <div className="aspect-[3/4] bg-[#0F172A] rounded-[32px] md:rounded-[48px] p-6 md:p-8 flex flex-col justify-between text-white shadow-2xl hover:-translate-y-4 transition-all duration-700">
                    <Compass size={28} className="text-pink-400" />
                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-400">The Metric</p>
                      <h3 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tighter">1.2M</h3>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Words Distilled</p>
                    </div>
                  </div>
                  <div className="aspect-square bg-white border border-gray-100 rounded-[32px] md:rounded-[48px] p-6 md:p-8 flex flex-col justify-center items-center gap-4 hover:border-pink-200 transition-all duration-700 shadow-sm">
                    <BookOpen size={28} className="text-gray-200" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial / Quote Section */}
      <section className="py-24 md:py-40 px-6 md:px-16 bg-[#FAF9F6] text-[#0F172A] relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-8 md:space-y-12">
          <Quote className="mx-auto text-pink-500 opacity-50 w-12 h-12 md:w-16 md:h-16" />
          <h3 className="text-2xl sm:text-3xl md:text-5xl font-light leading-snug tracking-tight">
            "readle has fundamentally changed how I approach my morning routine. Instead of wading through hundreds of pages, I start my day with the <span className="text-pink-400 italic">pure essence</span> of the books I value."
          </h3>
          <div className="space-y-2">
            <p className="text-sm font-black uppercase tracking-[0.4em]">Saif C</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Co-Founder at Stickup Digital</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-48 px-6 md:px-8 bg-white relative">
        <div className="max-w-4xl mx-auto text-center space-y-12 md:space-y-16">
          <div className="space-y-6 md:space-y-8">
             <div className="inline-block px-4 py-1.5 rounded-full border border-pink-200 text-pink-500 text-[10px] font-black uppercase tracking-[0.3em]">The Final Step</div>
             <h2 className="text-4xl sm:text-6xl md:text-8xl font-medium tracking-tighter text-[#0F172A] leading-tight md:leading-none">Your library is <br/><span className="italic font-light text-gray-300">waiting to bloom.</span></h2>
          </div>
          <div className="flex flex-col items-center gap-10 md:gap-12">
            <Button onClick={onStart} className="!px-12 md:!px-20 !py-6 md:!py-8 text-base md:text-lg !rounded-2xl md:!rounded-[32px] group relative overflow-hidden shadow-2xl shadow-pink-200/50 w-full sm:w-auto">
              <span className="relative z-10 flex items-center justify-center gap-4">Open Your Vault <ArrowRight className="transition-transform group-hover:translate-x-2" /></span>
              <div className="absolute inset-0 bg-pink-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </Button>
            <div className="flex gap-8 md:gap-16">
              <div className="text-center">
                <p className="text-xl md:text-2xl font-medium tracking-tighter text-[#0F172A]">99%</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Accuracy</p>
              </div>
              <div className="text-center">
                <p className="text-xl md:text-2xl font-medium tracking-tighter text-[#0F172A]">0s</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Delay</p>
              </div>
              <div className="text-center">
                <p className="text-xl md:text-2xl font-medium tracking-tighter text-[#0F172A]">Free</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-20 md:py-32 px-6 md:px-8 border-t border-gray-100 flex flex-col items-center gap-12 bg-white">
        <div className="flex flex-col items-center gap-6">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-pink-500 rounded-2xl flex items-center justify-center shadow-xl shadow-pink-200/50">
            <BookOpen className="w-7 h-7 md:w-8 md:h-8 text-[#0F172A]" />
          </div>
          <span className="font-bold tracking-[0.5em] lowercase text-xl md:text-2xl">readle.</span>
        </div>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-[10px] font-black uppercase tracking-widest text-gray-300">
           <a href="#" className="hover:text-pink-600 transition-colors">Privacy</a>
           <a href="#" className="hover:text-pink-600 transition-colors">Terms</a>
           <a href="#" className="hover:text-pink-600 transition-colors">Contact</a>
           <a href="#" className="hover:text-pink-600 transition-colors">Twitter</a>
        </div>
        <div className="space-y-4 text-center">
          <p className="text-gray-300 text-[10px] font-bold uppercase tracking-widest">© 2024 Distilled Wisdom Studio</p>
          <div className="h-px w-24 bg-gray-50 mx-auto"></div>
          <p className="text-[8px] text-gray-200 font-bold uppercase tracking-[0.5em]">Crafted for the sophisticated mind</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
