export interface player {
  id: string;
  honeyLatest: number;
  honeyMax: number;
  balance: GLfloat;
  lastLogin: string;
  lastLogout: string;
  levelId: string;
  referredById: string;
  rankId: string;
  tgId: string;
  isPremium: boolean;
  userName: string;
  createdAt: string;
  bossStreak: number;
  lastBossDate: string;
  referralProfit: number;
  farmingDate: string;
  farmingEndDate: string;
  playersOrcs: {
    id: string;
    playerId: string;
    bossStreak: number;
    hp: number;
  };
  playerRanks: {
    id: string;
    playerId: string;
    rankId: string;
    achievedAt: string;
    rank: {
      id: string;
      bonusAmount: number;
      description: string;
      rank: number;
      name: string;
      requiredAmount: number;
    };
  };
}
