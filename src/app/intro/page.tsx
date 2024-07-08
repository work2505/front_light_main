'use client';

import { Suspense, useEffect } from 'react';
import { IntroCarouselDApi } from '@/components/intro-carousel';
import { IntroItem } from '../../../types/types';
import { useSearchParams } from 'next/navigation';
import { useData } from '@/controllers/context';

const items: IntroItem[] = [
  {
    title: 'Fight bosses and collect their loot!',
    subtitle: 'Fight and earn honey!',
    imageURL: '/intro/intro1.webp',
  },
  {
    title: 'Increase your Alpha Rank!',
    subtitle:
      'Alpha ranks will allow you to receive unique rewards in the main release of the game!',
    imageURL: '/intro/intro2.webp',
  },
  {
    title: 'Invite friends and earn bonuses together',
    subtitle: 'Both you and your friend will receive honey.',
    imageURL: '/intro/intro3.webp',
  },
  {
    title: 'Complete quests and earn rewards!',
    subtitle:
      'Quests will help you earn honey faster and climb up the leaderboard!',
    imageURL: '/intro/intro4.webp',
  },
];

function IntroPageContent() {
  const params = useSearchParams();
  const { setTgId, setStateIsNew } = useData()!;

  useEffect(() => {
    const tgId = params.get('referrerId');
    console.log(tgId);

    let id = '';
    if (tgId && tgId.includes('frP-')) {
      id = tgId.split('frP-')[1];
      setTgId(id);
    }
    setStateIsNew(false);
  }, [params, setTgId, setStateIsNew]);

  return (
    <main className="grow w-full h-full bg-[#322418] flex flex-col items-center justify-center pt-2 select-none z-60">
      <IntroCarouselDApi items={items} href="/play" />
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <IntroPageContent />
    </Suspense>
  );
}
