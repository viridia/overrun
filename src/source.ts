import { Path, PathSpec } from './Path';
import type { SourceFileTask } from './SourceFileTask';
import { getOrCreateSourceTask } from './sourceInternal';

/** Create a task which reads a source file and returns a buffer. */
export function source(rootOrPath: string | Path | PathSpec, fragment?: string): SourceFileTask {
  const srcPath = Path.from(rootOrPath, fragment);
  return getOrCreateSourceTask(srcPath);
}
