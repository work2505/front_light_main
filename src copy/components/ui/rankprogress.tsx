'use client';

import { useData } from '@/controllers/context';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';

export default function RankProgress(props: {
  balance: number;
  reqAmount: number;
  lock?: boolean;
}) {
  const [healthBarWidth, setHealthBarWidth] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const { userRank, ranks } = useData()!;

  const progress = ranks.reduce((acc, rank) => {
    if (userRank && userRank.rank.rank === rank.rank) {
      return acc + rank.requiredAmount;
    }
    return acc;
  }, 0);

  useEffect(() => {
    if (props.lock) {
      setHealthBarWidth(0);
      setIsCompleted(false);
    } else {
      let healthPercentage = 0;
      if (props.balance < props.reqAmount) {
        healthPercentage = ((props.balance - progress) / props.reqAmount) * 100;
      } else {
        healthPercentage = 100;
        setIsCompleted(true);
      }
      setHealthBarWidth(healthPercentage);
    }
  }, [props.lock, props.balance, props.reqAmount]);

  const fixedProgress = progress.toFixed(0);
  const userBalance = props.balance.toFixed(0);

  let prevRank: any = 0;
  if (userRank && userRank.rank.name !== 'R0') {
    prevRank = ranks.find((rank) => rank.rank === userRank.rank.rank - 1);
  }

  return (
    <div className="relative w-[240px] h-[26px] my-2 min-[399px]:w-[280px]">
      <Image
        src={'/progressbar/hp-bar-empty.png'}
        fill
        objectFit="cover"
        alt="Hp bar Empty"
      />
      <div
        style={{ width: `${healthBarWidth}%` }}
        className={`max-w-[100%] min-w-[11%] h-[26px] overflow-hidden`}
      >
        <img
          className="w-[240px] relative max-w-none top-[-3px] min-[399px]:w-[280px] min-[399px]:top-[-6px]"
          src={'/progressbar/hp-bar-full.png'}
          alt="Hp bar Full"
          width={280}
          height={26}
        />
      </div>
      <h2 className="absolute top-[6px] text-[#ECEBEA] text-[10px] font-medium text-center w-full min-[399px]:top-[5px]">
        {props.lock
          ? 'Closed'
          : isCompleted
          ? 'Completed'
          : `${Number(userBalance) - Number(fixedProgress)}/${props.reqAmount}`}
      </h2>
    </div>
  );
}
