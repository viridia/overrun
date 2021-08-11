/// <reference types="node" />
import { Path } from './Paths';
import { SourceTask, Task } from './Task';
import { AbstractTask } from "./AbstractTask";
/** A task which reads a source file and returns a buffer. */
export declare class SourceFileTask extends AbstractTask<Buffer> {
    private filePath;
    private readonly dependants;
    private stats?;
    private lastModified;
    constructor(filePath: Path);
    addDependent(dependent: Task<unknown>, dependencies: Set<SourceTask>): void;
    get path(): Path;
    /** Returns a promise which resolves when we know the modified date of this file. */
    get ready(): Promise<void>;
    /** Return the modification date of this source file. */
    getModTime(): Promise<Date>;
    /** Return the output of the task. */
    read(): Promise<Buffer>;
    private prep;
    private readFile;
}
