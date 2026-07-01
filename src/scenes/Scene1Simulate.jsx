import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import FractionBarSimulation from '../components/simulations/FractionBarSimulation';

export default function Scene1Simulate() {
  const navigate = useNavigate();
  const { dispatch } = useGame();

  useEffect(() => {
    dispatch({ type: 'ADVANCE_SCENE', payload: 's1_sim' });
  }, [dispatch]);

  const handleComplete = (success) => {
    if (success) {
      dispatch({ type: 'ADD_SCORE', payload: { points: 15, stars: 1 } });
      dispatch({ type: 'COMPLETE_SCENE', payload: 's1' });
      setTimeout(() => navigate('/scene2-learn'), 1500);
    }
  };

  const simFractions = [
    { n: 4, d: 6 },
    { n: 1, d: 6 },
    { n: 5, d: 6 },
    { n: 2, d: 6 },
  ];

  return (
    <div className="simulate-phase">
      <FractionBarSimulation fractions={simFractions} onComplete={handleComplete} />
    </div>
  );
}
