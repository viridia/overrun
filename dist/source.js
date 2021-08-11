"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSource = exports.source = void 0;
const path_1 = __importDefault(require("path"));
const Paths_1 = require("./Paths");
const SourceFileTask_1 = require("./SourceFileTask");
const sources = new Map();
const directories = new Set();
/** Create a task which reads a source file and returns a buffer. */
function source(baseOrFile, relPath) {
    const srcPath = Paths_1.Path.from(baseOrFile, relPath);
    const srcPathFull = srcPath.fullPath;
    const task = sources.get(srcPathFull);
    if (task) {
        return task;
    }
    const rfTask = new SourceFileTask_1.SourceFileTask(srcPath);
    sources.set(srcPathFull, rfTask);
    directories.add(path_1.default.dirname(srcPathFull));
    return rfTask;
}
exports.source = source;
/** Return true if `path` is a source file. */
function isSource(path) {
    const fullPath = path.fullPath;
    return sources.has(fullPath);
}
exports.isSource = isSource;
