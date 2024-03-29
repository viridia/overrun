import { AbstractTask } from './AbstractTask';
import type { Path } from './Path';
import type { DependencySet, Task } from './Task';
/** A simplified transform task which accepts a synchronous transform function. */
export declare class TransformTask<In, Out> extends AbstractTask<Out> {
    private source;
    private transformer;
    /** Construct a new transform task.
        @param source The input to the transform.
        @param transformer A function which accepts an input value and returns an output
          value. This function will be called during the build, once the input data is ready.
     */
    constructor(source: Task<In>, transformer: (input: In) => Out | Promise<Out>);
    addDependencies(out: DependencySet): void;
    get path(): Path;
    read(): Promise<Out>;
}
