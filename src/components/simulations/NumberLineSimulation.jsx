import React, { useState, useMemo, useRef } from 'react';
import FractionDisplay from '../ui/FractionDisplay';
import { useAudio } from '../../context/AudioContext';

// Snap points the player can target (at key fractional positions across 0→1)
const SNAP_POINTS = [
  { val: 0,      label: '0',   major: true },
  { val: 0.125,  label: '⅛',  major: false },
  { val: 0.25,   label: '¼',   major: true  },
  { val: 0.333,  label: '⅓',  major: false },
  { val: 0.375,  label: '⅜',  major: false },
  { val: 0.5,    label: '½',   major: true  },
  { val: 0.625,  label: '⅝',  major: false },
  { val: 0.666,  label: '⅔',  major: false },
  { val: 0.75,   label: '¾',   major: true  },
  { val: 0.875,  label: '⅞',  major: false },
  { val: 1,      label: '1',   major: true  },
];

export default function NumberLineSimulation({ fractions: rawFractions, onComplete, isComplete }) {
  // Defensively assign IDs if they are missing
  const fractions = useMemo(() =>
    rawFractions.map((f, i) => ({ ...f, id: f.id ?? `nl-${f.n}-${f.d}-${i}` })),
    [rawFractions]
  );

  const [placements, setPlacements] = useState({});
  const [activeToken, setActiveToken] = useState(null);
  const [wrongId, setWrongId] = useState(null);
  const { playCorrect, playWrong } = useAudio();
  const containerRef = useRef(null);

  const handleSnapClick = (snapVal) => {
    if (!activeToken || isComplete) return;

    const targetDecimal = activeToken.n / activeToken.d;
    const tolerance = 0.07;

    if (Math.abs(snapVal - targetDecimal) <= tolerance) {
      if (playCorrect) playCorrect();
      const newPlacements = { ...placements, [activeToken.id]: snapVal };
      setPlacements(newPlacements);
      setActiveToken(null);
      setWrongId(null);
      if (Object.keys(newPlacements).length === fractions.length) {
        setTimeout(() => onComplete(true), 900);
      }
    } else {
      if (playWrong) playWrong();
      setWrongId(activeToken.id);
      setTimeout(() => setWrongId(null), 600);
    }
  };

  const handleLineClick = (e) => {
    if (!activeToken || isComplete || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    
    // The horizontal line is inset by 5% on left and right, so line starts at 5% and ends at 95%
    const lineLeft = width * 0.05;
    const lineWidth = width * 0.90;
    
    const clickPos = (clickX - lineLeft) / lineWidth;
    
    // Clamp between 0 and 1
    const clampedPos = Math.max(0, Math.min(1, clickPos));
    
    // Find the closest snap point
    let closestSp = SNAP_POINTS[0];
    let minDiff = Math.abs(clampedPos - closestSp.val);
    
    for (let i = 1; i < SNAP_POINTS.length; i++) {
      const diff = Math.abs(clampedPos - SNAP_POINTS[i].val);
      if (diff < minDiff) {
        minDiff = diff;
        closestSp = SNAP_POINTS[i];
      }
    }
    
    handleSnapClick(closestSp.val);
  };

  const remaining = fractions.filter(f => !placements[f.id]);

  return (
    <div style={{ width: '100%', maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>

      {/* Instruction banner */}
      <div style={{
        padding: '10px 20px', borderRadius: 'var(--radius-full)', marginBottom: '20px',
        background: activeToken ? 'rgba(255,193,7,0.15)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${activeToken ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
        transition: 'all 0.3s ease',
        fontWeight: 700, fontSize: '1rem',
        color: activeToken ? 'var(--gold)' : 'var(--text-secondary)',
      }}>
        {isComplete ? '✅ All placed correctly — excellent!' : activeToken
          ? `Now tap the number line where  ${activeToken.n}/${activeToken.d}  belongs!`
          : '👇 Pick a fraction card below, then tap its spot on the line'}
      </div>

      {/* ─── Number Line ─── */}
      <div 
        ref={containerRef}
        onClick={handleLineClick}
        style={{
          position: 'relative', width: '100%', height: '130px', marginBottom: '12px',
          background: activeToken ? 'rgba(255,193,7,0.05)' : 'rgba(255,255,255,0.04)',
          border: `2px solid ${activeToken ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 'var(--radius-xl)', transition: 'all 0.3s ease',
          boxShadow: activeToken ? '0 0 24px rgba(255,193,7,0.12)' : 'none',
          cursor: activeToken && !isComplete ? 'pointer' : 'default',
        }}
      >
        {/* Horizontal bar */}
        <div style={{
          position: 'absolute', top: '56px', left: '5%', right: '5%',
          height: '4px', background: 'rgba(255,255,255,0.6)', borderRadius: '2px',
          pointerEvents: 'none'
        }}>
          {/* Snap-point buttons */}
          {SNAP_POINTS.map((sp) => {
            const pct = sp.val * 100;
            const isPlaced = Object.values(placements).some(v => Math.abs(v - sp.val) < 0.01);
            return (
              <div
                key={sp.val}
                style={{
                  position: 'absolute',
                  left: `${pct}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: sp.major ? '36px' : '28px',
                  height: sp.major ? '52px' : '40px',
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 4,
                  pointerEvents: 'none'
                }}
              >
                {/* Tick mark */}
                <div style={{
                  width: sp.major ? '4px' : '2px',
                  height: sp.major ? '32px' : '18px',
                  borderRadius: '2px',
                  background: isPlaced ? 'var(--green)' : sp.major ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)',
                  boxShadow: activeToken && !isComplete && !isPlaced ? '0 0 8px rgba(255,193,7,0.5)' : 'none',
                  transition: 'all 0.2s ease',
                }} />
                {/* Label below major ticks */}
                {sp.major && (
                  <div style={{
                    position: 'absolute', top: '42px',
                    fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)',
                    fontFamily: 'var(--font-display)',
                    background: 'rgba(10,10,46,0.85)',
                    padding: '2px 6px', borderRadius: '6px',
                    whiteSpace: 'nowrap',
                  }}>
                    {sp.label}
                  </div>
                )}
              </div>
            );
          })}

          {/* Placed fraction tokens floating above the line */}
          {Object.entries(placements).map(([id, val]) => {
            const frac = fractions.find(f => f.id === id);
            if (!frac) return null;
            return (
              <div key={id} style={{
                position: 'absolute',
                left: `${val * 100}%`,
                top: '-58px',
                transform: 'translateX(-50%)',
                background: 'var(--bg-card-solid)',
                border: '3px solid var(--green)',
                borderRadius: '12px', padding: '4px 10px',
                boxShadow: '0 4px 16px rgba(76,175,80,0.3)',
                animation: 'bounceIn 0.4s ease',
                zIndex: 10,
                whiteSpace: 'nowrap',
              }}>
                <FractionDisplay n={frac.n} d={frac.d} size="sm" />
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Fraction token picker ─── */}
      {!isComplete && (
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '20px',
          marginTop: '40px', flexWrap: 'wrap',
        }}>
          {remaining.map((frac) => {
            const isActive = activeToken?.id === frac.id;
            const isWrong  = wrongId === frac.id;
            return (
              <button
                key={frac.id}
                onClick={() => setActiveToken(isActive ? null : frac)}
                style={{
                  background: isWrong
                    ? 'rgba(239,83,80,0.15)'
                    : isActive ? 'rgba(255,193,7,0.12)' : 'var(--bg-card)',
                  border: `3px solid ${isWrong ? 'var(--red)' : isActive ? 'var(--gold)' : 'rgba(255,255,255,0.2)'}`,
                  borderRadius: '20px', padding: '16px 24px', cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: isActive ? 'scale(1.15) translateY(-4px)' : 'scale(1)',
                  boxShadow: isActive
                    ? '0 8px 24px rgba(255,193,7,0.35)'
                    : isWrong ? '0 0 16px rgba(239,83,80,0.3)' : 'var(--shadow-button)',
                  animation: isWrong ? 'shake 0.4s ease' : 'none',
                }}
              >
                <FractionDisplay n={frac.n} d={frac.d} size="lg" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
