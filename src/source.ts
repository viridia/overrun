import { Path } from './Paths';
import { SourceFileTask } from './SourceFileTask';
import { sources, getOrCreateSourceTask } from './sourceInternal';

/** Create a task which reads a source file and returns a buffer. */
export function source(baseOrFile: string | Path, fragment?: string): SourceFileTask {
  const srcPath = Path.from(baseOrFile, fragment);
  const srcPathFull = srcPath.complete;
  const task = sources.get(srcPathFull);
  if (task) {
    return task;
  }

  return getOrCreateSourceTask(srcPath);
}
