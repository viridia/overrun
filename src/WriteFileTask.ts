import { open } from 'fs/promises';
import { SourceTask, Task } from './Task';
import { Path } from './Paths';
import { Builder, BuilderOptions } from './target';
import { isSource } from './source';
import { BuildError } from './errors';
import { AbstractTask } from './AbstractTask';
import { WritableTask, WriteOptions } from './write';
import path from 'path';
import fs from 'fs';
import util from 'util';

const mkdir = util.promisify(fs.mkdir);
const exists = util.promisify(fs.exists);

/** A task which reads a source file and returns a buffer. */
export class WriteFileTask extends AbstractTask<Buffer | string> implements Builder {
  private filePath: Path;
  private dependencies = new Set<SourceTask>();
  constructor(private source: WritableTask, options?: WriteOptions) {
    super();
    source.addDependent(this, this.dependencies);
    if (options?.path) {
      if (typeof options.path === 'string') {
        this.filePath = new Path(options.path, options?.base);
      } else if (options.base) {
        this.filePath = options.path.withBase(options.base);
      } else {
        this.filePath = options.path;
      }
    } else if (options?.base && this.source.path) {
      this.filePath = this.source.path.withBase(options.base);
    } else if (this.source.path) {
      this.filePath = this.source.path;
    } else {
      throw new BuildError('Write task must specify an output path.');
    }
  }

  public get path(): Path {
    return this.filePath;
  }

  public getName(): string {
    return (this.path ?? this.source.path).toString();
  }

  /** Add a task as a dependent of this task. */
  public addDependent(dependent: Task<unknown>, dependencies: Set<SourceTask>): void {
    this.source.addDependent(dependent, dependencies);
  }

  /** True if any sources of this file are newer than the file. */
  public get isModified(): boolean {
    return false;
    // return this.dependencies.s
  }

  /** Return a conduit containing the file path, which lazily reads the file. */
  public read(): Promise<Buffer | string> {
    return this.source.read();
  }

  /** Run all tasks and generate the file. */
  public async build(options: BuilderOptions): Promise<void> {
    // Don't allow overwriting of source files.
    const fullPath = this.filePath.fullPath;
    if (isSource(this.filePath)) {
      throw new BuildError(`Cannot overwrite source file '${fullPath}'.`);
    }

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
      // console.log(` - ${c.greenBright('Wrote')}: ${this.filePath.toString()} - ${buffer.length} bytes.`);
      // TODO: get new modification time.
    }
  }
}
