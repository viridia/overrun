import { Path } from './Path';
import { Builder, DependencySet, DirectoryDependency, Task } from './Task';
import { AbstractTask } from './AbstractTask';
import { taskContructors } from './ctors';

/** Represents an array of tasks. These are usually created when operating on collections of
    source files.

    The `transform()` and `pipe()` methods operate on the entire collection of tasks. To
    process tasks individually, use the `map()` or `reduce()` methods.
 */
export class TaskArray<Input, T2 extends Task<any>> extends AbstractTask<T2[]> {
  private cachedTasks = new Map<Input, T2>();
  private version = -1;

  constructor(
    private entries: () => ReadonlyArray<Input>,
    private factory: (input: Input) => T2,
    public readonly path: Path,
    protected dependsOn?: DirectoryDependency
  ) {
    super();
  }

  public addDependencies(out: DependencySet): void {
    if (this.dependsOn) {
      out.add(this.dependsOn);
    }
    this.sources.forEach(src => src.addDependencies(out));
  }

  /** The array of tasks contained in this `TaskArray`. */
  public items(): T2[] {
    return this.sources;
  }

  public read(): Promise<T2[]> {
    return Promise.resolve(this.sources);
  }

  /** Works like Array.map(), except that the elements are tasks.
      @param fn A transform which is applied to each task in the task array.
      @returns A `TaskArray` containing the transformed task outputs.
   */
  public map<Out, Depends extends Task<Out>>(fn: (input: T2) => Depends): TaskArray<T2, Depends> {
    return new TaskArray(() => this.sources, fn, this.path, this.dependsOn);
  }

  public getName(): string {
    return this.path.fragment;
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
    return taskContructors.transform<unknown, Out>(this, async () => {
      let result = init;
      for (let task of this.sources) {
        result = await Promise.resolve(reducer(result, task));
      }
      return result;
    });
  }

  public async gatherOutOfDate(force: boolean): Promise<Builder[]> {
    return (await Promise.all(this.sources.map(src => src.gatherOutOfDate(force)))).flat();
  }

  // Lazily comput the list of sources. This may change in cases where a new file was
  // added to a source directory.
  private get sources(): T2[] {
    let modified = false;
    if (this.dependsOn) {
      const version = this.dependsOn.getVersion();
      if (version > this.version) {
        this.version = version;
        modified = true;
      }
    } else {
      modified = true;
    }

    if (modified) {
      // Recompute the list of tasks from the entries.
      // Keep the list the same as much as possible.
      const entries = this.entries();
      const tasksToDelete = new Set(this.cachedTasks.keys());
      for (const entry of entries) {
        tasksToDelete.delete(entry);
        if (!this.cachedTasks.has(entry)) {
          this.cachedTasks.set(entry, this.factory(entry));
        }
      }

      for (const entry of tasksToDelete) {
        this.cachedTasks.delete(entry);
      }
    }

    return Array.from(this.cachedTasks.values());
  }
}
