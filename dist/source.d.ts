import { Path } from './Paths';
import { SourceFileTask } from './SourceFileTask';
/** Create a task which reads a source file and returns a buffer. */
export declare function source(baseOrFile: string | Path, relPath?: string): SourceFileTask;
