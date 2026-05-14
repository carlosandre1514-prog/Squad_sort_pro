'use client';

import React, { useState } from 'react';
import { Tournament, Match } from '@/types/football';
import { StandingsTable } from './standings-table';
import { MatchTimer } from './match-timer';
import { ChevronLeft, Calendar, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TournamentViewProps {
  tournament: Tournament;
  onUpdateScore: (matchId: string, s1: number, s2: number) => void;
  onBack: () => void;
  onReset: () => void;
}

export function TournamentView({ tournament, onUpdateScore, onBack, onReset }: TournamentViewProps) {
  const [activeRound, setActiveRound] = useState(1);

  const getTeamName = (id: string) => {
    return tournament.teams.find(t => t.id === id)?.name || 'Desconhecido';
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-display font-black tracking-tighter text-white uppercase italic">
              TORNEIO <span className="text-green-500">RESENHA</span>
            </h2>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest flex items-center gap-2">
              <Calendar size={10} /> Round Robin / Todos contra Todos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <button 
            onClick={() => {
              if (confirm('Deseja realmente apagar o torneio atual e começar um novo?')) {
                onReset();
                onBack();
              }
            }}
            className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500 hover:text-white transition-all"
           >
            Resetar Torneio
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Standings & Timer */}
        <div className="lg:col-span-2 space-y-8">
          <StandingsTable teams={tournament.teams} />
          
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl flex items-start gap-4">
            <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
              <Info size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white uppercase italic">Regras de Classificação</h4>
              <p className="text-xs text-slate-400">
                A classificação é definida por: 1º Pontos, 2º Vitórias e 3º Saldo de Gols. 
                Vitória vale 3 pontos, Empate vale 1 e Derrota 0.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Rounds & Matches */}
        <div className="space-y-8">
          <MatchTimer />

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-display font-black text-white uppercase italic">Rodadas</h3>
              <div className="flex gap-2">
                {tournament.rounds.map(r => (
                  <button
                    key={r.number}
                    onClick={() => setActiveRound(r.number)}
                    className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${
                      activeRound === r.number
                        ? 'bg-green-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {r.number}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeRound}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  {tournament.rounds[activeRound - 1]?.matches.map(match => (
                    <MatchCard 
                      key={match.id} 
                      match={match} 
                      team1Name={getTeamName(match.team1Id)}
                      team2Name={match.team2Id ? getTeamName(match.team2Id) : 'FOLGA'}
                      onUpdateScore={(s1, s2) => onUpdateScore(match.id, s1, s2)}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MatchCard({ match, team1Name, team2Name, onUpdateScore }: { 
  match: Match; 
  team1Name: string; 
  team2Name: string;
  onUpdateScore: (s1: number, s2: number) => void;
}) {
  const [s1, setS1] = useState(match.score1?.toString() || '');
  const [s2, setS2] = useState(match.score2?.toString() || '');

  const isBye = team2Name === 'FOLGA';

  const handleSave = () => {
    const val1 = parseInt(s1);
    const val2 = parseInt(s2);
    if (!isNaN(val1) && !isNaN(val2)) {
      onUpdateScore(val1, val2);
    }
  };

  if (isBye) {
    return (
      <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl flex items-center justify-between italic">
        <span className="text-xs font-bold text-slate-400 uppercase">{team1Name}</span>
        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Descansa</span>
      </div>
    );
  }

  return (
    <div className={`p-5 rounded-2xl border transition-all ${
      match.finished ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-950 border-slate-800 shadow-xl'
    }`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 text-right">
          <p className="text-xs font-black text-white uppercase truncate">{team1Name}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            value={s1}
            onChange={(e) => setS1(e.target.value)}
            disabled={match.finished}
            className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-lg text-center font-black text-green-500 focus:border-green-500 outline-none transition-colors disabled:opacity-50"
          />
          <span className="text-slate-700 font-black text-xs">X</span>
          <input 
            type="number" 
            value={s2}
            onChange={(e) => setS2(e.target.value)}
            disabled={match.finished}
            className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-lg text-center font-black text-green-500 focus:border-green-500 outline-none transition-colors disabled:opacity-50"
          />
        </div>

        <div className="flex-1">
          <p className="text-xs font-black text-white uppercase truncate">{team2Name}</p>
        </div>
      </div>

      {!match.finished ? (
        <button 
          onClick={handleSave}
          disabled={s1 === '' || s2 === ''}
          className="w-full mt-4 py-2 bg-green-500 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-green-400 transition-colors disabled:opacity-50"
        >
          Salvar Placar
        </button>
      ) : (
        <button 
          onClick={handleSave}
          className="w-full mt-4 py-2 bg-slate-700 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-600 hover:text-white transition-colors"
        >
          Editar Resultado
        </button>
      )}
    </div>
  );
}
