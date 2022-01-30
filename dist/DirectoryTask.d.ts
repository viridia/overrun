import { AbstractTask } from './AbstractTask';
import { Path } from './Path';
import type { SourceFileTask } from './SourceFileTask';
import type { SourceTask, Task } from './Task';
import { TaskArray } from './TaskArray';
/** A task which reads the contents of a directory. */
export declare class DirectoryTask extends AbstractTask<Path[]> {
    readonly path: Path;
    constructor(path: Path);
    addDependent(dependent: Task<unknown>, dependencies: Set<SourceTask>): void;
    /** Create a task for every file in the directory. */
    files(): TaskArray<SourceFileTask>;
    /** Create a task for every file that matches the glob. */
    match(pattern: string): TaskArray<SourceFileTask>;
    read(): Promise<Path[]>;
}
