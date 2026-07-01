import { mulberry32, pick, shuffle, uniqueInts, pickN } from './prng.js';
import { toDecimal } from './fractionMath.js';

export function generateLevelQuestions(level, baseSeed) {
  const prngBase = mulberry32(baseSeed);
  const questions = [];
  
  for (let i = 0; i < 5; i++) {
    // Generate a unique seed for each question to ensure determinism
    const qSeed = baseSeed ^ (i * 0x9E3779B9);
    
    if (level === 1) {
      questions.push(genSameDenominatorQ(qSeed, i));
    } else if (level === 2) {
      questions.push(genUnitFractionQ(qSeed, i));
    } else if (level === 3) {
      questions.push(genMixedFractionQ(qSeed, i));
    }
  }
  
  return shuffle(prngBase, questions);
}

// Level 1: Same denominator
export function genSameDenominatorQ(seed, index) {
  const prng = mulberry32(seed);
  const d = pick(prng, [5, 6, 8, 10, 12]);
  
  // Decide template type based on index to ensure variety
  if (index === 1 || index === 4) {
    // Identify Largest/Smallest MCQ
    const nums = pickN(prng, Array.from({length: d - 1}, (_, i) => i + 1), 4);
    const fractions = nums.map(n => ({ n, d }));
    const isLargest = prng() > 0.5;
    
    // Sort to find correct answer
    const sorted = [...fractions].sort((a, b) => a.n - b.n);
    const correct = isLargest ? sorted[sorted.length - 1] : sorted[0];
    
    return {
      id: `l1-mcq-${seed}`,
      type: 'MCQ',
      level: 1,
      questionText: `Which fraction is the ${isLargest ? 'largest' : 'smallest'}?`,
      options: shuffle(prng, fractions),
      correct
    };
  } else {
    // Template A - Drag Ascending
    const nums = shuffle(prng, uniqueInts(prng, 4, 1, d - 1));
    return {
      id: `l1-drag-${seed}`,
      type: 'DRAG_ORDER',
      level: 1,
      questionText: 'Drag the fractions in order from smallest to largest.',
      fractions: nums.map(n => ({ n, d })),
      correct: [...nums].sort((a, b) => a - b).map(n => ({ n, d }))
    };
  }
}

// Level 2: Unit fractions
export function genUnitFractionQ(seed, index) {
  const prng = mulberry32(seed);
  
  if (index === 1 || index === 4) {
    // True/False
    const denoms = pickN(prng, [2, 3, 4, 5, 6, 8, 10], 2);
    const isGreaterThan = prng() > 0.5;
    
    // Calculate correctness: larger denom = smaller fraction
    // e.g., 1/3 > 1/5 is true because 3 < 5
    const isCorrect = isGreaterThan ? denoms[0] < denoms[1] : denoms[0] > denoms[1];
    
    return {
      id: `l2-tf-${seed}`,
      type: 'TRUE_FALSE',
      level: 2,
      questionText: `Is 1/${denoms[0]} ${isGreaterThan ? '>' : '<'} 1/${denoms[1]}?`,
      correct: isCorrect
    };
  } else {
    // Drag Ascending
    const denoms = shuffle(prng, pickN(prng, [2, 3, 4, 5, 6, 8, 10], 4));
    return {
      id: `l2-drag-${seed}`,
      type: 'DRAG_ORDER',
      level: 2,
      questionText: 'Drag the fractions in order from smallest to largest.',
      fractions: denoms.map(d => ({ n: 1, d })),
      // Larger denominator = smaller fraction, so sort descending by d
      correct: [...denoms].sort((a, b) => b - a).map(d => ({ n: 1, d })) 
    };
  }
}

// Level 3: Mixed fractions
export function genMixedFractionQ(seed, index) {
  const prng = mulberry32(seed);
  
  if (index === 0 || index === 4) {
    // Word Problem
    const fractions = [{n: 3, d: 8, who: 'Sarah'}, {n: 5, d: 8, who: 'Mike'}, {n: 1, d: 8, who: 'Priya'}];
    const whoObj = prng() > 0.5 ? 'most' : 'least';
    const sorted = [...fractions].sort((a, b) => a.n - b.n);
    const correctWho = whoObj === 'most' ? sorted[2].who : sorted[0].who;
    
    return {
      id: `l3-wp-${seed}`,
      type: 'WORD_PROBLEM',
      level: 3,
      questionText: `Sarah ate 3/8 of her pizza. Mike ate 5/8. Priya ate 1/8. Who ate the ${whoObj}?`,
      options: ['Sarah', 'Mike', 'Priya'],
      correct: correctWho
    };
  } else if (index === 1) {
     // Template B - Number line drag
     const fractions = [
       {n: 1, d: 4, id: 'nl-1-4'},
       {n: 3, d: 4, id: 'nl-3-4'},
       {n: 1, d: 2, id: 'nl-1-2'}
     ];
     return {
       id: `l3-nl-${seed}`,
       type: 'NUMBER_LINE',
       level: 3,
       questionText: 'Place the fractions correctly on the number line.',
       fractions: shuffle(prng, fractions),
     }
  } else {
    // Template A - Drag Mixed
    const fractions = [{n: 3, d: 4}, {n: 1, d: 2}, {n: 2, d: 3}];
    return {
      id: `l3-drag-${seed}`,
      type: 'DRAG_ORDER',
      level: 3,
      questionText: 'Put these fractions in order from smallest to largest.',
      fractions: shuffle(prng, fractions),
      correct: [...fractions].sort((a, b) => toDecimal(a) - toDecimal(b))
    };
  }
}
