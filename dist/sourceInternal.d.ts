import { Path } from './Paths';
import { SourceFileTask } from './SourceFileTask';
export declare const sources: Map<string, SourceFileTask>;
/** Return true if `path` is a source file. */
export declare function isSource(path: Path): boolean;
export declare function addSource(task: SourceFileTask): void;
export declare function getOrCreateSourceTask(srcPath: Path): SourceFileTask;
/** Return true if `path` is a source file. */
export declare function getSource(path: string): SourceFileTask | undefined;
export declare function getWatchDirs(): string[];
