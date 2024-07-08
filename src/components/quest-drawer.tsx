'use client';

import React, { useEffect, useState } from 'react';
import HoneyDisplay from './honey-display';
import { Button } from './ui/button';
import Image from 'next/image';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';
import { useData } from '@/controllers/context';
import { useRouter } from 'next/navigation';
import { Table, TableBody } from './ui/table';
import { setQuestCompleted } from '@/services/network/AxiosService';

export default function QuestDrawer(props: {
  questTittle: string;
  questDescription: string;
  questReward: number;
  section: string;
  buttontext: string;
  condition?: boolean;
  specialicon?: string;
  progress?: number;
  goal?: number;
  link?: string;
  id: string;
  filePath: string;
  level?: number;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [rewardClaimed, setRewardClaimed] = useState<boolean>(false);
  const [confirmationFinishQuest, setConfirmationFinishQuest] = useState(false);
  const [newProgress, setNewProgress] = useState<number>(1);
  const [newGoal, setNewGoal] = useState<number>(3);
  const { user, setStateUser, playerQuests, friends, currentRefQuest } =
    useData()!;
  const [timerLabel, setTimerLabel] = useState<string>('');
  const router = useRouter();

  // useEffect(() => {
  //   alert(String(isCompleted))
  // }, [isCompleted])

  // console.log('Level:', props.level); // Добавляем логирование уровня

  const complitedQuest = async (id: string): Promise<void> => {
    setIsCompleted(true);
    await setQuestCompleted(id);
  }

  const handleComplete = () => {
    // alert('handleComplete')
    let url = props.link;
    if (url) {
      setIsOpen(false);
      if (props.level !== undefined) complitedQuest(props.id).then(_ => (true));
      router.push(url);
    }
  };

  const [prog, setProg] = useState(0);
  const [referralCount, setReferralCount] = useState(0);

  useEffect(() => {
    if (props?.progress && props?.progress !== prog) setProg(props.progress);
    if (currentRefQuest?.referralCount && currentRefQuest?.referralCount !== referralCount)
      setReferralCount(currentRefQuest.referralCount);
  }, [props?.progress, currentRefQuest?.referralCount]);

  useEffect(() => {
    if (prog > 0 && referralCount <= prog) complitedQuest(props.id).then(_ => (true));
  }, [referralCount, prog])

  const iconPath = `/icons/${props.filePath}`;

  const handleClaimReward = () => {
    setRewardClaimed(true);
    if (props.buttontext === 'Referrals') {
      setNewProgress(0);
      setNewGoal(5);
    }
  };

  useEffect(() => {
    try {
      console.log("playerQuests", playerQuests);

      const currentQuest = playerQuests?.find(
        (quest) => quest.terms === props.questTittle
      );

      // alert(`===${JSON.stringify(currentQuest, null, 10)}`)

      // const currentQuest = { ...tmpCurrentQuest, completeDate: `2024-07-09T09:${10 + Math.round(Math.random() * 49)}:${10 + Math.round(Math.random() * 49)}.186Z` };

      if (currentQuest?.completeDate) {
        const completedDate = new Date(currentQuest.completeDate);
        const nextDaySameTime = new Date(completedDate);

        const now = new Date();
        const diffTime = nextDaySameTime.getTime() - now.getTime();

        if (diffTime > 0) {
          const hoursRemaining = Math.floor(diffTime / (1000 * 60 * 60));
          const minutesRemaining = Math.floor(
            (diffTime % (1000 * 60 * 60)) / (1000 * 60)
          );

          // console.log('Hours Remaining:', hoursRemaining);
          // console.log('Minutes Remaining:', minutesRemaining);

          setTimerLabel(`${hoursRemaining}h ${minutesRemaining}m`);
        } else {
          setTimerLabel('Reward available');
        }
      }

    } catch (error) {
      console.log(error);
    }
  }, [playerQuests, props.questTittle]);

  return (
    <Drawer open={isOpen} onClose={() => setIsOpen(false)}>
      <DrawerTrigger>
        <div className="h-full inline-flex items-center justify-end">
          {timerLabel ? (
            <Button className="pointer-events-none">{timerLabel}</Button>
          ) : (
            <Button
              variant={'default'}
              className="w-24 border-2 font-medium text-normal-stroke rounded-full py-1"
              onClick={() => setIsOpen(true)}
            >
              {confirmationFinishQuest ? 'Completed' : 'Complete'}
            </Button>
          )}
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <div className="w-full inline-flex items-center justify-end relative pb-2">
          <div
            className={`w-full inline-flex items-center justify-center absolute ${props.questTittle === 'Invite your friends!'
              ? 'top-[48%]'
              : 'top-[53%]'
              }  left-1/2 -translate-x-1/2 -mt-9`}
          >
            <Image
              src={iconPath}
              alt="Logo"
              width={64}
              height={64}
              className={`${props.questTittle === 'Invite your 3 friends!'
                ? 'w-14 h-14'
                : 'w-12 h-12'
                } object-contain`}
              draggable={false}
              priority
            />
          </div>

          <h1
            className={`w-full text-2xl font-medium text-center whitespace-nowrap absolute left-1/2 -translate-x-1/2 top-[90%] -translate-y-1/2`}
          >
            {props.level !== undefined && props.level >= 0
              ? `${props.questTittle} LVL${props.level}`
              : props.questTittle}
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

        <div className="px-16 mt-5 text-[16px] flex gap-2 flex-col">
          <p>{props.questDescription}</p>
          {props.condition && (
            <p>
              You need to wait 24 hours for this quest to be counted, if you
              unsubscribe - it will be failed!
            </p>
          )}
          <div>
            <span>Reward:</span>{' '}
            <span>
              {' '}
              <HoneyDisplay
                text={'16px'}
                isBold={false}
                iconSize={16}
                amount={props.questReward}
              />{' '}
            </span>{' '}
          </div>
          {props.level !== undefined ? (
            <div>
              Invited: ({prog}/{referralCount})
            </div>
          ) : null}

          <div className="flex justify-center mt-4 mb-3">
            {(isCompleted) ? (
              <>
                {!confirmationFinishQuest && (
                  <Button
                    variant={'default'}
                    onClick={() => setConfirmationFinishQuest(true)}
                  >
                    Finish quest
                  </Button>
                )}
                <div>
                  {confirmationFinishQuest && (
                    <Table>
                      <TableBody>
                        {rewardClaimed ? (
                          <div className="text-white text-center font-bold">
                            <span className="text-white font-bold">
                              You completed the quest!
                              <br />
                              You
                              {` ${props.questTittle}`}
                              <br />
                            </span>
                            Reward claimed!
                          </div>
                        ) : (
                          <div className="text-white text-center">
                            <span className="text-white font-bold">
                              You completed the quest! You:
                              {` ${props.questTittle}`}
                              <br />
                            </span>
                            <Button
                              onClick={handleClaimReward}
                              className="text-xl px-10 py-2 rounded-full mt-1"
                              variant={'default'}
                            >
                              Claim Reward
                            </Button>
                          </div>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </>
            ) : (
              <Button
                onClick={() => handleComplete()}
                className="text-xl px-10 py-2 rounded-full"
                variant={'default'}
              >
                {props.level !== undefined ? 'Referrals' : 'Join'}
              </Button>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
