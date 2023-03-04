import { Path } from './Path';
import { AbstractTask } from "./AbstractTask";
import type { DependencySet } from './Task';
import { open, stat } from 'fs/promises';
import { BuildError } from './errors';
import { Stats } from 'fs';

/** A task which reads a source file and returns a buffer. */
export class SourceFileTask extends AbstractTask<Buffer> {
  private modTime: Date | null = null;
  private stats?: Promise<Stats>;

  constructor(public readonly path: Path, stats?: Stats) {
    super();
    if (stats) {
      this.stats = Promise.resolve(stats);
    }
  }

  public dispose(): void {
    // this.dependants.clear();
  }

  public addDependencies(trackingSet: DependencySet): void {
    trackingSet.add(this);
  }

  /** Return the modification date of this source file. */
  public getModTime(): Promise<Date> {
    return this.prep().then(st => st.mtime);
  }

  /** Used when we detect the file has been modified. */
  public updateModTime(modTime: Date) {
    this.modTime = modTime;
  }

  /** Return the output of the task. */
  public read(): Promise<Buffer> {
    return this.prep().then(() => this.readFile());
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
          if (!st.isFile()) {
            throw new BuildError(`'${srcPath}' is not a regular file.`);
          }
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
      if ((e as any).code === 'ENOENT') {
        throw new BuildError(`Input file '${srcPath}' not found.`);
      }
      console.error(e);
      throw e;
    }
  }
}
