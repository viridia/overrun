import { Path } from './Path';
import { SourceFileTask } from './SourceFileTask';
/** Create a task which reads a source file and returns a buffer. */
export declare function source(baseOrFile: string | Path, fragment?: string): SourceFileTask;
