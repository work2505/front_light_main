'use client';

import { useData } from '@/controllers/context';
import {
  InitData,
  retrieveLaunchParams,
  useInitData,
  useMiniApp,
  useViewport,
} from '@tma.js/sdk-react';
import Image from 'next/image';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useRouter as useNextRouter } from 'next/router';
import React, { Suspense, useEffect, useState } from 'react';
import { Tables } from '../../types/supabase';

import { useTelegramMock } from '@/hooks/useTelegramMock';
import AuthSerive from '@/services/AuthService';
import {
  getFriends,
  getMeInfo,
  getPlayerQuests,
  getPlayerRanks,
  getPlayerRefQuest,
  //getUserTelegramId,
  getRanks,
  getReferralQuests,
  getReferrals,
  //getUsers,
  getTopPlayers,
  getUserQuests,
  startFarming,
} from '@/services/network/AxiosService';
import { REWARD_COMMON_REFERRER, REWARD_PREMIUM_REFERRER } from '@/constants';

const SearchParamsComponent = ({
  setTgId,
}: {
  setTgId: (id: string | null) => void;
}) => {
  const params = useSearchParams();
  const tgIdWithPrefix = params.get('tgWebAppStartParam');
  const tgId = tgIdWithPrefix ? tgIdWithPrefix.replace(/^frP-/, '') : null;

  useEffect(() => {
    setTgId(tgId);
  }, [tgId, setTgId]);

  return null;
};

