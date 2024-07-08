'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';
import { useData } from '@/controllers/context';
import { getFriends, getPlayerQuests, getTopPlayers, startFarming } from '@/services/network/AxiosService';
import { BONUS_INTERVAL } from '@/constants';
import { MDQuests } from './menuDrawer/quests';
import { MDBonus } from './menuDrawer/bonus';
import { MDFriends } from './menuDrawer/friends';
import { TMDProps } from './menuDrawer/type';
import { MDLeaderBoard } from './menuDrawer/leaderbord';
import { TFriendsRequest } from '../../types/types';

export default function MenuDrawer(props: TMDProps) {
  const [claim, setIsClaimed] = useState(false);
  const {
    user,
    setStateUser,
    setStateLeaders,
    setStateFriends,
    setPlayerQuests
  } = useData()!;
  const [page, setPage] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timer, setTimer] = useState('');

  const [earnedFromReferrals, setEarnedFromReferrals] = useState<any>(0);

  const [isOpen, setIsOpen] = useState<string | false>(false);
  useEffect(() => {
    if (props?.section === 'leaderboard' || isOpen === 'leaderboard') {
      getTopPlayers().then(topPlayers => { if (topPlayers) setStateLeaders(topPlayers); });
    } else if (props?.section === 'quests' || isOpen === 'quests') {
      getPlayerQuests().then(playerQuests => { setPlayerQuests(playerQuests); });
    } else if (props?.section === 'friends' || isOpen === 'friends') {
      handleReferrals(page, 10).then(tmp => {
        if (tmp?.referrals) setStateFriends(tmp.referrals);
        if (tmp?.earnedFromReferrals) setEarnedFromReferrals(tmp.earnedFromReferrals);
      });
    }
  }, [props?.section, isOpen]);

  useEffect(() => {
    const lastClaimTime = localStorage.getItem('lastClaimTime');
    if (lastClaimTime) {
      const now = Date.now();
      const timePassed = now - parseInt(lastClaimTime, 10);
      setIsClaimed(true);
      if (timePassed < BONUS_INTERVAL) {
        setTimeRemaining(BONUS_INTERVAL - timePassed);
      }
    }
  }, []);

  useEffect(() => {
    if (timeRemaining !== null) {
      const interval = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime && prevTime > 1000) {
            return prevTime - 1000;
          } else {
            clearInterval(interval);
            setIsClaimed(false);
            return null;
          }
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeRemaining]);


  const handleReferrals = async (page?: number, take?: number): Promise<TFriendsRequest | undefined> => {
    const friends = await getFriends(page, take);
    if (Array.isArray(friends?.referrals)) {
      return { ...friends, referrals: (friends.referrals).map((pl: any) => (pl.players)) };
    }
    return friends;
  }

  useEffect(() => {
    if (user) {
      const endFarm = new Date(user.farmingEndDate);
      const now = new Date();
      if (now < endFarm) {
        const diffTime = Math.abs(endFarm.getTime() - now.getTime());
        const hours = Math.floor(diffTime / (1000 * 60 * 60));
        const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        setTimer(`${hours}h ${minutes}m`);
      } else {
        setTimer('');
      }
    }
  }, [claim, user]);

  let earnedH: any;
  if (user?.balance) {
    earnedH = (user.balance * 0.005).toFixed(2);
  }

  const start = useCallback(() => {
    if (user && user.balance > 0) {
      startFarming();
      const earned = user.balance * 0.005;
      const fixedE = Number(earned.toFixed(2));
      setStateUser({ ...user, balance: user.balance + fixedE });
    }
  }, [user, setStateUser]);


  return (
    <Drawer open={!!isOpen} onClose={() => setIsOpen(false)}>
      <DrawerTrigger asChild disabled={props.isLocked}>
        <Button
          size={props.size}
          className={cn(
            `w-[76px] px-3 em:w-full em:px-0 bg-transparent active:bg-transparent border-none flex flex-col  items-center justify-center text-sm font-medium text-normal-stroke leading-none relative`,
            props.className
          )}
          onClick={() => setIsOpen(props?.section || '')}
        >
          {props.isLocked && (
            <Image
              src={'/icons/lock.png'}
              alt="Logo"
              width={80}
              height={44}
              className="w-[80px] scale-75 absolute left-1/2 -translate-x-1/2 top-0 object-contain mt-8"
              draggable={false}
              priority
            />
          )}
          <Image
            src={props.iconURL}
            alt="Logo"
            width={128}
            height={128}
            className={`${props.iconURL === '/icons/chest.png' ||
              props.iconURL === '/icons/email.png'
              ? 'w-10 h-10 mb-1'
              : props.iconURL === '/icons/notification.png'
                ? 'h-[28px] w-[28px] mb-2'
                : 'w-9 h-9 mb-1'
              } object-contain`}
            draggable={false}
            priority
          />
          <span className="-mt-2.5 text-[14px] sm:text-[inherit]">
            {props.title}
          </span>
          {props.isLocked && (
            <span className="text-[0.5rem] leading-none font-normal font-montserrat">
              Coming soon
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="w-full inline-flex items-center justify-end relative h-full">
          {props.section === 'leaderboard' && (
            <div className="w-full inline-flex items-center justify-center absolute top-[43%] left-1/2 -translate-x-1/2 -mt-9">
              <Image
                src={'/icons/star.png'}
                alt="Logo"
                width={128}
                height={128}
                className="w-16 h-16 object-contain"
                draggable={false}
                priority
              />
            </div>
          )}
          <h1
            className={`w-full text-2xl font-medium text-center whitespace-nowrap absolute left-1/2 -translate-x-1/2 ${props.section === 'leaderboard' || props.section === 'quests'
              ? 'top-[90%]'
              : 'top-[80%]'
              }  -translate-y-1/2`}
          >
            {props.section === 'ranks' && 'Alpha Ranks Rewards:'}
            {props.section === 'friends' && `Referrals`}
            {props.section === 'bonus' && 'Treasure'}
            {props.section === 'quests' && 'Quests:'}
            {props.section === 'leaderboard' && 'Leaderboard:'}
          </h1>
          <Button
            variant={'ghost'}
            size={'icon'}
            onClick={() => setIsOpen(false)}
            className="z-[99] mt-8"
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
        </div>
        {props.section === 'leaderboard' && props.leaders && (<MDLeaderBoard props={props} />)}
        {props.section === 'friends' && props.friends && (
          <MDFriends
            props={props}
            pages={[page, setPage]}
            handleReferrals={handleReferrals}
            efr={{ earnedFromReferrals, setEarnedFromReferrals }}
          />)}
        {props.section === 'bonus' && (
          <MDBonus
            timer={timer}
            claims={[claim, setIsClaimed]}
            timeRemaining={timeRemaining}
            setTimeRemaining={setTimeRemaining}
          />)}
        {props.section === 'quests' && props.quests && (<MDQuests />)}
      </DrawerContent>
    </Drawer>
  );
}
