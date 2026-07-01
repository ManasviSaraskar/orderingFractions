import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import CharacterSpeech from '../components/layout/CharacterSpeech';

export default function Scene1Learn() {
  const navigate = useNavigate();
  const { dispatch } = useGame();

  useEffect(() => {
    dispatch({ type: 'ADVANCE_SCENE', payload: 's1_learn' });
  }, [dispatch]);

  return (
    <div className="story-phase">
      <div className="glass-card w-full max-w-3xl text-center z-10 mb-20 text-white">
        <h2 className="mb-6 text-gold font-display font-semibold text-3xl">The Same Denominator Gate</h2>
        <p className="text-xl mb-8 font-body leading-relaxed text-secondary">
          When fractions have the <strong className="font-display text-white">same denominator</strong> (bottom number), 
          the one with the <strong className="font-display text-green-light">bigger numerator</strong> (top number) is larger.
        </p>
        
        <div className="flex justify-center items-center gap-4 font-display text-3xl font-bold bg-white/10 p-6 rounded-2xl border-2 border-white/20">
          <span className="text-secondary text-lg">Example:</span>
          <span>1/8</span> <span className="text-gold">&lt;</span>
          <span>3/8</span> <span className="text-gold">&lt;</span>
          <span>5/8</span>
        </div>

        <button 
          className="btn btn-primary mt-12"
          onClick={() => navigate('/scene1-sim')}
        >
          Try It!
        </button>
      </div>

      <CharacterSpeech 
        character="Priya" 
        text="Look at the top numbers only! They're all eighths, so bigger top = bigger fraction!" 
        position="bottom-left"
      />
    </div>
  );
}
