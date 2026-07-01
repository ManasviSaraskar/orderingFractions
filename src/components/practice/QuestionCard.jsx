import React from 'react';

export default function QuestionCard({ title, questionText, children }) {
  return (
    <div className="card-container w-full max-w-3xl flex flex-col items-center">
      {title && <h2 className="mb-2 text-primary">{title}</h2>}
      <p className="instruction-text mb-8 text-center">{questionText}</p>
      
      <div className="w-full flex justify-center">
        {children}
      </div>
    </div>
  );
}
