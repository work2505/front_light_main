import Image from 'next/image';

export default function TargetStatsCard(props: {
  title: string;
  data: any;
  iconMainURL?: string;
  iconDataURL?: string;
  isLocked: boolean;
  rankIcon?: boolean;
  size?: number;
  lockIconUrl?: string;
}) {
  const lockIcon = props.lockIconUrl ? props.lockIconUrl : '/icons/lock.png';
  const className = props.rankIcon
    ? 'min-w-full min-h-full object-contain'
    : 'w-full scale-90 absolute left-1/2 -translate-x-1/2 top-0 object-contain mt-2';
  console.log(className);
  console.log(lockIcon);

  return (
    <div className="px-4 min-w-fit tb:max-w-[114px] inline-flex items-center justify-center gap-1 p-1 relative">
      {props.isLocked && (
        <Image
          src={lockIcon}
          alt="Logo"
          width={props.size || 128}
          height={props.size || 44}
          className={className}
          draggable={false}
          priority
        />
      )}
      {props.rankIcon && (
        <Image
          src={props.iconMainURL || ''}
          alt="Level"
          width={props.size || 120}
          height={props.size || 120}
          draggable={false}
          priority
        />
      )}
      {props.iconMainURL && (
        <Image
          src={props.iconMainURL}
          alt="Logo"
          width={32}
          height={32}
          className=""
          draggable={false}
          priority
        />
      )}
      <div className="h-full flex flex-col items-center justify-center">
        <h4 className="text-xl text-foreground text-title-stroke whitespace-nowrap">
          {props.title}
        </h4>
        <div className="w-full inline-flex items-center justify-center gap-0.5">
          {props.iconDataURL && (
            <Image
              src={props.iconDataURL}
              alt="Logo"
              width={14}
              height={14}
              className="object-contain"
              draggable={false}
              priority
            />
          )}
          <div className="w-full flex justify-center text-xs text-foreground font-montserrat text-center font-medium text-normal-stroke whitespace-nowrap mr-2">
            {props.title === 'Loot' && (
              <img src="/icons/honey.png" className="w-4 h-4" alt="honey" />
            )}
            {props.data}
          </div>
        </div>
      </div>
    </div>
  );
}
