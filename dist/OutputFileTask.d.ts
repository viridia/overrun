/// <reference types="node" />
import { Stats } from 'fs';
import { AbstractTask } from './AbstractTask';
import type { Path } from './Path';
import { Builder, BuilderOptions, DependencySet, Task, WritableData } from './Task';
/** A task which writes to an output file. */
export declare class OutputFileTask extends AbstractTask<Buffer | string> implements Builder {
    private source;
    readonly path: Path;
    private dependencies;
    private stats?;
    private version;
    /** Construct a new {@link OutputFileTask}.
        @param source The input task that provides the data to output.
        @param path The location of where to write the data.
     */
    constructor(source: Task<WritableData>, path: Path);
    getName(): string;
    /** Add a task as a dependent of this task. */
    addDependencies(out: DependencySet): void;
    /** True if any sources of this file are newer than the file.
        @internal
    */
    isModified(): Promise<boolean>;
    /** Return a conduit containing the file path, which lazily reads the file. */
    read(): Promise<Buffer | string>;
    gatherOutOfDate(force: boolean): Promise<Builder[]>;
    /** Run all tasks and generate the file. */
    build(options: BuilderOptions): Promise<void>;
    /** @internal */
    getStats(): Promise<Stats | null>;
}
