import React from 'react';

export default function FractionDisplay({ n, d, size = 'md' }) {
  const sizeClasses = {
    sm: 'text-xl w-6',
    md: 'text-3xl w-10',
    lg: 'text-5xl w-16',
    xl: 'text-7xl w-24'
  };

  const gapClasses = {
    sm: 'gap-0.5',
    md: 'gap-1',
    lg: 'gap-2',
    xl: 'gap-3'
  };

  return (
    <div className={`inline-flex flex-col items-center justify-center font-mono font-bold leading-none ${gapClasses[size]}`}>
      <span className={sizeClasses[size] + " text-center"}>{n}</span>
      <div className={`bg-current w-full ${size === 'sm' ? 'h-0.5' : size === 'md' ? 'h-1' : 'h-2'}`}></div>
      <span className={sizeClasses[size] + " text-center"}>{d}</span>
    </div>
  );
}
