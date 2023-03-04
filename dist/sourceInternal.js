"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWatchDirs = exports.clearSourceTasks = exports.getDirectoryTasks = exports.createDirectoryTask = exports.hasDirectoryTask = exports.getSourceTask = exports.getOrCreateSourceTask = exports.hasSourceTask = void 0;
const path_1 = __importDefault(require("path"));
const rootPaths_1 = require("./rootPaths");
const SourceFileTask_1 = require("./SourceFileTask");
const DirectoryTask_1 = require("./DirectoryTask");
const sourceTasks = new Map();
const directoryTasks = new Map();
const watchDirs = new Set();
/** Return true if `path` is a source file. */
function hasSourceTask(path) {
    const fullPath = path.complete;
    return sourceTasks.has(fullPath);
}
exports.hasSourceTask = hasSourceTask;
// Source file tasks are uniquely associated with a filesystem location. That is, even if
// multiple `source` directives appear in a build configuration, those that point to the
// same file will be merged to a single definition.
function getOrCreateSourceTask(srcPath) {
    const fullPath = path_1.default.resolve(srcPath.complete);
    let task = sourceTasks.get(fullPath);
    if (!task) {
        task = new SourceFileTask_1.SourceFileTask(srcPath);
        watchDirs.add(path_1.default.dirname(fullPath));
        sourceTasks.set(fullPath, task);
    }
    return task;
}
exports.getOrCreateSourceTask = getOrCreateSourceTask;
/** Return the task for the given source file.
    @internal
*/
function getSourceTask(path) {
    return sourceTasks.get(path);
}
exports.getSourceTask = getSourceTask;
/** Return true if `path` is a source file. */
function hasDirectoryTask(path) {
    const fullPath = path.complete;
    return directoryTasks.has(fullPath);
}
exports.hasDirectoryTask = hasDirectoryTask;
function createDirectoryTask(srcPath) {
    const fullPath = path_1.default.resolve(srcPath.complete);
    watchDirs.add(fullPath);
    const task = new DirectoryTask_1.DirectoryTask(srcPath);
    const taskList = directoryTasks.get(fullPath);
    if (taskList) {
        taskList.push(task);
    }
    else {
        directoryTasks.set(fullPath, [task]);
    }
    return task;
}
exports.createDirectoryTask = createDirectoryTask;
/** Return list of directory tasks which are observing the given path.

    Because DirectoryTasks can glob subdirectories, we can't know for sure whether
    a change to a directory will require a rebuild or not. This takes a conservative
    approach and assumes that any change at a given filesystem location will trigger
    a rebuild of all directory rules that encompass that location within it.
    @internal
*/
function getDirectoryTasks(dirPath) {
    const tasks = [];
    while (dirPath && dirPath !== '/') {
        const dirTasks = directoryTasks.get(dirPath);
        if (dirTasks) {
            // console.log(dirTasks);
            tasks.push(...dirTasks);
        }
        dirPath = path_1.default.dirname(dirPath);
    }
    return tasks;
}
exports.getDirectoryTasks = getDirectoryTasks;
/** Remove all cached source files, used for testing. */
function clearSourceTasks() {
    sourceTasks.clear();
    directoryTasks.clear();
}
exports.clearSourceTasks = clearSourceTasks;
/** @internal */
function getWatchDirs() {
    return rootPaths_1.rootPaths(Array.from(watchDirs));
}
exports.getWatchDirs = getWatchDirs;
