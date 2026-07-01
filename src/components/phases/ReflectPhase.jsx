import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';

const REFLECT_QUESTIONS = [
  { q: "If two fractions have the same denominator, how do we know which is bigger?", options: [
    { text: "Look at the numerator (top number)", correct: true, emoji: "👀" },
    { text: "Look at the denominator again", correct: false, emoji: "👇" },
    { text: "They are the same size", correct: false, emoji: "⚖️" },
  ]},
  { q: "What happens when you cut a pizza into MORE slices?", options: [
    { text: "Each slice gets SMALLER", correct: true, emoji: "🍕" },
    { text: "Each slice gets BIGGER", correct: false, emoji: "📈" },
    { text: "The pizza gets larger", correct: false, emoji: "🌍" },
  ]},
  { q: "How can you tell if 3/4 is bigger than 1/2?", options: [
    { text: "Compare them on a number line", correct: true, emoji: "📏" },
    { text: "Guess which one sounds bigger", correct: false, emoji: "🤔" },
    { text: "Add the numbers together", correct: false, emoji: "➕" },
  ]},
];

const CONFIDENCE_LEVELS = [
  { emoji: '😊', label: "I'm great at ordering fractions!", color: '#4caf50' },
  { emoji: '🙂', label: 'I can order most fractions!', color: '#ff9800' },
  { emoji: '😐', label: "I'm still learning", color: '#42a5f5' },
];

export default function ReflectPhase({ stats, onRestart, onGoHome, audioEnabled }) {
  const [step, setStep] = useState(0);
  const [teachIdx, setTeachIdx] = useState(0);
  const [teachAnswered, setTeachAnswered] = useState(false);
  const [teachCorrect, setTeachCorrect] = useState(0);
  const [confidence, setConfidence] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState([]);

  const score = stats?.score || 0;
  const xp = score;

  useEffect(() => {
    if (showConfetti) {
      const pieces = Array.from({ length: 40 }, (_, i) => ({
        id: i, x: Math.random() * 100, delay: Math.random() * 2,
        color: ['#ffc107', '#e91e63', '#4caf50', '#2196f3', '#ff5722', '#9c27b0'][i % 6],
        size: 6 + Math.random() * 10, duration: 2 + Math.random() * 3,
      }));
      setConfettiPieces(pieces);
    }
  }, [showConfetti]);

  const handleTeachAnswer = (opt) => {
    if (teachAnswered) return;
    setTeachAnswered(true);
    
    if (opt.correct) {
      setTeachCorrect(c => c + 1);
    } 
    
    setTimeout(() => {
      setTeachAnswered(false);
      if (teachIdx + 1 < REFLECT_QUESTIONS.length) {
        setTeachIdx(i => i + 1);
      } else {
        setStep(1);
      }
    }, 1500);
  };

  const handleConfidenceSelect = (idx) => {
    setConfidence(idx);
    setShowConfetti(true);
    setTimeout(() => setStep(2), 1000);
  };

  if (step === 0) {
    const rq = REFLECT_QUESTIONS[teachIdx];
    return (
      <div className="reflect-phase animate-fadeIn">
        <div className="reflect-header">
          <h3 className="reflect-label text-gold">📓 Reflect</h3>
          <p className="reflect-sublabel text-secondary">Teach Sarah what you learned!</p>
        </div>
        <div className="reflect-card">
          <div className="reflect-mascot-row">
            <div className="mascot thinking" style={{ width: 70, height: 70, fontSize: '2rem' }}>👧</div>
            <div className="speech-bubble" style={{ maxWidth: 280 }}>Can you help me? {rq.q}</div>
          </div>
          <div className="reflect-options">
            {rq.options.map((opt, i) => (
              <button key={i}
                className={`reflect-option ${teachAnswered ? (opt.correct ? 'correct' : 'wrong') : ''}`}
                onClick={() => handleTeachAnswer(opt)} disabled={teachAnswered}>
                <span className="reflect-option-emoji">{opt.emoji}</span>
                <span>{opt.text}</span>
              </button>
            ))}
          </div>
          <div className="reflect-progress mt-8">
            {REFLECT_QUESTIONS.map((_, i) => (
              <div key={i} className={`reflect-dot ${i === teachIdx ? 'active' : i < teachIdx ? 'done' : ''}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="reflect-phase animate-fadeIn">
        <div className="reflect-card">
          <h3 className="reflect-card-title text-gold text-2xl mb-4">How do you feel about ordering fractions?</h3>
          <p className="text-secondary mb-8">Be honest — every answer is great!</p>
          <div className="confidence-grid">
            {CONFIDENCE_LEVELS.map((c, i) => (
              <button key={i} className={`confidence-btn ${confidence === i ? 'selected' : ''}`}
                onClick={() => handleConfidenceSelect(i)} style={{ '--conf-color': c.color }}>
                <span className="confidence-emoji">{c.emoji}</span>
                <span className="confidence-label">{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reflect-phase animate-fadeIn">
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
      <div className="certificate-card">
        <div className="cert-badge">🏆</div>
        <h2 className="cert-title text-gold">Fraction Master!</h2>
        <p className="cert-subtitle">You have unlocked the Crystal Castle and defeated Grumble!</p>
        
        <div className="cert-stats">
          <div className="cert-stat">
            <div className="cert-stat-value text-gold">{xp}</div>
            <div className="cert-stat-label">Total XP</div>
          </div>
          <div className="cert-stat">
            <div className="cert-stat-value text-blue-bright">3</div>
            <div className="cert-stat-label">Gates Unlocked</div>
          </div>
          <div className="cert-stat">
            <div className="cert-stat-value text-green-light">{teachCorrect}/{REFLECT_QUESTIONS.length}</div>
            <div className="cert-stat-label">Teaching Score</div>
          </div>
        </div>

        <div className="mascot-container mt-8" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="mascot happy" style={{ width: 80, height: 80, fontSize: '2rem' }}>👧</div>
          <div className="speech-bubble mt-4">
            Incredible! We saved the Crystal Castle together! ✨
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginTop: 24 }}>
          <button className="btn btn-primary btn-lg" onClick={onRestart}>🔄 Play Again</button>
          <button className="btn btn-secondary" onClick={onGoHome}>🏠 Home</button>
        </div>
      </div>
    </div>
  );
}
