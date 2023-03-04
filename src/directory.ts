import type { DirectoryTask } from './DirectoryTask';
import { Path, PathSpec } from './Path';
import { createDirectoryTask } from './sourceInternal';

/** Create a task which reads a source file and returns a buffer. */
export function directory(rootOrPath: string | Path | PathSpec, fragment?: string): DirectoryTask {
  const srcPath = Path.from(rootOrPath, fragment);
  // TODO: stat - see if it's a dir
  return createDirectoryTask(srcPath);
}
