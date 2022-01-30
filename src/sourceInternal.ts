import path from 'path';
import { Path } from './Path';
import { rootPaths } from './rootPaths';
import { SourceFileTask } from './SourceFileTask';

export const sources = new Map<string, SourceFileTask>();
const directories = new Set<string>();

/** Return true if `path` is a source file. */
export function isSource(path: Path): boolean {
  const fullPath = path.complete;
  return sources.has(fullPath);
}

// TODO: This has a bug: source files might have different base/fragment combos.
export function getOrCreateSourceTask(srcPath: Path) {
  const srcPathFull = srcPath.complete;
  let srcTask = sources.get(srcPathFull);
  if (!srcTask) {
    srcTask = new SourceFileTask(srcPath);
    directories.add(path.dirname(srcPathFull));
    sources.set(srcPathFull, srcTask);
  }

  return srcTask;
}

/** Return the cached source file.
    @internal
*/
export function getSource(path: string): SourceFileTask | undefined {
  return sources.get(path);
}

/** Remove all cached source files, used for testing. */
export function clearSources(): void {
  sources.clear();
}

/** @internal */
export function getWatchDirs() {
  return rootPaths(Array.from(directories));
}
