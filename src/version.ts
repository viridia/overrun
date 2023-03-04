/** @fileoverview A simple version counter. Because directory tasks are actually globs,
    and because the concept of assigning a modtime to a glob is kind of meaningless,
    directory tasks instead use a version counter to track when a source has changed
    and the outputs need to be rebuilt. This may on occasion result in over-building
    (input file contents didn't actually change, only the modtime was altered, so output
    is unchanged), however thisis on the whole faster than trying to hash the contents
    of sources.
 */
let headVersion = 0;

export function currentVersion() {
  return headVersion;
}

export function nextVersion() {
  return ++headVersion;
}
