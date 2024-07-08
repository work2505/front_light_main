'use client';

import { createClient } from '@/utils/supabase/client';
import * as React from 'react';
import { Database, Tables } from '../../types/supabase';

import { updatePlayerRank } from '@/services/network/AxiosService';

import { SupabaseClient } from '@supabase/supabase-js';
import { useInitData, useMiniApp } from '@tma.js/sdk-react';
import { ReferredPlayer } from '../../types/types';
import { getNewRank } from '@/utils/getNewRank';
import { useState } from 'react';

interface ContextType {
  supabase: SupabaseClient<Database, 'public', any>;
  //
  isNew: boolean;
  setStateIsNew: (value: boolean) => void;
  justReferred: ReferredPlayer | null;
  setStateJustReferred: (value: ReferredPlayer) => void;
  isPhone: boolean;
  setStateIsPhone: (value: boolean) => void;
  //
  user: Tables<'users'> | null;
  setStateUser: (value: Tables<'users'>) => void;
  reward: number;
  setStateReward: (value: number) => void;
  userRank: Tables<'playerRank'> | null;
  setStateUserRank: (value: Tables<'playerRank'> | null) => void;
  ranks: Tables<'ranks'>[];
  setStateRanks: (value: Tables<'ranks'>[]) => void;
  leaders: Tables<'users'>[];
  setStateLeaders: (value: Tables<'users'>[]) => void;
  friends: Tables<'ref_friends'>[];
  setStateFriends: (value: Tables<'ref_friends'>[]) => void;
  quests: Tables<'quests'>[];
  setStateQuests: (value: Tables<'quests'>[]) => void;
  handleNewRank: (newRank: Tables<'playerRank'>) => void;
  handlePlayerTap: (profitTap: number) => boolean;

  refQuest: Tables<'ref_quests'>[];
  setRefQuest: (value: Tables<'ref_quests'>[]) => void;

  questTimer: number;
  setQuestTimer: (value: number) => void;

  killStreak: number;
  setKillStreak: (value: number) => void;
  killStreakBonus: number;
  setKillStreakBonus: (value: number) => void;

  healthBoss: number;
  setHealthBoss: (value: number) => void;

  sumReqAmount: number;
  setSumReqAmount: (value: number) => void;

  currentRefQuest: Tables<'ref_quests'>;
  setCurrentRefQuest: (value: Tables<'ref_quests'>) => void;

  playerQuests: Tables<'playerQuests'>[];
  setPlayerQuests: (value: Tables<'playerQuests'>[]) => void;

  earnedHoneyFromFarming: number;
  setEarnedHoneyFromFarming: (value: number) => void;

  updateBalanceRes: Tables<'updateBalance'> | null;
  setUpdateBalanceRes: (value: Tables<'updateBalance'>) => void;

  tdId: string | null;
  setTgId: (value: string | null) => void;
}

export const ContextData = React.createContext<ContextType | null>(null);

