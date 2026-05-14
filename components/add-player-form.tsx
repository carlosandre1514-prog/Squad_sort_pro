'use client';

import React, { useState } from 'react';
import { Sparkles, UserPlus, Star } from 'lucide-react';
import { PlayerType } from '@/types/football';

interface AddPlayerFormProps {
  onAdd: (name: string, type: PlayerType, rating: number) => void;
  onBulkAdd: (names: string[], type: PlayerType, rating: number) => void;
}

export function AddPlayerForm({ 
  onAdd, 
  onBulkAdd 
}: AddPlayerFormProps) {
  const [name, setName] = useState('');
  const [bulkNames, setBulkNames] = useState('');
  const [isBulk, setIsBulk] = useState(false);
  const [type, setType] = useState<PlayerType>('player');
  const [rating, setRating] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBulk) {
      const names = bulkNames
        .split(/[\n,]+/)
        .map(n => n.trim())
        .filter(n => n.length > 0);
        
      if (names.length === 0) return;
      onBulkAdd(names, type, rating);
      setBulkNames('');
      setIsBulk(false);
    } else {
      if (!name.trim()) return;
      onAdd(name, type, rating);
      setName('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
          {isBulk ? 'Adição em Massa' : 'Novo Jogador'}
        </label>
        <button 
          type="button"
          onClick={() => setIsBulk(!isBulk)}
          className="text-[8px] font-black uppercase tracking-widest text-green-500 hover:text-green-400 underline underline-offset-4"
        >
          {isBulk ? 'Modo Simples' : 'Modo em Lista'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-slate-950/30 p-4 rounded-2xl border border-slate-800/50">
        {isBulk ? (
          <div className="space-y-2">
             <textarea 
               value={bulkNames}
               onChange={(e) => setBulkNames(e.target.value)}
               placeholder="João Silva&#10;Mateus Oliveira&#10;Lucas Santos..."
               rows={6}
               className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all text-sm font-medium"
             />
          </div>
        ) : (
          <div className="space-y-2">
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do craque..."
              className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all text-sm font-medium"
            />
          </div>
        )}

        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => setType('player')}
            className={`flex-1 p-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${type === 'player' ? 'bg-green-600 text-slate-950' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}
          >
            Linha
          </button>
          <button 
            type="button"
            onClick={() => setType('goalkeeper')}
            className={`flex-1 p-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${type === 'goalkeeper' ? 'bg-green-600 text-slate-950' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}
          >
            Goleiro
          </button>
        </div>

        <div className="flex items-center justify-between px-1">
          <div className="flex gap-1 group/stars">
            {[1,2,3,4,5].map(r => (
              <button 
                key={`rating-${r}`} 
                type="button" 
                onClick={() => setRating(r)}
                className="transition-transform hover:scale-125 active:scale-95"
              >
                <Star 
                  size={14} 
                  className={`${r <= rating ? 'fill-green-500 text-green-500' : 'text-slate-800'} transition-colors`} 
                />
              </button>
            ))}
          </div>
          
          <button 
            type="submit" 
            className="p-2 bg-green-500 rounded-lg text-slate-950 hover:bg-green-400 transition-all active:scale-90"
          >
            {isBulk ? <Sparkles size={16} /> : <UserPlus size={16} />}
          </button>
        </div>
      </form>
    </div>
  );
}
