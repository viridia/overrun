import { Task } from './Task';
import { Path } from './Paths';
import { TaskArray } from "./TaskArray";
import { WriteFileTask } from './WriteFileTask';

export type WritableTask = Task<Buffer | string>;

export interface WriteOptions {
  path?: string | Path;
  base?: string | Path;
}

export function write(options?: WriteOptions): (source: WritableTask) => WriteFileTask;
export function write(options?: WriteOptions): (source: WritableTask[]) => WriteFileTask[];
export function write(options?: WriteOptions): (source: TaskArray<WritableTask>) => WriteFileTask[];
export function write(options?: WriteOptions): (source: any) => WriteFileTask | WriteFileTask[] {
  return (source: WritableTask | WritableTask[]) => {
    if (Array.isArray(source)) {
      return source.map(s => new WriteFileTask(s, options));
    } else {
      return new WriteFileTask(source, options);
    }
  };
}
