import React from 'react';
import { useGame } from '../../context/GameContext';

export default function ProgressBar() {
  const { state } = useGame();
  const stages = ['intro', 's1', 's2', 's3', 'practice'];
  
  // Very simple mapping for progress
  let currentIndex = 0;
  if (state.currentScene.startsWith('s1')) currentIndex = 1;
  else if (state.currentScene.startsWith('s2')) currentIndex = 2;
  else if (state.currentScene.startsWith('s3')) currentIndex = 3;
  else if (state.currentScene.startsWith('p') || state.currentScene === 'victory') currentIndex = 4;

  return (
    <div className="w-full max-w-2xl mx-auto flex gap-2 p-4">
      {stages.map((stage, idx) => (
        <div 
          key={stage} 
          className={`h-4 flex-1 rounded-full transition-colors duration-500 ${
            idx <= currentIndex ? 'bg-success' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );
}
