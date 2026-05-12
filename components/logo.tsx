'use client';

import { Trophy } from 'lucide-react';
import { motion } from 'motion/react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 group cursor-default">
      <motion.div 
        whileHover={{ rotate: 15, scale: 1.1 }}
        className="relative flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-green-500 blur-md opacity-20 transition-opacity group-hover:opacity-40" />
        <div className="relative bg-gradient-to-br from-green-400 to-green-600 p-2 rounded-xl shadow-lg border border-green-300/20">
          <Trophy size={20} className="text-slate-950" strokeWidth={2.5} />
        </div>
      </motion.div>
      <div className="flex flex-col">
        <h1 className="text-xl font-display font-black tracking-tighter leading-none text-white uppercase italic">
          SQUAD<span className="text-green-500">SORT</span>
        </h1>
        <span className="text-[8px] font-black tracking-[0.3em] text-slate-500 uppercase leading-none mt-1">
          Professional Tool
        </span>
      </div>
    </div>
  );
}
