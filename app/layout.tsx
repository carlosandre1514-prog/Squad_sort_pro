import type {Metadata} from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Sorteador Pro | Futebol',
  description: 'Sorteio inteligente de times de futebol com equilíbrio de nível.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className={`${spaceGrotesk.variable} ${inter.variable} dark`}>
      <body className="bg-slate-950 text-slate-200 font-sans antialiased selection:bg-green-500 selection:text-black min-h-screen">
        {children}
      </body>
    </html>
  );
}
