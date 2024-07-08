'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Effect from '../../../public/animations/png 3.png';

interface HitEffectProps {
  visible: boolean;
}

interface HitState {
  id: number;
  position: number;
}

const HitEffect: React.FC<HitEffectProps> = React.memo(({ visible }) => {
  const [hits, setHits] = useState<HitState[]>([]);
  const positions = ['20%', '50%', '80%'];

  useEffect(() => {
    if (visible) {
      const newHitId = Date.now();
      const newPosition = hits.length % 3; // позиция для новой линии
      const newHits = [...hits, { id: newHitId, position: newPosition }];
      setHits(newHits);

      setTimeout(() => {
        setHits((prevHits) => prevHits.filter((item) => item.id !== newHitId));
      }, 700);
    }
  }, [visible]);

  const handleExitComplete = (id: number) => {
    setHits((prevHits) => prevHits.filter((item) => item.id !== id));
  };

  return (
    <AnimatePresence>
      {hits.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 1, scale: 1, left: '20%' }}
          animate={{ opacity: 0, scale: 0, left: positions[item.position] }}
          exit={{ opacity: 0, scale: 0.2 }}
          transition={{ duration: 1 }}
          onAnimationComplete={() => handleExitComplete(item.id)}
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 150,
            rotate:
              item.position === 0
                ? '45deg'
                : item.position === 1
                ? '0deg'
                : '-45deg',
          }}
        >
          <Image src={Effect} alt="Линия удара" width={200} height={200} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
});

HitEffect.displayName = 'HitEffect';

export default HitEffect;
