'use client';

import { useState, useEffect } from 'react';
import { Player, Team, PlayerType } from '@/types/football';

const STORAGE_KEY = 'sorteador_futebol_players';

export function useFootballStore() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    
    const initialize = () => {
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setPlayers((prev) => (prev.length === 0 ? parsed : prev));
        } catch (e) {
          console.error('Failed to load players', e);
        }
      }
      setIsLoaded(true);
    };

    const timeoutId = setTimeout(initialize, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
    }
  }, [players, isLoaded]);

  const addPlayer = (name: string, type: PlayerType, rating: number) => {
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name,
      type,
      rating,
      isActive: true,
      createdAt: Date.now(),
    };
    setPlayers((prev) => [newPlayer, ...prev]);
  };

  const removePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const togglePlayerActive = (id: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const updatePlayerRating = (id: string, rating: number) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, rating } : p))
    );
  };

  const drawTeams = (numTeams: number, playersPerTeam: number): Team[] | string => {
    const activePlayers = players.filter((p) => p.isActive);
    const goalkeepers = activePlayers.filter((p) => p.type === 'goalkeeper');
    const fieldPlayers = activePlayers.filter((p) => p.type === 'player');

    // Requirement: One goalkeeper per team minimum
    if (goalkeepers.length < numTeams) {
      return `Goleiros insuficientes. Você ativou ${goalkeepers.length} goleiros, mas precisa de ${numTeams} para ${numTeams} times.`;
    }

    // Requirement: Exact number of field players per team
    const totalFieldNeeded = numTeams * playersPerTeam;
    if (fieldPlayers.length < totalFieldNeeded) {
      return `Jogadores de linha insuficientes. Ative pelo menos ${totalFieldNeeded} jogadores para compor os times.`;
    }

    // Shuffle helper
    const shuffle = <T,>(array: T[]): T[] => {
      const newArr = [...array];
      for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
      }
      return newArr;
    };

    // Prepare teams
    let teams: Team[] = Array.from({ length: numTeams }, (_, i) => ({
      id: crypto.randomUUID(),
      name: `Time ${i + 1}`,
      players: [],
      totalRating: 0,
    }));

    // Assign exactly one random goalkeeper to each team
    const shuffledGKs = shuffle(goalkeepers);
    for (let i = 0; i < numTeams; i++) {
      teams[i].players.push(shuffledGKs[i]);
      teams[i].totalRating += shuffledGKs[i].rating;
    }

    // Pick necessary field players and shuffle them
    const pool = shuffle(fieldPlayers).slice(0, totalFieldNeeded);

    // Sort pool by rating descending to balance
    pool.sort((a, b) => b.rating - a.rating);

    // Greedy distribution of field players to balance total rating
    pool.forEach((player) => {
      // Find team with lowest total rating that still needs field players
      // Each team needs 1 (GK) + playersPerTeam (Line)
      const targetTeam = teams
        .filter((t) => t.players.length < playersPerTeam + 1)
        .sort((a, b) => a.totalRating - b.totalRating)[0];

      if (targetTeam) {
        targetTeam.players.push(player);
        targetTeam.totalRating += player.rating;
      }
    });

    return teams;
  };

  return {
    players,
    addPlayer,
    removePlayer,
    togglePlayerActive,
    updatePlayerRating,
    drawTeams,
    isLoaded,
  };
}
