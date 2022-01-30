import { Path } from './Path';
import { SourceFileTask } from './SourceFileTask';
export declare const sources: Map<string, SourceFileTask>;
/** Return true if `path` is a source file. */
export declare function isSource(path: Path): boolean;
export declare function getOrCreateSourceTask(srcPath: Path): SourceFileTask;
/** Return the cached source file.
    @internal
*/
export declare function getSource(path: string): SourceFileTask | undefined;
/** Remove all cached source files, used for testing. */
export declare function clearSources(): void;
/** @internal */
export declare function getWatchDirs(): string[];
