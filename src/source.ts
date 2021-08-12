import { Path } from './Paths';
import { SourceFileTask } from './SourceFileTask';
import { sources, addSource } from './sourceInternal';

/** Create a task which reads a source file and returns a buffer. */
export function source(baseOrFile: string | Path, relPath?: string): SourceFileTask {
  const srcPath = Path.from(baseOrFile, relPath);
  const srcPathFull = srcPath.fullPath;
  const task = sources.get(srcPathFull);
  if (task) {
    return task;
  }

  const rfTask = new SourceFileTask(srcPath);
  addSource(rfTask);
  return rfTask;
}
