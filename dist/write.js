"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.write = void 0;
const WriteFileTask_1 = require("./WriteFileTask");
function write(options) {
    return (source) => {
        if (Array.isArray(source)) {
            return source.map(s => new WriteFileTask_1.WriteFileTask(s, options));
        }
        else {
            return new WriteFileTask_1.WriteFileTask(source, options);
        }
    };
}
exports.write = write;
