import { cn } from '@/lib/utils';
import Image from 'next/image';
import TargetStatsCard from './target-stats-card';

export default function RankIcon(props: {
  name: string;
  url: string;
  size: number;
  textClass?: string;
  locked: boolean;
}) {
  return (
    <div className="relative inline-flex items-center justify-center">
      <Image
        src={props.url}
        alt="Level"
        width={props.size}
        height={props.size}
        className="min-w-full min-h-full object-contain"
        draggable={false}
        priority
      />
      <h4
        className={cn(
          'absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-[1px] text-base leading-none font-bold text-title-stroke',
          props.textClass
        )}
      >
        {props.name}
      </h4>
    </div>
  );
}
