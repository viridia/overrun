"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.directory = void 0;
const Paths_1 = require("./Paths");
const SourceDirectoryTask_1 = require("./SourceDirectoryTask");
/** Create a task which reads a source file and returns a buffer. */
function directory(baseOrPath, relPath) {
    const srcPath = Paths_1.Path.from(baseOrPath, relPath);
    // TODO: stat - see if it's a dir
    return new SourceDirectoryTask_1.SourceDirectoryTask(srcPath);
}
exports.directory = directory;
