import { AbstractTask } from './AbstractTask';
import { taskContructors } from './ctors';
import type { Path } from './Path';
import type { DependencySet, Task } from './Task';

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

  public addDependencies(out: DependencySet) {
    // For transforms, just add a dependency directly on the source.
    this.source.addDependencies(out);
  }

  public get path(): Path {
    return this.source.path;
  }

  public read(): Promise<Out> {
    return this.source.read().then(data => this.transformer(data));
  }
}

taskContructors.transform = (source, transform) => new TransformTask(source, transform);
