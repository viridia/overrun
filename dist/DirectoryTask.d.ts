import { Path } from './Paths';
import { SourceTask, Task } from './Task';
import { AbstractTask } from "./AbstractTask";
import { SourceFileTask } from "./SourceFileTask";
import { TaskArray } from "./TaskArray";
/** A task which reads the contents of a directory. */
export declare class DirectoryTask extends AbstractTask<Path[]> {
    private dirPath;
    constructor(dirPath: Path);
    addDependent(dependent: Task<unknown>, dependencies: Set<SourceTask>): void;
    get path(): Path;
    /** Create a task for every file in the directory. */
    files(): TaskArray<SourceFileTask>;
    /** Create a task for every file that matches the glob. */
    match(pattern: string): TaskArray<SourceFileTask>;
    read(): Promise<Path[]>;
}
