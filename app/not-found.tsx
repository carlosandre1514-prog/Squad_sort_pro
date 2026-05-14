'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <h2 className="text-4xl font-display font-black text-white mb-4">404</h2>
      <p className="text-slate-400 mb-8 font-bold uppercase tracking-widest text-[10px]">Página não encontrada</p>
      <Link 
        href="/" 
        className="px-6 py-3 bg-green-600 text-slate-950 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-green-500 transition-all"
      >
        Voltar para o Início
      </Link>
    </div>
  );
}
