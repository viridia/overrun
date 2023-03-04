"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDirectoryDependency = exports.isFileDependency = void 0;
function isFileDependency(dep) {
    return typeof dep.getModTime === 'function';
}
exports.isFileDependency = isFileDependency;
function isDirectoryDependency(dep) {
    return typeof dep.getVersion === 'function';
}
exports.isDirectoryDependency = isDirectoryDependency;
