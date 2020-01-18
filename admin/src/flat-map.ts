export const flatMap = <T, U>(array: T[], f: (t: T) => U[]): U[] =>
  array.reduce<U[]>((accum, e) => accum.concat(f(e)), []);
