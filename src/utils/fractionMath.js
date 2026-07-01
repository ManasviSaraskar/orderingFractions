// fractionMath.js

// Greatest Common Divisor
export function gcd(a, b) {
  if (!b) {
    return a;
  }
  return gcd(b, a % b);
}

// Least Common Multiple
export function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

// Compare two fractions: returns negative if a < b, positive if a > b, 0 if equal
export function compare(a, b) {
  return (a.n * b.d) - (b.n * a.d);
}

// Convert fraction object {n, d} to decimal
export function toDecimal(fraction) {
  return fraction.n / fraction.d;
}

// Simplify a fraction
export function simplify(fraction) {
  const divisor = gcd(fraction.n, fraction.d);
  return { n: fraction.n / divisor, d: fraction.d / divisor };
}
