"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.source = void 0;
const Paths_1 = require("./Paths");
const SourceFileTask_1 = require("./SourceFileTask");
const sourceInternal_1 = require("./sourceInternal");
/** Create a task which reads a source file and returns a buffer. */
function source(baseOrFile, relPath) {
    const srcPath = Paths_1.Path.from(baseOrFile, relPath);
    const srcPathFull = srcPath.fullPath;
    const task = sourceInternal_1.sources.get(srcPathFull);
    if (task) {
        return task;
    }
    const rfTask = new SourceFileTask_1.SourceFileTask(srcPath);
    sourceInternal_1.addSource(rfTask);
    return rfTask;
}
exports.source = source;
