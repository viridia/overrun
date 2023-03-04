import { Path, PathSpec } from './Path';
import type { SourceFileTask } from './SourceFileTask';
/** Create a task which reads a source file and returns a buffer. */
export declare function source(baseOrFile: string | Path | PathSpec, fragment?: string): SourceFileTask;
