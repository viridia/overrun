import { Path } from './Paths';
import { SourceTask, Task } from './Task';
import { AbstractTask } from "./AbstractTask";
import { SourceFileTask } from "./SourceFileTask";
import { TaskArray } from "./TaskArray";
import fg from 'fast-glob';
import path from 'path';
import { getOrCreateSourceTask } from './sourceInternal';

/** A task which reads the contents of a directory. */
export class DirectoryTask extends AbstractTask<Path[]> {
  constructor(private dirPath: Path) {
    super();
  }

  // No-op: we don't support recompilation based on directory changes.
  public addDependent(dependent: Task<unknown>, dependencies: Set<SourceTask>): void { }

  public get path(): Path {
    return this.dirPath;
  }

  /** Create a task for every file in the directory. */
  public files(): TaskArray<SourceFileTask> {
    return this.match('*');
  }

  /** Create a task for every file that matches the glob. */
  public match(pattern: string): TaskArray<SourceFileTask> {
    const base = this.dirPath.base;
    const files = fg.sync(path.join(this.dirPath.fragment, pattern), {
      cwd: base,
      onlyFiles: true,
      globstar: true,
    });

    return new TaskArray(
      files.map(file => {
        return getOrCreateSourceTask(new Path(file, base));
      }),
      this.dirPath
    );
  }

  public read(): Promise<Path[]> {
    const base = this.dirPath.base;
    return fg(path.join(this.dirPath.fragment, '*'), {
      cwd: base,
      onlyFiles: true,
      globstar: true,
      dot: true,
    }).then(files => files.map(file => new Path(file, base)));
  }
}
