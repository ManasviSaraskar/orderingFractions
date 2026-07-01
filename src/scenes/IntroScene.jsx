import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import CharacterSpeech from '../components/layout/CharacterSpeech';

export default function IntroScene() {
  const navigate = useNavigate();
  const { dispatch } = useGame();

  useEffect(() => {
    dispatch({ type: 'ADVANCE_SCENE', payload: 'intro' });
  }, [dispatch]);

  return (
    <div className="intro-screen">
      <div className="intro-badge">
        Ordering Fractions
      </div>
      <h1 className="intro-title text-gold drop-shadow-lg mb-4">FractionQuest</h1>

      <CharacterSpeech 
        character="Sarah" 
        text="Oh no! Grumble has mixed up all the fraction stones! We need to put them back in order or the Crystal Castle will be locked forever!" 
      />

      <div className="mt-8">
        <button 
          className="btn btn-primary intro-start-btn"
          onClick={() => navigate('/scene1-learn')}
        >
          Start Adventure!
        </button>
      </div>
    </div>
  );
}
