"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWatchDirs = exports.clearSources = exports.getSource = exports.getOrCreateSourceTask = exports.isSource = exports.sources = void 0;
const path_1 = __importDefault(require("path"));
const rootPaths_1 = require("./rootPaths");
const SourceFileTask_1 = require("./SourceFileTask");
exports.sources = new Map();
const directories = new Set();
/** Return true if `path` is a source file. */
function isSource(path) {
    const fullPath = path.complete;
    return exports.sources.has(fullPath);
}
exports.isSource = isSource;
// TODO: This has a bug: source files might have different base/fragment combos.
function getOrCreateSourceTask(srcPath) {
    const srcPathFull = srcPath.complete;
    let srcTask = exports.sources.get(srcPathFull);
    if (!srcTask) {
        srcTask = new SourceFileTask_1.SourceFileTask(srcPath);
        directories.add(path_1.default.dirname(srcPathFull));
        exports.sources.set(srcPathFull, srcTask);
    }
    return srcTask;
}
exports.getOrCreateSourceTask = getOrCreateSourceTask;
/** Return the cached source file.
    @internal
*/
function getSource(path) {
    return exports.sources.get(path);
}
exports.getSource = getSource;
/** Remove all cached source files, used for testing. */
function clearSources() {
    exports.sources.clear();
}
exports.clearSources = clearSources;
/** @internal */
function getWatchDirs() {
    return rootPaths_1.rootPaths(Array.from(directories));
}
exports.getWatchDirs = getWatchDirs;
