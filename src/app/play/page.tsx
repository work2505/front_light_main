'use client';
import React, { useState, useEffect, useRef } from 'react';
import DamageText from '@/components/bear/bear-damage-text';
import BearDead from '@/components/bear/bear-defeated';
import BearDamage from '@/components/bear/bear-hit';
import HitEffect from '@/components/bear/bear-hit-line';
import BearIdle from '@/components/bear/bear-idle';
import BeeIdle from '@/components/bee/bee';
import BeeHit from '@/components/bee/bee-hit';
import Bossdefeat from '@/components/boss-defeat-drawer';
import HoneyDisplay from '@/components/honey-display';
import MenuButton from '@/components/menu-drawer';
import RankDrawer from '@/components/rank-drawer';
import TargetStatsCard from '@/components/target-stats-card';
import Progressbar from '@/components/ui/progressbar';
import { TAP_PROFIT } from '@/constants';
import { useData } from '@/controllers/context';
import {
  getTopPlayers,
  updateUserBonus,
} from '@/services/network/AxiosService';
import { useRouter } from 'next/navigation';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Cooldown } from '@/utils/timer';
import { Tables } from '../../../types/supabase';
import MultiTapButton from '@/components/MultiTapButton';

export default function Page() {
  const router = useRouter();
  const maxHealth = 100000;
  const reward = 25000;
  const {
    user,
    userRank,
    ranks,
    leaders,
    friends,
    quests,
    handlePlayerTap,
    setStateLeaders,
    refQuest,
    setStateUser,
    healthBoss,
    currentRefQuest,
    setUpdateBalanceRes,
    updateBalanceRes,
    tdId,
  } = useData()!;

  const [atackInProgress, setAtackInProgress] = useState(false);
  const [gameEnd, setGameEnd] = useState(false);
  const [rewardDrawer, setRewardDrawer] = useState(false);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inactivityTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const [completedRefQuest, setCompletedRefQuest] = useState(false);
  const [health, setHealth] = useState(healthBoss);
  const [clickCount, setClickCount] = useState(1);
  const [openedBossDrawer, setOpenedBossDrawer] = useState(false);

  console.log(user);

  let nextRank: Tables<'ranks'> | undefined;
  if (userRank) {
    nextRank = ranks.find((rank) => rank.rank === userRank?.rank.rank + 1);
  }

  const handleAttack = () => {
    if (!user || !userRank || !ranks) return;

    handlePlayerTap(TAP_PROFIT);

    setClickCount((prevCount) => prevCount + 1);

    if (!gameEnd && health > 0) {
      setHealth((prevHealth) => prevHealth - 100);
    }

    if (!atackInProgress && health > 0) {
      setAtackInProgress(true);
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
      clickTimeoutRef.current = setTimeout(() => {
        setAtackInProgress(false);
        clickTimeoutRef.current = null;
      }, 300);
    }

    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
    inactivityTimeoutRef.current = setTimeout(async () => {
      const profit = clickCount * TAP_PROFIT;
      const data = await updateUserBonus(user.balance, profit);
      if (data) {
        setUpdateBalanceRes(data);
        console.log(data);
      }
      const top = await getTopPlayers();
      if (top) {
        setStateLeaders(top);
      }
      setClickCount(1);
      console.log(profit);
    }, 1500);
  };

  const handleRefQuest = () => {
    if (!user || !refQuest) return;
    const updateUser = {
      ...user,
      balance: user.balance + currentRefQuest?.reward,
    };

    setStateUser(updateUser);
  };

  useEffect(() => {
    if (
      currentRefQuest &&
      friends &&
      currentRefQuest.referralCount === friends?.length
    ) {
      setCompletedRefQuest(true);
    }
  }, [friends]);

  useEffect(() => {
    if (
      healthBoss <= 0 &&
      updateBalanceRes?.battle.bossStreakHoney &&
      updateBalanceRes?.battle.bossStreakHoney >= 0
    ) {
      console.log('ff');

      setRewardDrawer(true);
    }
  }, [healthBoss]);

  useEffect(() => {
    if (health <= 0) {
      console.log(user);
      setGameEnd(true);
      setHealth(0);
    }
  }, [health]);

  useEffect(() => {
    const updateLeaders = async () => {
      if (!user || !leaders || !userRank) return;

      console.log(leaders);

      const oldBalance = user.balance;
      const rewardReceived = user.balance - oldBalance;

      const userIndex = leaders.findIndex(
        (leader) => leader.tgId === user.tgId
      );
      console.log(leaders);
      if (userIndex !== -1) {
        const updatedLeaders = [...leaders];
        updatedLeaders[userIndex].balance += rewardReceived;
        setStateLeaders(updatedLeaders);
      } else {
        const updatedLeaders = [
          ...leaders,
          { ...user, balance: rewardReceived },
        ];
        console.log(leaders);
        setStateLeaders(updatedLeaders);
        console.log(leaders);
      }
    };

    updateLeaders();
  }, [atackInProgress]);

  if (!user || !userRank || !ranks) return router.replace('/');

  return (
    <main className="grow w-full h-screen overflow-auto bg-[url(/back.png)] bg-center bg-no-repeat bg-cover flex flex-col relative  z-0">
      <video
        src="/animations/back.webm"
        autoPlay
        muted
        loop
        className="w-full h-full absolute object-cover z-0"
      />

      <div className="absolute top-1/2 z-[99]">VERSION: 3.0</div>

      {gameEnd && (
        <div className="absolute top-1/2 z-50 ml-32">
          <Cooldown />
        </div>
      )}

      <section
        id="main-section"
        className="w-full h-full flex flex-col items-center justify-between z-20 mt-6"
      >
        <div
          id="main-top-box"
          className="w-full flex flex-col justify-between gap-1"
        >
          <div className="w-full fixed h-14 inline-flex items-center justify-center px-1 ">
            <div className="min-w-14 min-h-14 inline-flex items-center justify-center">
              <RankDrawer isSvg={false} />
            </div>
            <div className="inline-flex gap-0.5 items-center justify-center flex-wrap sm:flex-nowrap">
              <div className="flex justify-center">
                <span>
                  <HoneyDisplay
                    isBold={true}
                    amount={user.balance}
                    iconSize={24}
                  />
                </span>
              </div>
            </div>
            <div className="ml-2 mt-1">
              <RankDrawer isSvg={true} />
            </div>
          </div>
          <div className="fixed top-[80px] max-w-screen-md w-full h-20 bg-[url(/interface/target-box.png)] bg-center bg-no-repeat bg-contain rounded-xl inline-flex items-center justify-center px-4">
            <TargetStatsCard
              title={'BEEAR'}
              data={'Level 10'}
              iconMainURL="/icons/skull.png"
              iconDataURL="/icons/shield.png"
              isLocked={false}
            />
            <TargetStatsCard
              title={'HP Heal'}
              data={'Coming soon'}
              isLocked={true}
            />
            <TargetStatsCard title={'Loot'} data={reward} isLocked={false} />
          </div>
          <div className="fixed w-full z-20 top-[155px] text-md flex justify-center items-center">
            <Progressbar health={health} maxHealth={maxHealth} />
          </div>
        </div>

        {health > 0 && (
          <div
            onClick={handleAttack}
            className="bg-red-400 opacity-0 w-full fixed top-[190px] h-[360px] z-[799]"
          ></div>
        )}

        <MultiTapButton>
          <div className="w-full h-full inline-flex items-center justify-center px-4 py-2">
            <div>
              <BearDead visible={gameEnd} />
              <BearIdle visible={!atackInProgress && !gameEnd} />
              <BearDamage visible={atackInProgress && !gameEnd} />
              <DamageText
                damage={100}
                visible={atackInProgress && !gameEnd}
              />{' '}
              <HitEffect visible={atackInProgress && !gameEnd} />
            </div>
            <BeeIdle visible={!atackInProgress || gameEnd} />
            <BeeHit visible={atackInProgress && !gameEnd} />
          </div>
        </MultiTapButton>

        <div>
          <Bossdefeat
            loot={reward}
            handleReward={setRewardDrawer}
            isOpen={rewardDrawer}
          />
        </div>
        {completedRefQuest && (
          <Drawer open={completedRefQuest} onClose={() => handleRefQuest()}>
            <DrawerTrigger asChild></DrawerTrigger>
            <DrawerContent className="flex flex-col items-center justify-center h-[250px] space-y-4 pt-9 text-center text-[18px]">
              <Button
                variant={'ghost'}
                size={'icon'}
                onClick={() => setCompletedRefQuest(false)}
                className="z-[99] mt-8 absolute top-[0%] left-[90%]"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="14.8492"
                    y="6.10352e-05"
                    width="4"
                    height="21"
                    transform="rotate(45 14.8492 6.10352e-05)"
                    fill="#D9D9D9"
                  />
                  <rect
                    x="0.00012207"
                    y="2.82843"
                    width="4"
                    height="21"
                    transform="rotate(-45 0.00012207 2.82843)"
                    fill="#D9D9D9"
                  />
                </svg>
              </Button>
              {
                <div>
                  <p className="text-2xl font-medium text-center pt-4 pb-2">
                    You invited {currentRefQuest?.referralCount} friends!
                  </p>
                  <p>
                    To complete this quest, your friends must be your referrals.
                  </p>
                  <p>Reward: {currentRefQuest?.reward}</p>
                  <p className="mb-5">
                    invited: {currentRefQuest?.referralCount}/
                    {currentRefQuest?.referralCount}
                  </p>
                  <Button
                    onClick={() => handleRefQuest()}
                    className="text-[18px]"
                  >
                    Claim{' '}
                    <span className="ml-2">
                      {currentRefQuest?.reward && (
                        <HoneyDisplay
                          amount={currentRefQuest?.reward}
                          iconSize={48}
                        />
                      )}
                    </span>
                  </Button>
                </div>
              }
            </DrawerContent>
          </Drawer>
        )}

        <div
          id="main-bottom-box"
          className="z-[999] fixed bottom-0 w-full inline-flex items-center justify-center mb-4"
        >
          <div className="w-full relative">
            <div className="w-full z-[999] h-20 bg-[url(/interface/menu.png)] bg-center bg-no-repeat bg-cover rounded-xl inline-flex items-end justify-center px-4 pb-3 relative">
              <MenuButton
                title={'Leaders'}
                iconURL={'/icons/star.png'}
                size={'sm'}
                isLocked={false}
                section="leaderboard"
                user={user}
                leaders={leaders}
              />
              <MenuButton
                title={'Friends'}
                iconURL={'/icons/email.png'}
                size={'sm'}
                isLocked={false}
                section="friends"
                user={user}
                friends={friends}
              />
              <MenuButton
                title={'Retreat'}
                iconURL={'/icons/flag.png'}
                size={'lg'}
                isLocked={true}
                section="retreat"
                user={user}
                className=""
              />
              <MenuButton
                title={'Quests'}
                iconURL={'/icons/notification.png'}
                size={'sm'}
                isLocked={false}
                section="quests"
                user={user}
                quests={quests}
              />
              <MenuButton
                title={'Treasure'}
                iconURL={'/icons/chest.png'}
                size={'sm'}
                isLocked={false}
                section="bonus"
                user={user}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
