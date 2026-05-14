'use client';

import { useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <h2 className="text-4xl font-display font-black text-white mb-4">OPS!</h2>
      <p className="text-slate-400 mb-8 font-bold uppercase tracking-widest text-[10px]">Algo deu errado de forma inesperada.</p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-slate-950 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-green-500 transition-all"
      >
        <RotateCcw size={14} />
        Tentar Novamente
      </button>
    </div>
  );
}
