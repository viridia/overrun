import { taskContructors } from './ctors';
import type { OutputFileTask } from './OutputFileTask';
import type { Path, PathMapping } from './Path';
import type { SourceTask, Task, WritableTask } from './Task';

type OutputType<T> = T extends string | Buffer ? OutputFileTask : never;

/** An abstract base class useful for defining custom tasks. It implements most of the methods
    of the {@link Task} interface.
 */
export abstract class AbstractTask<T> implements Task<T> {
  public abstract addDependent(dependent: Task<unknown>, dependencies: Set<SourceTask>): void;
  public abstract readonly path: Path;
  public abstract read(): Promise<T>;

  public dispose(): void {}

  public transform<Out>(transform: (input: T) => Promise<Out> | Out): Task<Out> {
    return taskContructors.transform<T, Out>(this, transform);
  }

  public pipe<Out, Dependant extends Task<Out>>(taskGen: (input: this) => Dependant): Dependant {
    return taskGen(this);
  }

  public dest(
    this: WritableTask,
    baseOrPath: Path | PathMapping | string | null,
    fragment?: string | null
  ): OutputType<string | Buffer> {
    return taskContructors.output(this, this.path.compose(baseOrPath, fragment)) as any;
  }
}
