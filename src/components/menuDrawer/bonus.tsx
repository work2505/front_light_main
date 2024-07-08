import { useData } from "@/controllers/context";
import Image from 'next/image';
import QuestCard from "../quest-card";
import { Button } from "../ui/button";
import { CSSProperties, useCallback, useEffect, useState } from "react";
import { startFarming } from "@/services/network/AxiosService";
import { BONUS_INTERVAL } from "@/constants";
import { formatTime } from "@/lib/utils";


export function MDBonus({ timer, claims, setTimeRemaining, timeRemaining }:
  {
    timer: string,
    claims: [boolean, setIsClaimed: React.Dispatch<React.SetStateAction<boolean>>],
    setTimeRemaining: React.Dispatch<React.SetStateAction<number | null>>,
    timeRemaining: number | null
  }) {

  const [buttonStyle, setButtonStyle] = useState<CSSProperties>({});

  useEffect(() => {
    if (timer) setButtonStyle({ opacity: 0.5, pointerEvents: 'none' });
    else setButtonStyle({});
  }, [timer]);

  // useEffect(() => {
  //   alert(timeRemaining);
  // }, [])


  const [earnedH, setEarnedH] = useState<number>(0);

  const { user, earnedHoneyFromFarming, setStateUser, currentRefQuest, quests: myQuests } = useData()!;

  useEffect(() => {
    if (user?.balance) setEarnedH(Number((user.balance * 0.005).toFixed(2)));
  }, [user?.balance])

  const [claim, setIsClaimed] = claims;

  const handleBonus = useCallback(() => {
    if (user) {
      startFarming();
      const earned = user.balance * 0.005;
      const fixedE = Number(earned.toFixed(2));
      setStateUser({ ...user, balance: user.balance + fixedE });
      localStorage.setItem('lastClaimTime', Date.now().toString());
      setIsClaimed(true);
      setTimeRemaining(BONUS_INTERVAL);
    }
  }, [user, setStateUser]);

  return (
    <div className="w-full min-h-full max-h-full items-center flex flex-col mt-4 ml-2 overflow-auto">
      <div className="w-[95%] inline-flex items-center justify-center absolute top-[8%] left-1/2 -translate-x-1/2 -mt-9 ">
        <Image
          src={'/icons/chest.png'}
          alt="Logo"
          width={128}
          height={128}
          className="w-16 h-16 object-contain"
          draggable={false}
          priority
        />
      </div>
      <div className="flex pr-3">
        <div className="bg-backdrop w-[128px] h-[128px] flex items-center flex-shrink-0 mr-[13px] rounded-[20px]">
          <img alt="tresurechest" src="/icons/tresurechest.png" />
        </div>
        <div>
          <span className=" text-[16px]">
            Every 4 hours, your worker bees will bring you more honey!
            Specifically, 0.5% of your balance.
          </span>
          <p className="">Your passive income now: </p>
          {/* 0.5% of balance  */}
          <div className="flex text-[18px] items-center">
            {' '}
            <p>
              {' '}
              {earnedHoneyFromFarming
                ? earnedHoneyFromFarming
                : user?.balance && earnedH}
            </p>{' '}
            <img
              src="/icons/honey.png"
              className="ml-[2px] w-4 h-4"
              alt="honey"
            />{' '}
          </div>
        </div>
      </div>
      {timeRemaining ? (
        <Button
          // onClick={() => handleBonus()}
          className="w-36 mb-4"
          style={buttonStyle}
        >
          {formatTime(timeRemaining)}
        </Button>
      ) : (
        <Button
          onClick={() => handleBonus()}
          className="w-36 mb-4"
          style={buttonStyle}
        >
          {'Get bonus'}
        </Button>
      )}
    </div>
  );
}