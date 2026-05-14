import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Racha da Resenha",
  description: "O melhor gerenciador de peladas. Sorteio de times e chaveamento profissional.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export const viewport = {
  themeColor: "#16a34a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased selection:bg-green-500 selection:text-black bg-slate-950`}>
        {children}
      </body>
    </html>
  );
}
