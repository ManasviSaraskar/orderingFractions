import React, { useState, useCallback, useEffect } from 'react';
import FractionBarSimulation from '../simulations/FractionBarSimulation';
import PizzaSliceSimulation from '../simulations/PizzaSliceSimulation';
import NumberLineSimulation from '../simulations/NumberLineSimulation';

const STATIONS = [
  { id: 0, title: 'Same Denominator', subtitle: 'Fraction Bars', icon: '📊' },
  { id: 1, title: 'Unit Fractions', subtitle: 'Pizza Slices', icon: '🍕' },
  { id: 2, title: 'Mixed Fractions', subtitle: 'Number Line', icon: '📏' },
];

import { narrate, stopNarration } from '../../utils/audio';
import { simulateIntro, simulateStationIntro } from '../../utils/narration';

export default function SimulatePhase({ onComplete, audioEnabled }) {
  const [station, setStation] = useState(0);
  const [stationComplete, setStationComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState([]);

  useEffect(() => {
    if (!audioEnabled) return;
    let cancelled = false;
    const playNarrative = async () => {
      if (station === 0) {
        await narrate(simulateIntro(), true);
        if (cancelled) return;
        await narrate(simulateStationIntro(station), false);
      } else {
        await narrate(simulateStationIntro(station), true);
      }
    };
    playNarrative();
    return () => {
      cancelled = true;
      stopNarration();
    };
  }, [station, audioEnabled]);

  useEffect(() => {
    if (showConfetti) {
      const pieces = Array.from({ length: 40 }, (_, i) => ({
        id: i, x: Math.random() * 100, delay: Math.random() * 2,
        color: ['#ffc107', '#e91e63', '#4caf50', '#2196f3', '#ff5722', '#9c27b0'][i % 6],
        size: 6 + Math.random() * 10, duration: 2 + Math.random() * 3,
      }));
      setConfettiPieces(pieces);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [showConfetti]);

  const nextStation = useCallback(() => {
    setStationComplete(false);
    setShowConfetti(false);
    if (station < 2) {
      setStation(s => s + 1);
    } else {
      onComplete();
    }
  }, [station, onComplete]);

  // Data for stations
  const simFractions1 = [
    { n: 4, d: 6 },
    { n: 1, d: 6 },
    { n: 5, d: 6 },
    { n: 2, d: 6 },
  ];

  const simFractions3 = [
    { n: 1, d: 4, id: 'frac-1-4' },
    { n: 3, d: 4, id: 'frac-3-4' },
    { n: 1, d: 2, id: 'frac-1-2' },
  ];

  const handleSimComplete = (success) => {
    if (success === undefined || success) {
      setStationComplete(true);
      setShowConfetti(true);
    }
  };

  return (
    <div className="simulate-phase animate-fadeIn">
      {showConfetti && (
        <div className="confetti-container">
          {confettiPieces.map(p => (
            <div key={p.id} className="confetti-piece" style={{
              left: `${p.x}%`, animationDelay: `${p.delay}s`,
              backgroundColor: p.color, width: p.size, height: p.size,
              animationDuration: `${p.duration}s`,
            }} />
          ))}
        </div>
      )}

      <div className="simulate-header">
        <h3 className="simulate-label">🧪 Simulate</h3>
        <p className="simulate-sublabel">Explore and discover — interact with the fractions!</p>
      </div>
      
      <div className="progress-dots">
        {STATIONS.map((s, i) => (
          <div key={i} className="simulate-dot-wrapper">
            <div className={`progress-dot ${i === station ? 'active' : i < station ? 'completed' : ''}`} />
            <span className="simulate-dot-label">{s.icon}</span>
          </div>
        ))}
      </div>
      
      <div className="glass-card" style={{ maxWidth: 800, width: '100%', animation: 'slideUp 0.4s ease' }}>
        {station === 0 && (
          <div style={{ textAlign: 'center' }}>
            <div className="station-header"><h2>📊 Same Denominator</h2></div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
              Drag the fractions to order them from smallest to largest!
            </p>
            <FractionBarSimulation fractions={simFractions1} onComplete={handleSimComplete} isComplete={stationComplete} />
          </div>
        )}
        
        {station === 1 && (
          <div style={{ textAlign: 'center' }}>
            <div className="station-header"><h2>🍕 Unit Fractions</h2></div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
              Change the number of slices to see what happens to the size of each piece!
            </p>
            <PizzaSliceSimulation onExploreComplete={handleSimComplete} isComplete={stationComplete} />
          </div>
        )}
        
        {station === 2 && (
          <div style={{ textAlign: 'center' }}>
            <div className="station-header"><h2>📏 Mixed Fractions</h2></div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
              Tap a fraction, then tap its spot on the number line!
            </p>
            <NumberLineSimulation fractions={simFractions3} onComplete={handleSimComplete} isComplete={stationComplete} />
          </div>
        )}

        {stationComplete && (
          <div style={{ marginTop: 24, animation: 'bounceIn 0.5s', textAlign: 'center' }}>
            <button className="btn btn-primary btn-lg" onClick={nextStation}>
              {station < 2 ? 'Next Station →' : '🎉 Complete Simulation!'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
