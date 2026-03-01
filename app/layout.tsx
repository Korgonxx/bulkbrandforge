import type { Metadata } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Mono, Anton, Space_Grotesk, Outfit } from "next/font/google";
import "./globals.css"; // Global styles
import { ThemeProvider } from "@/components/theme-provider";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
});

const anton = Anton({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-anton",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "BULK BRAND FORGE",
  description:
    "The official interactive brand kit website for Bulk Trade (Solana perp DEX). One Exchange • Infinite Flex.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${plexMono.variable} ${anton.variable} ${spaceGrotesk.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <body
        className="antialiased min-h-screen flex flex-col"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
