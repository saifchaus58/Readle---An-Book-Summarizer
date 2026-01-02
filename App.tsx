import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Summarizer from './components/Summarizer';
import { LoadingScreen } from './components/LoadingScreen';

type ViewState = 'landing' | 'loading' | 'app';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');

  const startApp = () => {
    setView('loading');
    setTimeout(() => {
      setView('app');
    }, 5000); // 5 seconds loading as requested
  };

  return (
    <div className="antialiased selection:bg-pink-100 selection:text-pink-700">
      {view === 'landing' && (
        <div className="animate-in fade-in duration-1000">
          <LandingPage onStart={startApp} />
        </div>
      )}

      {view === 'loading' && <LoadingScreen />}

      {view === 'app' && (
        <div className="animate-in slide-in-from-bottom-4 fade-in duration-700">
          <Summarizer onBack={() => setView('landing')} />
        </div>
      )}
    </div>
  );
};

export default App;