import React from 'react';

export default function Badge({ type, size = 'md' }) {
  const badgeColors = {
    'fraction-finder': 'bg-blue-500',
    'pizza-pro': 'bg-orange-500',
    'number-line-ninja': 'bg-purple-500',
    'fraction-master': 'bg-yellow-500',
    'crystal-champion': 'bg-indigo-600',
  };

  const badgeNames = {
    'fraction-finder': 'Fraction Finder',
    'pizza-pro': 'Pizza Pro',
    'number-line-ninja': 'Number Line Ninja',
    'fraction-master': 'Fraction Master',
    'crystal-champion': 'Crystal Champion',
  };

  return (
    <div className={`rounded-full ${badgeColors[type] || 'bg-gray-400'} text-white font-bold font-heading text-center flex items-center justify-center shadow-lg border-4 border-white
      ${size === 'sm' ? 'w-16 h-16 text-xs' : size === 'md' ? 'w-24 h-24 text-sm' : 'w-32 h-32 text-lg'}
    `}>
      <span className="p-2 leading-tight drop-shadow-md">{badgeNames[type] || 'Badge'}</span>
    </div>
  );
}
