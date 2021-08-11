import { Path } from './Paths';
import { SourceTask, Task, TransformTask } from './Task';
import { SourceFileTask } from './source';
import fg from 'fast-glob';
import path from 'path';

/** A task which reads the contents of a directory. */
class SourceDirectoryTask extends Task<Path[]> {
  constructor(private dirPath: Path) {
    super();
  }

  // No-op: we don't support recompilation based on directory changes.
  public addDependent(dependent: Task<unknown>, dependencies: Set<SourceTask>): void {}

  public get path(): Path {
    return this.dirPath;
  }

  /** Create a task for every file in the directory. */
  public files(): TaskArray<SourceFileTask> {
    return this.match('*');
  }

  /** Create a task for every file that matches the glob. */
  public match(pattern: string): TaskArray<SourceFileTask> {
    const base = this.dirPath.basePath;
    const files = fg.sync(path.join(this.dirPath.toString(), pattern), {
      cwd: base,
      onlyFiles: true,
      globstar: true,
    });

    return new TaskArray(
      files.map(file => new SourceFileTask(new Path(file, base))),
      this.dirPath
    );
  }

  public read(): Promise<Path[]> {
    const base = this.dirPath.basePath;
    return fg(path.join(this.dirPath.toString(), '*'), {
      cwd: base,
      onlyFiles: true,
      globstar: true,
      dot: true,
    }).then(files => files.map(file => new Path(file, base)));
  }
}

/** Represents an array of tasks. These are usually created when operating on collections of
    source files.
 */
export class TaskArray<T2 extends Task<any>> extends Task<T2[]> {
  constructor(private sources: T2[], private dirPath: Path) {
    super();
  }

  public addDependent(dependent: Task<unknown>, dependencies: Set<SourceTask>): void {
    this.sources.forEach(src => src.addDependent(dependent, dependencies));
  }

  public get path(): Path {
    return this.dirPath;
  }

  public items(): T2[] {
    return this.sources;
  }

  public read(): Promise<T2[]> {
    return Promise.resolve(this.sources);
  }

  /** Works like Array.map(), except that the elements are tasks. */
  public map<Out, Depends extends Task<Out>>(fn: (input: T2) => Depends): TaskArray<Depends> {
    return new TaskArray(this.sources.map(fn), this.dirPath);
  }

  /** Returns the number of tasks. */
  public get length(): number {
    return this.sources.length;
  }

  /** Find a task by some predicate. */
  public find(predicate: (value: T2) => boolean): T2 | undefined {
    return this.sources.find(predicate);
  }

  /** Reduce the list of tasks to a single task by combining them.
      @param init The initial value before any reductions.
      @param reducer Function which combines the accumulated value with new values.
  */
  public reduce<Out>(init: Out, reducer: (acc: Out, next: T2) => Out | Promise<Out>): Task<Out> {
    return new TransformTask<unknown, Out>(this, async () => {
      let result = init;
      for (let task of this.sources) {
        result = await Promise.resolve(reducer(init, task));
      }
      return result;
    });
  }
}

/** Create a task which reads a source file and returns a buffer. */
export function directory(baseOrPath: string | Path, relPath?: string): SourceDirectoryTask {
  const srcPath = Path.from(baseOrPath, relPath);
  // TODO: stat - see if it's a dir
  return new SourceDirectoryTask(srcPath);
}
