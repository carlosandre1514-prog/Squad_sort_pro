'use client';

import { Team } from '@/types/football';
import { ShieldCheck, Users, Star } from 'lucide-react';

interface TeamCardProps {
  team: Team;
  index: number;
}

export function TeamCard({ team, index }: TeamCardProps) {
  const avgRating = isNaN(team.averageRating) ? 0 : team.averageRating;
  
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
      <div className="bg-slate-800 p-4 px-6 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-green-500 text-slate-950 font-black italic">
            {index + 1}
          </div>
          <h3 className="font-display font-black text-xl text-white uppercase italic truncate max-w-[150px]">{team.name}</h3>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Média Técnica</span>
          <span className="text-sm font-black text-green-500">{avgRating.toFixed(1)}</span>
        </div>
      </div>
      <div className="p-4 space-y-2">
        {team.players.map(p => (
          <div key={`team-${index}-player-${p.id}`} className="flex items-center justify-between p-2 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              {p.type === 'goalkeeper' ? <ShieldCheck size={14} className="text-amber-500" /> : <Users size={14} className="text-green-500" />}
              <span className="text-sm font-medium text-slate-200 truncate max-w-[120px]">{p.name}</span>
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: Math.min(5, Math.max(0, Math.round(p.rating))) }).map((_, i) => (
                <Star key={`p-${p.id}-star-${i}`} size={8} className="fill-green-500 text-green-500" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
