import path from 'path';
import { Path } from './Path';
import { rootPaths } from './rootPaths';
import { SourceFileTask } from './SourceFileTask';
import { DirectoryTask } from './DirectoryTask';

const sourceTasks = new Map<string, SourceFileTask>();
const directoryTasks = new Map<string, DirectoryTask[]>();

const watchDirs = new Set<string>();

/** Return true if `path` is a source file. */
export function hasSourceTask(path: Path): boolean {
  const fullPath = path.full;
  return sourceTasks.has(fullPath);
}

// Source file tasks are uniquely associated with a filesystem location. That is, even if
// multiple `source` directives appear in a build configuration, those that point to the
// same file will be merged to a single definition.
export function getOrCreateSourceTask(srcPath: Path) {
  const fullPath = srcPath.full;
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
  const fullPath = path.full;
  return directoryTasks.has(fullPath);
}

export function createDirectoryTask(srcPath: Path) {
  const fullPath = srcPath.full;
  watchDirs.add(fullPath);
  const task = new DirectoryTask(srcPath);
  const taskList = directoryTasks.get(fullPath);
  if (taskList) {
    taskList.push(task);
  } else {
    directoryTasks.set(fullPath, [task])
  }

  return task;
}

/** Return list of directory tasks which are observing the given path.

    Because DirectoryTasks can glob subdirectories, we can't know for sure whether
    a change to a directory will require a rebuild or not. This takes a conservative
    approach and assumes that any change at a given filesystem location will trigger
    a rebuild of all directory rules that encompass that location within it.
    @internal
*/
export function getDirectoryTasks(dirPath: string): DirectoryTask[] {
  const tasks: DirectoryTask[] = [];
  while (dirPath && dirPath !== '/') {
    const dirTasks = directoryTasks.get(dirPath);
    if (dirTasks) {
      // console.log(dirTasks);
      tasks.push(...dirTasks);
    }
    dirPath = path.dirname(dirPath);
  }
  return tasks;
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
