"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Hero } from "@/components/brand-forge/Hero";
import { AssetsLibrary } from "@/components/brand-forge/AssetsLibrary";
import { BannerForge } from "@/components/brand-forge/BannerForge";
import { Guidelines } from "@/components/brand-forge/Guidelines";
import { Footer } from "@/components/brand-forge/Footer";
import { useStore } from "@/store/useStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { ModeToggle } from "@/components/mode-toggle";
import {
  LayoutGrid,
  Paintbrush,
  BookOpen,
  Users,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function Home() {
  const { activeTab, setActiveTab } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const navItems = [
    { id: "home", label: "HOME", icon: Sparkles, color: "text-primary" },
    {
      id: "assets",
      label: "ASSETS",
      icon: LayoutGrid,
      color: "text-secondary",
    },
    {
      id: "forge",
      label: "BANNER FORGE",
      icon: Paintbrush,
      color: "text-primary",
    },
    {
      id: "guidelines",
      label: "GUIDELINES",
      icon: BookOpen,
      color: "text-secondary",
    },
    {
      id: "community",
      label: "COMMUNITY",
      icon: Users,
      color: "text-primary",
    },
  ];

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#0046FF", "#73C8D2", "#F5F1DC"],
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-background text-foreground overflow-hidden font-sans selection:bg-primary selection:text-foreground">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary opacity-10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary opacity-10 blur-[150px] pointer-events-none" />

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-xl z-30 relative">
        <h1 className="text-xl font-bold tracking-tighter flex items-center gap-2">
          <span>BULK</span>
          <span className="text-primary neon-text-blue">BRAND FORGE</span>
        </h1>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav
        className={`fixed md:relative top-[73px] md:top-0 left-0 w-64 h-[calc(100vh-73px)] md:h-full border-r border-border bg-background/95 md:bg-background/80 backdrop-blur-xl flex flex-col z-40 md:z-20 transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="hidden md:block p-6 border-b border-border">
          <h1 className="text-2xl font-bold tracking-tighter flex flex-col">
            <span>BULK</span>
            <span className="text-primary neon-text-blue">BRAND FORGE</span>
          </h1>
          <p className="text-[10px] text-muted-foreground font-mono mt-2 uppercase tracking-widest">
            One Exchange • Infinite Flex
          </p>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (isMobile) setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 font-mono text-sm ${
                  isActive
                    ? `bg-muted border border-border ${item.color} shadow-[0_0_15px_rgba(0,0,0,0.5)]`
                    : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? item.color : "text-muted-foreground"}`}
                />
                <span className="tracking-wider">{item.label}</span>
                {isActive && !isMobile && (
                  <motion.span
                    layoutId="activeTabIndicator"
                    className={`absolute left-0 w-1 h-8 rounded-r-full ${item.color.replace("text-", "bg-")}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="p-6 border-t border-border flex items-center justify-between">
          <span className="text-xs font-mono text-muted-foreground">v1.0.0 // BULK TRADE</span>
          <div className="hidden md:block">
            <ModeToggle />
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden top-[73px]"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 h-[calc(100vh-73px)] md:h-full overflow-y-auto relative z-10 custom-scrollbar scroll-smooth">
        <div className="min-h-full p-8 md:p-12 lg:p-16 max-w-7xl mx-auto flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex-1 flex flex-col"
            >
              {activeTab === "home" && <Hero />}
              {activeTab === "assets" && <AssetsLibrary />}
              {activeTab === "forge" && <BannerForge />}
              {activeTab === "guidelines" && <Guidelines />}
              {activeTab === "community" && (
                <div className="flex-1 flex flex-col items-center justify-center py-20">
                  <div className="glass-panel p-12 rounded-2xl border border-secondary/30 text-center max-w-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <h2 className="text-4xl font-bold mb-4 neon-text-light relative z-10">
                      COMMUNITY VIBES
                    </h2>
                    <p className="text-muted-foreground mb-10 text-lg relative z-10">
                      Generate random banners, download the full kit, and join
                      the fam.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 relative z-10">
                      <button
                        className="px-8 py-4 bg-transparent border border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-foreground transition-all duration-300 neon-border-blue uppercase tracking-widest text-sm"
                        onClick={() => {
                          triggerConfetti();
                          setTimeout(() => setActiveTab("forge"), 1000);
                        }}
                      >
                        Vibe Generator
                      </button>
                      <button
                        className="px-8 py-4 bg-secondary text-background font-bold rounded-lg hover:bg-[#ffffff] transition-all duration-300 shadow-[0_0_20px_rgba(213,219,230,0.4)] uppercase tracking-widest text-sm"
                        onClick={triggerConfetti}
                      >
                        Download Full Kit (.ZIP)
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {activeTab !== "forge" && <Footer />}
        </div>
      </main>
    </div>
  );
}
