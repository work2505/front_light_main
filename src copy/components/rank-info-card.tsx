import Image from 'next/image';
import HoneyDisplay from '@/components/honey-display';
import RankIcon from './rank-icon';
import Rankprogress from './ui/rankprogress';

export default function RankInfoCard(props: {
  name: string;
  description: string;
  iconURL: string;
  requiredAmount: number;
  bonusAmount: number;
  currentbalance: number;
  locked: boolean;
}) {
  const rankUrl = props.locked
    ? `/icons/closed_ranks/${props.name}.png`
    : `/icons/levels/${props.name}.png`;

  console.log(props.description);

  const desc = props.description.replace(/\s*\+\s*\d{1,3}(,\d{3})*/, '');

  return (
    <div className="bg-[url(/backgrounds/tab.webp)] bg-cover bg-no-repeat w-full bg-center">
      <div className="w-full inline-flex ">
        <div className="inline-flex items-center justify-center pl-2">
          <RankIcon
            name={props.name}
            url={rankUrl}
            size={120}
            textClass="text-xl font-bold mt-0.5"
            locked={props.locked}
          />
        </div>
        <div className="w-full flex flex-col items-start justify-center mb-4">
          {/* <HoneyDisplay amount={props.requiredAmount} iconSize={32} /> */}
          {/* <Progress value={0} content={`${props.currentbalance}/${props.requiredAmount}`} className="bg-[url(/interface/target-progress.png)] text-[10px] "/> */}
          <div>
            <Rankprogress
              balance={props.currentbalance}
              reqAmount={props.requiredAmount}
              lock={props.locked}
            />
          </div>
          <p className="text-foreground text-base font-medium leading-5 ml-[10px]">
            {desc} +{' '}
            <span>
              <HoneyDisplay
                isBold={false}
                amount={props.bonusAmount}
                iconSize={24}
                textClass="text-sm text-normal-stroke font-not-bold"
              />
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
