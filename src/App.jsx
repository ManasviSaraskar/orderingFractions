import React, { useState, useCallback } from 'react';
import { GameProvider } from './context/GameContext';
import { AudioProvider } from './context/AudioContext';

import FloatingNumbers from './components/FloatingNumbers';
import WonderPhase from './components/phases/WonderPhase';
import StoryPhase from './components/phases/StoryPhase';
import SimulatePhase from './components/phases/SimulatePhase';
import PlayPhase from './components/phases/PlayPhase';
import ReflectPhase from './components/phases/ReflectPhase';

// intro = landing screen, wonder/story/simulate/play/reflect = the 5 phases
const PHASES = ['intro', 'wonder', 'story', 'simulate', 'play', 'reflect'];
const JOURNEY_ITEMS = [
  { icon: '🔍', label: 'Wonder' },
  { icon: '📖', label: 'Story' },
  { icon: '🧪', label: 'Simulate' },
  { icon: '🎮', label: 'Play' },
  { icon: '📓', label: 'Reflect' },
];

const JOURNEY_PHASES = [
  { icon: '🔍', label: 'Wonder', desc: 'The Mystery Question' },
  { icon: '📖', label: 'Story', desc: 'The Scrambled Stones' },
  { icon: '🧪', label: 'Simulate', desc: 'Interactive Tools' },
  { icon: '🎮', label: 'Play', desc: 'Practice Gates' },
  { icon: '📓', label: 'Reflect', desc: 'Crystal Castle Unlocked' },
];

function IntroScreen({ onStart }) {
  return (
    <div className="intro-screen">
      <div className="intro-badge">✨ Grade 3 Math</div>

      <h1 className="intro-title">
        <span style={{ color: 'var(--gold)' }}>FractionQuest</span>
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: 4, fontFamily: 'var(--font-display)' }}>
        Lesson 5.5 · Ordering Fractions
      </p>

      <div className="mascot-container">
        <div className="mascot">👧</div>
        <div className="speech-bubble">
          Let's explore fractions and save the Crystal Castle! ✨
        </div>
      </div>

      <p className="intro-desc">
        Learn to <strong style={{ color: 'var(--gold)' }}>order fractions</strong>, solve the mystery of
        the scrambled stones, and defeat Grumble the Troll!
      </p>

      <div className="intro-journey-map">
        <h3 className="intro-journey-title">Your Learning Journey</h3>
        <div className="intro-journey-steps">
          {JOURNEY_PHASES.map((p, i) => (
            <div key={i} className="intro-journey-step">
              <div className="intro-journey-icon">{p.icon}</div>
              <div className="intro-journey-info">
                <div className="intro-journey-label">{p.label}</div>
                <div className="intro-journey-desc">{p.desc}</div>
              </div>
              {i < JOURNEY_PHASES.length - 1 && <div className="intro-journey-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-primary btn-lg intro-start-btn" onClick={onStart} id="start-journey-btn">
        🚀 Begin Your Journey!
      </button>

      <div className="feature-cards">
        <div className="feature-card">
          <div className="feature-card-icon">🌲</div>
          <div className="feature-card-label">Fraction Forest</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">🍕</div>
          <div className="feature-card-label">Interactive Math</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">✨</div>
          <div className="feature-card-label">Badges & XP</div>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const [phase, setPhase] = useState('intro');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [playStats, setPlayStats] = useState(null);

  const toggleAudio = useCallback(() => setAudioEnabled(prev => !prev), []);

  const goHome = useCallback(() => {
    setPhase('intro');
    setPlayStats(null);
  }, []);

  const restart = useCallback(() => {
    setPhase('wonder');
    setPlayStats(null);
  }, []);

  const phaseIndex = PHASES.indexOf(phase);
  // Show journey bar on all phases except intro
  const showJourney = phase !== 'intro';

  return (
    <>
      <FloatingNumbers />
      <div className="app-container">
        {/* Audio Toggle */}
        <button className="audio-toggle-btn" onClick={toggleAudio} title={audioEnabled ? 'Mute' : 'Unmute'}>
          {audioEnabled ? '🔊' : '🔇'}
        </button>

        {/* Home Button */}
        {showJourney && (
          <button className="home-btn" onClick={goHome}>
            🏠 Home
          </button>
        )}

        {/* Journey Progress Bar */}
        {showJourney && (
          <div className="journey-bar">
            {JOURNEY_ITEMS.map((item, i) => {
              const stepPhaseIndex = i + 1; // wonder=1, story=2, simulate=3, play=4, reflect=5
              const isActive = phaseIndex === stepPhaseIndex;
              const isCompleted = phaseIndex > stepPhaseIndex;
              return (
                <div key={i} className="journey-step-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                  <div className={`journey-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                    <div className="journey-step-dot">{isCompleted ? '✓' : item.icon}</div>
                    <div className="journey-step-label">{item.label}</div>
                  </div>
                  {i < JOURNEY_ITEMS.length - 1 && (
                    <div className={`journey-connector ${phaseIndex > stepPhaseIndex ? 'filled' : ''}`} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Phase Content ── */}
        {phase === 'intro' && (
          <IntroScreen onStart={() => setPhase('wonder')} />
        )}

        {phase === 'wonder' && (
          <WonderPhase
            onComplete={() => setPhase('story')}
            audioEnabled={audioEnabled}
          />
        )}

        {phase === 'story' && (
          <StoryPhase
            onComplete={() => setPhase('simulate')}
            audioEnabled={audioEnabled}
          />
        )}

        {phase === 'simulate' && (
          <SimulatePhase
            onComplete={() => setPhase('play')}
            audioEnabled={audioEnabled}
          />
        )}

        {phase === 'play' && (
          <PlayPhase
            onComplete={(stats) => { setPlayStats(stats); setPhase('reflect'); }}
            audioEnabled={audioEnabled}
          />
        )}

        {phase === 'reflect' && (
          <ReflectPhase
            stats={playStats}
            onRestart={restart}
            onGoHome={goHome}
            audioEnabled={audioEnabled}
          />
        )}
      </div>
    </>
  );
}

function App() {
  return (
    <AudioProvider>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </AudioProvider>
  );
}

export default App;
