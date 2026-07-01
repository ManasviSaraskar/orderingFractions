// Mulberry32 PRNG
export function mulberry32(a) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

// Helper to pick a random element from an array
export function pick(prng, arr) {
  return arr[Math.floor(prng() * arr.length)];
}

// Helper to shuffle an array
export function shuffle(prng, array) {
  let currentIndex = array.length, randomIndex;
  let newArray = [...array];
  while (currentIndex !== 0) {
    randomIndex = Math.floor(prng() * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex], newArray[currentIndex]];
  }
  return newArray;
}

// Helper to get unique integers in a range
export function uniqueInts(prng, count, min, max) {
  const ints = new Set();
  while (ints.size < count) {
    ints.add(Math.floor(prng() * (max - min + 1)) + min);
  }
  return Array.from(ints);
}

// Helper to pick n unique elements from an array
export function pickN(prng, arr, n) {
  return shuffle(prng, arr).slice(0, n);
}
