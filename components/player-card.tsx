'use client';

import React, { useState } from 'react';
import { Player } from '@/types/football';
import { Trash2, ShieldCheck, LayoutGrid, CheckCircle2, Circle, Star, Pencil } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  onRemove: () => void;
  onToggle: () => void;
  onRate: (rating: number) => void;
  onRename: (name: string) => void;
}

export function PlayerCard({ 
  player, 
  onToggle, 
  onRemove, 
  onRate,
  onRename 
}: PlayerCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(player.name);

  const handleRename = () => {
    if (editName.trim() && editName !== player.name) {
      onRename(editName);
    }
    setIsEditing(false);
  };

  return (
    <div className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between ${player.isActive ? 'bg-slate-900 border-slate-800' : 'bg-slate-950/50 border-slate-900 opacity-60'}`}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button 
          onClick={onToggle} 
          className={`shrink-0 transition-all duration-200 transform active:scale-90 ${player.isActive ? 'text-green-500' : 'text-slate-700'}`}
        >
          {player.isActive ? <CheckCircle2 size={20} /> : <Circle size={20} />}
        </button>
        <div className="flex flex-col min-w-0 flex-1">
          {isEditing ? (
            <input
              autoFocus
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              className="bg-slate-950 border border-green-500/50 rounded px-2 py-0.5 text-sm text-white outline-none w-full"
            />
          ) : (
            <div className="flex items-center gap-2 group/name">
              <span 
                onClick={() => setIsEditing(true)}
                className={`text-sm font-bold truncate max-w-[150px] transition-colors cursor-pointer hover:text-green-400 ${player.isActive ? 'text-white' : 'text-slate-500'}`}
                title="Clique para renomear"
              >
                {player.name}
              </span>
              <Pencil 
                size={10} 
                className="text-slate-600 opacity-0 group-hover/name:opacity-100 transition-opacity cursor-pointer"
                onClick={() => setIsEditing(true)}
              />
            </div>
          )}
          <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black flex items-center gap-1.5 mt-0.5">
             {player.type === 'goalkeeper' ? <ShieldCheck size={10} className="text-amber-500" /> : <LayoutGrid size={10} className="text-green-500" />}
             {player.type === 'goalkeeper' ? 'Goleiro' : 'Linha'}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
         <div className="flex gap-1 items-center">
            {[1,2,3,4,5].map(r => (
              <button 
                key={`rate-${player.id}-${r}`} 
                className="p-0.5"
                onClick={() => onRate(r)}
                title={`Nível ${r}`}
              >
                <Star 
                  size={12} 
                  className={`transition-all duration-200 ${
                    r <= player.rating ? 'fill-green-500 text-green-500' : 'text-slate-800'
                  }`} 
                />
              </button>
            ))}
         </div>
         <button 
           onClick={onRemove} 
           className="p-1.5 text-slate-700 hover:text-red-500 transition-all opacity-40 group-hover:opacity-100 shrink-0 ml-1"
         >
            <Trash2 size={14} />
         </button>
      </div>
    </div>
  );
}
