import { AbstractTask } from './AbstractTask';
import { Path } from './Path';
import type { SourceFileTask } from './SourceFileTask';
import type { DependencySet } from './Task';
import { TaskArray } from './TaskArray';
/** A task which reads the contents of a directory. */
export declare class DirectoryTask extends AbstractTask<Path[]> {
    readonly path: Path;
    private version;
    constructor(path: Path);
    addDependencies(dependencies: DependencySet): void;
    /** Create a task for every file in the directory. */
    files(): TaskArray<string, SourceFileTask>;
    /** Create a task for every file that matches the glob. */
    match(pattern: string): TaskArray<string, SourceFileTask>;
    getVersion(): number;
    bumpVersion(): void;
    read(): Promise<Path[]>;
}
