import React from 'react';
import { useGame } from '../../context/GameContext';
import { Outlet } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import StarCounter from '../ui/StarCounter';

export default function SceneWrapper() {
  const { state } = useGame();

  return (
    <div className="app-container">
      {/* Global Header */}
      <header className="absolute top-0 left-0 w-full z-10 flex justify-between items-center p-4 pointer-events-none">
        <div className="pointer-events-auto">
          <ProgressBar />
        </div>
        <div className="pointer-events-auto">
          <StarCounter count={state.stars} />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
