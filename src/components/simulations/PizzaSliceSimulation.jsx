import React, { useState } from 'react';
import FractionDisplay from '../ui/FractionDisplay';

export default function PizzaSliceSimulation({ onExploreComplete, isComplete }) {
  const [denominator, setDenominator] = useState(2);
  const [hasExplored, setHasExplored] = useState(false);

  const handleSliderChange = (e) => {
    if (isComplete) return;
    const val = parseInt(e.target.value);
    setDenominator(val);
    if (val >= 6) setHasExplored(true); 
  };

  const createSlices = () => {
    const slices = [];
    const center = 150;
    const radius = 120;
    const angleStep = (2 * Math.PI) / denominator;

    for (let i = 0; i < denominator; i++) {
      const startAngle = i * angleStep - Math.PI / 2;
      const endAngle = (i + 1) * angleStep - Math.PI / 2;

      const x1 = center + radius * Math.cos(startAngle);
      const y1 = center + radius * Math.sin(startAngle);
      const x2 = center + radius * Math.cos(endAngle);
      const y2 = center + radius * Math.sin(endAngle);

      const largeArc = angleStep > Math.PI ? 1 : 0;

      const d = [
        `M ${center} ${center}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');

      slices.push(
        <path
          key={i}
          d={d}
          fill={i === 0 ? 'var(--coral)' : 'var(--purple-light)'}
          stroke="var(--bg-dark)"
          strokeWidth="4"
          style={{ transition: 'all 0.3s ease' }}
        />
      );
    }
    return slices;
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '32px', marginBottom: '32px' }}>
        <svg width="240" height="240" viewBox="0 0 300 300" style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))' }}>
          <circle cx="150" cy="150" r="120" fill="var(--bg-card-solid)" stroke="var(--gold)" strokeWidth="6" />
          {createSlices()}
        </svg>

        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: 'var(--radius-lg)',
          border: '2px solid rgba(255,255,255,0.1)'
        }}>
          <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 'bold', marginBottom: '8px' }}>One Slice is</span>
          <FractionDisplay n={1} d={denominator} size="xl" />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '400px', margin: '0 auto' }}>
        <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>2</span>
        <input 
          type="range" 
          min="2" max="12" 
          value={denominator} 
          onChange={handleSliderChange}
          style={{ width: '100%', cursor: 'pointer' }}
          disabled={isComplete}
        />
        <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>12</span>
      </div>

      {hasExplored && !isComplete && (
        <div style={{ marginTop: '32px', animation: 'fadeIn 0.5s' }}>
          <button className="btn btn-outline" onClick={() => onExploreComplete(true)}>I understand!</button>
        </div>
      )}
    </div>
  );
}
