import { Path } from './Paths';

export type TransformFn<In, Out> = (input: In) => Out;
export type TransformFnAsync<In, Out> = (input: In) => Promise<Out> | Out;

/** A TypeScript interface representing an object which produces data asynchronously. It
    has a single template parameter, which represents the type of data produced.
  */
export interface Task<T> {
  /** Mark a task as being dependent on this task, meaning that the target is considered to
      be out of date when any of its dependencies are out of date. */
  addDependent(dependent: Task<unknown>, dependencies: Set<SourceTask>): void;

  /** The filesystem location associated with the build artifact produced by this task. */
  get path(): Path | undefined;

  /** Returns a Promise that resolves to the data output by this task. This is
      generally called by pipeline operators to read the data from the previous step, however
      operators are not required to do this. */
  read(): Promise<T>;

  /** Creates a new task which transforms the output of this task's data. The `transform`
      argument is a function which accepts the task's output as an argument, and which returns
      either the transformed data or a promise which resolves to that data.

      The task created will list the current task as a dependency, so if the source file is changed
      the transform task will be re-run.

      @param transform A function which accepts the input type and returns the output type.
      @returns A new Task which transforms the output when run.
  */
  transform<Out>(transform: TransformFnAsync<T, Out>): Task<Out>;

  /** Pipe the output of this task through another task. Similar to `transform()`, except that
      it allows more flexibility in processing.
      @param taskGen A function which creates a new task, given a reference to this task.
      @returns A new Task which transforms the output when run.
  */
  pipe<Out, Dependant extends Task<Out>>(taskGen: (input: this) => Dependant): Dependant;
}

/** A task that has a "last modified" date. */
export interface SourceTask {
  /** Location of this file in the source tree. */
  get path(): Path;

  /** Return true if the last modified time of this file is newer than the given date. */
  getModTime(): Promise<Date>;
}
