'use client';
import { useUtils } from '@tma.js/sdk-react';
import HoneyDisplay from './honey-display';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import QuestDrawer from './quest-drawer';
import { useData } from '@/controllers/context';
import { useEffect } from 'react';

export default function QuestCard(props: {
  reward: number;
  title: string;
  iconURL: string;
  actionURL?: string;
  goal?: number;
  waitcondition?: boolean;
  action: string;
  link?: string;
  specialicon?: string;
  description: string;
  id: string;
  filePath: string;
  level?: number;
}) {
  const utils = useUtils(true);
  const { friends } = useData()!;

  useEffect(() => { alert(JSON.stringify(props, null, 10)) }, [])

  let isUrlTelegram = false;
  let isUrlX = false;

  if (props.actionURL) {
    try {
      const domain = new URL(props.actionURL);
      isUrlTelegram = domain.hostname === 't.me';
      isUrlX = domain.hostname === 'x.com';
      // console.log(props.actionURL);
    } catch (error) {
      console.log(error);
    }
  }
  const progress = friends.length - 1 > 0 ? friends.length - 1 : 0;

  const iconPath = `/icons/${props.filePath}`;

  return (
    <div className="w-full min-h-fit h-[90px] rounded-2xl inline-flex gap-2 items-center justify-between p-2">
      <div className="h-full inline-flex items-center justify-center p-2">
        <Avatar
          className={`w-14 h-14 ${!isUrlTelegram && !isUrlX ? 'rounded-none' : 'rounded-full'
            } ${isUrlX && 'object-contain'} `}
        >
          <AvatarImage src={iconPath} alt="avatar" width={128} height={128} />
          <AvatarFallback className="bg-backdrop">?</AvatarFallback>
        </Avatar>
      </div>
      <div className="w-full h-full inline-flex mt-5 gap-1 items-center justify-between">
        <div className="w-full max-w-34 h-full flex flex-col items-start justify-start">
          <HoneyDisplay
            text="20px"
            isBold={false}
            amount={props.reward}
            iconSize={24}
          />
          <div
            className={`${progress
              ? 'flex flex-col'
              : 'inline-flex items-start justify-start'
              } w-full h-full `}
          >
            <p
              className={`${progress ? 'text-[14px]' : 'text-base leading-5 '
                } text-foreground font-medium text-normal-stroke`}
            >
              {props.title} {props?.level ? `(LVL ${props?.level})` : null}
            </p>
          </div>
        </div>
      </div>
      <QuestDrawer
        id={props.id}
        section={props.iconURL}
        questTittle={props.title}
        questDescription={props.description}
        questReward={props.reward}
        buttontext={props.action}
        progress={progress}
        goal={props.goal}
        link={props.link}
        condition={props.waitcondition}
        specialicon={props.specialicon}
        filePath={props.filePath}
        level={props.level}
      />
    </div>
  );
}
