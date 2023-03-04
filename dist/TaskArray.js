"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskArray = void 0;
const AbstractTask_1 = require("./AbstractTask");
const ctors_1 = require("./ctors");
/** Represents an array of tasks. These are usually created when operating on collections of
    source files.

    The `transform()` and `pipe()` methods operate on the entire collection of tasks. To
    process tasks individually, use the `map()` or `reduce()` methods.
 */
class TaskArray extends AbstractTask_1.AbstractTask {
    entries;
    factory;
    path;
    dependsOn;
    cachedTasks = new Map();
    version = -1;
    constructor(entries, factory, path, dependsOn) {
        super();
        this.entries = entries;
        this.factory = factory;
        this.path = path;
        this.dependsOn = dependsOn;
    }
    addDependencies(out) {
        if (this.dependsOn) {
            out.add(this.dependsOn);
        }
        this.sources.forEach(src => src.addDependencies(out));
    }
    /** The array of tasks contained in this `TaskArray`. */
    items() {
        return this.sources;
    }
    read() {
        return Promise.resolve(this.sources);
    }
    /** Works like Array.map(), except that the elements are tasks.
        @param fn A transform which is applied to each task in the task array.
        @returns A `TaskArray` containing the transformed task outputs.
     */
    map(fn) {
        return new TaskArray(() => this.sources, fn, this.path, this.dependsOn);
    }
    getName() {
        return this.path.fragment;
    }
    /** Returns the number of tasks in this `TaskArray`. */
    get length() {
        return this.sources.length;
    }
    /** Find a task by some predicate. */
    find(predicate) {
        return this.sources.find(predicate);
    }
    /** Combine the output of all the tasks in the task array into a single data structure.
        The reducer function operates much like `Array.reduce()` except that it is asynchronous.
        @param init The initial value before any reductions.
        @param reducer Function which combines the accumulated value with new values.
        @returns A new Task which produces the combined output of the reduction.
    */
    reduce(init, reducer) {
        return ctors_1.taskContructors.transform(this, async () => {
            let result = init;
            for (let task of this.sources) {
                result = await Promise.resolve(reducer(result, task));
            }
            return result;
        });
    }
    async gatherOutOfDate(force) {
        return (await Promise.all(this.sources.map(src => src.gatherOutOfDate(force)))).flat();
    }
    // Lazily comput the list of sources. This may change in cases where a new file was
    // added to a source directory.
    get sources() {
        let modified = false;
        if (this.dependsOn) {
            const version = this.dependsOn.getVersion();
            if (version > this.version) {
                this.version = version;
                modified = true;
            }
        }
        else {
            modified = true;
        }
        if (modified) {
            // Recompute the list of tasks from the entries.
            // Keep the list the same as much as possible.
            const entries = this.entries();
            const tasksToDelete = new Set(this.cachedTasks.keys());
            for (const entry of entries) {
                tasksToDelete.delete(entry);
                if (!this.cachedTasks.has(entry)) {
                    this.cachedTasks.set(entry, this.factory(entry));
                }
            }
            for (const entry of tasksToDelete) {
                this.cachedTasks.delete(entry);
            }
        }
        return Array.from(this.cachedTasks.values());
    }
}
exports.TaskArray = TaskArray;
