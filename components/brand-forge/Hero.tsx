"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Upload, Sparkles, Image as ImageIcon, ArrowRight } from "lucide-react";
import { useStore } from "@/store/useStore";
import confetti from "canvas-confetti";

export function Hero() {
  const { setActiveTab } = useStore();

  const handleLucky = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#0046FF", "#0066ff", "#ffffff"],
    });
    setTimeout(() => setActiveTab("forge"), 1000);
  };

  return (
    <div className="flex flex-col items-start justify-center min-h-[70vh] space-y-12 py-12">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="inline-block px-3 py-1 border border-primary text-primary text-xs font-mono tracking-widest uppercase rounded-full bg-primary/10 mb-4">
          Official Brand Kit v1.0
        </div>
        <h1 className="text-6xl md:text-8xl lg:text-[120px] font-bold tracking-tighter leading-[0.85] uppercase">
          BULK BRAND <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary neon-text-blue">
            FORGE
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-mono tracking-widest uppercase max-w-2xl mt-8">
          One Exchange • Infinite Flex. The ultimate toolkit for the Bulk Trade
          ecosystem.
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-wrap gap-6 mt-12"
      >
        <button
          onClick={() => setActiveTab("assets")}
          className="group relative px-8 py-4 bg-foreground text-background font-bold text-lg uppercase tracking-widest overflow-hidden"
        >
          <span className="relative z-10 flex items-center">
            Explore Assets{" "}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
          <span className="absolute inset-0 bg-secondary transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out" />
        </button>

        <button
          onClick={() => setActiveTab("forge")}
          className="group relative px-8 py-4 bg-transparent border border-border text-foreground font-bold text-lg uppercase tracking-widest overflow-hidden hover:border-primary transition-colors"
        >
          <span className="relative z-10 flex items-center">
            <ImageIcon className="mr-2 w-5 h-5 text-primary" /> Open Forge
          </span>
        </button>

        <button
          onClick={handleLucky}
          className="group relative px-8 py-4 bg-transparent border border-primary text-primary font-bold text-lg uppercase tracking-widest overflow-hidden hover:bg-primary hover:text-foreground transition-colors neon-border-blue"
        >
          <span className="relative z-10 flex items-center">
            <Sparkles className="mr-2 w-5 h-5" /> I Feel Lucky
          </span>
        </button>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        onClick={() => setActiveTab("forge")}
        className="w-full max-w-3xl mt-20 glass-panel p-8 rounded-none border border-border hover:border-primary/50 transition-colors cursor-pointer group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(0,153,255,0.3)] transition-all">
              <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold uppercase tracking-wider">
                Quick Brand Treatment
              </h3>
              <p className="text-muted-foreground font-mono text-sm mt-1">
                Upload image → Auto-apply neon glow & dither
              </p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
      </motion.div>
    </div>
  );
}
