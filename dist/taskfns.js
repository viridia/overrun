"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tee = void 0;
const TaskArray_1 = require("./TaskArray");
/** Pipe the output through several downstream tasks in parallel.
    @param taskGens An array of functions which generate tasks.
    @returns A TaskArray representing all of the .
  */
function tee(taskGens) {
    return input => new TaskArray_1.TaskArray(taskGens.map(t => t(input)), input.path);
}
exports.tee = tee;
