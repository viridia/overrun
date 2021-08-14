import { Task } from './Task';
import { Path } from './Paths';
import { TaskArray } from "./TaskArray";
import { OutputFileTask } from './OutputFileTask';

/** @internal */
export type WritableTask = Task<Buffer | string>;

export interface WriteOptions {
  path?: string | Path;
  base?: string | Path;
}

export function output(options?: WriteOptions): (source: WritableTask) => OutputFileTask;
export function output(options?: WriteOptions): (source: WritableTask[]) => OutputFileTask[];
export function output(options?: WriteOptions): (source: TaskArray<WritableTask>) => OutputFileTask[];
export function output(options?: WriteOptions): (source: any) => OutputFileTask | OutputFileTask[] {
  return (source: WritableTask | WritableTask[]) => {
    if (Array.isArray(source)) {
      return source.map(s => new OutputFileTask(s, options));
    } else {
      return new OutputFileTask(source, options);
    }
  };
}
