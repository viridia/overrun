import fg from 'fast-glob';
import type { Stats } from 'fs';
import path from 'path';
import { AbstractTask } from './AbstractTask';
import { Path } from './Path';
import type { SourceFileTask } from './SourceFileTask';
import { getOrCreateSourceTask } from './sourceInternal';
import type { SourceTask, Task } from './Task';
import { TaskArray } from './TaskArray';
import { stat } from 'fs/promises';
import { BuildError } from './errors';

/** A task which reads the contents of a directory. */
export class DirectoryTask extends AbstractTask<Path[]> {
  private stats?: Promise<Stats>;

  constructor(public readonly path: Path) {
    super();
  }

  // No-op: we don't support recompilation based on directory changes.
  public addDependent(dependent: Task<unknown>, dependencies: Set<SourceTask>): void {}

  /** Create a task for every file in the directory. */
  public files(): TaskArray<string, SourceFileTask> {
    return this.match('*');
  }

  /** Create a task for every file that matches the glob. */
  public match(pattern: string): TaskArray<string, SourceFileTask> {
    const base = this.path.base;
    return new TaskArray(
      () => fg.sync(path.join(this.path.fragment, pattern), {
        cwd: base && path.resolve(base),
        onlyFiles: true,
        globstar: true,
      }),
      file => getOrCreateSourceTask(Path.from(base!, file)),
      this.path
    );
  }

  /** Return the modification date of this directory. */
  public getModTime(): Promise<Date> {
    return this.prep().then(st => st.mtime);
  }

  public async read(): Promise<Path[]> {
    const base = this.path.base;
    await this.prep();
    const files = await fg(path.join(this.path.fragment, '*'), {
      cwd: base && path.resolve(base),
      onlyFiles: true,
      globstar: true,
      dot: true,
    });

    return files.map(file => {
      return Path.from(base!, file);
    });
  }

  /** Used when we detect the file is modified.
      @internal
  */
  public updateStats(stats: Stats) {
    this.stats = Promise.resolve(stats);
  }

  private prep(): Promise<Stats> {
    const srcPath = this.path.complete;
    if (!this.stats) {
      this.stats = stat(srcPath).then(
        st => {
          if (!st.isDirectory()) {
            throw new BuildError(`'${srcPath}' is not a directory.`);
          }
          return st;
        },
        err => {
          if (err.code === 'ENOENT') {
            throw new BuildError(`Input directory '${srcPath}' not found.`);
          }
          throw err;
        }
      );
    }
    return this.stats;
  }
}
