import React from 'react';

export default function CharacterSpeech({ character, text, position = 'bottom-right' }) {
  // We'll use the generated sprites from public folder
  const spriteUrl = `/images/characters/${character.toLowerCase()}.png`;

  return (
    <div className={`fixed z-50 flex items-end gap-4 pointer-events-none 
      ${position === 'bottom-right' ? 'bottom-4 right-4 flex-row' : 
        position === 'bottom-left' ? 'bottom-4 left-4 flex-row-reverse' : ''}`}>
      
      {/* Speech Bubble */}
      <div className="bg-white border-4 border-gray-200 rounded-3xl rounded-br-none p-4 md:p-6 shadow-xl max-w-sm">
        <p className="instruction-text text-xl md:text-2xl m-0">{text}</p>
      </div>

      {/* Character Sprite */}
      <img src={spriteUrl} alt={character} className="w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-2xl" />
    </div>
  );
}
