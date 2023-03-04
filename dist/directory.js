"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.directory = void 0;
const Path_1 = require("./Path");
const sourceInternal_1 = require("./sourceInternal");
/** Create a task which reads a source file and returns a buffer. */
function directory(rootOrPath, fragment) {
    const srcPath = Path_1.Path.from(rootOrPath, fragment);
    // TODO: stat - see if it's a dir
    return sourceInternal_1.createDirectoryTask(srcPath);
}
exports.directory = directory;
