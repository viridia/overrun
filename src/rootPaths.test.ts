import { rootPaths } from "./rootPaths"

test('rootPaths', () => {
  expect(rootPaths(['a'])).toEqual(['a']);
  expect(rootPaths(['a', 'b'])).toEqual(['a', 'b']);
  expect(rootPaths(['a', 'b', 'bc'])).toEqual(['a', 'b']);
  expect(rootPaths(['a', 'bc', 'b'])).toEqual(['a', 'b']);
});
