import { Path } from './Paths';
import { SourceTask, Task } from './Task';
import { AbstractTask } from "./AbstractTask";
import { open, stat } from 'fs/promises';
import { BuildError } from './errors';
import { Stats } from 'fs';

/** A task which reads a source file and returns a buffer. */

export class SourceFileTask extends AbstractTask<Buffer> {
  private readonly dependants = new Set<Task<unknown>>();
  private stats?: Promise<Stats>;
  private lastModified = new Date();

  constructor(private filePath: Path) {
    super();
  }

  public addDependent(dependent: Task<unknown>, dependencies: Set<SourceTask>): void {
    this.dependants.add(dependent);
    dependencies.add(this);
  }

  public get path(): Path {
    return this.filePath;
  }

  /** Returns a promise which resolves when we know the modified date of this file. */
  public get ready(): Promise<void> {
    return this.prep().then(
      () => { },
      () => { }
    );
  }

  /** Return true if the last modified time of this file is newer than the given date. */
  public isNewerThan(date: Date): boolean {
    return this.lastModified > date;
  }

  /** Return the output of the task. */
  public read(): Promise<Buffer> {
    return this.prep().then(() => this.readFile());
  }

  private prep() {
    const srcPath = this.path.fullPath;
    if (!this.stats) {
      this.stats = stat(srcPath).then(
        st => {
          if (!st.isFile()) {
            throw new BuildError(`'${srcPath}' is not a regular file.`);
          }
          this.lastModified = st.mtime;
          return st;
        },
        err => {
          if (err.code === 'ENOENT') {
            throw new BuildError(`Input file '${srcPath}' not found.`);
          }
          throw err;
        }
      );
    }
    return this.stats;
  }

  private async readFile(): Promise<Buffer> {
    const srcPath = this.path.fullPath;
    try {
      const fh = await open(srcPath, 'r', 0o666);
      const buffer = fh.readFile();
      fh.close();
      return buffer;
    } catch (e) {
      if (e.code === 'ENOENT') {
        throw new BuildError(`Input file '${srcPath}' not found.`);
      }
      console.error(e);
      throw e;
    }
  }
}
