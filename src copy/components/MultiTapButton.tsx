import useMultiTap from '@/hooks/useMultiTap';
import React from 'react';

interface MultiTapButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  threshold?: number;
  timeoutDuration?: number;
}

const MultiTapButton: React.FC<MultiTapButtonProps> = ({
  threshold = 2,
  timeoutDuration = 500,
  onClick,
  children,
  ...buttonProps
}) => {
  const handleMultiPress = useMultiTap(threshold, timeoutDuration);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (typeof onClick === 'function') {
      handleMultiPress(() => {
        onClick(event);
      });
    }
  };

  return (
    <button onClick={handleClick} {...buttonProps}>
      {children}
    </button>
  );
};

export default MultiTapButton;
