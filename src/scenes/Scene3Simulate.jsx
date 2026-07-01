import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import NumberLineSimulation from '../components/simulations/NumberLineSimulation';

export default function Scene3Simulate() {
  const navigate = useNavigate();
  const { dispatch } = useGame();

  useEffect(() => {
    dispatch({ type: 'ADVANCE_SCENE', payload: 's3_sim' });
  }, [dispatch]);

  const handleComplete = (success) => {
    if (success) {
      dispatch({ type: 'ADD_SCORE', payload: { points: 15, stars: 1 } });
      dispatch({ type: 'COMPLETE_SCENE', payload: 's3' });
      navigate('/practice-1');
    }
  };

  const simFractions = [
    { n: 1, d: 4, id: 'frac-1-4' },
    { n: 3, d: 4, id: 'frac-3-4' },
    { n: 1, d: 2, id: 'frac-1-2' },
  ];

  return (
    <div className="flex flex-col items-center animate-fade-in w-full py-8">
      <NumberLineSimulation fractions={simFractions} onComplete={handleComplete} />
    </div>
  );
}
