/// <reference types="node" />
import type { OutputFileTask } from './OutputFileTask';
import type { Path, PathMapping } from './Path';
import type { SourceTask, Task, WritableTask } from './Task';
declare type OutputType<T> = T extends string | Buffer ? OutputFileTask : never;
/** An abstract base class useful for defining custom tasks. It implements most of the methods
    of the `Task` interface.
 */
export declare abstract class AbstractTask<T> implements Task<T> {
    abstract addDependent(dependent: Task<unknown>, dependencies: Set<SourceTask>): void;
    abstract readonly path: Path;
    abstract read(): Promise<T>;
    transform<Out>(transform: (input: T) => Promise<Out> | Out): Task<Out>;
    pipe<Out, Dependant extends Task<Out>>(taskGen: (input: this) => Dependant): Dependant;
    dest(this: WritableTask, baseOrPath: Path | PathMapping | string | null, fragment?: string | null): OutputType<string | Buffer>;
}
export {};
