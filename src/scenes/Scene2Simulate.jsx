import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import PizzaSliceSimulation from '../components/simulations/PizzaSliceSimulation';

export default function Scene2Simulate() {
  const navigate = useNavigate();
  const { dispatch } = useGame();

  useEffect(() => {
    dispatch({ type: 'ADVANCE_SCENE', payload: 's2_sim' });
  }, [dispatch]);

  const handleComplete = () => {
    dispatch({ type: 'ADD_SCORE', payload: { points: 15, stars: 1 } });
    dispatch({ type: 'COMPLETE_SCENE', payload: 's2' });
    navigate('/scene3-learn');
  };

  return (
    <div className="flex flex-col items-center animate-fade-in w-full py-8">
      <PizzaSliceSimulation onExploreComplete={handleComplete} />
    </div>
  );
}
