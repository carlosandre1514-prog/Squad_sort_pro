'use client';

import React, { useState } from 'react';
import { AuthButton } from '@/components/auth-button';
import { Logo } from '@/components/logo';
import { AddPlayerForm } from '@/components/add-player-form';
import { PlayerCard } from '@/components/player-card';
import { TeamCard } from '@/components/team-card';
import { BracketsView } from '@/components/brackets-view';
import { TournamentView } from '@/components/tournament-view';
import { useFootballStore } from '@/hooks/use-football-store';
import { Team } from '@/types/football';
import { Trash2, RotateCcw, AlertCircle, ChevronRight, Minus, Plus, Trophy } from 'lucide-react';

type View = 'draw' | 'brackets' | 'tournament';

export default function Home() {
  const {
    players,
    tournament,
    addPlayer,
    bulkAddPlayers,
    removePlayer,
    togglePlayerActive,
    updatePlayerRating,
    renamePlayer,
    clearAllPlayers,
    seedPlayers,
    drawTeams,
    generateTournament,
    updateMatchScore,
    resetTournament,
    isLoaded,
    user
  } = useFootballStore();

  const [numTeams, setNumTeams] = useState(2);
  const [playersPerTeam, setPlayersPerTeam] = useState(5);
  const [generatedTeams, setGeneratedTeams] = useState<Team[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>(tournament ? 'tournament' : 'draw');

  const handleDraw = () => {
    const result = drawTeams(numTeams, playersPerTeam);
    if (typeof result === 'string') {
      setError(result);
      setGeneratedTeams(null);
    } else {
      setGeneratedTeams(result);
      setError(null);
      setView('draw');
    }
  };

  const handleSeed = async () => {
    await seedPlayers();
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden">
      {/* Sidebar */}
      <aside className="w-full lg:w-80 bg-slate-900 border-r border-slate-800 flex flex-col lg:h-screen lg:sticky lg:top-0 overflow-hidden">
        <div className="p-6 border-b border-slate-800 shrink-0 space-y-4">
          <Logo />
          <AuthButton user={user} />
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Banco de Dados</p>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          <AddPlayerForm onAdd={addPlayer} onBulkAdd={bulkAddPlayers} />
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Jogadores ({players.length})
              </h2>
              {players.length > 0 && (
                <button 
                  onClick={clearAllPlayers}
                  className="text-[8px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                >
                  <Trash2 size={8} />
                  Retirar Todos
                </button>
              )}
            </div>
            <div className="space-y-2">
              {players.map(player => (
                <PlayerCard 
                  key={player.id} 
                  player={player} 
                  onToggle={() => togglePlayerActive(player.id)}
                  onRemove={() => removePlayer(player.id)}
                  onRate={(r) => updatePlayerRating(player.id, r)}
                  onRename={(name) => renamePlayer(player.id, name)}
                />
              ))}

              {players.length === 0 && (
                <button 
                  onClick={handleSeed}
                  className="w-full py-6 border-2 border-dashed border-slate-800 rounded-3xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-green-500/50 hover:text-green-500 transition-all flex flex-col items-center gap-3 group"
                >
                  <div className="p-3 bg-slate-900 rounded-2xl group-hover:bg-green-500/10 group-hover:scale-110 transition-all">
                    <RotateCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                  </div>
                  Restaurar Lista Padrão
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto bg-slate-950">
        <div className="max-w-4xl mx-auto space-y-8">
          {view === 'draw' ? (
            <div className="space-y-8">
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                <div className="space-y-2">
                  <h2 className="text-3xl font-display font-black tracking-tighter text-white uppercase italic">
                    MONTAR <span className="text-green-500">PELADA</span>
                  </h2>
                  <p className="text-slate-400 text-sm">Organize seu racha com transparência e equilíbrio.</p>
                </div>
                
                <div className="flex items-center gap-4 bg-slate-950/50 p-2 rounded-2xl border border-slate-800">
                  <div className="flex flex-col gap-1 px-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Times</span>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setNumTeams(Math.max(2, numTeams - 1))}
                        className="p-1 hover:bg-slate-800 rounded-md transition-colors text-slate-400 hover:text-green-500"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-xl font-black text-green-500 min-w-[1.5rem] text-center">{numTeams}</span>
                      <button 
                        onClick={() => setNumTeams(numTeams + 1)}
                        className="p-1 hover:bg-slate-800 rounded-md transition-colors text-slate-400 hover:text-green-500"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-slate-800" />
                  <div className="flex flex-col gap-1 px-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Jogadores / Time</span>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setPlayersPerTeam(Math.max(1, playersPerTeam - 1))}
                        className="p-1 hover:bg-slate-800 rounded-md transition-colors text-slate-400 hover:text-green-500"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-xl font-black text-green-500 min-w-[1.5rem] text-center">{playersPerTeam}</span>
                      <button 
                        onClick={() => setPlayersPerTeam(playersPerTeam + 1)}
                        className="p-1 hover:bg-slate-800 rounded-md transition-colors text-slate-400 hover:text-green-500"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </header>

              <button 
                onClick={handleDraw}
                className="w-full py-6 bg-green-600 hover:bg-green-500 text-slate-950 font-display font-black text-xl uppercase tracking-widest rounded-3xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
              >
                <div className="group-hover:rotate-180 transition-transform duration-500">
                  <RotateCcw />
                </div>
                Sortear Equipes
              </button>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm">
                  <AlertCircle size={20} />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {generatedTeams?.map((team, idx) => (
                  <TeamCard key={`${team.name}-${idx}`} team={team} index={idx} />
                ))}
              </div>

              {generatedTeams && generatedTeams.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                  <button 
                    onClick={() => {
                      generateTournament(generatedTeams);
                      setView('tournament');
                    }}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-green-600 text-slate-950 font-display font-black uppercase tracking-widest rounded-2xl hover:bg-green-500 transition-all shadow-lg shadow-green-500/20 group"
                  >
                    <Trophy size={20} />
                    Iniciar Campeonato
                  </button>
                  
                  <button 
                    onClick={() => setView('brackets')}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 font-display font-black uppercase tracking-widest rounded-2xl transition-all group"
                  >
                    Chaveamento Simples
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          ) : view === 'brackets' ? (
            <div>
              <BracketsView 
                teams={generatedTeams || []} 
                onBack={() => setView('draw')} 
              />
            </div>
          ) : (
            <TournamentView 
              tournament={tournament!}
              onUpdateScore={updateMatchScore}
              onBack={() => setView('draw')}
              onReset={resetTournament}
            />
          )}
        </div>

        <footer className="mt-20 border-t border-slate-900 pt-8 pb-12 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] text-slate-600 uppercase font-bold tracking-[0.2em]">
          <div className="flex items-center gap-4">
             <Logo />
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Banco de Dados Global Ativo
          </div>
        </footer>
      </main>
    </div>
  );
}
