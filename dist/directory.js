"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.directory = void 0;
const Paths_1 = require("./Paths");
const DirectoryTask_1 = require("./DirectoryTask");
/** Create a task which reads a source file and returns a buffer. */
function directory(baseOrPath, fragment) {
    const srcPath = Paths_1.Path.from(baseOrPath, fragment);
    // TODO: stat - see if it's a dir
    return new DirectoryTask_1.DirectoryTask(srcPath);
}
exports.directory = directory;
