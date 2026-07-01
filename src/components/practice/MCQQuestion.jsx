import React from 'react';
import FractionDisplay from '../ui/FractionDisplay';

export default function MCQQuestion({ question, onAnswer, disabled }) {
  return (
    <div className="options-grid">
      {question.options.map((opt, idx) => (
        <button 
          key={idx}
          onClick={() => onAnswer(opt)}
          className={`option-btn ${disabled ? 'disabled' : ''}`}
          disabled={disabled}
        >
          {opt.n !== undefined ? (
            <div style={{ display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
              <FractionDisplay n={opt.n} d={opt.d} size="lg" />
            </div>
          ) : (
            <span style={{ fontSize: '1.4rem' }}>{opt}</span>
          )}
        </button>
      ))}
    </div>
  );
}
