/// <reference types="node" />
import { Task } from './Task';
import { Path } from './Paths';
import { TaskArray } from "./TaskArray";
import { WriteFileTask } from './WriteFileTask';
export declare type WritableTask = Task<Buffer | string>;
export interface WriteOptions {
    path?: string | Path;
    base?: string | Path;
}
export declare function write(options?: WriteOptions): (source: WritableTask) => WriteFileTask;
export declare function write(options?: WriteOptions): (source: WritableTask[]) => WriteFileTask[];
export declare function write(options?: WriteOptions): (source: TaskArray<WritableTask>) => WriteFileTask[];
