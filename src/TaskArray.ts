import { Path } from './Paths';
import { SourceTask, Task } from './Task';
import { AbstractTask, TransformTask } from "./AbstractTask";

/** Represents an array of tasks. These are usually created when operating on collections of
    source files.

    The `transform()` and `pipe()` methods operate on the entire collection of tasks. To
    process tasks individually, use the `map()` or `reduce()` methods.
 */
export class TaskArray<T2 extends Task<any>> extends AbstractTask<T2[]> {
  constructor(private sources: T2[], private dirPath?: Path) {
    super();
  }

  public addDependent(dependent: Task<unknown>, dependencies: Set<SourceTask>): void {
    this.sources.forEach(src => src.addDependent(dependent, dependencies));
  }

  public get path(): Path | undefined {
    return this.dirPath;
  }

  /** The array of tasks contained in this `TaskArray`. */
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

  /** Returns the number of tasks in this `TaskArray`. */
  public get length(): number {
    return this.sources.length;
  }

  /** Find a task by some predicate. */
  public find(predicate: (value: T2) => boolean): T2 | undefined {
    return this.sources.find(predicate);
  }

  /** Combine the output of all the tasks in the task array into a single data structure.
      The reducer function operates much like `Array.reduce()` except that it is asynchronous.
      @param init The initial value before any reductions.
      @param reducer Function which combines the accumulated value with new values.
      @returns A new Task which produces the combined output of the reduction.
  */
  public reduce<Out>(init: Out, reducer: (acc: Out, next: T2) => Out | Promise<Out>): Task<Out> {
    return new TransformTask<unknown, Out>(this, async () => {
      let result = init;
      for (let task of this.sources) {
        result = await Promise.resolve(reducer(result, task));
      }
      return result;
    });
  }
}
