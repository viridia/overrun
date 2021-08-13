import { Path } from './Paths';
import { DirectoryTask } from './DirectoryTask';
/** Create a task which reads a source file and returns a buffer. */
export declare function directory(baseOrPath: string | Path, fragment?: string): DirectoryTask;
