import { say, ask, cheer, think, celebrate, instruct } from './audio';

export function introNarration() {
  return [
    say("Let's explore fractions and save the Crystal Castle!"),
    say("Learn to order fractions, solve the mystery of the scrambled stones, and defeat Grumble the Troll!")
  ];
}

export function wonderIntro() {
  return think("Hmm… I wonder…");
}

export function wonderNarration(wonder) {
  return [
    ask(wonder.question),
    say(wonder.subtext)
  ];
}

export function storySlideNarration(slideIndex, text) {
  return say(text);
}

export function simulateIntro() {
  return instruct("Explore and discover — interact with the fractions!");
}

export function simulateStationIntro(stationIndex) {
  if (stationIndex === 0) {
    return instruct("Drag the fractions to order them from smallest to largest!");
  } else if (stationIndex === 1) {
    return instruct("Change the number of slices to see what happens to the size of each piece!");
  } else {
    return instruct("Tap a fraction, then tap its spot on the number line!");
  }
}

export function playIntro() {
  return instruct("You must answer Grumble's riddles to unlock each gate!");
}

export function questionNarration(questionText) {
  // Convert raw comparison symbols to spoken words so the text matches
  // the pre-generated audioMap entries (e.g. "Is 1/3 > 1/5?" -> "Is 1/3 greater than 1/5?")
  let cleanedText = questionText
    .replace(/\s*>\s*/g, ' greater than ')
    .replace(/\s*<\s*/g, ' less than ')
    .replace(/\s+/g, ' ')
    .trim();
  return ask(cleanedText);
}

export function reflectQuestionNarration(qText) {
  return ask(`Can you help me? ${qText}`);
}

export function confidenceIntro() {
  return ask("How do you feel about ordering fractions?");
}

export function victoryNarration() {
  return [
    celebrate("You have unlocked the Crystal Castle and defeated Grumble!"),
    celebrate("Incredible! We saved the Crystal Castle together!")
  ];
}
