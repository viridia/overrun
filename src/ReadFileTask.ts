import { Path } from './Paths';
import { Task } from './Task';
import { open } from 'fs/promises';
import c from 'ansi-colors';
import { BuildError } from './errors';

/** A task which reads a source file and returns a buffer. */
export class ReadFileTask extends Task<Buffer> {
  private readonly dependants = new Set<Task<unknown>>();
  private filePath: Path;

  constructor(path: string | Path) {
    super();
    this.filePath = typeof path === 'string' ? new Path(path) : path;
  }

  public addDependent(dependent: Task<unknown>, dependencies: Set<Task<unknown>>): void {
    this.dependants.add(dependent);
    dependencies.add(this);
  }

  public get path(): Path {
    return this.filePath;
  }

  /** Return the output of the task. */
  public read(): Promise<Buffer> {
    return this.readFile();
  }

  /** Mark whether this task's input has been modified, in other words, whether the input has
      changed and the task needs to be re-run. Setting modified to true will also set any
      dependent tasks to be modified as well.
   */
  // public setModified(modified: boolean) {
  //   if (this.modified !== modified) {
  //     this.modified = modified;
  //     // if (this.modified) {
  //     //   this.dependants.forEach(dep => dep.setModified(true));
  //     // }
  //   }
  // }

  private async readFile(): Promise<Buffer> {
    const srcPath = this.path.fullPath();
    console.log(`${c.green('Reading')}: ${srcPath}`);
    // TODO: Stat
    try {
      const fh = await open(srcPath, 'r', 0o666);
      return fh.readFile();
    } catch (e) {
      if (e.code === 'ENOENT') {
        throw new BuildError(`Input file '${srcPath}' not found.`);
      }
      console.error(e);
      throw e;
    }
  }
}
