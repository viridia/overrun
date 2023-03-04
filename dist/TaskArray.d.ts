import { Path } from './Path';
import { Builder, DependencySet, DirectoryDependency, Task } from './Task';
import { AbstractTask } from './AbstractTask';
/** Represents an array of tasks. These are usually created when operating on collections of
    source files.

    The `transform()` and `pipe()` methods operate on the entire collection of tasks. To
    process tasks individually, use the `map()` or `reduce()` methods.
 */
export declare class TaskArray<Input, T2 extends Task<any>> extends AbstractTask<T2[]> {
    private entries;
    private factory;
    readonly path: Path;
    protected dependsOn?: DirectoryDependency | undefined;
    private cachedTasks;
    private version;
    constructor(entries: () => ReadonlyArray<Input>, factory: (input: Input) => T2, path: Path, dependsOn?: DirectoryDependency | undefined);
    addDependencies(out: DependencySet): void;
    /** The array of tasks contained in this `TaskArray`. */
    items(): T2[];
    read(): Promise<T2[]>;
    /** Works like Array.map(), except that the elements are tasks.
        @param fn A transform which is applied to each task in the task array.
        @returns A `TaskArray` containing the transformed task outputs.
     */
    map<Out, Depends extends Task<Out>>(fn: (input: T2) => Depends): TaskArray<T2, Depends>;
    getName(): string;
    /** Returns the number of tasks in this `TaskArray`. */
    get length(): number;
    /** Find a task by some predicate. */
    find(predicate: (value: T2) => boolean): T2 | undefined;
    /** Combine the output of all the tasks in the task array into a single data structure.
        The reducer function operates much like `Array.reduce()` except that it is asynchronous.
        @param init The initial value before any reductions.
        @param reducer Function which combines the accumulated value with new values.
        @returns A new Task which produces the combined output of the reduction.
    */
    reduce<Out>(init: Out, reducer: (acc: Out, next: T2) => Out | Promise<Out>): Task<Out>;
    gatherOutOfDate(force: boolean): Promise<Builder[]>;
    private get sources();
}
