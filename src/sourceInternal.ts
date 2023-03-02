import path from 'path';
import { Path } from './Path';
import { rootPaths } from './rootPaths';
import { SourceFileTask } from './SourceFileTask';
import { DirectoryTask } from './DirectoryTask';

const sourceTasks = new Map<string, SourceFileTask>();
const directoryTasks = new Map<string, DirectoryTask>();

const watchDirs = new Set<string>();

/** Return true if `path` is a source file. */
export function hasSourceTask(path: Path): boolean {
  const fullPath = path.complete;
  return sourceTasks.has(fullPath);
}

// TODO: This has a bug: source files might have different base/fragment combos.
export function getOrCreateSourceTask(srcPath: Path) {
  const fullPath = srcPath.complete;
  let task = sourceTasks.get(fullPath);
  if (!task) {
    task = new SourceFileTask(srcPath);
    watchDirs.add(path.dirname(fullPath));
    sourceTasks.set(fullPath, task);
  }

  return task;
}

/** Return the task for the given source file.
    @internal
*/
export function getSourceTask(path: string): SourceFileTask | undefined {
  return sourceTasks.get(path);
}

/** Return true if `path` is a source file. */
export function hasDirectoryTask(path: Path): boolean {
  const fullPath = path.complete;
  return directoryTasks.has(fullPath);
}

// TODO: This has a bug: source files might have different base/fragment combos.
export function getOrCreateDirectoryTask(srcPath: Path) {
  const fullPath = srcPath.complete;
  let task = directoryTasks.get(fullPath);
  if (!task) {
    task = new DirectoryTask(srcPath);
    watchDirs.add(path.dirname(fullPath));
    directoryTasks.set(fullPath, task);
  }

  return task;
}

/** Return the task for the given source file.
    @internal
*/
export function getDirectoryTask(path: string): DirectoryTask | undefined {
  return directoryTasks.get(path);
}

/** Remove all cached source files, used for testing. */
export function clearSourceTasks(): void {
  sourceTasks.clear();
  directoryTasks.clear();
}

/** @internal */
export function getWatchDirs() {
  return rootPaths(Array.from(watchDirs));
}
