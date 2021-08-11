/// <reference types="node" />
import { SourceTask, Task } from './Task';
import { Path } from './Paths';
import { Builder, BuilderOptions } from './target';
import { AbstractTask } from './AbstractTask';
import { WritableTask, WriteOptions } from './write';
import { Stats } from 'fs';
/** A task which reads a source file and returns a buffer. */
export declare class WriteFileTask extends AbstractTask<Buffer | string> implements Builder {
    private source;
    private filePath;
    private dependencies;
    private stats?;
    constructor(source: WritableTask, options?: WriteOptions);
    get path(): Path;
    getName(): string;
    /** Add a task as a dependent of this task. */
    addDependent(dependent: Task<unknown>, dependencies: Set<SourceTask>): void;
    /** True if any sources of this file are newer than the file. */
    isModified(): Promise<boolean>;
    /** Return a conduit containing the file path, which lazily reads the file. */
    read(): Promise<Buffer | string>;
    /** Run all tasks and generate the file. */
    build(options: BuilderOptions): Promise<void>;
    getStats(): Promise<Stats | null>;
}
