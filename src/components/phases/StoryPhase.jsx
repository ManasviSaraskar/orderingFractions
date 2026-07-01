import React, { useState, useEffect, useCallback, useRef } from 'react';

const STORY_SLIDES = [
  {
    image: '/images/story_scrambled.png',
    title: "The Scrambled Stones",
    text: "Sarah runs into Fraction Forest with her friends. 'Oh no!' she shouts. 'Grumble has mixed up all the fraction stones! We need to put them back in order or the Crystal Castle will be locked forever!'",
    highlight: '"We must order the stones!"',
    mascotText: "Let's work together! 🌲",
    mascotEmoji: "👧"
  },
  {
    image: '/images/story_samedeno.png',
    title: "The Same Denominator Gate",
    text: "Mike trips over fraction stones labelled 1/6, 4/6, 2/6, 5/6. 'These all have the same bottom number!' says Priya. 'That means we just look at the top!'",
    highlight: '"Bigger top = Bigger fraction!"',
    mascotText: "Look at the numerators! 📊",
    mascotEmoji: "👧🏽" // Priya
  },
  {
    image: '/images/story_unit.png',
    title: "The Unit Fraction Tower",
    text: "They reach a tall tower with stones 1/2, 1/4, 1/8. 'They ALL have 1 on top,' says Leon. Zara smiles: 'Bigger bottom means tinier piece! Think of pizza slices.'",
    highlight: '"More slices = Smaller pieces!"',
    mascotText: "Watch the denominator! 🍕",
    mascotEmoji: "👧🏿" // Zara
  },
  {
    image: '/images/story_maze.png',
    title: "The Mixed Fraction Maze",
    text: "Grumble throws a mixed set at them: 3/4, 1/2, 2/3. 'Now what?!' cries Mike. Priya pulls out a number line: 'We compare them to 1/2 or use the same denominator!'",
    highlight: '"Use a Number Line!"',
    mascotText: "You can do this! 📏",
    mascotEmoji: "👦🏼" // Mike
  },
  {
    image: '/images/story_ready.png',
    title: "Your Turn!",
    text: "Now you know how to order all the fraction stones! Let's step into the simulations and practice placing these stones in the right order to unlock the gates.",
    highlight: '"Fraction Forest awaits!"',
    mascotText: "Ready to explore! ✨",
    mascotEmoji: "👧" // Sarah
  },
];

export default function StoryPhase({ onComplete, audioEnabled }) {
  const [slide, setSlide] = useState(0);
  const [anim, setAnim] = useState(false);
  const [textVis, setTextVis] = useState(false);
  const [hlVis, setHlVis] = useState(false);
  
  const s = STORY_SLIDES[slide];
  const isLast = slide === STORY_SLIDES.length - 1;
  const pct = ((slide + 1) / STORY_SLIDES.length) * 100;

  useEffect(() => {
    setTextVis(false); setHlVis(false);
    const t1 = setTimeout(() => setTextVis(true), 100);
    const t2 = setTimeout(() => setHlVis(true), 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [slide]);

  const goNext = useCallback(() => {
    if (anim) return;
    setAnim(true);
    setTimeout(() => { isLast ? onComplete() : setSlide(i => i + 1); setAnim(false); }, 400);
  }, [anim, isLast, onComplete]);

  const goPrev = useCallback(() => {
    if (anim || slide === 0) return;
    setAnim(true);
    setTimeout(() => { setSlide(i => i - 1); setAnim(false); }, 400);
  }, [anim, slide]);

  return (
    <div className="story-phase animate-fadeIn">
      <div className="story-progress">
        <div className="story-progress-bar"><div className="story-progress-fill" style={{ width: `${pct}%` }} /></div>
        <span className="story-progress-label">{slide + 1} / {STORY_SLIDES.length}</span>
      </div>
      <div className={`story-card ${anim ? 'flipping' : ''}`}>
        <div className="story-image-section" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
          {/* We use a colored background for the image section in case the image fails to load */}
          <img src={s.image} alt={s.title} className="story-image" onError={(e) => { e.target.style.display = 'none'; }} />
          <div className="story-image-overlay" />
        </div>
        <div className="story-text-section">
          <h2 className="story-title">{s.title}</h2>
          <p className={`story-text ${textVis ? 'revealed' : ''}`}>{s.text}</p>
          <div className={`story-highlight ${hlVis ? 'visible' : ''}`}>
            <span>✨</span><span className="story-highlight-text">{s.highlight}</span><span>✨</span>
          </div>
          <div className="story-mascot">
            <div className="mascot" style={{ width: 50, height: 50, fontSize: '1.4rem' }}>{s.mascotEmoji}</div>
            <div className="speech-bubble" style={{ fontSize: '0.8rem', padding: '8px 14px', maxWidth: 180 }}>{s.mascotText}</div>
          </div>
        </div>
      </div>
      <div className="story-nav">
        <button className="btn btn-outline btn-sm" onClick={goPrev} disabled={slide === 0} style={{ opacity: slide === 0 ? 0.3 : 1 }}>← Back</button>
        <div className="story-dots">
          {STORY_SLIDES.map((_, i) => (<div key={i} className={`story-dot ${i === slide ? 'active' : i < slide ? 'completed' : ''}`} />))}
        </div>
        <button className={`btn ${isLast ? 'btn-green' : 'btn-primary'} btn-sm`} onClick={goNext}>
          {isLast ? "🚀 Let's Simulate!" : 'Next →'}
        </button>
      </div>
    </div>
  );
}
