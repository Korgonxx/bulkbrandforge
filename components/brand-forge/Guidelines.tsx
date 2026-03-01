"use client";

import { CheckCircle2, XCircle } from "lucide-react";

export function Guidelines() {
  return (
    <div className="space-y-24 pb-20">
      <div className="space-y-4 mb-12 border-b border-border pb-8">
        <h2 className="text-5xl font-bold uppercase tracking-tighter">
          BRAND GUIDELINES
        </h2>
        <p className="text-muted-foreground font-mono mt-2 max-w-2xl">
          The Bulk brand is bold, unapologetic, and highly recognizable. Follow
          these rules to ensure consistency across the ecosystem.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Do's */}
        <div className="border border-secondary/50 bg-background p-8 flex flex-col">
          <div className="flex items-center text-secondary text-3xl font-bold uppercase tracking-tighter mb-8 border-b border-[#d5dbe6]/20 pb-4">
            <CheckCircle2 className="mr-4 h-8 w-8" /> DO
          </div>
          <div className="space-y-8">
            <div className="space-y-2">
              <h4 className="font-bold text-xl uppercase tracking-wider">
                Use the exact hex codes
              </h4>
              <p className="text-muted-foreground font-mono text-sm">
                Always use #0099ff for blue and #d5dbe6 for light grey. Never
                approximate.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-xl uppercase tracking-wider">
                Maintain contrast
              </h4>
              <p className="text-muted-foreground font-mono text-sm">
                Ensure neon elements are placed on dark backgrounds (#04070d or
                #1b1a14) for maximum pop.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-xl uppercase tracking-wider">
                Give logos breathing room
              </h4>
              <p className="text-muted-foreground font-mono text-sm">
                Leave clear space around the logo equal to the height of the
                &quot;B&quot; icon.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-xl uppercase tracking-wider">
                Use Plus Jakarta Sans for headings
              </h4>
              <p className="text-muted-foreground font-mono text-sm">
                All primary titles and call-to-actions should use Plus Jakarta Sans
                font.
              </p>
            </div>
          </div>
        </div>

        {/* Don'ts */}
        <div className="border border-[#FF4444]/50 bg-background p-8 flex flex-col">
          <div className="flex items-center text-[#FF4444] text-3xl font-bold uppercase tracking-tighter mb-8 border-b border-[#FF4444]/20 pb-4">
            <XCircle className="mr-4 h-8 w-8" /> DON&apos;T
          </div>
          <div className="space-y-8">
            <div className="space-y-2">
              <h4 className="font-bold text-xl uppercase tracking-wider">
                Don&apos;t alter the logo
              </h4>
              <p className="text-muted-foreground font-mono text-sm">
                Never stretch, skew, or rotate the primary logo or icon.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-xl uppercase tracking-wider">
                Don&apos;t use neon on light backgrounds
              </h4>
              <p className="text-muted-foreground font-mono text-sm">
                Neon colors lose their impact and legibility on white or light
                gray backgrounds.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-xl uppercase tracking-wider">
                Don&apos;t mix font families
              </h4>
              <p className="text-muted-foreground font-mono text-sm">
                Stick to Plus Jakarta Sans and IBM Plex Mono. Do not introduce new
                fonts.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-xl uppercase tracking-wider">
                Don&apos;t overdo the glow
              </h4>
              <p className="text-muted-foreground font-mono text-sm">
                Use glows purposefully to highlight key elements, not on every
                single component.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Examples */}
      <div className="mt-24 space-y-8">
        <h3 className="text-3xl font-bold uppercase tracking-tighter border-b border-border pb-4">
          VISUAL EXAMPLES
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-border bg-background p-8 flex flex-col items-center justify-center space-y-6 relative overflow-hidden group">
            <div className="absolute top-4 left-4 bg-secondary text-background text-[10px] font-mono uppercase tracking-widest font-bold px-3 py-1">
              CORRECT
            </div>
            <div className="w-full h-48 bg-background border border-border flex items-center justify-center group-hover:border-secondary/50 transition-colors">
              <span className="text-5xl font-bold text-foreground neon-text-blue tracking-tighter">
                BULK TRADE
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-mono uppercase tracking-widest text-center">
              High contrast, clear typography, purposeful glow.
            </p>
          </div>
          <div className="border border-border bg-background p-8 flex flex-col items-center justify-center space-y-6 relative overflow-hidden group">
            <div className="absolute top-4 left-4 bg-[#FF4444] text-foreground text-[10px] font-mono uppercase tracking-widest font-bold px-3 py-1">
              INCORRECT
            </div>
            <div className="w-full h-48 bg-foreground border border-border flex items-center justify-center group-hover:border-[#FF4444]/50 transition-colors">
              <span className="text-5xl font-bold text-secondary shadow-[0_0_15px_#d5dbe6] tracking-tighter">
                BULK TRADE
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-mono uppercase tracking-widest text-center">
              Low contrast, neon on light background.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
