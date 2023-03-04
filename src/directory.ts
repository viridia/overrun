import type { DirectoryTask } from './DirectoryTask';
import { Path, PathSpec } from './Path';
import { createDirectoryTask } from './sourceInternal';

/** Create a task which reads a source file and returns a buffer. */
export function directory(baseOrPath: string | Path | PathSpec, fragment?: string): DirectoryTask {
  const srcPath = Path.from(baseOrPath, fragment);
  // TODO: stat - see if it's a dir
  return createDirectoryTask(srcPath);
}
