import { Path } from './Path';
import { DirectoryTask } from './DirectoryTask';
/** Create a task which reads a source file and returns a buffer. */
export declare function directory(baseOrPath: string | Path, fragment?: string): DirectoryTask;
