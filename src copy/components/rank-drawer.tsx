'use client';

import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useData } from '@/controllers/context';
import { createClient } from '@/utils/supabase/client';
import React, { useEffect } from 'react';
import RankIcon from './rank-icon';
import RankInfoCard from './rank-info-card';
import { Button } from './ui/button';
import { Tables } from '../../types/supabase';

export default function RankDrawer(props: { isSvg: boolean }) {
  const { user, userRank, ranks, setSumReqAmount, setStateUser } = useData()!;
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const [displayRank, setDisplayRank] =
    React.useState<Tables<'playerRank'> | null>(userRank);

  const [abc, setAbc] = React.useState<{
    name: string | undefined;
  }>({
    name: displayRank?.rank.name,
  });

  const sortedRanks = ranks
    ? [...ranks].sort((a, b) => a.requiredAmount - b.requiredAmount)
    : [];

  const userBalance = user?.balance || 0;
  let nextRankFound = false;
  const updatedRanks = sortedRanks.map((rank, idx) => {
    const isUnlocked = userBalance >= rank.requiredAmount;
    const isNextRank = !nextRankFound && !isUnlocked;
    if (isNextRank) nextRankFound = true;

    return {
      ...rank,
      locked: !isUnlocked && !isNextRank,
    };
  });

  const filteredRanks = updatedRanks.filter((rank) => rank.name !== 'R0');

  useEffect(() => {
    let nextRank: any;
    if (userRank) {
      nextRank = ranks.find((rank) => rank.rank === userRank?.rank.rank + 1);
    }

    if (user?.balance && nextRank && user?.balance >= nextRank.requiredAmount) {
      if (user && displayRank && displayRank.rank.rank !== nextRank.rank) {
        setStateUser({
          ...user,
          balance: user.balance + displayRank?.rank.bonusAmount,
        });
      }
      setDisplayRank(nextRank);
    }
  }, [user?.balance, userRank, ranks, displayRank, setStateUser]);

  return (
    <Drawer open={isOpen}>
      <DrawerTrigger onClick={() => setIsOpen(!isOpen)}>
        {props.isSvg ? (
          <svg
            width="18"
            height="18"
            viewBox="0 0 13 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.5">
              <circle cx="6.5" cy="6.5" r="6.5" fill="#D9D9D9" />
              <path
                d="M6.54302 5.40625C6.2175 5.40625 5.94927 5.32943 5.73833 5.17578C5.5274 5.02214 5.42193 4.80078 5.42193 4.51172C5.42193 4.22266 5.5274 4.00391 5.73833 3.85547C5.94927 3.70703 6.22011 3.63281 6.55083 3.63281C6.88156 3.63281 7.14979 3.70573 7.35552 3.85156C7.56386 3.9974 7.66802 4.21745 7.66802 4.51172C7.66802 4.80078 7.56125 5.02214 7.34771 5.17578C7.13677 5.32943 6.86854 5.40625 6.54302 5.40625ZM7.98052 8.82422V10H5.10162V8.82422H5.60552V7.02344H5.10162V6.0625L7.47662 5.81641V8.82422H7.98052Z"
                fill="#464646"
              />
            </g>
          </svg>
        ) : (
          <div>
            {abc && (
              <RankIcon
                name={abc?.name || 'R0'}
                url={`/icons/levels/${abc.name}.png`}
                size={64}
                locked={false}
              />
            )}
          </div>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <div className="w-full inline-flex items-center justify-end relative">
          <h1 className="w-full text-2xl font-medium text-center whitespace-nowrap absolute left-1/2 -translate-x-1/2 top-[80%] -translate-y-1/2">
            Alpha Ranks Rewards:
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
        <div className="w-full h-auto max-h-[459px] flex flex-col gap-4 mt-4 overflow-auto">
          {filteredRanks.map((rank, idx) => (
            <RankInfoCard
              key={idx}
              name={rank.name}
              description={rank.description}
              iconURL={`/icons/levels/${rank.name}.png`}
              requiredAmount={rank.requiredAmount}
              bonusAmount={rank.bonusAmount}
              currentbalance={user?.balance || 0}
              locked={rank.locked}
            />
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
