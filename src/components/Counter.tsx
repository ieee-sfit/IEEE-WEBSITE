import React from 'react';
import { useCounterAnimation } from '../hooks/useScrollAnimation';

interface CounterProps {
  endValue: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

const Counter: React.FC<CounterProps> = ({
  endValue,
  duration = 2000,
  suffix = '',
  prefix = '',
  className = 'text-2xl font-bold text-gray-800'
}) => {
  const { ref, count } = useCounterAnimation(endValue, duration);

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
};

export default Counter;