export default function Page() {
  const router = useRouter();
  const initData = useInitData(true);
  const viewport = useViewport(true);

  const {
    supabase,
    isNew,
    user,
    setStateUser,
    setStateRanks,
    setStateUserRank,
    setStateIsNew,
    setStateIsPhone,
    setStateJustReferred,
    setStateLeaders,
    setStateFriends,
    setStateQuests,
    setHealthBoss,
    setRefQuest,
    setStateReward,
    setCurrentRefQuest,
    setPlayerQuests,
    tdId,
    setSumReqAmount,
  } = useData()!;

  const [isLoadError, setIsLoadError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [RefId, setRefId] = React.useState<string | null>(null);

  useTelegramMock();
  const handleTelegramMiniAppEvents = React.useCallback(async () => {
    if (!viewport) return;

    viewport.expand();
    if (typeof window !== 'undefined') {
      const launchParams = retrieveLaunchParams();
      setStateIsPhone(
        launchParams.platform === 'android' ||
        launchParams.platform === 'android_x' ||
        launchParams.platform === 'ios'
      );
    }
  }, [setStateIsPhone, viewport]);

  const handleSessionPlayerLoaded = React.useCallback(async () => {
    if (user) {
      router.push(isNew ? '/intro' : '/play');
    }
  }, [isNew, router, user]);

  const fetchPlayer = React.useCallback(async () => {
    const user: Tables<'users'> | null = await getMeInfo();

    if (user) {
      setStateUser({ ...user, balance: user.balance });
    }
  }, []);

  const fetchHealthBoss = React.useCallback(async () => { }, []);

  const fetchRanksData = React.useCallback(
    async (_user: Tables<'users'>) => {
      const ranks = await getRanks();
      console.log('ranks', ranks);

      if (!ranks) return;

      if (user) {
        if (user.playersOrcs.bossStreak > 0) {
          const reward = user.playersOrcs.bossStreak * 25000;
          setStateReward(reward);
        } else {
          setStateReward(25000);
        }
      }
      setStateRanks(ranks);
    },
    [setStateRanks]
  );

  const fetchUserInteraction = React.useCallback(
    async function fetchUserQuests() {
      const data = await getUserQuests();
      if (data) {
        setStateQuests(data);
      }
    },
    [setStateFriends, setStateLeaders, setStateQuests]
  );

  const fetchPlayerData = React.useCallback(
    async (miniAppData: InitData) => {
      handleTelegramMiniAppEvents();

      const tgUser = miniAppData.user;
      if (!tgUser) return;

      const authResponse = await AuthSerive.login(
        `${tgUser.id}`,
        tgUser.isPremium || false,
        tgUser.username || '',
        RefId ? RefId : undefined
      );

      if (!authResponse) {
        console.log('LOGIN ERROR');
        return;
      }
      console.log(authResponse.data);
      const accessToken = authResponse.data.accessToken;
      if (!accessToken) {
        console.log('Access Token Unknown');
        return;
      }
      if (localStorage.getItem('token') !== accessToken) {
        localStorage.removeItem('token');
        localStorage.setItem('token', accessToken);
      } else {
        localStorage.setItem('token', accessToken);
      }

      setStateIsNew(authResponse.data.isNew);

      const data: Tables<'ref_quests'>[] = await getPlayerRefQuest();
      if (data) setRefQuest(data);

      // const friends = await getFriends();
      // console.log(friends);
      // setStateFriends(friends);

      // const topPlayers = await getTopPlayers();
      // console.log(topPlayers);

      // if (topPlayers) {
      //   setStateLeaders(topPlayers);
      // }

      const refQuests = await getReferralQuests();
      console.log(refQuests);

      // const playerQuests = await getPlayerQuests();
      // console.log("playerQuests", playerQuests);
      // setPlayerQuests(playerQuests);

      const me = await getMeInfo();
      setStateUser(me);

      const referrals = await getReferrals();
      console.log(referrals);

      const userRanks = await getPlayerRanks();
      console.log(userRanks);

      const curRefQuest = data.find((quest) => !quest.isCompleted);
      console.log(curRefQuest);

      if (curRefQuest) {
        setCurrentRefQuest(curRefQuest);
      }
      if (user?.playersOrcs.hp) {
        console.log(user?.playersOrcs.hp);
        setHealthBoss(user?.playersOrcs.hp);
      }

      if (me.playerRanks.length !== 0) {
        const userRankIndex = me.playerRanks.length;
        const curRank = { ...me.playerRanks[userRankIndex - 1] };
        console.log(me.playerRanks);
        console.log(userRankIndex, curRank);
        setStateUserRank(curRank);
      } else {
        console.log('NO RANKS');
      }

      const player = authResponse.data.player;
      let sessionPlayer = { ...me };
      console.log(sessionPlayer);

      if (!sessionPlayer) return;
      await Promise.all([
        fetchRanksData(sessionPlayer),
        fetchPlayer(),
        fetchHealthBoss(),
        fetchUserInteraction(),
      ]);
      setStateUser(sessionPlayer);
      setIsLoading(false);

      handleSessionPlayerLoaded();
    },
    [
      handleTelegramMiniAppEvents,
      fetchRanksData,
      fetchUserInteraction,
      setStateUser,
      handleSessionPlayerLoaded,
      tdId,
    ]
  );

  React.useEffect(() => {
    const splashTimeout = setTimeout(() => {
      if (!initData) {
        setIsLoadError(true);
        return;
      }

      fetchPlayerData(initData);
    }, 1500);

    return () => clearTimeout(splashTimeout);
  }, [fetchPlayerData, initData]);

  if (isLoadError) {
    return <div>Error loading data</div>;
  }

  return (
    <main className="w-full h-full z-20 relative overflow-hidden px-2 py-6">
      <div className="w-full h-full absolute inline-flex items-center justify-center left-0 top-0">
        <Image
          src={'/splash.png'}
          alt={'splash-img'}
          width={1024}
          height={1024}
          priority
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="grow w-full h-full bg-gradient-to-t from-black from-1% to-transparent to-100% absolute left-0 bottom-0 z-30 opacity-8s0"></div>
      <div className="w-full flex flex-col gap-1 items-center justify-center absolute left-0 bottom-[176px] z-40">
        {isLoadError ? (
          <>
            <h1 className="text-foreground text-center text-7xl font-extrabold">
              ERROR
            </h1>
            <h2 className="text-[#FFB800] text-xl text-center font-semibold">
              Can&#39;t get any Telegram data
            </h2>
          </>
        ) : (
          <>
            <h1 className="text-foreground text-center text-5xl font-extrabold">
              BeeVerse
            </h1>
            <h2 className="text-[#FFB800] text-xl text-center font-semibold">
              Join our adventure!
            </h2>
          </>
        )}
      </div>
      <div className="w-full flex flex-col gap-1 items-center justify-center absolute left-0 bottom-4 z-40">
        <h1 className="text-foreground font-exo-2 text-base font-semibold">
          Stay tuned
        </h1>
        <h2 className="text-foreground font-exo-2 text-base font-semibold">
          More info in official channels
        </h2>
        <div className="w-full inline-flex gap-6 items-center justify-center mt-2">
          <SocialImage url="/icons/x.png" alt="x-icon" />
          <SocialImage url="/icons/tg.png" alt="tg-icon" />
          <SocialImage url="/icons/logo.webp" alt="logo" />
        </div>
      </div>
      <Suspense>
        <SearchParamsComponent setTgId={setRefId}></SearchParamsComponent>
      </Suspense>
    </main>
  );
}

function SocialImage(props: { url: string; alt: string }) {
  return (
    <Image src={props.url} alt={props.alt} width={32} height={32} property="" />
  );
}
