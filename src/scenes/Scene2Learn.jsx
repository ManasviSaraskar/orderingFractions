import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import CharacterSpeech from '../components/layout/CharacterSpeech';

export default function Scene2Learn() {
  const navigate = useNavigate();
  const { dispatch } = useGame();

  useEffect(() => {
    dispatch({ type: 'ADVANCE_SCENE', payload: 's2_learn' });
  }, [dispatch]);

  return (
    <div className="flex flex-col items-center animate-fade-in w-full h-[600px] justify-center relative">
      <div className="card-container w-full max-w-3xl text-center z-10 mb-20">
        <h2 className="mb-6">The Unit Fraction Tower</h2>
        <p className="text-2xl mb-8 font-body leading-relaxed">
          <strong className="font-heading text-primary">Unit fractions</strong> have 1 on top (like 1/2, 1/3, 1/4...). 
          With 1 on top, the <strong className="font-heading text-accent">bigger the denominator</strong> (bottom number), 
          the <strong className="font-heading text-accent">smaller the fraction</strong>.
        </p>
        
        <div className="flex justify-center items-center gap-4 font-mono text-3xl font-bold bg-blue-50 p-6 rounded-2xl border-4 border-blue-100">
          <span className="text-gray-600">Example:</span>
          <span>1/2</span> <span className="text-accent">&gt;</span>
          <span>1/3</span> <span className="text-accent">&gt;</span>
          <span>1/4</span>
        </div>

        <button 
          className="btn-primary mt-12"
          onClick={() => navigate('/scene2-sim')}
        >
          Try It!
        </button>
      </div>

      <CharacterSpeech 
        character="Zara" 
        text="If you cut a pizza into MORE slices, each slice is SMALLER!" 
        position="bottom-right"
      />
    </div>
  );
}
