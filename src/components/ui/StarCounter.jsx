import React from 'react';
import { Star } from 'lucide-react';

export default function StarCounter({ count }) {
  return (
    <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full border-4 border-yellow-400">
      <Star className="w-8 h-8 text-yellow-500 fill-yellow-500 drop-shadow-md" />
      <span className="font-heading font-black text-3xl text-yellow-700">{count}</span>
    </div>
  );
}
