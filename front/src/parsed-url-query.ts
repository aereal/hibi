/// <reference lib="dom" />

import { ParsedUrlQuery } from "querystring";

const flatMap = <T, U>(array: T[], f: (t: T) => U[]): U[] =>
  array.reduce<U[]>((accum, e) => accum.concat(f(e)), []);

export const toSearchParams = (q: ParsedUrlQuery): URLSearchParams =>
  new URLSearchParams(
    flatMap(Object.entries(q), ([k, vs]) => {
      const values = ([] as string[]).concat(vs);
      return values.map(v => [k, v]);
    })
  );
