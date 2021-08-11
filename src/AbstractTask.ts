import { Path } from './Paths';
import { Task, SourceTask } from './Task';

/** Class representing a pipeline operation to be performed on a specific asset. */
export abstract class AbstractTask<T> implements Task<T> {
  public abstract addDependent(dependent: Task<unknown>, dependencies: Set<SourceTask>): void;
  public abstract get path(): Path | undefined;
  public abstract read(): Promise<T>;

  /** Transform the output of this task through a function.
      @param transform A function which accepts the input type and returns the output type.
      @returns A new Task which transforms the output when run.
  */
  public transform<Out>(transform: (input: T) => Promise<Out> | Out): Task<Out> {
    return new TransformTask<T, Out>(this, transform);
  }

  /** Pipe the output of this task through another task.
      @param taskGen A function which creates a task, given a reference to this task.
      @returns A new Task which transforms the output when run.
  */
  public pipe<Out, Dependant extends Task<Out>>(taskGen: (input: this) => Dependant): Dependant {
    return taskGen(this);
  }
}

/** A simplified transform task which accepts a synchronous transform function. */
export class TransformTask<In, Out> extends AbstractTask<Out> {
  /** Construct a new transform task.
      @param source The input to the transform.
      @param transformer A function which accepts an input value and returns an output
        value. This function will be called during the build, once the input data is ready.
   */
  constructor(private source: Task<In>, private transformer: (input: In) => Out | Promise<Out>) {
    super();
  }

  public addDependent(dependent: Task<unknown>, dependencies: Set<SourceTask>) {
    // For transforms, just add a dependency directly on the source.
    this.source.addDependent(dependent, dependencies);
  }

  public get path(): Path | undefined {
    return this.source.path;
  }

  public read(): Promise<Out> {
    return this.source.read().then(data => this.transformer(data));
  }
}
