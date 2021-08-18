import { Path } from './Paths';
import { Task, SourceTask } from './Task';
/** An abstract base class useful for defining custom tasks. It implements most of the methods
    of the `Task` interface.
 */
export declare abstract class AbstractTask<T> implements Task<T> {
    abstract addDependent(dependent: Task<unknown>, dependencies: Set<SourceTask>): void;
    abstract get path(): Path | undefined;
    abstract read(): Promise<T>;
    /** Transform the output of this task through a function.
        @param transform A function which accepts the input type and returns the output type.
        @returns A new Task which transforms the output when run.
    */
    transform<Out>(transform: (input: T) => Promise<Out> | Out): Task<Out>;
    /** Pipe the output of this task through another task.
        @param taskGen A function which creates a task, given a reference to this task.
        @returns A new Task which transforms the output when run.
    */
    pipe<Out, Dependant extends Task<Out>>(taskGen: (input: this) => Dependant): Dependant;
}
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
    addDependent(dependent: Task<unknown>, dependencies: Set<SourceTask>): void;
    get path(): Path | undefined;
    read(): Promise<Out>;
}
