"use client";

import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";

export function CreatorPopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Show popup after a short delay
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!showPopup) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="bg-[#0a0a0a] border border-white/10 w-72 flex flex-col rounded-xl overflow-hidden shadow-2xl p-5 relative">
        <button 
          onClick={() => setShowPopup(false)} 
          className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase tracking-tighter text-white leading-tight">Built by @korgonxx</h3>
            <p className="text-[10px] text-white/60 font-mono mt-0.5">Support the creator</p>
          </div>
        </div>
        <a 
          href="https://x.com/korgonxx" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full py-2 px-3 bg-white text-black hover:bg-white/90 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 uppercase tracking-wider text-[10px]"
          onClick={() => setShowPopup(false)}
        >
          Follow me on X
        </a>
      </div>
    </div>
  );
}
