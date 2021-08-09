import { Path } from "./Paths";

export type TransformFn<In, Out> = (input: In) => Out;

/** Class representing a pipeline operation to be performed on a specific asset. */
export abstract class Task<T> {
  /** Mark a task as being dependent on this task, meaning that the target is considered to
      be out of date when any of its dependencies are out of date. */
  public abstract addDependent(dependent: Task<unknown>, dependencies: Set<Task<unknown>>): void;

  /** The filesystem location associated with the build artifact produced by this task. */
  public abstract get path(): Path | undefined;

  /** Return the output of this task. */
  public abstract read(): Promise<T>;

  /** Transform the output of this task through a function.
      @param transform A function which accepts the input type and returns the output type.
      @returns A new Task which transforms the output when run.
  */
  public transform<Out>(transform: (input: T) => Out): Task<Out> {
    return new TransformTask<T, Out>(this, transform);
  }

  /** Pipe the output of this task through another task.
      @param taskGen A function which creates a task, given a reference to this task.
      @returns A new Task which transforms the output when run.
  */
  public pipe<Out, Dependant extends Task<Out>>(taskGen: (input: this) => Dependant): Dependant {
    return taskGen(this);
  }

  /** Distribute the output of this task to multiple sub-tasks.
      @param taskGens An array of functions that create dependent tasks.
      @returns This task.
  */
  public tee(...taskGens: ReadonlyArray<(source: this) => Task<unknown>>): this {
    taskGens.forEach(taskGen => {
      taskGen(this);
    });
    return this;
  }
}

/** A simplified transform task which accepts a synchronous transform function. */
export class TransformTask<In, Out> extends Task<Out> {
  /** Construct a new transform task.
      @param source The input to the transform.
      @param transformer A function which accepts an input value and returns an output
        value. This function will be called during the build, once the input data is ready.
   */
  constructor(private source: Task<In>, private transformer: (input: In) => Out) {
    super();
  }

  public get path(): Path | undefined {
    return this.source.path;
  }

  public addDependent(dependent: Task<unknown>, dependencies: Set<Task<unknown>>) {
    // For transforms, just add a dependency directly on the source.
    this.source.addDependent(dependent, dependencies);
  }

  public read(): Promise<Out> {
    return this.source.read().then(data => this.transformer(data));
  }
}
