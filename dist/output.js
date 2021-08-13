"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.output = void 0;
const OutputFileTask_1 = require("./OutputFileTask");
function output(options) {
    return (source) => {
        if (Array.isArray(source)) {
            return source.map(s => new OutputFileTask_1.OutputFileTask(s, options));
        }
        else {
            return new OutputFileTask_1.OutputFileTask(source, options);
        }
    };
}
exports.output = output;