export function ContextProvider({ children }: React.PropsWithChildren) {
  // Supabase SDK
  const supabase = createClient();
  // Telegram SDK
  const miniApp = useMiniApp(true);
  const initData = useInitData(true);

  const [isNew, setIsNew] = React.useState<boolean>(false);
  const [justReferred, setJustReferred] = React.useState<ReferredPlayer | null>(
    null
  );
  const [isPhone, setIsPhone] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<Tables<'users'> | null>(null);
  const [userRank, setUserRank] = React.useState<Tables<'playerRank'> | null>(
    null
  );
  const [ranks, setRanks] = React.useState<Tables<'ranks'>[]>([]);
  const [leaders, setLeaders] = React.useState<Tables<'users'>[]>([]);
  const [friends, setFriends] = React.useState<Tables<'ref_friends'>[]>([]);
  const [quests, setQuests] = React.useState<Tables<'quests'>[]>([]);
  const [reward, setReward] = React.useState<number>(0);
  const [killStreak, setKillStreak] = React.useState<number>(0);
  const [killStreakBonus, setKillStreakBonus] = React.useState<number>(0);
  const [healthBoss, setHealthBoss] = React.useState<number>(0);
  const [refQuest, setRefQuest] = React.useState<Tables<'ref_quests'>[]>([]);
  const [questTimer, setQuestTimer] = React.useState<number>(0);
  const [currentRefQuest, setCurrentRefQuest] =
    React.useState<Tables<'ref_quests'>>();

  const [sumReqAmount, setSumReqAmount] = React.useState<number>(0);

  const [playerQuests, setPlayerQuests] = React.useState<
    Tables<'playerQuests'>[]
  >([]);

  const [earnedHoneyFromFarming, setEarnedHoneyFromFarming] =
    useState<number>(0);

  const [updateBalanceRes, setUpdateBalanceRes] =
    useState<Tables<'updateBalance'> | null>(null);

  const [tdId, setTgId] = useState<string | null>(null);

  const value: ContextType = {
    supabase,
    isNew,
    setStateIsNew: (value: boolean): void => setIsNew(value),
    justReferred,
    setStateJustReferred: (value: ReferredPlayer | null): void =>
      setJustReferred(value),
    isPhone,
    setStateIsPhone: (value: boolean): void => setIsPhone(value),
    user,
    setStateUser: (value: Tables<'users'>): void => setUser(value),
    reward,
    setStateReward: (value: number): void => setReward(value),

    userRank,
    setStateUserRank: (value: Tables<'playerRank'> | null): void =>
      setUserRank(value),
    ranks,

    setStateRanks: (value: Tables<'ranks'>[]): void => setRanks(value),
    leaders,
    setStateLeaders: (value: Tables<'users'>[]): void => setLeaders(value),

    friends,
    setStateFriends: (value: Tables<'ref_friends'>[]): void =>
      setFriends(value),

    quests,
    setStateQuests: (value: Tables<'quests'>[]): void => setQuests(value),

    killStreak: 0,
    setKillStreak: (value: number): void => setKillStreak(value),
    killStreakBonus: 0,
    setKillStreakBonus: (value: number): void => setKillStreakBonus(value),

    healthBoss,
    setHealthBoss: (value: number): void => setHealthBoss(value),

    refQuest,
    setRefQuest: (value: Tables<'ref_quests'>[]): void => setRefQuest(value),

    questTimer: 0,
    setQuestTimer: (value: number): void => setQuestTimer(value),

    sumReqAmount,
    setSumReqAmount: (value: number): void => setSumReqAmount(value),

    playerQuests,
    setPlayerQuests: (value: Tables<'playerQuests'>[]): void =>
      setPlayerQuests(value),

    // @ts-ignore
    currentRefQuest,
    setCurrentRefQuest: (value: Tables<'ref_quests'>): void =>
      setCurrentRefQuest(value),

    earnedHoneyFromFarming,
    setEarnedHoneyFromFarming: (value: number): void =>
      setEarnedHoneyFromFarming(value),

    updateBalanceRes,
    setUpdateBalanceRes: (value: Tables<'updateBalance'>): void =>
      setUpdateBalanceRes(value),

    tdId,
    setTgId: (value: string | null): void => setTgId(value),

    handleNewRank: function (newRank: Tables<'playerRank'>): void {
      if (!user || !userRank) return;
      let rank: number = getNewRank(userRank);

      const updateRank1 = newRank;
      const nextrank = updateRank1.rank;
      const nextrank2 = {
        nextrank,
        rank,
      };

      const updateRank2 = {
        ...updateRank1,
        nextrank2,
      };
      updatePlayerRank(newRank);
      setUser({
        ...user,
        balance: user.balance + userRank.rank.bonusAmount,
        playerRanks: [updateRank2, ...user.playerRanks],
      });
      console.log('user', user);
      console.log('newRank', newRank);

      const auserRank = {
        ...newRank,
        rank: nextrank,
      };
      console.log('userRank', userRank);

      setUserRank(auserRank);
    },

    handlePlayerTap: function (profitTap: number): boolean {
      setUser((prevState) => ({
        ...prevState!,
        balance: prevState?.balance! + profitTap,
      }));
      return true;
    },
  };

  React.useEffect(() => {
    if (!user) return;

    //updateUserStats(user);
  }, [supabase, user]);

  React.useEffect(() => {}, []);

  return <ContextData.Provider value={value}>{children}</ContextData.Provider>;
}

export const useData = () => React.useContext(ContextData);
