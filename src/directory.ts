import { Path } from './Paths';
import { SourceDirectoryTask } from './SourceDirectoryTask';

/** Create a task which reads a source file and returns a buffer. */
export function directory(baseOrPath: string | Path, relPath?: string): SourceDirectoryTask {
  const srcPath = Path.from(baseOrPath, relPath);
  // TODO: stat - see if it's a dir
  return new SourceDirectoryTask(srcPath);
}
