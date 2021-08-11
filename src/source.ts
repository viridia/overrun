import path from 'path';
import { Path } from './Paths';
import { SourceFileTask } from './SourceFileTask';

const sources = new Map<string, SourceFileTask>();
const directories = new Set<string>();

/** Create a task which reads a source file and returns a buffer. */
export function source(baseOrFile: string | Path, relPath?: string): SourceFileTask {
  const srcPath = Path.from(baseOrFile, relPath);
  const srcPathFull = srcPath.fullPath;
  const task = sources.get(srcPathFull);
  if (task) {
    return task;
  }

  const rfTask = new SourceFileTask(srcPath);
  sources.set(srcPathFull, rfTask);
  directories.add(path.dirname(srcPathFull));
  return rfTask;
}

/** Return true if `path` is a source file. */
export function isSource(path: Path): boolean {
  const fullPath = path.fullPath;
  return sources.has(fullPath);
}
