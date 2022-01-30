"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.output = void 0;
const Path_1 = require("./Path");
const OutputFileTask_1 = require("./OutputFileTask");
function combinePaths(src, options) {
    if (!options) {
        return src;
    }
    else if (typeof options.base === 'string' && typeof options.path === 'string') {
        return Path_1.Path.from(options.base, options.path);
    }
    else if (options.path) {
        return Path_1.Path.from(options.path);
    }
    else if (typeof options.base === 'string') {
        return src.withBase(options.base);
    }
    else if (options.base) {
        return src.withBase(options.base);
    }
    else {
        return src;
    }
}
function output(options) {
    return (source) => {
        if (Array.isArray(source)) {
            return source.map(s => new OutputFileTask_1.OutputFileTask(s, combinePaths(s.path, options)));
        }
        else {
            return new OutputFileTask_1.OutputFileTask(source, combinePaths(source.path, options));
        }
    };
}
exports.output = output;
