import fg from 'fast-glob';
import path from 'path';
import { AbstractTask } from './AbstractTask';
import { Path } from './Path';
import type { SourceFileTask } from './SourceFileTask';
import { getOrCreateSourceTask } from './sourceInternal';
import type { DependencySet } from './Task';
import { TaskArray } from './TaskArray';
import { nextVersion, currentVersion } from './version';

/** A task which reads the contents of a directory. */
export class DirectoryTask extends AbstractTask<Path[]> {
  private version = currentVersion();

  constructor(public readonly path: Path) {
    super();
  }

  public addDependencies(dependencies: DependencySet): void {
    dependencies.add(this);
  }

  /** Create a task for every file in the directory. */
  public files(): TaskArray<string, SourceFileTask> {
    return this.match('*');
  }

  /** Create a task for every file that matches the glob. */
  public match(pattern: string): TaskArray<string, SourceFileTask> {
    const root = this.path.root;
    return new TaskArray(
      () =>
        fg.sync(path.join(this.path.fragment, pattern), {
          cwd: root && path.resolve(root),
          onlyFiles: true,
          globstar: true,
        }),
      file => getOrCreateSourceTask(Path.from(root!, file)),
      this.path,
      this
    );
  }

  public getVersion() {
    return this.version;
  }

  public bumpVersion() {
    this.version = nextVersion();
  }

  public async read(): Promise<Path[]> {
    const root = this.path.root;
    const files = await fg(path.join(this.path.fragment, '*'), {
      cwd: root && path.resolve(root),
      onlyFiles: true,
      globstar: true,
      dot: true,
    });

    return files.map(file => {
      return Path.from(root!, file);
    });
  }
}
