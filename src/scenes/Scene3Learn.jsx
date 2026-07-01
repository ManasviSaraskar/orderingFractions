import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import CharacterSpeech from '../components/layout/CharacterSpeech';

export default function Scene3Learn() {
  const navigate = useNavigate();
  const { dispatch } = useGame();

  useEffect(() => {
    dispatch({ type: 'ADVANCE_SCENE', payload: 's3_learn' });
  }, [dispatch]);

  return (
    <div className="flex flex-col items-center animate-fade-in w-full h-[600px] justify-center relative">
      <div className="card-container w-full max-w-3xl text-center z-10 mb-20">
        <h2 className="mb-6">The Mixed Fraction Maze</h2>
        <p className="text-2xl mb-8 font-body leading-relaxed">
          To order fractions with <strong className="font-heading text-primary">different numerators and denominators</strong>, 
          place them on a number line between 0 and 1.
        </p>
        
        <div className="bg-blue-50 p-6 rounded-2xl border-4 border-blue-100 text-xl font-bold text-gray-700">
          Tip: Compare to <span className="font-mono text-2xl text-accent mx-2">1/2</span> to see if it's smaller or larger!
        </div>

        <button 
          className="btn-primary mt-12"
          onClick={() => navigate('/scene3-sim')}
        >
          Try It!
        </button>
      </div>

      <CharacterSpeech 
        character="Mike" 
        text="Is it closer to 0, to 1/2, or to 1? That helps you decide where it goes!" 
        position="bottom-left"
      />
    </div>
  );
}
