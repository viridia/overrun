/// <reference types="node" />
import { Path } from './Path';
import { AbstractTask } from "./AbstractTask";
import type { DependencySet } from './Task';
import { Stats } from 'fs';
/** A task which reads a source file and returns a buffer. */
export declare class SourceFileTask extends AbstractTask<Buffer> {
    readonly path: Path;
    private modTime;
    private stats?;
    constructor(path: Path, stats?: Stats);
    dispose(): void;
    addDependencies(trackingSet: DependencySet): void;
    /** Return the modification date of this source file. */
    getModTime(): Promise<Date>;
    /** Used when we detect the file has been modified. */
    updateModTime(modTime: Date): void;
    /** Return the output of the task. */
    read(): Promise<Buffer>;
    /** Used when we detect the file is modified.
        @internal
    */
    updateStats(stats: Stats): void;
    private prep;
    private readFile;
}
