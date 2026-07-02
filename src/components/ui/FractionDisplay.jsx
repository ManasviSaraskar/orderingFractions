import React from 'react';

export default function FractionDisplay({ n, d, size = 'md' }) {
  const fontSize = { sm: '1.1rem', md: '1.6rem', lg: '2.4rem', xl: '3.5rem' }[size];
  const minWidth = { sm: '28px', md: '40px', lg: '60px', xl: '88px' }[size];
  const barHeight = { sm: '2px', md: '3px', lg: '4px', xl: '5px' }[size];
  const gap = { sm: '2px', md: '3px', lg: '5px', xl: '7px' }[size];

  return (
    <div style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap,
      fontFamily: 'var(--font-display, monospace)',
      fontWeight: 'bold',
      lineHeight: 1,
      minWidth,
    }}>
      <span style={{ fontSize, textAlign: 'center', display: 'block' }}>{n}</span>
      <div style={{
        width: '100%',
        height: barHeight,
        background: 'currentColor',
        borderRadius: '2px',
        minWidth,
      }} />
      <span style={{ fontSize, textAlign: 'center', display: 'block' }}>{d}</span>
    </div>
  );
}
