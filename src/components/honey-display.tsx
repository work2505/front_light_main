import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function HoneyDisplay(props: {
  textClass?: string;
  amount: number;
  iconSize: number;
  isBold?: boolean;
  text?: string;
}) {
  // Добавляем проверку на undefined или не число
  if (isNaN(props.amount)) {
    return null; // или другое поведение по умолчанию
  }

  return (
    <div className="inline-flex items-center justify-center">
      <h1
        className={cn(
          `${
            props.isBold && 'font-bold'
          } text-foreground text-title-stroke text-[${props.text}] ${
            props.isBold && 'min-[364px]: text-xl  min-[395px]:text-2xl'
          }`,
          props.textClass
        )}
      >
        {props.amount.toLocaleString('en')}
      </h1>
      <Image
        src={'/icons/honey.png'}
        alt="Logo"
        width={props.iconSize}
        height={props.iconSize}
        className="object-contain"
        draggable={false}
        priority
      />
    </div>
  );
}
