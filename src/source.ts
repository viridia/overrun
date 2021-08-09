import path from 'path';
import { Path } from './Paths';
import { ReadFileTask } from './ReadFileTask';

const sources = new Map<string, ReadFileTask>();
const directories = new Set<string>();

/** Create a task which reads a source file and returns a buffer. */
export function source(filePath: string, base?: string): ReadFileTask {
  const srcPath = new Path(filePath, base);
  const srcPathFull = srcPath.fullPath();
  const task = sources.get(srcPathFull);
  if (task) {
    return task;
  }
  // TODO: state - see if it's a file and can be accessed.
  const rfTask = new ReadFileTask(srcPath);
  sources.set(srcPathFull, rfTask);
  directories.add(path.dirname(srcPathFull));
  return rfTask;
}

export function isSource(path: Path): boolean {
  const fullPath = path.fullPath();
  return sources.has(fullPath);
}
