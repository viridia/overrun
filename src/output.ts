import { Path } from './Path';
import type { TaskArray } from "./TaskArray";
import { OutputFileTask } from './OutputFileTask';
import { WritableData, Task } from './Task';

/** @deprecated */
interface OutputOptions {
  path?: string | Path;
  base?: string | Path;
}

function combinePaths(src: Path, options?: OutputOptions): Path {
  if (!options) {
    return src;
  } else if (typeof options.base === 'string' && typeof options.path === 'string') {
    return Path.from(options.base, options.path);
  } else if (options.path) {
    return Path.from(options.path);
  } else if (typeof options.base === 'string') {
    return src.withBase(options.base)
  } else if (options.base) {
    return src.withBase(options.base)
  } else {
    return src;
  }
}

/** Task generator function that generates an output task.
    @deprecated Prefer `task.writeTo()`.
 */
export function output(options?: OutputOptions): (source: Task<WritableData>) => OutputFileTask;
export function output(options?: OutputOptions): (source: Task<WritableData>[]) => OutputFileTask[];
export function output(options?: OutputOptions): (source: TaskArray<any, Task<WritableData>>) => OutputFileTask[];
export function output(options?: OutputOptions): (source: any) => OutputFileTask | OutputFileTask[] {
  return (source: Task<WritableData> | Task<WritableData>[]) => {
    if (Array.isArray(source)) {
      return source.map(s => new OutputFileTask(s, combinePaths(s.path, options)));
    } else {
      return new OutputFileTask(source, combinePaths(source.path, options));
    }
  };
}
