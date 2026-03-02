"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Copy, Check, ArrowDown } from "lucide-react";
import confetti from "canvas-confetti";

export function AssetsLibrary() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#0099ff", "#d5dbe6", "#FFFFFF"],
    });
  };

  const handleDownload = async (e: React.MouseEvent, url: string, filename: string) => {
    e.stopPropagation();
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed", error);
      // Fallback
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      link.click();
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Logos Section */}
      <section>
        <div className="flex items-end justify-between mb-12 border-b border-border pb-4">
          <div>
            <h2 className="text-5xl font-bold uppercase tracking-tighter">
              LOGOS
            </h2>
            <p className="text-muted-foreground font-mono mt-2">
              Core brand identifiers
            </p>
          </div>
          <button
            className="flex items-center space-x-2 text-xs font-mono text-primary hover:text-foreground transition-colors uppercase tracking-widest"
            onClick={triggerConfetti}
          >
            <Download className="w-4 h-4" /> <span>Download All Logos</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {["Primary Logo", "Icon Only", "Wordmark", "Monochrome"].map(
            (logo, i) => (
              <div key={i} className="group flex flex-col">
                <div className="h-48 bg-muted border border-border flex items-center justify-center relative overflow-hidden group-hover:border-primary transition-colors p-8">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={`https://api.dicebear.com/7.x/shapes/svg?seed=logo${i}&backgroundColor=transparent`}
                      alt={logo}
                      fill
                      className={`object-contain transition-transform duration-500 group-hover:scale-110 ${i === 3 ? "grayscale" : ""}`}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-4 border border-t-0 border-border bg-background flex flex-col space-y-4">
                  <div>
                    <h3 className="font-bold uppercase tracking-wider">
                      {logo}
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      Standard usage
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-muted border border-border hover:border-primary hover:text-primary transition-colors text-xs font-mono uppercase tracking-widest flex items-center justify-center">
                      PNG
                    </button>
                    <button className="flex-1 py-2 bg-muted border border-border hover:border-[#d5dbe6] hover:text-secondary transition-colors text-xs font-mono uppercase tracking-widest flex items-center justify-center">
                      SVG
                    </button>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </section>

      {/* Colors Section */}
      <section>
        <div className="flex items-end justify-between mb-12 border-b border-border pb-4">
          <div>
            <h2 className="text-5xl font-bold uppercase tracking-tighter">
              COLORS
            </h2>
            <p className="text-muted-foreground font-mono mt-2">
              The Bulk Trade palette
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-border">
          {[
            {
              name: "Neon Purple",
              hex: "#0099ff",
              text: "white",
              bg: "bg-primary",
            },
            {
              name: "Neon Green",
              hex: "#d5dbe6",
              text: "black",
              bg: "bg-secondary",
            },
            {
              name: "Dark Background",
              hex: "#04070d",
              text: "white",
              bg: "bg-background",
            },
            {
              name: "Muted Gray",
              hex: "#2a2a2a",
              text: "white",
              bg: "bg-[#2a2a2a]",
            },
          ].map((color, i) => (
            <div
              key={i}
              className={`flex flex-col border-r border-border last:border-r-0 ${i > 1 ? "border-t sm:border-t-0 lg:border-t-0" : ""} ${i === 1 ? "border-t-0 sm:border-t-0" : ""}`}
            >
              <div
                className={`h-40 ${color.bg} flex items-end p-6 relative group`}
              >
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="font-bold text-xl uppercase tracking-wider mix-blend-difference text-foreground relative z-10">
                  {color.name}
                </span>
              </div>
              <div className="flex items-center justify-between bg-background p-4 border-t border-border">
                <span className="font-mono text-sm tracking-widest">
                  {color.hex}
                </span>
                <button
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => handleCopy(color.hex)}
                >
                  {copied === color.hex ? (
                    <Check className="h-4 w-4 text-secondary" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography Section */}
      <section>
        <div className="flex items-end justify-between mb-12 border-b border-border pb-4">
          <div>
            <h2 className="text-5xl font-bold uppercase tracking-tighter">
              TYPOGRAPHY
            </h2>
            <p className="text-muted-foreground font-mono mt-2">Fonts and weights</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-border bg-background p-8 flex flex-col h-full">
            <div className="mb-8">
              <h3 className="font-sans text-3xl font-bold uppercase tracking-tighter">
                Plus Jakarta Sans
              </h3>
              <p className="text-muted-foreground font-mono text-sm mt-2 uppercase tracking-widest">
                Primary Font - Headings & Display
              </p>
            </div>
            <div className="space-y-6 flex-1">
              <div className="font-sans text-5xl font-bold tracking-tighter">
                Aa Bb Cc Dd Ee
              </div>
              <div className="font-sans text-2xl font-medium leading-tight">
                The quick brown fox jumps over the lazy dog.
              </div>
              <div className="font-sans text-sm text-muted-foreground tracking-widest">
                0123456789 !@#$%^&*()
              </div>
            </div>
            <button
              className="mt-8 w-full py-4 bg-muted border border-border hover:border-primary hover:text-primary transition-colors font-mono text-xs uppercase tracking-widest flex items-center justify-center"
              onClick={() =>
                handleCopy("font-family: 'Plus Jakarta Sans', sans-serif;")
              }
            >
              {copied === "font-family: 'Plus Jakarta Sans', sans-serif;" ? (
                <Check className="mr-2 h-4 w-4 text-secondary" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              Copy CSS
            </button>
          </div>

          <div className="border border-border bg-background p-8 flex flex-col h-full">
            <div className="mb-8">
              <h3 className="font-mono text-3xl font-bold uppercase tracking-tighter">
                IBM Plex Mono
              </h3>
              <p className="text-muted-foreground font-mono text-sm mt-2 uppercase tracking-widest">
                Secondary Font - Data & Code
              </p>
            </div>
            <div className="space-y-6 flex-1">
              <div className="font-mono text-4xl font-bold tracking-tighter">
                Aa Bb Cc Dd Ee
              </div>
              <div className="font-mono text-xl font-medium leading-tight">
                The quick brown fox jumps over the lazy dog.
              </div>
              <div className="font-mono text-sm text-muted-foreground tracking-widest">
                0123456789 !@#$%^&*()
              </div>
            </div>
            <button
              className="mt-8 w-full py-4 bg-muted border border-border hover:border-[#d5dbe6] hover:text-secondary transition-colors font-mono text-xs uppercase tracking-widest flex items-center justify-center"
              onClick={() =>
                handleCopy("font-family: 'IBM Plex Mono', monospace;")
              }
            >
              {copied === "font-family: 'IBM Plex Mono', monospace;" ? (
                <Check className="mr-2 h-4 w-4 text-secondary" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              Copy CSS
            </button>
          </div>
        </div>
      </section>

      {/* Stickers Section */}
      <section>
        <div className="flex items-end justify-between mb-12 border-b border-border pb-4">
          <div>
            <h2 className="text-5xl font-bold uppercase tracking-tighter">
              STICKERS
            </h2>
            <p className="text-muted-foreground font-mono mt-2">
              Community elements & memes (/public/stickers)
            </p>
          </div>
          <button
            className="flex items-center space-x-2 text-xs font-mono text-secondary hover:text-foreground transition-colors uppercase tracking-widest"
            onClick={triggerConfetti}
          >
            <Download className="w-4 h-4" /> <span>Download Pack</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px bg-[#2a2a2a] border border-border">
          {Array.from({ length: 18 }).map((_, i) => {
            const url = `https://api.dicebear.com/7.x/bottts/svg?seed=sticker${i}&backgroundColor=transparent`;
            return (
              <div
                key={i}
                className="aspect-square bg-background flex flex-col items-center justify-center hover:bg-muted transition-colors cursor-pointer group relative overflow-hidden p-4"
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={url}
                    alt={`Sticker ${i + 1}`}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-125 p-4"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest mt-2 relative z-10">
                  Sticker {i + 1}
                </span>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm z-20">
                  <button 
                    onClick={(e) => handleDownload(e, url, `sticker-${i+1}.svg`)}
                    className="p-3 bg-primary text-foreground rounded-full hover:bg-foreground hover:text-primary transition-colors"
                  >
                    <ArrowDown className="h-6 w-6" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Backgrounds Section */}
      <section>
        <div className="flex items-end justify-between mb-12 border-b border-border pb-4">
          <div>
            <h2 className="text-5xl font-bold uppercase tracking-tighter">
              BACKGROUNDS
            </h2>
            <p className="text-muted-foreground font-mono mt-2">
              Brand textures and environments (/public/backgrounds)
            </p>
          </div>
          <button
            className="flex items-center space-x-2 text-xs font-mono text-primary hover:text-foreground transition-colors uppercase tracking-widest"
            onClick={triggerConfetti}
          >
            <Download className="w-4 h-4" /> <span>Download Pack</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => {
            const url = `https://picsum.photos/seed/bulkbg${i}/800/400?blur=2`;
            return (
              <div key={i} className="group relative aspect-video bg-muted border border-border overflow-hidden rounded-lg">
                <Image src={url} alt={`Background ${i+1}`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                  <button 
                    onClick={(e) => handleDownload(e, url, `background-${i+1}.jpg`)} 
                    className="p-4 bg-background/80 backdrop-blur-md text-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                  >
                    <Download className="h-6 w-6" />
                  </button>
                  <span className="mt-4 font-mono text-xs tracking-widest text-white uppercase">Background {i+1}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3D Assets Section */}
      <section>
        <div className="flex items-end justify-between mb-12 border-b border-border pb-4">
          <div>
            <h2 className="text-5xl font-bold uppercase tracking-tighter">
              3D ASSETS
            </h2>
            <p className="text-muted-foreground font-mono mt-2">
              Rendered brand objects (/public/3d-assets)
            </p>
          </div>
          <button
            className="flex items-center space-x-2 text-xs font-mono text-secondary hover:text-foreground transition-colors uppercase tracking-widest"
            onClick={triggerConfetti}
          >
            <Download className="w-4 h-4" /> <span>Download Pack</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => {
            const url = `main/public/3d-assets/tpose_back.pngseed=bulk3d${i}&backgroundColor=transparent`;
            return (
              <div key={i} className="group relative aspect-square bg-muted/50 border border-border overflow-hidden rounded-lg p-6 flex flex-col items-center justify-center hover:bg-muted transition-colors duration-300">
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image src={url} alt={`3D Asset ${i+1}`} fill className="object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 drop-shadow-2xl" referrerPolicy="no-referrer" />
                </div>
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center z-20">
                  <button 
                    onClick={(e) => handleDownload(e, url, `3d-asset-${i+1}.svg`)} 
                    className="p-3 bg-secondary text-secondary-foreground rounded-full hover:bg-foreground hover:text-background transition-all duration-300 transform scale-90 group-hover:scale-100"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                  <span className="mt-3 font-mono text-[10px] tracking-widest text-foreground uppercase">Asset {i+1}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
