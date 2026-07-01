import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import { generateLevelQuestions } from '../../utils/questionGenerator';
import MCQQuestion from '../practice/MCQQuestion';
import TrueFalseQuestion from '../practice/TrueFalseQuestion';
import DragOrderQuestion from '../practice/DragOrderQuestion';
import NumberLineSimulation from '../simulations/NumberLineSimulation';

import { narrate, stopNarration } from '../../utils/audio';
import { questionNarration } from '../../utils/narration';

export default function PracticeLevelUI({ level, onComplete, audioEnabled }) {
  const { dispatch } = useGame();
  const { playCorrect, playWrong } = useAudio();
  
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (questions[currentIndex] && audioEnabled) {
      narrate(questionNarration(questions[currentIndex].questionText), true);
    } else {
      stopNarration();
    }
    return () => stopNarration();
  }, [currentIndex, questions, audioEnabled]);
  
  // Gamification state
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [totalXP, setTotalXP] = useState(0);
  const [xpPopup, setXpPopup] = useState(null);
  const [feedback, setFeedback] = useState(null); // { type, message, sub }
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const generated = generateLevelQuestions(level, Date.now());
    setQuestions(generated);
  }, [level]);

  const currentQ = questions[currentIndex];

  const handleAnswer = (answer) => {
    if (feedback || failed) return;

    let isCorrect = false;
    
    if (currentQ.type === 'MCQ') {
      isCorrect = answer.n === currentQ.correct.n && answer.d === currentQ.correct.d;
    } else if (currentQ.type === 'TRUE_FALSE') {
      isCorrect = answer === currentQ.correct;
    } else if (currentQ.type === 'WORD_PROBLEM') {
      isCorrect = answer === currentQ.correct;
    } else if (currentQ.type === 'DRAG_ORDER') {
      isCorrect = answer.every((f, i) => f.n === currentQ.correct[i].n && f.d === currentQ.correct[i].d);
    } else if (currentQ.type === 'NUMBER_LINE') {
      isCorrect = true; 
    }

    if (isCorrect) {
      if (playCorrect) playCorrect();
      
      const newStreak = streak + 1;
      const earnedXP = attempts === 0 ? 10 + (newStreak >= 3 ? 5 : 0) : 5;
      
      setStreak(newStreak);
      setTotalXP(prev => prev + earnedXP);
      
      setXpPopup(`+${earnedXP} XP`);
      setTimeout(() => setXpPopup(null), 1500);

      setFeedback({ 
        type: 'correct', 
        message: newStreak >= 3 ? `🔥 ${newStreak} Streak!` : 'Brilliant! 🎉',
        sub: 'You got it right!'
      });
      
      dispatch({ type: 'ADD_SCORE', payload: { points: earnedXP, stars: 1 } });
      
      setTimeout(() => {
        setFeedback(null);
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setAttempts(0);
          setShowHint(false);
        } else {
          setIsComplete(true);
        }
      }, 1500);
    } else {
      if (playWrong) playWrong();
      
      setStreak(0);
      const newLives = lives - 1;
      setLives(newLives);
      setAttempts(prev => prev + 1);
      
      setFeedback({
        type: 'wrong',
        message: 'Not quite!',
        sub: newLives > 0 ? 'Try again!' : 'Out of lives!'
      });
      
      setTimeout(() => {
        setFeedback(null);
        if (newLives <= 0) {
          setFailed(true);
        } else {
          setShowHint(true);
        }
      }, 1500);
    }
  };

  const handleLevelComplete = () => {
    dispatch({ type: 'RECORD_PRACTICE_SCORE', payload: { level: `level${level}`, score: totalXP } });
    onComplete({ score: totalXP });
  };

  const handleRetry = () => {
    // Reset and try again
    const generated = generateLevelQuestions(level, Date.now());
    setQuestions(generated);
    setCurrentIndex(0);
    setAttempts(0);
    setShowHint(false);
    setIsComplete(false);
    setStreak(0);
    setLives(3);
    setTotalXP(0);
    setFailed(false);
  };

  if (!currentQ) return <div style={{ fontSize: '1.5rem', color: 'white', textAlign: 'center' }}>Loading Gateway...</div>;

  if (isComplete) {
    return (
      <div className="play-phase" style={{ justifyContent: 'center' }}>
        <div className="world-complete-card">
          <div className="world-complete-icon">✨</div>
          <h2 className="world-complete-title text-gold">Gate Unlocked!</h2>
          <div className="world-complete-score text-gold">⭐ {totalXP} XP</div>
          <div className="world-complete-stars">
             <span className="world-star earned" style={{ animationDelay: '0.2s' }}>⭐</span>
             <span className="world-star earned" style={{ animationDelay: '0.4s' }}>⭐</span>
             <span className="world-star earned" style={{ animationDelay: '0.6s' }}>⭐</span>
          </div>
          <button className="btn btn-primary btn-lg mt-6" onClick={handleLevelComplete}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (failed) {
    return (
      <div className="play-phase" style={{ justifyContent: 'center' }}>
        <div className="world-complete-card" style={{ border: '2px solid var(--red)' }}>
          <div className="world-complete-icon">💔</div>
          <h2 className="world-complete-title" style={{ color: 'var(--red)' }}>Out of Lives!</h2>
          <p className="text-secondary mb-6">Grumble's riddles were too tricky this time.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={handleRetry}>
              Try Again
            </button>
            <button className="btn btn-outline" onClick={() => onComplete({ score: 0 })}>
              Flee
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderQuestion = () => {
    switch (currentQ.type) {
      case 'MCQ':
      case 'WORD_PROBLEM':
        return <MCQQuestion question={currentQ} onAnswer={handleAnswer} disabled={feedback !== null} />;
      case 'TRUE_FALSE':
        return <TrueFalseQuestion onAnswer={handleAnswer} disabled={feedback !== null} />;
      case 'DRAG_ORDER':
        return <DragOrderQuestion question={currentQ} onAnswer={handleAnswer} disabled={feedback !== null} />;
      case 'NUMBER_LINE':
        return <NumberLineSimulation fractions={currentQ.fractions} onComplete={() => handleAnswer(true)} isComplete={feedback !== null} />;
      default:
        return <div>Unsupported Question Type</div>;
    }
  };

  const pct = Math.round((currentIndex / questions.length) * 100);

  return (
    <div className="play-phase pt-8 animate-fadeIn">
      {xpPopup && <div className="xp-popup">{xpPopup}</div>}

      <div className="hud">
        <div className="hud-item text-gold">⭐ {totalXP}</div>
        <div className="hearts">
          {Array.from({ length: 3 }, (_, i) => (
            <span key={i} style={{ opacity: i < lives ? 1 : 0.2 }}>❤️</span>
          ))}
        </div>
        <div className={`hud-item text-coral ${streak >= 3 ? 'streak-fire' : ''}`}>🔥 {streak}x</div>
      </div>
      
      <div style={{ width: '100%', maxWidth: '700px', marginBottom: '16px' }}>
        <div className="progress-bar-container">
          <div className="progress-bar-label text-secondary">
            <span>Question {currentIndex + 1}/{questions.length}</span>
            <span>{pct}%</span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
      
      <div className="question-card" style={{ animation: 'slideUp 0.3s ease' }}>
        <h3 className="question-text text-white">{currentQ.questionText}</h3>
        {renderQuestion()}
        
        {showHint && (
          <div className="hint-text text-gold mt-4 text-lg">
            Hint: {currentQ.type === 'MCQ' || currentQ.type === 'WORD_PROBLEM' ? "Look carefully at the numerators and denominators!" : "Remember what you learned in the simulations!"}
          </div>
        )}
      </div>

      {/* Feedback Overlay */}
      {feedback && (
        <div className="feedback-overlay">
          <div className={`feedback-content ${feedback.type}`}>
            <div className="feedback-emoji">{feedback.type === 'correct' ? '🎉' : '😢'}</div>
            <div className="feedback-message">{feedback.message}</div>
            <div className="feedback-sub">{feedback.sub}</div>
          </div>
        </div>
      )}
    </div>
  );
}
