import { open } from 'fs/promises';
import { Task } from './Task';
import { Path } from './Paths';
import { Builder } from './target';
import { isSource } from './source';
import { BuildError } from './errors';
import c from 'ansi-colors';
import path from 'path';
import fs from 'fs';
import util from 'util';

const mkdir = util.promisify(fs.mkdir);
const exists = util.promisify(fs.exists);

interface WriteOptions {
  path?: string | Path;
  base?: string | Path;
}

/** A task which reads a source file and returns a buffer. */
export class WriteFileTask extends Task<Buffer | string> implements Builder {
  private filePath: Path;
  private dependencies = new Set<Task<unknown>>();
  constructor(private source: Task<Buffer | string>, options?: WriteOptions) {
    super();
    source.addDependent(this, this.dependencies);
    if (options?.path) {
      this.filePath = new Path(options.path, options?.base);
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
  public addDependent(dependent: Task<unknown>, dependencies: Set<Task<unknown>>): void {
    this.source.addDependent(dependent, dependencies);
  }

  /** Return a conduit containing the file path, which lazily reads the file. */
  public read(): Promise<Buffer | string> {
    return this.source.read();
  }

  /** Run all tasks and generate the file. */
  public async build(): Promise<void> {
    // Don't allow overwriting of source files.
    if (isSource(this.filePath)) {
      throw new BuildError(`Cannot overwrite source file '${this.filePath.fullPath()}'.`);
    }
    const fullPath = this.filePath.fullPath();

    // Ensure output directory exists.
    const dirPath = path.dirname(fullPath);
    const dirPathExists = await exists(dirPath);
    if (!dirPathExists) {
      await mkdir(dirPath, { recursive: true })
    }

    // Write the file.
    const fh = await open(fullPath, 'w', 0o666);
    const buffer = await this.source.read();
    fh.writeFile(buffer);
    console.log(`${c.greenBright('write')}: ${this.filePath.toString()}`);
  }
}

export function write(options?: WriteOptions): (source: Task<Buffer | string>) => WriteFileTask {
  return (source: Task<Buffer | string>) => new WriteFileTask(source, options);
}
