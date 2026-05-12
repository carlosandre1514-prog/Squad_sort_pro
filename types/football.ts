export type PlayerType = 'player' | 'goalkeeper';

export interface Player {
  id: string;
  name: string;
  type: PlayerType;
  rating: number; // 1-5 for players, 1-3 for goalkeepers
  isActive: boolean; // toggle if participating in current draw
  createdAt: number;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
  totalRating: number;
}
