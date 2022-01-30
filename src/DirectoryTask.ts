import fg from 'fast-glob';
import path from 'path';
import { AbstractTask } from './AbstractTask';
import { Path } from './Path';
import type { SourceFileTask } from './SourceFileTask';
import { getOrCreateSourceTask } from './sourceInternal';
import type { SourceTask, Task } from './Task';
import { TaskArray } from './TaskArray';

/** A task which reads the contents of a directory. */
export class DirectoryTask extends AbstractTask<Path[]> {
  constructor(public readonly path: Path) {
    super();
  }

  // No-op: we don't support recompilation based on directory changes.
  public addDependent(dependent: Task<unknown>, dependencies: Set<SourceTask>): void {}

  /** Create a task for every file in the directory. */
  public files(): TaskArray<SourceFileTask> {
    return this.match('*');
  }

  /** Create a task for every file that matches the glob. */
  public match(pattern: string): TaskArray<SourceFileTask> {
    const base = this.path.base;
    const files = fg.sync(path.join(this.path.fragment, pattern), {
      cwd: base && path.resolve(base),
      onlyFiles: true,
      globstar: true,
    });

    return new TaskArray(
      files.map(file => {
        return getOrCreateSourceTask(Path.from(base!, file));
      }),
      this.path
    );
  }

  public read(): Promise<Path[]> {
    const base = this.path.base;
    return fg(path.join(this.path.fragment, '*'), {
      cwd: base && path.resolve(base),
      onlyFiles: true,
      globstar: true,
      dot: true,
    }).then(files =>
      files.map(file => {
        return Path.from(base!, file);
      })
    );
  }
}
