"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.source = void 0;
const Path_1 = require("./Path");
const sourceInternal_1 = require("./sourceInternal");
/** Create a task which reads a source file and returns a buffer. */
function source(baseOrFile, fragment) {
    const srcPath = Path_1.Path.from(baseOrFile, fragment);
    const srcPathFull = srcPath.complete;
    const task = sourceInternal_1.sources.get(srcPathFull);
    if (task) {
        return task;
    }
    return sourceInternal_1.getOrCreateSourceTask(srcPath);
}
exports.source = source;
