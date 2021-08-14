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

  constructor(private filePath: Path, stats?: Stats) {
    super();
    if (stats) {
      this.stats = Promise.resolve(stats);
    }
  }

  public addDependent(dependent: Task<unknown>, dependencies: Set<SourceTask>): void {
    this.dependants.add(dependent);
    dependencies.add(this);
  }

  public get path(): Path {
    return this.filePath;
  }

  /** Return the modification date of this source file. */
  public getModTime(): Promise<Date> {
    return this.prep().then(st => st.mtime);
  }

  /** Return the output of the task. */
  public read(): Promise<Buffer> {
    return this.prep().then(() => this.readFile());
  }

  /** Used when we detect the file is modified. */
  public updateStats(stats: Stats) {
    this.stats = Promise.resolve(stats);
  }

  private prep() {
    const srcPath = this.path.complete;
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
    const srcPath = this.path.complete;
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
