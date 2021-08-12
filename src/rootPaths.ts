/** Reduce a set of strings to common prefixes. */
export function rootPaths(input: string[]): string[] {
  let result: string[] = [];
  for (const s of input) {
    result = result.filter(t => !t.startsWith(s));
    const unique = !result.some(t => s.startsWith(t));
    if (unique) {
      result = [...result, s];
    }
  }

  return result;
}
