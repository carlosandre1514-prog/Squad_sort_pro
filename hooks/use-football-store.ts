'use client';

import { useState, useEffect } from 'react';
import { Player, Team, PlayerType, Tournament, Match, Round } from '@/types/football';
import { getAuthService, getFirestoreService, handleFirestoreError, OperationType } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

const STORAGE_KEY = 'sorteador_futebol_players';
const TOURNAMENT_KEY = 'sorteador_futebol_tournament';

export function useFootballStore() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Handle Auth
  useEffect(() => {
    const auth = getAuthService();
    if (!auth) return;
    
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setIsLoaded(true);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Sync with Firestore (Global Collection)
  useEffect(() => {
    const db = getFirestoreService();
    if (!db) {
       // Fallback for SSR/Testing
       if (typeof window !== 'undefined') {
          const saved = window.localStorage.getItem(STORAGE_KEY);
          if (saved) {
            try { setPlayers(JSON.parse(saved)); } catch (e) {}
          }
          setIsLoaded(true);
       }
       return;
    }

    const q = collection(db, 'players');
    
    const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
      const remotePlayers: Player[] = [];
      snapshot.forEach((doc) => {
        remotePlayers.push(doc.data() as Player);
      });
      
      remotePlayers.sort((a, b) => b.createdAt - a.createdAt);
      setPlayers(remotePlayers);
      setIsLoaded(true);
    }, (error) => {
      console.error('Firestore sync error:', error);
      // Optional: fallback to local if firestore fails
      if (!isLoaded && typeof window !== 'undefined') {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            setPlayers(JSON.parse(saved));
          } catch (e) {
            console.error('Local backup failed:', e);
          }
        }
        setIsLoaded(true);
      }
    });

    return () => unsubscribeFirestore();
  }, []);

  // Sync to localStorage as backup
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
      if (tournament) {
        window.localStorage.setItem(TOURNAMENT_KEY, JSON.stringify(tournament));
      }
    }
  }, [players, tournament, isLoaded]);

  // Load tournament from local
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem(TOURNAMENT_KEY);
      if (saved) {
        try {
          setTournament(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to load tournament', e);
        }
      }
    }
  }, []);

  const addPlayer = async (name: string, type: PlayerType, rating: number) => {
    const id = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : Math.random().toString(36).substring(2, 15);
      
    const newPlayer: Player = {
      id,
      name,
      type,
      rating,
      isActive: true,
      createdAt: Date.now(),
      ownerId: user?.uid || 'anonymous'
    };

    try {
      const db = getFirestoreService();
      if (!db) return;
      await setDoc(doc(db, 'players', newPlayer.id), newPlayer);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `players/${newPlayer.id}`);
    }
  };

  const removePlayer = async (id: string) => {
    try {
      const db = getFirestoreService();
      if (!db) return;
      await deleteDoc(doc(db, 'players', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `players/${id}`);
    }
  };

  const togglePlayerActive = async (id: string) => {
    const player = players.find(p => p.id === id);
    if (!player) return;

    try {
      const db = getFirestoreService();
      if (!db) return;
      await updateDoc(doc(db, 'players', id), { isActive: !player.isActive });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `players/${id}`);
    }
  };

  const updatePlayerRating = async (id: string, rating: number) => {
    try {
      const db = getFirestoreService();
      if (!db) return;
      await updateDoc(doc(db, 'players', id), { rating });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `players/${id}`);
    }
  };

  const renamePlayer = async (id: string, name: string) => {
    if (!name.trim()) return;
    try {
      const db = getFirestoreService();
      if (!db) return;
      await updateDoc(doc(db, 'players', id), { name: name.trim() });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `players/${id}`);
    }
  };

  const clearAllPlayers = async () => {
    if (!confirm('Tem certeza que deseja apagar TODOS os jogadores do cadastro?')) return;
    
    const db = getFirestoreService();
    if (!db) {
       setPlayers([]);
       if (typeof window !== 'undefined') {
         window.localStorage.removeItem(STORAGE_KEY);
       }
       return;
    };
    
    const batchPromises = players.map(p => deleteDoc(doc(db, 'players', p.id)));
    
    try {
      await Promise.all(batchPromises);
    } catch (error) {
      console.error('Error clearing database', error);
    }
  };

  const seedPlayers = async () => {
    const defaultPlayers = [
      { name: 'Neymar Jr', type: 'player', rating: 5 },
      { name: 'Vinícius Jr', type: 'player', rating: 5 },
      { name: 'Casemiro', type: 'player', rating: 4 },
      { name: 'Marquinhos', type: 'player', rating: 4 },
      { name: 'Alisson Becker', type: 'goalkeeper', rating: 5 },
      { name: 'Ederson', type: 'goalkeeper', rating: 5 },
      { name: 'Richarlison', type: 'player', rating: 4 },
      { name: 'Paquetá', type: 'player', rating: 4 },
      { name: 'Rodrygo', type: 'player', rating: 4 },
      { name: 'Raphinha', type: 'player', rating: 4 },
      { name: 'Danilo', type: 'player', rating: 3 },
      { name: 'Gabriel Magalhães', type: 'player', rating: 4 },
    ];

    const db = getFirestoreService();
    if (!db) {
       // Local only if no DB
       const seeded = defaultPlayers.map(p => ({
         ...p,
         id: Math.random().toString(36).substring(2, 11),
         isActive: true,
         createdAt: Date.now(),
         ownerId: 'local'
       })) as Player[];
       setPlayers(seeded);
       return;
    }

    for (const p of defaultPlayers) {
      await addPlayer(p.name, p.type as PlayerType, p.rating);
    }
  };

  const bulkAddPlayers = async (names: string[], type: PlayerType, rating: number) => {
    const newPlayers: Player[] = names.map(name => ({
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      name: name.trim(),
      type,
      rating,
      isActive: true,
      createdAt: Date.now(),
      ownerId: user?.uid || 'anonymous'
    })).filter(p => p.name.length > 0);

    const db = getFirestoreService();
    if (!db) return;
    for (const p of newPlayers) {
      try {
        await setDoc(doc(db, 'players', p.id), p);
      } catch (error) {
        console.error('Error bulk adding', error);
      }
    }
  };

  const drawTeams = (numTeams: number, playersPerTeam: number): Team[] | string => {
    const activePlayers = players.filter(p => p.isActive);
    
    if (activePlayers.length < numTeams) {
      return `Jogadores insuficientes para formar ${numTeams} times. Mínimo de 1 por time.`;
    }

    const shuffled = [...activePlayers].sort(() => Math.random() - 0.5);
    const goalies = shuffled.filter(p => p.type === 'goalkeeper');
    const outfield = shuffled.filter(p => p.type === 'player');

    const resultTeams: Team[] = Array.from({ length: numTeams }, (_, i) => ({
      id: `team-${i + 1}-${Date.now()}`,
      name: `Time ${i + 1}`,
      players: [],
      averageRating: 0,
      points: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      wins: 0,
      draws: 0,
      losses: 0
    }));

    // Distribute goalies
    goalies.forEach((g, i) => {
      if (i < numTeams) {
        resultTeams[i].players.push(g);
      } else {
        outfield.push(g);
      }
    });

    // Fill teams
    outfield.sort((a, b) => b.rating - a.rating);
    
    // Group slots available after goalies
    let currentOutfieldIndex = 0;
    for (let t = 0; t < numTeams; t++) {
      while (resultTeams[t].players.length < playersPerTeam && currentOutfieldIndex < outfield.length) {
        resultTeams[t].players.push(outfield[currentOutfieldIndex]);
        currentOutfieldIndex++;
      }
    }

    // Calculate average ratings
    resultTeams.forEach(team => {
      if (team.players.length > 0) {
        const total = team.players.reduce((sum, p) => sum + p.rating, 0);
        team.averageRating = total / team.players.length;
      }
    });

    return resultTeams;
  };

  const generateTournament = (teams: Team[]) => {
    const tournamentTeams = teams.map(t => ({ ...t }));
    const teamIds = tournamentTeams.map(t => t.id);
    
    // Add bye if odd
    if (teamIds.length % 2 !== 0) {
      teamIds.push('bye');
    }

    const n = teamIds.length;
    const rounds: Round[] = [];
    const numRounds = n - 1;
    const matchesPerRound = n / 2;

    for (let r = 0; r < numRounds; r++) {
      const roundMatches: Match[] = [];
      for (let m = 0; m < matchesPerRound; m++) {
        const t1Idx = (r + m) % (n - 1);
        let t2Idx = (n - 1 - m + r) % (n - 1);

        if (m === 0) {
          t2Idx = n - 1;
        }

        const team1Id = teamIds[t1Idx];
        const team2Id = teamIds[t2Idx];

        if (team1Id !== 'bye' || team2Id !== 'bye') {
          roundMatches.push({
            id: `match-${r}-${m}-${Date.now()}`,
            team1Id: team1Id === 'bye' ? team2Id : team1Id,
            team2Id: team1Id === 'bye' || team2Id === 'bye' ? null : (team1Id === teamIds[t1Idx] ? team2Id : team1Id),
            score1: undefined,
            score2: undefined,
            finished: false
          });
        }
      }
      rounds.push({ number: r + 1, matches: roundMatches });
    }

    const newTournament: Tournament = {
      teams: tournamentTeams,
      rounds: rounds
    };

    setTournament(newTournament);
    return newTournament;
  };

  const updateMatchScore = (matchId: string, score1: number, score2: number) => {
    if (!tournament) return;

    const newRounds = tournament.rounds.map(round => ({
      ...round,
      matches: round.matches.map(match => {
        if (match.id === matchId) {
          return { ...match, score1, score2, finished: true };
        }
        return match;
      })
    }));

    // Recalculate standings
    const newTeams = tournament.teams.map(team => ({
      ...team,
      points: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      wins: 0,
      draws: 0,
      losses: 0
    }));

    newRounds.forEach(round => {
      round.matches.forEach(match => {
        if (match.finished && match.team2Id) {
          const t1 = newTeams.find(t => t.id === match.team1Id);
          const t2 = newTeams.find(t => t.id === match.team2Id);

          if (t1 && t2 && match.score1 !== undefined && match.score2 !== undefined) {
            t1.goalsFor += match.score1;
            t1.goalsAgainst += match.score2;
            t2.goalsFor += match.score2;
            t2.goalsAgainst += match.score1;

            if (match.score1 > match.score2) {
              t1.points += 3;
              t1.wins += 1;
              t2.losses += 1;
            } else if (match.score1 < match.score2) {
              t2.points += 3;
              t2.wins += 1;
              t1.losses += 1;
            } else {
              t1.points += 1;
              t2.points += 1;
              t1.draws += 1;
              t2.draws += 1;
            }
          }
        }
      });
    });

    setTournament({
      teams: newTeams,
      rounds: newRounds
    });
  };

  const resetTournament = () => {
    setTournament(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(TOURNAMENT_KEY);
    }
  };

  return {
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
    user,
  };
}
