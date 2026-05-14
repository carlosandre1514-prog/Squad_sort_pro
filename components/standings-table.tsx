'use client';

import React from 'react';
import { Team } from '@/types/football';
import { Trophy, TrendingUp, Minus } from 'lucide-react';

interface StandingsTableProps {
  teams: Team[];
}

export function StandingsTable({ teams }: StandingsTableProps) {
  // Sort teams based on criteria: 1. Points, 2. Wins, 3. Goal Difference
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.wins !== a.wins) return b.wins - a.wins;
    return (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <h3 className="text-xl font-display font-black text-white uppercase italic tracking-tighter flex items-center gap-2">
          <Trophy className="text-green-500" size={20} />
          Classificação <span className="text-green-500">Geral</span>
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-950/50 border-b border-slate-800">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Pos</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Time</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">P</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">V</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">SG</th>
              <th className="hidden sm:table-cell px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">GP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {sortedTeams.map((team, idx) => (
              <tr key={team.id} className="hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <span className={`w-6 h-6 flex items-center justify-center rounded-md text-[10px] font-black shadow-sm ${
                    idx === 0 ? 'bg-green-500 text-slate-950' : 
                    idx === 1 ? 'bg-slate-700 text-slate-300' :
                    idx === 2 ? 'bg-slate-800 text-slate-500' : 'text-slate-600'
                  }`}>
                    {idx + 1}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-white uppercase italic group-hover:text-green-500 transition-colors">
                      {team.name}
                    </span>
                    <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest">
                      {team.players.length} Jogadores
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-lg font-black text-green-500">{team.points}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-bold text-slate-300">{team.wins}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp size={10} className={team.goalsFor - team.goalsAgainst >= 0 ? 'text-green-500' : 'text-red-500'} />
                    <span className="text-sm font-bold text-slate-300">
                      {team.goalsFor - team.goalsAgainst}
                    </span>
                  </div>
                </td>
                <td className="hidden sm:table-cell px-6 py-4 text-center">
                  <span className="text-sm font-bold text-slate-500">{team.goalsFor}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {teams.length === 0 && (
        <div className="p-20 text-center space-y-4">
          <Minus className="mx-auto text-slate-800" size={40} />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Nenhum time registrado no torneio</p>
        </div>
      )}
    </div>
  );
}
