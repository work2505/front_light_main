import { Tables } from "./supabase";

type IntroItem = {
  title: string;
  subtitle?: string;
  imageURL: string;
};

type ReferredPlayer = {
  isNew: boolean;
  referralUsername: string;
  reward: number;
};

export type User = {
  id: string;
  honeyLatest: number;
  honeyMax: number;
  balance: number;
  tgId: string;
  isPremium: true;
  userName: string;
  referralProfit: number;
  createdAt: string;
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
  }[];
};

export type Referral = {
  created_at?: string;
  id?: number;
};

export type Rank = {
  id: string;
  bonusAmount: number;
  description: string;
  rank: number;
  name: string;
  requiredAmount: number;
};

export type Quest = {
  id: string;
  link: string;
  reward: number;
  terms: string;
  description: string;
  media: {
    id: string;
    fileName: string;
    filePath: string;
    size: string;
    mimeType: string;
    originalName: string;
    fileType: string;
    questId: string;
    createdAt: string;
    updatedAt: string;
  };
};

interface RefQuest {
  id: string;
  referralCount: number;
  reward: number;
  isCompleted: boolean;
}

interface UserQuest {
  id: string;
  link: string;
  reward: number;
  terms: string;
  description: string;
  completed: boolean;
  completeDate: string;
  media: {
    id: string;
    fileName: string;
    filePath: string;
    size: string;
    mimeType: string;
    originalName: string;
    fileType: string;
    questId: string;
    createdAt: string;
    updatedAt: string;
  };
}

type AllQuests = {
  refQuest: RefQuest;
  userQuests: UserQuest[];
};

type TFriendsRequest = {
  totalCount: number,
  referrals: Tables<"ref_friends">[];
  earnedFromReferrals: number;
  totalPages: number;
}
