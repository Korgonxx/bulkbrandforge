import type { Metadata } from "next";
import { 
  Plus_Jakarta_Sans, 
  IBM_Plex_Mono, 
  Anton, 
  Space_Grotesk, 
  Outfit,
  Inter,
  Roboto,
  Playfair_Display,
  Cormorant_Garamond,
  Libre_Baskerville
} from "next/font/google";
import "./globals.css"; // Global styles
import { ThemeProvider } from "@/components/theme-provider";
import { CreatorPopup } from "@/components/CreatorPopup";

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

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
});

const libre = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-libre",
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
      className={`${jakarta.variable} ${plexMono.variable} ${anton.variable} ${spaceGrotesk.variable} ${outfit.variable} ${inter.variable} ${roboto.variable} ${playfair.variable} ${cormorant.variable} ${libre.variable}`}
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
          <CreatorPopup />
        </ThemeProvider>
      </body>
    </html>
  );
}
