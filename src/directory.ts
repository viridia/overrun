import type { DirectoryTask } from './DirectoryTask';
import { Path } from './Path';
import { createDirectoryTask } from './sourceInternal';

/** Create a task which reads a source file and returns a buffer. */
export function directory(baseOrPath: string | Path, fragment?: string): DirectoryTask {
  const srcPath = Path.from(baseOrPath, fragment);
  // TODO: stat - see if it's a dir
  return createDirectoryTask(srcPath);
}
