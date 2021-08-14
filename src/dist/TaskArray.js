"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskArray = void 0;
const AbstractTask_1 = require("./AbstractTask");
/** Represents an array of tasks. These are usually created when operating on collections of
    source files.
 */
class TaskArray extends AbstractTask_1.AbstractTask {
    sources;
    dirPath;
    constructor(sources, dirPath) {
        super();
        this.sources = sources;
        this.dirPath = dirPath;
    }
    addDependent(dependent, dependencies) {
        this.sources.forEach(src => src.addDependent(dependent, dependencies));
    }
    get path() {
        return this.dirPath;
    }
    items() {
        return this.sources;
    }
    read() {
        return Promise.resolve(this.sources);
    }
    /** Works like Array.map(), except that the elements are tasks. */
    map(fn) {
        return new TaskArray(this.sources.map(fn), this.dirPath);
    }
    /** Returns the number of tasks. */
    get length() {
        return this.sources.length;
    }
    /** Find a task by some predicate. */
    find(predicate) {
        return this.sources.find(predicate);
    }
    /** Reduce the list of tasks to a single task by combining them.
        @param init The initial value before any reductions.
        @param reducer Function which combines the accumulated value with new values.
    */
    reduce(init, reducer) {
        return new AbstractTask_1.TransformTask(this, async () => {
            let result = init;
            for (let task of this.sources) {
                result = await Promise.resolve(reducer(result, task));
            }
            return result;
        });
    }
}
exports.TaskArray = TaskArray;
