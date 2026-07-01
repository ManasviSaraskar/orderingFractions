import React from 'react';

export default function TrueFalseQuestion({ onAnswer, disabled }) {
  return (
    <div className="options-grid">
      <button 
        onClick={() => onAnswer(true)}
        className={`option-btn ${disabled ? 'disabled' : ''}`}
        disabled={disabled}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '2rem' }}>✅</span>
          <span>True</span>
        </div>
      </button>
      <button 
        onClick={() => onAnswer(false)}
        className={`option-btn ${disabled ? 'disabled' : ''}`}
        disabled={disabled}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '2rem' }}>❌</span>
          <span>False</span>
        </div>
      </button>
    </div>
  );
}
