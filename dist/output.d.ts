/// <reference types="node" />
import { Task } from './Task';
import { Path } from './Paths';
import { TaskArray } from "./TaskArray";
import { OutputFileTask } from './OutputFileTask';
export declare type WritableTask = Task<Buffer | string>;
export interface WriteOptions {
    path?: string | Path;
    base?: string | Path;
}
export declare function output(options?: WriteOptions): (source: WritableTask) => OutputFileTask;
export declare function output(options?: WriteOptions): (source: WritableTask[]) => OutputFileTask[];
export declare function output(options?: WriteOptions): (source: TaskArray<WritableTask>) => OutputFileTask[];
