'use client';

import { Player } from '@/types/football';
import { Trash2, Shield, Users } from 'lucide-react';
import { StarRating } from './star-rating';
import { motion } from 'motion/react';

interface PlayerCardProps {
  player: Player;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
  onRate: (id: string, rating: number) => void;
}

export function PlayerCard({ player, onRemove, onToggle, onRate }: PlayerCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group flex items-center justify-between p-3 rounded-xl border transition-all ${
        player.isActive
          ? 'bg-slate-800/40 border-slate-700/50 shadow-sm'
          : 'bg-slate-900 border-slate-900 opacity-40 grayscale'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          onClick={() => onToggle(player.id)}
          className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all text-[10px] font-bold ${
            player.isActive
              ? player.type === 'goalkeeper' 
                ? 'bg-blue-500/20 text-blue-400' 
                : 'bg-slate-700 text-slate-300'
              : 'bg-slate-800 text-slate-600'
          }`}
        >
          {player.type === 'goalkeeper' ? 'GK' : 'LIN'}
        </div>
        <div>
          <h3 className={`font-medium text-sm leading-tight ${player.isActive ? 'text-white' : 'text-slate-500'}`}>
            {player.name}
          </h3>
          <div className="flex items-center gap-2">
            <StarRating
              rating={player.rating}
              max={player.type === 'player' ? 5 : 3}
              onChange={(r) => onRate(player.id, r)}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          onClick={() => onToggle(player.id)}
          className={`relative inline-flex h-5 w-10 items-center rounded-full cursor-pointer transition-colors ${
            player.isActive ? 'bg-green-500' : 'bg-slate-700'
          }`}
        >
          <span
            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
              player.isActive ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </div>
        <button
          onClick={() => onRemove(player.id)}
          className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
}
