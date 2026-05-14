'use client';

import { Trophy } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 group cursor-default">
      <div className="relative flex items-center justify-center transition-transform hover:scale-105 duration-200">
        <div className="absolute inset-0 bg-green-500 opacity-10 transition-opacity group-hover:opacity-30 rounded-xl" />
        <div className="relative bg-gradient-to-br from-green-400 to-green-600 p-2 rounded-xl border border-green-300/20">
          <Trophy size={20} className="text-slate-950" strokeWidth={2.5} />
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className="text-xl font-display font-black tracking-tighter leading-none text-white uppercase italic">
          RACHA DA <span className="text-green-500">RESENHA</span>
        </h1>
        <span className="text-[8px] font-black tracking-[0.3em] text-slate-500 uppercase leading-none mt-1">
          O PAI TÁ ON
        </span>
      </div>
    </div>
  );
}
