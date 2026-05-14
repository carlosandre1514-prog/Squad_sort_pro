export type PlayerType = 'player' | 'goalkeeper';

export interface Player {
  id: string;
  name: string;
  type: PlayerType;
  rating: number;
  isActive: boolean;
  ownerId?: string;
  createdAt: number;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
  averageRating: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  wins: number;
  draws: number;
  losses: number;
}

export interface Match {
  id: string;
  team1Id: string;
  team2Id: string | null; // null means bye
  score1?: number;
  score2?: number;
  finished: boolean;
}

export interface Round {
  number: number;
  matches: Match[];
}

export interface Tournament {
  teams: Team[];
  rounds: Round[];
}
