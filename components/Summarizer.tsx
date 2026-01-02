
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
    
    const opt = {
      margin: 10,
      filename: `${result.title.replace(/\s+/g, '_')}_readle_Folio.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        backgroundColor: '#ffffff',
        windowWidth: 1024, // Fix viewport width for consistent alignment
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
      // @ts-ignore
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF Export failed:", err);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col overflow-x-hidden relative">
      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl h-16 glass border border-gray-100 rounded-full flex items-center justify-between px-6 md:px-10 z-50 shadow-xl shadow-gray-200/20">
        <div 
          className="flex items-center gap-3 md:gap-4 cursor-pointer group" 
          onClick={step === 'result' ? handleReset : onBack}
        >
          <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center transition-all group-hover:border-pink-500 bg-white/50">
            <ArrowLeft size={14} className="text-gray-400 group-hover:text-pink-600" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
              <BookOpen size={14} className="text-[#0F172A]" />
            </div>
            <span className="font-bold tracking-tighter text-xl lowercase hidden sm:inline">readle.</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${showHistory ? 'text-pink-600' : 'text-gray-400 hover:text-[#0F172A]'}`}
          >
            <HistoryIcon size={12} /> <span className="hidden xs:inline">Vault</span>
          </button>
        </div>
      </header>

      <main className="flex-1 relative flex flex-col pt-32">
        {step === 'input' && (
          <div className="max-w-2xl mx-auto w-full px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2">
                  <div className="w-8 h-px bg-pink-200"></div>
                  <h2 className="text-[10px] font-black text-pink-600 uppercase tracking-[0.4em]">The Inquiry</h2>
                </div>
                <h1 className="text-4xl md:text-6xl font-medium tracking-tighter text-[#0F172A] leading-tight">
                  What are we <br/><span className="italic text-gray-300 font-light">distilling today?</span>
                </h1>
              </div>

              <div className="space-y-10">
                <div className="flex gap-4 p-1.5 bg-white/50 backdrop-blur rounded-2xl border border-gray-100 shadow-sm">
                  <button onClick={() => setInputMode(InputMode.PASTE)} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${inputMode === InputMode.PASTE ? 'bg-[#0F172A] text-white' : 'text-gray-400'}`}>Paste Text</button>
                  <button onClick={() => setInputMode(InputMode.DETAILS)} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${inputMode === InputMode.DETAILS ? 'bg-[#0F172A] text-white' : 'text-gray-400'}`}>Search Title</button>
                </div>

                <div className="space-y-6">
                  {inputMode === InputMode.PASTE ? (
                    <textarea
                      className="w-full h-80 p-8 rounded-[32px] bg-white border border-gray-100 focus:border-pink-300 focus:ring-8 focus:ring-pink-50 outline-none resize-none transition-all text-sm leading-relaxed"
                      placeholder="Paste the excerpt..."
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                    />
                  ) : (
                    <div className="space-y-6">
                      <input 
                        className="w-full px-8 py-6 rounded-3xl bg-white border border-gray-100 focus:border-pink-300 outline-none transition-all text-xl font-medium tracking-tight"
                        placeholder="Book Title"
                        value={bookDetails.title}
                        onChange={(e) => setBookDetails({...bookDetails, title: e.target.value})}
                      />
                      <div className="grid grid-cols-2 gap-6">
                        <input className="px-8 py-5 rounded-2xl bg-white border border-gray-100 outline-none text-sm" placeholder="Author" value={bookDetails.author} onChange={(e) => setBookDetails({...bookDetails, author: e.target.value})} />
                        <input className="px-8 py-5 rounded-2xl bg-white border border-gray-100 outline-none text-sm" placeholder="Genre" value={bookDetails.genre} onChange={(e) => setBookDetails({...bookDetails, genre: e.target.value})} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Density</span>
                    <div className="flex gap-1 p-1 bg-gray-50 rounded-xl">
                      {Object.values(SummaryLength).map((l) => (
                        <button key={l} onClick={() => setLength(l)} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${length === l ? 'bg-[#0F172A] text-white' : 'text-gray-400'}`}>{l}</button>
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleGenerate} disabled={inputMode === InputMode.PASTE ? textInput.length < 50 : !bookDetails.title} className="w-full sm:w-auto">Distill Insight</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="h-full min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-12">
            <div className="w-40 h-40 bg-white rounded-[56px] shadow-2xl border border-pink-50 flex items-center justify-center animate-pulse">
               <Sparkles className="text-pink-600" size={48} />
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-4xl font-light text-[#0F172A]">Refining Knowledge</h3>
              <p className="text-gray-400 italic">"In the garden of the mind, knowledge is the seed..."</p>
            </div>
          </div>
        )}

        {step === 'result' && result && (
          <div className="max-w-4xl mx-auto w-full px-6 py-12 md:py-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div id="folio-card" className="bg-white rounded-[48px] p-8 md:p-20 shadow-xl border border-gray-50 overflow-hidden">
              <div className="space-y-16">
                <header className="space-y-8">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em] bg-pink-50 px-3 py-1 rounded-full">{result.readingTimeSaved} Saved</span>
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">{new Date(result.timestamp).toLocaleDateString()}</span>
                  </div>
                  <div className="space-y-4">
                    <h1 className="text-5xl md:text-8xl font-medium tracking-tighter text-[#0F172A] leading-tight">{result.title}</h1>
                    <p className="text-2xl text-gray-400 font-light italic">by {result.author}</p>
                  </div>
                </header>

                <div className="prose prose-slate max-w-none">
                  <div className="text-gray-600 text-xl md:text-2xl leading-relaxed font-light">
                    {isTyping ? <Typewriter text={result.summary} speed={4} onComplete={() => setIsTyping(false)} /> : <p>{result.summary}</p>}
                  </div>
                </div>

                <div className="pt-20 border-t border-gray-50 grid md:grid-cols-2 gap-16">
                  <div className="space-y-8">
                    <h4 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#0F172A]"><Zap size={16} className="text-pink-600" /> Key Insights</h4>
                    <ul className="space-y-6">
                      {result.keyTakeaways.map((point, idx) => (
                        <li key={idx} className="space-y-2">
                          <div className="h-1 w-12 bg-pink-100 rounded-full"></div>
                          <p className="text-gray-500 font-light">{point}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col justify-end items-end gap-10">
                    <div className="flex gap-4 w-full sm:w-auto">
                      <button onClick={() => navigator.clipboard.writeText(result.summary)} className="w-16 h-16 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-pink-600 transition-all"><Copy size={24} /></button>
                      <button onClick={handleDownloadPdf} disabled={isExporting || isTyping} className="flex-1 px-12 h-16 rounded-full bg-[#0F172A] text-white text-[11px] font-black uppercase tracking-widest shadow-lg active:scale-95 disabled:opacity-50">
                        {isExporting ? "Exporting..." : <><Download size={18} className="inline mr-2" /> Download PDF</>}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="py-24 text-center">
              <button onClick={handleReset} className="inline-flex items-center gap-4 py-5 px-10 rounded-full border border-gray-200 bg-white/70 backdrop-blur-md shadow-sm hover:shadow-xl transition-all group">
                <ArrowLeft className="text-gray-400 group-hover:text-pink-600" size={18} />
                <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 group-hover:text-[#0F172A]">New Session</span>
              </button>
            </div>
          </div>
        )}

        <div className={`fixed inset-y-0 right-0 w-full sm:w-[450px] glass border-l border-gray-100 z-[60] transform transition-transform duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${showHistory ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-full flex flex-col">
            <header className="h-24 flex items-center justify-between px-10 border-b border-gray-100/50">
              <h3 className="text-[12px] font-black uppercase tracking-[0.4em]">The Vault</h3>
              <button onClick={() => setShowHistory(false)} className="w-12 h-12 rounded-full hover:bg-white flex items-center justify-center"><X size={20} className="text-gray-400" /></button>
            </header>
            <div className="flex-1 overflow-y-auto p-10 space-y-8">
              {history.map((item, idx) => (
                <div key={idx} onClick={() => { setResult(item); setStep('result'); setShowHistory(false); setIsTyping(false); }} className="p-8 rounded-[40px] bg-white border border-gray-100 hover:border-pink-200 transition-all cursor-pointer">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-[9px] font-black text-pink-500 uppercase tracking-widest">{item.readingTimeSaved} Saved</span>
                      <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                    <h5 className="font-bold text-lg text-[#0F172A] line-clamp-1">{item.title}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Summarizer;
