import path from 'path';
import { Path } from './Paths';
import { rootPaths } from './rootPaths';
import { SourceFileTask } from './SourceFileTask';

export const sources = new Map<string, SourceFileTask>();
const directories = new Set<string>();

/** Return true if `path` is a source file. */
export function isSource(path: Path): boolean {
  const fullPath = path.fullPath;
  return sources.has(fullPath);
}

export function addSource(task: SourceFileTask) {
  const srcPathFull = task.path.fullPath;
  sources.set(srcPathFull, task);
  directories.add(path.dirname(srcPathFull));
}

/** Return true if `path` is a source file. */
export function getSource(path: string): SourceFileTask | undefined {
  return sources.get(path);
}

export function getWatchDirs() {
  return rootPaths(Array.from(directories));
}