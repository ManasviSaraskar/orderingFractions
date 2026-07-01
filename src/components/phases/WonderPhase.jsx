import React, { useState, useEffect, useCallback } from 'react';
import { narrate, stopNarration } from '../../utils/audio';
import { wonderIntro, wonderNarration } from '../../utils/narration';

const WONDER_QUESTIONS = [
  {
    question: "Grumble has scrambled the fraction stones on the path! Can you tell which is the biggest?",
    subtext: "When we compare fractions, we need to look at their numerator AND denominator!",
    emoji: "🪨",
    bgEmojis: ["¼", "½", "¾", "⅓", "✨"],
  },
  {
    question: "Sarah ate ½ of a pizza. Mike ate ¾. Who ate more — and how do you know?",
    subtext: "Ordering fractions helps us compare amounts without guessing!",
    emoji: "🍕",
    bgEmojis: ["🍕", "½", "¾", "🤔", "✨"],
  },
  {
    question: "There are 3 magic gates: 1/4, 3/4, and 1/2. Which gate comes last on the path?",
    subtext: "Ordering fractions on a number line shows us exactly where each one lives!",
    emoji: "🌟",
    bgEmojis: ["¼", "¾", "½", "🌲", "✨"],
  },
  {
    question: "If you split a chocolate bar into 8 pieces and eat 3, is that more or less than ½?",
    subtext: "Fractions are everywhere — and knowing their order is a superpower!",
    emoji: "🍫",
    bgEmojis: ["🍫", "⅜", "½", "🤩", "✨"],
  },
];

export default function WonderPhase({ onComplete, audioEnabled }) {
  const [wonder] = useState(() => WONDER_QUESTIONS[Math.floor(Math.random() * WONDER_QUESTIONS.length)]);
  const [stage, setStage] = useState(0);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!audioEnabled) return;
    let cancelled = false;
    const playNarrative = async () => {
      await narrate(wonderIntro(), true);
      if (cancelled) return;
      await narrate(wonderNarration(wonder), false);
    };
    playNarrative();
    return () => {
      cancelled = true;
      stopNarration();
    };
  }, [wonder, audioEnabled]);

  useEffect(() => {
    const p = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      emoji: wonder.bgEmojis[i % wonder.bgEmojis.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 12,
      size: 1.2 + Math.random() * 1.8,
    }));
    setParticles(p);

    const t1 = setTimeout(() => setStage(1), 400);
    const t2 = setTimeout(() => setStage(2), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [wonder]);

  const handleDiscover = useCallback(() => {
    setTimeout(() => onComplete(), 300);
  }, [onComplete]);

  return (
    <div className="wonder-phase">
      {/* Floating background particles */}
      <div className="wonder-particles">
        {particles.map(p => (
          <span key={p.id} className="wonder-particle" style={{
            left: `${p.x}%`, top: `${p.y}%`,
            animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`,
            fontSize: `${p.size}rem`,
          }}>{p.emoji}</span>
        ))}
      </div>

      <div className="wonder-content">
        {/* Pulsing ? orb */}
        <div className={`wonder-qmark ${stage >= 1 ? 'revealed' : ''}`}>
          <span className="wonder-qmark-icon">?</span>
          <div className="wonder-qmark-glow" />
        </div>

        {/* Mascot + speech bubble */}
        <div className={`wonder-mascot ${stage >= 1 ? 'visible' : ''}`}>
          <div className="mascot thinking">👧</div>
          <div className="speech-bubble wonder-bubble">Hmm… I wonder… 🤔</div>
        </div>

        {/* Question card */}
        <div className={`wonder-question-card ${stage >= 1 ? 'visible' : ''}`}>
          <div className="wonder-emoji">{wonder.emoji}</div>
          <h2 className="wonder-question-text">{wonder.question}</h2>
          <p className="wonder-subtext">{wonder.subtext}</p>
        </div>

        {/* CTA button — appears last */}
        <button
          className={`btn btn-wonder ${stage >= 2 ? 'visible' : ''}`}
          onClick={handleDiscover}
          id="discover-btn"
        >
          <span className="wonder-btn-sparkle">✨</span>
          Let's Discover!
          <span className="wonder-btn-sparkle">✨</span>
        </button>
      </div>
    </div>
  );
}
