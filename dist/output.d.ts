import { Path } from './Path';
import type { TaskArray } from "./TaskArray";
import { OutputFileTask } from './OutputFileTask';
import { WritableData, Task } from './Task';
/** @deprecated */
interface OutputOptions {
    path?: string | Path;
    base?: string | Path;
}
/** Task generator function that generates an output task.
    @deprecated Prefer `task.writeTo()`.
 */
export declare function output(options?: OutputOptions): (source: Task<WritableData>) => OutputFileTask;
export declare function output(options?: OutputOptions): (source: Task<WritableData>[]) => OutputFileTask[];
export declare function output(options?: OutputOptions): (source: TaskArray<any, Task<WritableData>>) => OutputFileTask[];
export {};
