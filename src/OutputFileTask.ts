import fs, { Stats } from 'fs';
import { open, stat } from 'fs/promises';
import path from 'path';
import util from 'util';
import { AbstractTask } from './AbstractTask';
import { taskContructors } from './ctors';
import { log } from './debug';
import { BuildError } from './errors';
import type { Path } from './Path';
import { hasSourceTask } from './sourceInternal';
import {
  Builder,
  BuilderOptions,
  Dependency,
  DependencySet,
  isDirectoryDependency,
  isFileDependency,
  Task,
  WritableData,
} from './Task';
import { currentVersion } from './version';

const mkdir = util.promisify(fs.mkdir);
const exists = util.promisify(fs.exists);

/** A task which writes to an output file. */
export class OutputFileTask extends AbstractTask<Buffer | string> implements Builder {
  private dependencies = new Set<Dependency>();
  private stats?: Promise<Stats | null>;
  private version: number;

  /** Construct a new {@link OutputFileTask}.
      @param source The input task that provides the data to output.
      @param path The location of where to write the data.
   */
  constructor(private source: Task<WritableData>, public readonly path: Path) {
    super();
    source.addDependencies(this.dependencies);
    this.version = Math.max(
      0,
      ...Array.from(this.dependencies).map(dep =>
        isDirectoryDependency(dep) ? dep.getVersion() : 0
      )
    );
  }

  public getName(): string {
    return (this.path ?? this.source.path).fragment;
  }

  /** Add a task as a dependent of this task. */
  public addDependencies(out: DependencySet): void {
    this.source.addDependencies(out);
  }

  /** True if any sources of this file are newer than the file.
      @internal
  */
  public async isModified(): Promise<boolean> {
    const stats = await this.getStats();
    if (stats === null) {
      return true;
    } else {
      for (const dep of this.dependencies) {
        if (isFileDependency(dep)) {
          const depTime = await dep.getModTime();
          if (depTime > stats.mtime) {
            log(`Rebuilding ${this.path.full} because source file ${dep.path.full} is newer.`);
            return true;
          }
        } else if (isDirectoryDependency(dep)) {
          if (this.version < dep.getVersion()) {
            log(`Rebuilding ${this.path.full} because directory ${dep.path.full} changed.`);
            return true;
          }
        }
      }
      return false;
    }
  }

  /** Return a conduit containing the file path, which lazily reads the file. */
  public read(): Promise<Buffer | string> {
    return this.source.read();
  }

  public async gatherOutOfDate(force: boolean): Promise<Builder[]> {
    if (force || (await this.isModified())) {
      return [this];
    }
    return [];
  }

  /** Run all tasks and generate the file. */
  public async build(options: BuilderOptions): Promise<void> {
    // Don't allow overwriting of source files.
    const fullPath = this.path.complete;
    if (hasSourceTask(this.path)) {
      throw new BuildError(`Cannot overwrite source file '${fullPath}'.`);
    }

    this.version = currentVersion();

    // Ensure output directory exists.
    if (options.dryRun) {
      await this.source.read();
    } else {
      const dirPath = path.dirname(fullPath);
      const dirPathExists = await exists(dirPath);
      if (!dirPathExists) {
        await mkdir(dirPath, { recursive: true });
      }

      // Write the file.
      const buffer = await this.source.read();
      const fh = await open(fullPath, 'w', 0o666);
      await fh.writeFile(buffer);
      await fh.close();
      this.stats = undefined;
      // console.log(` - ${c.greenBright('Wrote')}: ${this.filePath.toString()} - ${buffer.length} bytes.`);
      // TODO: get new modification time.
    }
  }

  /** @internal */
  public getStats(): Promise<Stats | null> {
    const srcPath = this.path.complete;
    if (this.stats === undefined) {
      this.stats = stat(srcPath).then(
        st => {
          if (!st.isFile()) {
            throw new BuildError(`'${srcPath}' is not a regular file.`);
          }
          return st;
        },
        err => {
          if (err.code === 'ENOENT') {
            return null;
          }
          throw err;
        }
      );
    }
    return this.stats;
  }
}

taskContructors.output = (source, path) => new OutputFileTask(source, path);
