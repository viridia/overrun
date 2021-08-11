import { open } from 'fs/promises';
import { SourceTask, Task } from './Task';
import { Path } from './Paths';
import { Builder, BuilderOptions } from './target';
import { isSource } from './source';
import { BuildError } from './errors';
import path from 'path';
import fs from 'fs';
import util from 'util';
import { TaskArray } from './directory';
// import c from 'ansi-colors';

const mkdir = util.promisify(fs.mkdir);
const exists = util.promisify(fs.exists);

type WritableTask = Task<Buffer | string>;

interface WriteOptions {
  path?: string | Path;
  base?: string | Path;
}

/** A task which reads a source file and returns a buffer. */
class WriteFileTask extends Task<Buffer | string> implements Builder {
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
    if (isSource(this.filePath)) {
      throw new BuildError(`Cannot overwrite source file '${this.filePath.fullPath}'.`);
    }
    const fullPath = this.filePath.fullPath;

    // Ensure output directory exists.
    if (options.dryRun) {
      await this.source.read();
    } else {
      const dirPath = path.dirname(fullPath);
      try {
        const dirPathExists = await exists(dirPath);
        if (!dirPathExists) {
          await mkdir(dirPath, { recursive: true });
        }
      } catch (err) {
        console.log('c');
        console.log(err);
        throw err;
      }

      // Write the file.
      const buffer = await this.source.read();
      const fh = await open(fullPath, 'w', 0o666);
      await fh.writeFile(buffer);
      await fh.close();
      // TODO: get new modification time.
    }
    // console.log(`${c.greenBright('Wrote')}: ${this.filePath.toString()}`);
  }
}

export function write(options?: WriteOptions): (source: WritableTask) => WriteFileTask;
export function write(options?: WriteOptions): (source: WritableTask[]) => WriteFileTask[];
export function write(options?: WriteOptions): (source: TaskArray<WritableTask>) => WriteFileTask[];
export function write(options?: WriteOptions): (source: any) => WriteFileTask | WriteFileTask[] {
  return (source: WritableTask | WritableTask[]) => {
    if (Array.isArray(source)) {
      return source.map(s => new WriteFileTask(s, options));
    } else {
      return new WriteFileTask(source, options);
    }
  };
}
