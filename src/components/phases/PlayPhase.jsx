import React, { useState } from 'react';
import PracticeLevelUI from './PracticeLevelUI'; 

const WORLDS = [
  { id: 1, name: 'Forest Gate', desc: 'Same Denominator', icon: '🌲', color: '#4caf50' },
  { id: 2, name: 'Pizza Tower', desc: 'Unit Fractions', icon: '🍕', color: '#ff7043' },
  { id: 3, name: 'Crystal Maze', desc: 'Mixed Fractions', icon: '💎', color: '#3f51b5' },
];

export default function PlayPhase({ onComplete, audioEnabled }) {
  const [currentLevel, setCurrentLevel] = useState(null);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [totalXP, setTotalXP] = useState(0);
  
  const handleLevelComplete = (stats) => {
    setCompletedLevels(prev => [...prev, currentLevel]);
    setTotalXP(prev => prev + (stats.score || 50));
    
    if (currentLevel === 3) {
      setTimeout(() => onComplete({ score: totalXP + (stats.score || 50) }), 1500);
    } else {
      setCurrentLevel(null); // Back to map
    }
  };

  if (currentLevel) {
    return <PracticeLevelUI level={currentLevel} onComplete={handleLevelComplete} />;
  }

  const allDone = completedLevels.length === 3;

  return (
    <div className="play-phase animate-fadeIn">
      <div className="play-header">
        <h2 className="play-title text-gold">🎮 Play — Choose Your Gate!</h2>
        <p className="play-subtitle">You must answer Grumble's riddles to unlock each gate!</p>
        {totalXP > 0 && <div className="play-xp-badge">⭐ {totalXP} XP</div>}
      </div>

      <div className="world-map">
        {WORLDS.map((w, i) => {
          const isUnlocked = i === 0 || completedLevels.includes(w.id - 1);
          const isCompleted = completedLevels.includes(w.id);

          return (
            <div 
              key={w.id}
              className={`world-card ${isUnlocked ? 'unlocked' : 'locked'} ${isCompleted ? 'completed' : ''}`}
              style={{ '--world-color': w.color }}
              onClick={() => isUnlocked && !isCompleted && setCurrentLevel(w.id)}
            >
              {!isUnlocked && <div className="world-lock">🔒</div>}
              {isCompleted && <div className="world-lock text-green">✅</div>}
              
              <div className="world-icon">{w.icon}</div>
              <div className="world-name">{w.name}</div>
              <div className="world-desc">{w.desc}</div>
              
              {isUnlocked && !isCompleted && (
                <button className="world-play-btn">Unlock Gate</button>
              )}
            </div>
          );
        })}
      </div>
      
      {allDone && (
        <button className="btn btn-green btn-lg mt-8 animate-bounceIn" onClick={() => onComplete({ score: totalXP })}>
          🏆 Enter Crystal Castle!
        </button>
      )}
    </div>
  );
}
