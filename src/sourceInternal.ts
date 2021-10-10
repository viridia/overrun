import path from 'path';
import { Path } from './Paths';
import { rootPaths } from './rootPaths';
import { SourceFileTask } from './SourceFileTask';

export const sources = new Map<string, SourceFileTask>();
const directories = new Set<string>();

/** Return true if `path` is a source file. */
export function isSource(path: Path): boolean {
  const fullPath = path.complete;
  return sources.has(fullPath);
}

export function addSource(task: SourceFileTask) {
  const srcPathFull = task.path.complete;
  sources.set(srcPathFull, task);
  directories.add(path.dirname(srcPathFull));
}

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

/** Return true if `path` is a source file. */
export function getSource(path: string): SourceFileTask | undefined {
  return sources.get(path);
}

export function getWatchDirs() {
  return rootPaths(Array.from(directories));
}
