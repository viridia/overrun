"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWatchDirs = exports.getSource = exports.addSource = exports.isSource = exports.sources = void 0;
const path_1 = __importDefault(require("path"));
const rootPaths_1 = require("./rootPaths");
exports.sources = new Map();
const directories = new Set();
/** Return true if `path` is a source file. */
function isSource(path) {
    const fullPath = path.fullPath;
    return exports.sources.has(fullPath);
}
exports.isSource = isSource;
function addSource(task) {
    const srcPathFull = task.path.fullPath;
    exports.sources.set(srcPathFull, task);
    directories.add(path_1.default.dirname(srcPathFull));
}
exports.addSource = addSource;
/** Return true if `path` is a source file. */
function getSource(path) {
    return exports.sources.get(path);
}
exports.getSource = getSource;
function getWatchDirs() {
    return rootPaths_1.rootPaths(Array.from(directories));
}
exports.getWatchDirs = getWatchDirs;
