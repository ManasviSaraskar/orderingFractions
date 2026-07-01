import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import CharacterSpeech from '../components/layout/CharacterSpeech';
import Badge from '../components/ui/Badge';

export default function VictoryScene() {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch({ type: 'ADVANCE_SCENE', payload: 'victory' });
    dispatch({ type: 'ADD_BADGE', payload: 'crystal-champion' });
  }, [dispatch]);

  return (
    <div className="flex flex-col items-center text-center animate-fade-in w-full relative">
      <div className="card-container z-10 w-full max-w-4xl py-12">
        <h1 className="text-success text-6xl md:text-7xl mb-4">Victory!</h1>
        <h2 className="text-3xl text-gray-700 mb-8">You unlocked the Crystal Castle!</h2>
        
        <div className="flex justify-center gap-6 mb-12">
          {state.badges.map(b => <Badge key={b} type={b} size="lg" />)}
        </div>

        <div className="text-2xl font-bold mb-12 flex flex-col gap-2">
          <div>Final Score: <span className="text-primary">{state.score}</span></div>
          <div>Stars Earned: <span className="text-yellow-500">{state.stars} ⭐</span></div>
        </div>

        <button className="btn-primary py-4 px-12 text-2xl" onClick={() => window.location.reload()}>
          Play Again
        </button>
      </div>

      <CharacterSpeech 
        character="Zara" 
        text="You did it! Grumble is defeated! You're a Fraction Master!" 
        position="bottom-right"
      />
    </div>
  );
}
