/// <reference lib="esnext.array" />
/// <reference lib="dom" />

import { ParsedUrlQuery } from "querystring";
import "core-js/es/array/flat-map";

export const toSearchParams = (q: ParsedUrlQuery): URLSearchParams =>
  new URLSearchParams(
    Object.entries(q).flatMap(([k, vs]) => {
      const values = ([] as string[]).concat(vs);
      return values.map(v => [k, v]);
    })
  );
