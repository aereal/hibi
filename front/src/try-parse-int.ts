export const tryParseInt = (
  numeric: string,
  radix?: number
): number | undefined => {
  try {
    return parseInt(numeric, radix);
  } catch {
    return undefined;
  }
};
