/// <reference types="node" />
import { Path } from './Paths';
import { SourceTask, Task } from './Task';
import { AbstractTask } from "./AbstractTask";
import { Stats } from 'fs';
/** A task which reads a source file and returns a buffer. */
export declare class SourceFileTask extends AbstractTask<Buffer> {
    private filePath;
    private readonly dependants;
    private stats?;
    private lastModified;
    constructor(filePath: Path, stats?: Stats);
    addDependent(dependent: Task<unknown>, dependencies: Set<SourceTask>): void;
    get path(): Path;
    /** Return the modification date of this source file. */
    getModTime(): Promise<Date>;
    /** Return the output of the task. */
    read(): Promise<Buffer>;
    /** Used when we detect the file is modified. */
    updateStats(stats: Stats): void;
    private prep;
    private readFile;
}
