import { Path } from './Paths';
import { SourceTask, Task } from './Task';
import { AbstractTask } from "./AbstractTask";
/** Represents an array of tasks. These are usually created when operating on collections of
    source files.

    The `transform()` and `pipe()` methods operate on the entire collection of tasks. To
    process tasks individually, use the `map()` or `reduce()` methods.
 */
export declare class TaskArray<T2 extends Task<any>> extends AbstractTask<T2[]> {
    private sources;
    private dirPath?;
    constructor(sources: T2[], dirPath?: Path | undefined);
    addDependent(dependent: Task<unknown>, dependencies: Set<SourceTask>): void;
    get path(): Path | undefined;
    /** The array of tasks contained in this `TaskArray`. */
    items(): T2[];
    read(): Promise<T2[]>;
    /** Works like Array.map(), except that the elements are tasks. */
    map<Out, Depends extends Task<Out>>(fn: (input: T2) => Depends): TaskArray<Depends>;
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
}
