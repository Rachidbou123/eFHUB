export interface PlayerStats {
  // Attacking
  offensiveAwareness: number;
  ballControl: number;
  dribbling: number;
  tightPossession: number;
  lowPass: number;
  loftedPass: number;
  finishing: number;
  heading: number;
  placeKicking: number;
  curl: number;

  // Defending
  defensiveAwareness: number;
  defensiveEngagement: number;
  tackling: number;
  aggression: number;

  // Goalkeeping
  gkAwareness: number;
  gkCatching: number;
  gkParrying: number;
  gkReflexes: number;
  gkReach: number;

  // Atlethicism
  speed: number;
  acceleration: number;
  kickingPower: number;
  jump: number;
  physicalContact: number;
  balance: number;
  stamina: number;
}

export type StatCategory =
  | 'shooting'
  | 'passing'
  | 'dribbling'
  | 'dexterity'
  | 'lowerBody'
  | 'aerial'
  | 'defending'
  | 'gk1'
  | 'gk2'
  | 'gk3';

export interface PointAllocation {
  shooting: number;
  passing: number;
  dribbling: number;
  dexterity: number;
  lowerBody: number;
  aerial: number;
  defending: number;
  gk1: number;
  gk2: number;
  gk3: number;
}

export interface Player {
  id: string; // e.g. "100105"
  name: string;
  shortName: string;
  avatar: string; // face image URL/placeholder
  rating: number; // Base rating
  maxRating: number; // Maximum potential
  position: 'ST' | 'CF' | 'SS' | 'LWF' | 'RWF' | 'AMF' | 'CMF' | 'DMF' | 'LMF' | 'RMF' | 'CB' | 'LB' | 'RB' | 'GK';
  cardType: 'epic' | 'bigtime' | 'showtime' | 'potw' | 'highlight' | 'standard' | 'legendary' | 'epic_highlight' | 'epic_special' | 'showtime_effect' | 'highlight_special' | 'highlight_special_alt';
  stars: 1 | 2 | 3 | 4 | 5;
  booster?: {
    name: string;
    stats: (keyof PlayerStats)[]; // stats boosted by booster
    value: number; // flat boost amount e.g. 2 or 3 or 4
  } | null;
  playstyle: string;
  nation: string;
  club: string;
  league: string;
  height: number; // cm
  weight: number; // kg
  age: number;
  preferredFoot: 'Right' | 'Left';
  weakFootUsage: 'Slightly' | 'Medium' | 'Regular' | 'Almost Never' | 'Often';
  weakFootAccuracy: 'Low' | 'Medium' | 'High' | 'Very High';
  form: 'Standard' | 'Unwavering' | 'Inconsistent';
  injuryResistance: 'Low' | 'Medium' | 'High';
  skills: string[];
  baseStats: PlayerStats;
  maxAllocation?: Partial<PointAllocation>; // optional pre-computed max paths
}

export interface Manager {
  id: string;
  name: string;
  avatar: string;
  possession: number;
  quickCounter: number;
  longBallCounter: number;
  outWide: number;
  longBall: number;
  bonusType: 'all' | 'speed' | 'passing' | 'defending' | 'shooting';
  bonusValue: number;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  league: string;
}

export interface SavedBuild {
  id: string;
  playerId: string;
  name: string;
  points: PointAllocation;
  managerId?: string | null;
  boosterEnabled: boolean;
  createdAt: string;
}

export interface SquadMember {
  position: string; // Pitch slot
  playerId: string | null;
  customBuild?: PointAllocation | null;
}

export interface Squad {
  id: string;
  name: string;
  managerId: string | null;
  playstyle: 'possession' | 'quickCounter' | 'longBallCounter' | 'outWide' | 'longBall';
  pitch: { [position: string]: string | null }; // map of slot key -> playerId
}

export interface CommunityPost {
  id: string;
  title: string;
  author: string;
  content: string;
  upvotes: number;
  commentsCount: number;
  tags: string[];
  playerId?: string | null;
  buildPoints?: PointAllocation | null;
  createdAt: string;
}
