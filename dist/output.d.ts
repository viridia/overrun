import { Path } from './Path';
import type { TaskArray } from "./TaskArray";
import { OutputFileTask } from './OutputFileTask';
import { WritableTask } from './Task';
/** @deprecated */
interface OutputOptions {
    path?: string | Path;
    base?: string | Path;
}
/** Task generator function that generates an output task.
    @deprecated Prefer `task.writeTo()`.
 */
export declare function output(options?: OutputOptions): (source: WritableTask) => OutputFileTask;
export declare function output(options?: OutputOptions): (source: WritableTask[]) => OutputFileTask[];
export declare function output(options?: OutputOptions): (source: TaskArray<WritableTask>) => OutputFileTask[];
export {};
