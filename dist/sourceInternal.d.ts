import { Path } from './Path';
import { SourceFileTask } from './SourceFileTask';
import { DirectoryTask } from './DirectoryTask';
/** Return true if `path` is a source file. */
export declare function hasSourceTask(path: Path): boolean;
export declare function getOrCreateSourceTask(srcPath: Path): SourceFileTask;
/** Return the task for the given source file.
    @internal
*/
export declare function getSourceTask(path: string): SourceFileTask | undefined;
/** Return true if `path` is a source file. */
export declare function hasDirectoryTask(path: Path): boolean;
export declare function createDirectoryTask(srcPath: Path): DirectoryTask;
/** Return list of directory tasks which are observing the given path.

    Because DirectoryTasks can glob subdirectories, we can't know for sure whether
    a change to a directory will require a rebuild or not. This takes a conservative
    approach and assumes that any change at a given filesystem location will trigger
    a rebuild of all directory rules that encompass that location within it.
    @internal
*/
export declare function getDirectoryTasks(dirPath: string): DirectoryTask[];
/** Remove all cached source files, used for testing. */
export declare function clearSourceTasks(): void;
/** @internal */
export declare function getWatchDirs(): string[];
