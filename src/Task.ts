import { Path } from './Paths';

export type TransformFn<In, Out> = (input: In) => Out;
export type TransformFnAsync<In, Out> = (input: In) => Promise<Out> | Out;

/** Object representing a pipeline operation to be performed on a specific asset. */
export interface Task<T> {
  /** Mark a task as being dependent on this task, meaning that the target is considered to
      be out of date when any of its dependencies are out of date. */
  addDependent(dependent: Task<unknown>, dependencies: Set<SourceTask>): void;

  /** The filesystem location associated with the build artifact produced by this task. */
  get path(): Path | undefined;

  /** Return the output of this task. */
  read(): Promise<T>;

  /** Transform the output of this task through a function.
      @param transform A function which accepts the input type and returns the output type.
      @returns A new Task which transforms the output when run.
  */
  transform<Out>(transform: TransformFnAsync<T, Out>): Task<Out>;

  /** Pipe the output of this task through another task.
      @param taskGen A function which creates a task, given a reference to this task.
      @returns A new Task which transforms the output when run.
  */
  pipe<Out, Dependant extends Task<Out>>(taskGen: (input: this) => Dependant): Dependant;
}

/** A task that has a "last modified" date. */
export interface SourceTask {
  /** Location of this file in the source tree. */
  get path(): Path;

  /** Returns a promise which resolves when we know the modified date of this file. */
  get ready(): Promise<void>;

  /** Return true if the last modified time of this file is newer than the given date. */
  getModTime(): Promise<Date>;
}
