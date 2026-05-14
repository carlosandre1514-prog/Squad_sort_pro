'use client';

import { Team } from '@/types/football';
import { Trophy, Users, Swords, ChevronLeft } from 'lucide-react';

interface BracketsViewProps {
  teams: Team[];
  onBack: () => void;
}

export function BracketsView({ teams, onBack }: BracketsViewProps) {
  const matches = [];
  for (let i = 0; i < teams.length; i += 2) {
    if (i + 1 < teams.length) {
      matches.push({ team1: teams[i], team2: teams[i+1] });
    } else {
      matches.push({ team1: teams[i], team2: null });
    }
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
        >
          <ChevronLeft size={16} />
          Voltar para Times
        </button>
        <div className="text-right">
          <h2 className="text-2xl font-display font-black tracking-tighter text-white uppercase italic">
            CHAVEAMENTO <span className="text-green-500">CONFRONTOS</span>
          </h2>
          <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Defina quem joga contra quem</p>
        </div>
      </header>

      <div className="space-y-6">
        {matches.map((match, idx) => (
          <div key={`match-container-${idx}`} className="relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-950 px-4 py-1 rounded-full border border-slate-800 z-10">
              <span className="text-[10px] font-black italic text-green-500 uppercase tracking-widest">Jogo {idx + 1}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900 border border-slate-800 p-8 rounded-3xl justify-around">
              {/* Team 1 */}
              <div className="flex flex-col items-center gap-4 min-w-[120px]">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700">
                  <span className="text-2xl font-black italic text-white">{idx * 2 + 1}</span>
                </div>
                <h4 className="text-lg font-display font-black text-white uppercase italic text-center truncate max-w-[120px]">
                  {match.team1.name}
                </h4>
                <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">
                  Power: {match.team1.averageRating.toFixed(1)}
                </span>
              </div>

              {/* VS */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-slate-950 font-black italic">
                  <Swords size={20} />
                </div>
              </div>

              {/* Team 2 */}
              <div className="flex flex-col items-center gap-4 min-w-[120px]">
                {match.team2 ? (
                  <>
                    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700">
                      <span className="text-2xl font-black italic text-white">{idx * 2 + 2}</span>
                    </div>
                    <h4 className="text-lg font-display font-black text-white uppercase italic text-center truncate max-w-[120px]">
                      {match.team2.name}
                    </h4>
                    <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">
                      Power: {match.team2.averageRating.toFixed(1)}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-slate-800/10 border-2 border-dashed border-slate-800 rounded-2xl flex items-center justify-center">
                      <Users size={20} className="text-slate-800" />
                    </div>
                    <h4 className="text-sm font-display font-black text-slate-700 uppercase italic">ESPERANDO...</h4>
                    <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest italic">FOLGA / PRÓX. FASE</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl text-center space-y-4">
        <Trophy className="mx-auto text-green-500/50" size={32} />
        <div className="space-y-1">
          <p className="text-sm font-bold text-white uppercase tracking-tighter italic">Vencedores avançam para a final!</p>
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Os confrontos foram definidos pela ordem do sorteio</p>
        </div>
      </div>
    </div>
  );
}
