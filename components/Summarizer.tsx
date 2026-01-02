import React, { useState, useEffect } from 'react';
import { BookOpen, Copy, History as HistoryIcon, ArrowLeft, Zap, Sparkles, X, Download } from 'lucide-react';
import { Button } from './ui/Button';
import { Typewriter } from './ui/Typewriter';
import { SummaryResult, SummaryLength, InputMode, BookDetails } from '../types';
import { generateSummary } from '../services/geminiService';

interface SummarizerProps {
  onBack: () => void;
}

type SummarizerStep = 'input' | 'loading' | 'result';

const FloralMotif = ({ className, color = "#FCE7F3" }: { className?: string; color?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 50C65 15 85 25 80 45C75 65 55 55 50 50Z" fill={color} opacity="0.6" />
    <path d="M50 50C35 15 15 25 20 45C25 65 45 55 50 50Z" fill={color} opacity="0.6" />
    <path d="M50 50C70 85 45 95 35 85C25 75 45 55 50 50Z" fill={color} opacity="0.4" />
    <path d="M50 50C30 85 55 95 65 85C75 75 55 55 50 50Z" fill={color} opacity="0.4" />
    <circle cx="50" cy="50" r="3" fill="#DB2777" />
  </svg>
);

const Summarizer: React.FC<SummarizerProps> = ({ onBack }) => {
  const [step, setStep] = useState<SummarizerStep>('input');
  const [inputMode, setInputMode] = useState<InputMode>(InputMode.PASTE);
  const [textInput, setTextInput] = useState('');
  const [bookDetails, setBookDetails] = useState<BookDetails>({ title: '', author: '', genre: '', concepts: '' });
  const [length, setLength] = useState<SummaryLength>(SummaryLength.MEDIUM);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [history, setHistory] = useState<SummaryResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('readle_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = (newSummary: SummaryResult) => {
    const updated = [newSummary, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem('readle_history', JSON.stringify(updated));
  };

  const handleGenerate = async () => {
    if (inputMode === InputMode.PASTE && textInput.length < 50) return;
    if (inputMode === InputMode.DETAILS && !bookDetails.title) return;

    setStep('loading');
    
    try {
      const summary = await generateSummary({
        mode: inputMode,
        text: textInput,
        details: bookDetails,
        length
      });
      setResult(summary);
      saveToHistory(summary);
      setStep('result');
      setIsTyping(true);
    } catch (error) {
      console.error(error);
      setStep('input');
    }
  };

  const handleReset = () => {
    setResult(null);
    setStep('input');
  };

  const handleDownloadPdf = async () => {
    const element = document.getElementById('folio-card');
    if (!element || !result) return;
    
    setIsExporting(true);
    
    // We use a larger windowWidth to ensure the "md" responsive layout is captured
    // and remove margins to prevent misalignment shifts in the resulting canvas.
    const opt = {
      margin: 0,
      filename: `${result.title.replace(/\s+/g, '_')}_readle_Insight.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 1200, // Force desktop-grade layout for the PDF capture
        scrollX: 0,
        scrollY: 0
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
      // Temporarily hide UI elements that shouldn't be in PDF if any (handled via ID choice)
      // @ts-ignore
      const worker = html2pdf().set(opt).from(element);
      await worker.save();
    } catch (err) {
      console.error("PDF Export failed:", err);
      alert("Something went wrong during export. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col overflow-x-hidden relative">
      {/* Circular Floating Header */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl h-16 glass border border-gray-100 rounded-full flex items-center justify-between px-6 md:px-10 z-50 shadow-xl shadow-gray-200/20 transition-all duration-700">
        <div 
          className="flex items-center gap-3 md:gap-4 cursor-pointer group" 
          onClick={step === 'result' ? handleReset : onBack}
        >
          <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center transition-all group-hover:border-pink-500 bg-white/50">
            <ArrowLeft size={14} className="text-gray-400 group-hover:text-pink-600" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center shadow-md shadow-pink-100">
              <BookOpen size={14} className="text-[#0F172A]" />
            </div>
            <span className="font-bold tracking-tighter text-xl lowercase hidden sm:inline">readle.</span>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${showHistory ? 'text-pink-600' : 'text-gray-400 hover:text-[#0F172A]'}`}
          >
            <HistoryIcon size={12} /> <span className="hidden xs:inline">Vault</span>
          </button>
          <div className="h-4 w-px bg-gray-100"></div>
          <div className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] hidden xs:block">Wisdom Engine</div>
        </div>
      </header>

      <main className="flex-1 relative flex flex-col pt-32">
        {step === 'input' && (
          <div className="max-w-2xl mx-auto w-full px-6 py-12 md:py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-12">
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 mb-2">
                  <div className="w-8 h-px bg-pink-200"></div>
                  <h2 className="text-[10px] font-black text-pink-600 uppercase tracking-[0.4em]">The Inquiry</h2>
                </div>
                <h1 className="text-4xl md:text-6xl font-medium tracking-tighter text-[#0F172A] leading-tight">
                  What are we <br/><span className="italic text-gray-300 font-light">distilling today?</span>
                </h1>
              </div>

              <div className="space-y-10">
                <div className="flex gap-4 p-1.5 bg-white/50 backdrop-blur rounded-2xl border border-gray-100 shadow-sm">
                  <button 
                    onClick={() => setInputMode(InputMode.PASTE)}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold tracking-tight transition-all duration-300 ${inputMode === InputMode.PASTE ? 'bg-[#0F172A] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Paste Text
                  </button>
                  <button 
                    onClick={() => setInputMode(InputMode.DETAILS)}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold tracking-tight transition-all duration-300 ${inputMode === InputMode.DETAILS ? 'bg-[#0F172A] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Search Title
                  </button>
                </div>

                <div className="space-y-6">
                  {inputMode === InputMode.PASTE ? (
                    <textarea
                      className="w-full h-64 md:h-80 p-8 rounded-[32px] bg-white border border-gray-100 focus:border-pink-300 focus:ring-[16px] focus:ring-pink-50/40 outline-none resize-none transition-all text-sm leading-relaxed placeholder:text-gray-300 font-light shadow-[0_15px_40px_rgba(0,0,0,0.02)]"
                      placeholder="Paste the excerpt or content you wish to condense..."
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                    />
                  ) : (
                    <div className="space-y-6 animate-in fade-in duration-500">
                      <div className="relative group">
                        <input 
                          type="text" 
                          className="w-full px-8 py-7 rounded-3xl bg-white border border-gray-100 focus:border-pink-300 focus:ring-[16px] focus:ring-pink-50/40 outline-none transition-all text-xl font-medium tracking-tight shadow-[0_15px_40px_rgba(0,0,0,0.02)] placeholder:text-gray-300"
                          placeholder="e.g. It Ends with Us"
                          value={bookDetails.title}
                          onChange={(e) => setBookDetails({...bookDetails, title: e.target.value})}
                        />
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity">
                          <Sparkles size={20} className="text-pink-300 animate-pulse" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <input 
                          type="text" 
                          className="w-full px-8 py-5 rounded-2xl bg-white border border-gray-100 focus:border-pink-300 focus:ring-[12px] focus:ring-pink-50/30 outline-none transition-all text-sm font-medium tracking-tight placeholder:text-gray-300 shadow-sm"
                          placeholder="Author (e.g. Colleen Hoover)"
                          value={bookDetails.author}
                          onChange={(e) => setBookDetails({...bookDetails, author: e.target.value})}
                        />
                        <input 
                          type="text" 
                          className="w-full px-8 py-5 rounded-2xl bg-white border border-gray-100 focus:border-pink-300 focus:ring-[12px] focus:ring-pink-50/30 outline-none transition-all text-sm font-medium tracking-tight placeholder:text-gray-300 shadow-sm"
                          placeholder="Genre"
                          value={bookDetails.genre}
                          onChange={(e) => setBookDetails({...bookDetails, genre: e.target.value})}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-gray-100">
                  <div className="flex items-center gap-5">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Density</span>
                    <div className="flex gap-1.5 p-1 bg-gray-50 rounded-xl">
                      {Object.values(SummaryLength).map((l) => (
                        <button
                          key={l}
                          onClick={() => setLength(l)}
                          className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${length === l ? 'bg-[#0F172A] text-white shadow-lg' : 'text-gray-400 hover:text-[#0F172A]'}`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button 
                    onClick={handleGenerate} 
                    disabled={inputMode === InputMode.PASTE ? textInput.length < 50 : !bookDetails.title}
                    className="w-full sm:w-auto !py-6 !px-12 shadow-2xl shadow-pink-100/50 hover:shadow-pink-300/30 active:scale-95"
                  >
                    Distill Insight
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="h-full min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-16 animate-in fade-in duration-1000 relative overflow-hidden">
            <FloralMotif className="absolute top-1/4 left-[10%] w-32 h-32 opacity-[0.15] animate-sway" />
            <FloralMotif className="absolute bottom-1/4 right-[10%] w-40 h-40 opacity-[0.1] animate-sway-reverse delay-1000" />
            <FloralMotif className="absolute top-1/2 right-[5%] w-20 h-20 opacity-[0.2] animate-sway delay-500" />

            <div className="relative">
              <div className="absolute inset-0 border-2 border-pink-100 rounded-full scale-[1.5] animate-ping opacity-10"></div>
              <div className="absolute inset-0 border border-pink-200 rounded-full scale-[2.2] opacity-5 animate-pulse delay-700"></div>
              
              <div className="w-40 h-40 bg-white rounded-[56px] shadow-[0_30px_70px_rgba(251,207,232,0.4)] border border-pink-50 flex items-center justify-center relative z-10 animate-float">
                <div className="relative flex flex-col items-center gap-2">
                  <Sparkles className="text-pink-600 animate-pulse mb-1" size={48} />
                  <div className="absolute -inset-4 bg-pink-500 rounded-full blur-[25px] opacity-10 animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div className="text-center space-y-8 max-w-sm relative z-10">
              <div className="space-y-3">
                <h3 className="text-4xl font-light tracking-tighter text-[#0F172A]">Refining Knowledge</h3>
                <div className="flex items-center justify-center gap-3">
                  <div className="h-px w-6 bg-pink-200"></div>
                  <p className="text-pink-500 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Clarity Incoming</p>
                  <div className="h-px w-6 bg-pink-200"></div>
                </div>
              </div>
              <p className="text-gray-400 text-base font-light leading-relaxed italic px-4">
                "In the garden of the mind, knowledge is the seed, but reflection is the bloom."
              </p>
            </div>

            <div className="w-64 h-2 bg-gray-100/60 rounded-full overflow-hidden relative shadow-inner">
              <div className="h-full bg-pink-500 rounded-full w-1/4 animate-loading-bar shadow-[0_0_15px_rgba(219,39,119,0.3)]"></div>
            </div>

            <style>{`
              @keyframes loading-bar {
                0% { transform: translateX(-100%) scaleX(0.5); }
                50% { transform: translateX(100%) scaleX(1.5); }
                100% { transform: translateX(300%) scaleX(0.5); }
              }
              @keyframes sway {
                0%, 100% { transform: rotate(-5deg) translateY(0); }
                50% { transform: rotate(5deg) translateY(-30px); }
              }
              @keyframes sway-reverse {
                0%, 100% { transform: rotate(5deg) translateY(0); }
                50% { transform: rotate(-5deg) translateY(-40px); }
              }
              @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
              }
              .animate-loading-bar { animation: loading-bar 2.8s infinite cubic-bezier(0.76, 0, 0.24, 1); }
              .animate-sway { animation: sway 12s infinite ease-in-out; }
              .animate-sway-reverse { animation: sway-reverse 14s infinite ease-in-out; }
              .animate-float { animation: float 7s infinite ease-in-out; }
            `}</style>
          </div>
        )}

        {step === 'result' && result && (
          <div className="max-w-4xl mx-auto w-full px-6 py-12 md:py-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
            <div id="folio-card" className="bg-white rounded-[48px] p-8 md:p-20 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.08)] border border-gray-100 relative overflow-hidden">
              <div className="absolute top-12 left-8 md:top-16 md:left-20 w-20 h-2 bg-pink-200/50 rounded-full"></div>

              <div className="mt-12 space-y-16 md:space-y-24">
                <header className="space-y-8 md:space-y-10">
                  <div className="flex flex-wrap items-center gap-6">
                    <span className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em] bg-pink-50 px-3 py-1 rounded-full">{result.readingTimeSaved} Saved</span>
                    <div className="h-px w-10 bg-gray-100 hidden sm:block"></div>
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">{new Date(result.timestamp).toLocaleDateString()}</span>
                  </div>
                  <div className="space-y-6">
                    <h1 className="text-5xl md:text-8xl font-medium tracking-tighter text-[#0F172A] leading-[1.0] md:leading-[0.95] selection:bg-pink-100">
                      {result.title}
                    </h1>
                    <p className="text-2xl md:text-3xl text-gray-400 font-light italic tracking-tight">
                      by {result.author}
                    </p>
                  </div>
                </header>

                <div className="prose prose-slate max-w-none">
                  <div className="text-gray-600 text-xl md:text-2xl leading-[1.65] font-light selection:bg-pink-50">
                    {/* Render typewriter for live view, but PDF will capture current snapshot */}
                    {isTyping ? (
                      <Typewriter 
                        text={result.summary} 
                        speed={4} 
                        onComplete={() => setIsTyping(false)} 
                      />
                    ) : (
                      <p>{result.summary}</p>
                    )}
                  </div>
                </div>

                <div className="pt-20 md:pt-24 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
                  <div className="space-y-10">
                    <h4 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#0F172A]">
                      <Zap size={16} className="text-pink-600" /> Key Insights
                    </h4>
                    <ul className="space-y-10">
                      {result.keyTakeaways.map((point, idx) => (
                        <li key={idx} className="space-y-4 group">
                          <div className="h-1.5 w-16 bg-pink-100/50 rounded-full group-hover:w-24 group-hover:bg-pink-300 transition-all duration-700"></div>
                          <p className="text-base text-gray-500 font-light leading-relaxed group-hover:text-[#0F172A] transition-colors">
                            {point}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col justify-end items-center md:items-end gap-10">
                    <div className="flex gap-4 w-full sm:w-auto print:hidden">
                      <button 
                        onClick={() => navigator.clipboard.writeText(result.summary)}
                        className="w-16 h-16 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-pink-600 hover:border-pink-200 bg-white shadow-sm transition-all duration-500"
                        title="Copy Text"
                      >
                        <Copy size={24} />
                      </button>
                      <button 
                        onClick={handleDownloadPdf}
                        disabled={isExporting || isTyping}
                        className="flex-1 sm:flex-none px-12 h-16 rounded-full bg-[#0F172A] text-white text-[11px] font-black uppercase tracking-widest hover:bg-pink-600 shadow-2xl transition-all duration-500 disabled:bg-gray-400 disabled:opacity-70"
                      >
                        {isExporting ? <span className="animate-pulse">Distilling PDF...</span> : isTyping ? "Writing..." : <><Download size={18} className="inline mr-2" /> Download PDF</>}
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Doc Reference</p>
                      <p className="text-[10px] font-black text-gray-200 uppercase tracking-widest mt-1">READLE-LIB-{result.timestamp.toString().slice(-6)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="py-24 text-center">
              <button 
                onClick={handleReset}
                className="inline-flex items-center gap-4 py-5 px-10 rounded-full border border-gray-200 bg-white/70 backdrop-blur-md shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <ArrowLeft className="text-gray-400 group-hover:text-pink-600 transition-colors" size={18} />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 group-hover:text-[#0F172A]">Start New Session</span>
              </button>
            </div>
          </div>
        )}

        <div className={`fixed inset-y-0 right-0 w-full sm:w-[450px] glass border-l border-gray-100 z-[60] transform transition-transform duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${showHistory ? 'translate-x-0 shadow-[0_0_100px_rgba(0,0,0,0.1)]' : 'translate-x-full'}`}>
          <div className="h-full flex flex-col pt-24 md:pt-0">
            <header className="h-24 flex items-center justify-between px-10 border-b border-gray-100/50">
              <div className="space-y-1">
                <h3 className="text-[12px] font-black uppercase tracking-[0.4em]">The Vault</h3>
                <p className="text-[9px] text-gray-300 font-bold uppercase tracking-[0.2em]">Stored Insights</p>
              </div>
              <button 
                onClick={() => setShowHistory(false)} 
                className="w-12 h-12 rounded-full hover:bg-white flex items-center justify-center transition-colors group"
              >
                <X size={20} className="text-gray-400 group-hover:text-pink-600" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto p-10 space-y-8">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-10 gap-8 grayscale">
                  <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center">
                    <BookOpen size={32} className="text-pink-600" />
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest">Library Empty</p>
                </div>
              ) : (
                history.map((item, idx) => (
                  <div 
                    key={idx}
                    onClick={() => { setResult(item); setStep('result'); setShowHistory(false); setIsTyping(false); }}
                    className="p-10 rounded-[40px] bg-white border border-gray-100 hover:border-pink-200 hover:shadow-2xl hover:shadow-pink-500/5 transition-all duration-500 cursor-pointer group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Zap size={16} className="text-pink-100" />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-pink-500 uppercase tracking-widest">{item.readingTimeSaved} Saved</span>
                        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{new Date(item.timestamp).toLocaleDateString()}</span>
                      </div>
                      <h5 className="font-bold text-xl tracking-tighter text-[#0F172A] group-hover:text-pink-600 transition-colors line-clamp-2">{item.title}</h5>
                      <p className="text-xs text-gray-400 font-light italic truncate">{item.author}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {history.length > 0 && (
              <footer className="p-10 border-t border-gray-100/50">
                <button 
                  onClick={() => { localStorage.removeItem('readle_history'); setHistory([]); }}
                  className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 hover:text-red-400 transition-colors"
                >
                  Purge Knowledge
                </button>
              </footer>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Summarizer;