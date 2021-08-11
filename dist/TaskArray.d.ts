import { Path } from './Paths';
import { SourceTask, Task } from './Task';
import { AbstractTask } from "./AbstractTask";
/** Represents an array of tasks. These are usually created when operating on collections of
    source files.
 */
export declare class TaskArray<T2 extends Task<any>> extends AbstractTask<T2[]> {
    private sources;
    private dirPath;
    constructor(sources: T2[], dirPath: Path);
    addDependent(dependent: Task<unknown>, dependencies: Set<SourceTask>): void;
    get path(): Path;
    items(): T2[];
    read(): Promise<T2[]>;
    /** Works like Array.map(), except that the elements are tasks. */
    map<Out, Depends extends Task<Out>>(fn: (input: T2) => Depends): TaskArray<Depends>;
    /** Returns the number of tasks. */
    get length(): number;
    /** Find a task by some predicate. */
    find(predicate: (value: T2) => boolean): T2 | undefined;
    /** Reduce the list of tasks to a single task by combining them.
        @param init The initial value before any reductions.
        @param reducer Function which combines the accumulated value with new values.
    */
    reduce<Out>(init: Out, reducer: (acc: Out, next: T2) => Out | Promise<Out>): Task<Out>;
}
