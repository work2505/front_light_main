'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DamageTextProps {
  damage: number;
  visible: boolean;
}

interface DamageState {
  id: number;
  damage: number;
}

const DamageText: React.FC<DamageTextProps> = ({ damage, visible }) => {
  const [damages, setDamages] = useState<DamageState[]>([]);

  useEffect(() => {
    if (visible && damage > 0) {
      const newDamageId = Date.now();
      const newDamages = [...damages, { id: newDamageId, damage }];
      setDamages(newDamages);

      setTimeout(() => {
        const filteredDamages = damages.filter(
          (item) => item.id !== newDamageId
        );
        setDamages(filteredDamages);
      }, 1500);
    }
  }, [visible]);

  const handleExitComplete = (id: number) => {
    setDamages((prevDamages) => prevDamages.filter((item) => item.id !== id));
  };

  if (!visible) {
    setTimeout(() => {
      setDamages([]);
    }, 500);
  }

  return (
    <AnimatePresence>
      {damages.map((item) => (
        <motion.div
          key={item.id}
          className="damage-text absolute text-red-600 text-4xl font-bold z-50"
          initial={{ opacity: 1, y: 50 }}
          animate={{ opacity: 0, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 1.5 }}
          onAnimationComplete={() => handleExitComplete(item.id)}
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            textShadow: '0px 0px 10px black',
          }}
        >
          {item.damage}
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

export default DamageText;
