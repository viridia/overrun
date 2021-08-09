import { open } from 'fs/promises';
import { Task } from './Task';
import c from 'ansi-colors';
import { Path } from './Paths';
import { Builder } from './target';
import { isSource } from './source';
import { BuildError } from './errors';

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
  public out(): Promise<Buffer | string> {
    return this.source.out();
  }

  /** Run all tasks and generate the file. */
  public async build(): Promise<void> {
    // this.modified = false;
    const buffer = await this.source.out();
    const dstPath = this.path;
    if (isSource(dstPath)) {
      throw new BuildError(`Cannot overwrite source file '${dstPath.fullPath()}'.`);
    }
    const fh = await open(dstPath.fullPath(), 'w', 0o666);
    fh.writeFile(buffer);
    console.log(`${c.greenBright('write')}: ${dstPath.toString()}`);
  }
}

export function write(options?: WriteOptions): (source: Task<Buffer | string>) => WriteFileTask {
  return (source: Task<Buffer | string>) => new WriteFileTask(source, options);
}
