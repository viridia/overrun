import { Path } from './Path';
import type { SourceFileTask } from './SourceFileTask';
import { getOrCreateSourceTask } from './sourceInternal';

/** Create a task which reads a source file and returns a buffer. */
export function source(baseOrFile: string | Path, fragment?: string): SourceFileTask {
  const srcPath = Path.from(baseOrFile, fragment);
  return getOrCreateSourceTask(srcPath);
}
