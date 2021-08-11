import { Path } from './Paths';
import { SourceDirectoryTask } from './SourceDirectoryTask';
/** Create a task which reads a source file and returns a buffer. */
export declare function directory(baseOrPath: string | Path, relPath?: string): SourceDirectoryTask;
