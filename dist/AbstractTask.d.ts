/// <reference types="node" />
import type { OutputFileTask } from './OutputFileTask';
import type { Path, PathMapping, PathSpec } from './Path';
import type { Builder, DependencySet, Task, WritableData } from './Task';
export interface AbstractOutput extends Task<WritableData> {
}
export declare type OutputType<T> = T extends string | Buffer ? OutputFileTask : never;
/** An abstract base class useful for defining custom tasks. It implements most of the methods
    of the {@link Task} interface.
 */
export declare abstract class AbstractTask<T> implements Task<T> {
    abstract addDependencies(out: DependencySet): void;
    abstract readonly path: Path;
    abstract read(): Promise<T>;
    dispose(): void;
    transform<Out>(transform: (input: T) => Promise<Out> | Out): Task<Out>;
    pipe<Out, Dependant extends Task<Out>>(taskGen: (input: this) => Dependant): Dependant;
    dest(this: Task<WritableData>, baseOrPath: Path | PathSpec | PathMapping | string | null, fragment?: string | null): OutputType<string | Buffer>;
    gatherOutOfDate(force: boolean): Promise<Builder[]>;
}
