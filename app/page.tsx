'use client';

import { useFootballStore } from '@/hooks/use-football-store';
import { AddPlayerForm } from '@/components/add-player-form';
import { PlayerCard } from '@/components/player-card';
import { useState } from 'react';
import { Team } from '@/types/football';
import { Trophy, Users, LayoutGrid, RotateCcw, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StarRating } from '@/components/star-rating';
import { Logo } from '@/components/logo';

export default function Home() {
  const {
    players,
    addPlayer,
    removePlayer,
    togglePlayerActive,
    updatePlayerRating,
    drawTeams,
    isLoaded
  } = useFootballStore();

  const [numTeams, setNumTeams] = useState(2);
  const [perTeam, setPerTeam] = useState(5);
  const [result, setResult] = useState<Team[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activePlayers = players.filter(p => p.isActive);
  const goalkeepers = activePlayers.filter(p => p.type === 'goalkeeper');
  const fieldPlayers = activePlayers.filter(p => p.type === 'player');

  const handleDraw = () => {
    const outcome = drawTeams(numTeams, perTeam);
    if (typeof outcome === 'string') {
      setError(outcome);
      setResult(null);
    } else {
      setResult(outcome);
      setError(null);
    }
  };

  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <RotateCcw className="text-green-500" size={40} />
      </motion.div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-950 text-slate-200">
      {/* Sidebar: Player Database */}
      <aside className="w-full lg:w-80 bg-slate-900 border-r border-slate-800 flex flex-col lg:h-screen lg:sticky lg:top-0 overflow-hidden">
        <div className="p-6 border-b border-slate-800 shrink-0">
          <Logo />
          <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest font-bold">Banco de Dados de Jogadores</p>
        </div>

        {/* Quick Add Form Section */}
        <div className="p-4 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          <section className="space-y-4">
            <AddPlayerForm onAdd={addPlayer} />
          </section>

          <section className="space-y-3 pb-4">
             <div className="flex items-center justify-between px-1">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Jogadores ({players.length})
                </h2>
                <div className="flex gap-2 text-[8px] uppercase font-bold text-slate-600">
                  <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Ativos</span>
                </div>
             </div>

            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {players.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 border border-dashed border-slate-800 rounded-2xl"
                  >
                    <p className="text-slate-600 text-xs italic">Nenhum jogador cadastrado.</p>
                  </motion.div>
                ) : (
                  [...players].sort((a,b) => b.createdAt - a.createdAt).map((p) => (
                    <PlayerCard
                      key={p.id}
                      player={p}
                      onRemove={removePlayer}
                      onToggle={togglePlayerActive}
                      onRate={updatePlayerRating}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>
        
        {/* Sidebar Footer Stats */}
        <div className="p-4 bg-slate-900/50 border-t border-slate-800 grid grid-cols-2 gap-2">
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/50">
              <p className="text-slate-500 text-[8px] font-bold uppercase tracking-tighter leading-none mb-1">Linha</p>
              <p className="text-sm font-black text-white">{fieldPlayers.length} <span className="text-[10px] text-slate-600">/ {players.filter(p => p.type === 'player').length}</span></p>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/50">
              <p className="text-slate-500 text-[8px] font-bold uppercase tracking-tighter leading-none mb-1">Goleiros</p>
              <p className="text-sm font-black text-blue-400">{goalkeepers.length} <span className="text-[10px] text-slate-600">/ {players.filter(p => p.type === 'goalkeeper').length}</span></p>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-6 lg:p-10 overflow-y-auto custom-scrollbar">
        {/* Configuration Header */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden group">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-600/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Qtd. de Times</label>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setNumTeams(Math.max(2, numTeams - 1))}
                className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl font-bold hover:bg-slate-700 transition-colors"
              >-</button>
              <span className="text-3xl font-display font-black text-white w-8 text-center">{numTeams}</span>
              <button 
                onClick={() => setNumTeams(numTeams + 1)}
                className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl font-bold hover:bg-slate-700 transition-colors"
              >+</button>
            </div>
          </div>

          <div className="space-y-3 md:border-x md:border-slate-800 md:px-10">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Linha / Time (+ Goleiro)</label>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setPerTeam(Math.max(2, perTeam - 1))}
                className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl font-bold hover:bg-slate-700 transition-colors"
              >-</button>
              <span className="text-3xl font-display font-black text-white w-8 text-center">{perTeam}</span>
              <button 
                onClick={() => setPerTeam(perTeam + 1)}
                className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl font-bold hover:bg-slate-700 transition-colors"
              >+</button>
            </div>
            <p className="text-[9px] text-slate-600 font-bold uppercase italic text-center">Cada time terá {perTeam} na linha + 1 no gol</p>
          </div>

          <div className="flex flex-col justify-center">
            <button 
              onClick={handleDraw}
              className="h-14 bg-green-600 hover:bg-green-500 text-white font-black rounded-2xl shadow-xl shadow-green-950/20 flex items-center justify-center gap-3 transition-all active:scale-[0.97] uppercase tracking-widest text-sm"
            >
              <RotateCcw className="w-5 h-5" />
              SORTEAR AGORA
            </button>
          </div>
        </section>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-red-500/10 border border-red-500/20 p-5 rounded-2xl flex items-start gap-3"
          >
            <AlertCircle className="text-red-500 shrink-0" size={20} />
            <p className="text-red-400 text-sm font-bold uppercase tracking-tight">{error}</p>
          </motion.div>
        )}

        {/* Results Grid */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="h-full min-h-[300px] flex flex-col items-center justify-center text-center space-y-4 rounded-[40px] border-2 border-dashed border-slate-900"
              >
                <div className="bg-slate-900 p-6 rounded-full">
                  <LayoutGrid size={48} className="text-slate-800" />
                </div>
                <div>
                  <h3 className="text-slate-600 font-display font-bold text-lg">Nenhum sorteio realizado</h3>
                  <p className="text-slate-700 text-sm max-w-xs">Configure acima e clique em Sortear para ver a divisão dos times.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {result.map((team, idx) => (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-lg flex flex-col"
                  >
                    <div className="bg-slate-800/80 p-5 flex justify-between items-center border-b border-slate-800">
                      <div>
                        <h3 className="font-display font-black text-white uppercase tracking-wider">{team.name}</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Nível Total: {team.totalRating}</p>
                      </div>
                      <div className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-[10px] font-black tracking-tighter">
                        TEAM {idx + 1}
                      </div>
                    </div>
                    <div className="p-5 flex-1 space-y-2">
                      {team.players.map((p) => (
                        <div 
                          key={p.id} 
                          className="flex justify-between items-center p-3 bg-slate-950/40 rounded-xl border border-slate-800/50 transition-hover hover:border-slate-700"
                        >
                          <div className="flex items-center gap-3 truncate">
                            {p.type === 'goalkeeper' ? (
                              <div className="w-6 h-6 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center text-[8px] font-black shrink-0">GK</div>
                            ) : (
                              <div className="w-6 h-6 rounded bg-slate-800 text-slate-500 flex items-center justify-center text-[8px] font-black shrink-0">LIN</div>
                            )}
                            <span className="text-sm font-bold text-slate-300 truncate">{p.name}</span>
                          </div>
                          <StarRating rating={p.rating} max={p.type === 'player' ? 5 : 3} readOnly />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Status */}
        <footer className="mt-10 py-6 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center text-slate-500 text-[10px] gap-4 font-bold tracking-widest uppercase">
          <div className="flex gap-6">
            <span>Jogadores Ativos: <b className="text-green-500">{activePlayers.length}</b></span>
            <span>Nível Médio: <b className="text-white">
              {activePlayers.length > 0 ? (activePlayers.reduce((acc, curr) => acc + curr.rating, 0) / activePlayers.length).toFixed(1) : '0.0'}
            </b></span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Sincronizado com Memória Local
          </div>
        </footer>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
    </div>
  );
}
