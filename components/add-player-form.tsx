'use client';

import { useState } from 'react';
import { Plus, Shield, Users } from 'lucide-react';
import { PlayerType } from '@/types/football';
import { StarRating } from './star-rating';
import { motion } from 'motion/react';

interface AddPlayerFormProps {
  onAdd: (name: string, type: PlayerType, rating: number) => void;
}

export function AddPlayerForm({ onAdd }: AddPlayerFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<PlayerType>('player');
  const [rating, setRating] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name, type, rating);
    setName('');
    // Reset defaults based on type
    setRating(type === 'player' ? 3 : 2);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl"
    >
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Nome do Craque</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Ronaldinho"
          className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-xl focus:outline-none focus:border-green-500 transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Posição</label>
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => { setType('player'); setRating(3); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                type === 'player' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Users size={16} />
              <span className="text-sm font-medium">Linha</span>
            </button>
            <button
              type="button"
              onClick={() => { setType('goalkeeper'); setRating(2); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                type === 'goalkeeper' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Shield size={16} />
              <span className="text-sm font-medium">Goleiro</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Nível</label>
          <div className="h-[42px] flex items-center justify-center bg-slate-950 rounded-xl border border-slate-800 px-4">
            <StarRating
              rating={rating}
              max={type === 'player' ? 5 : 3}
              onChange={setRating}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!name.trim()}
        className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:hover:bg-green-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98]"
      >
        <Plus size={20} />
        ADICIONAR
      </button>
    </motion.form>
  );
}
