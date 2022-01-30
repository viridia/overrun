"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectoryTask = void 0;
const fast_glob_1 = __importDefault(require("fast-glob"));
const path_1 = __importDefault(require("path"));
const AbstractTask_1 = require("./AbstractTask");
const Path_1 = require("./Path");
const sourceInternal_1 = require("./sourceInternal");
const TaskArray_1 = require("./TaskArray");
/** A task which reads the contents of a directory. */
class DirectoryTask extends AbstractTask_1.AbstractTask {
    path;
    constructor(path) {
        super();
        this.path = path;
    }
    // No-op: we don't support recompilation based on directory changes.
    addDependent(dependent, dependencies) { }
    /** Create a task for every file in the directory. */
    files() {
        return this.match('*');
    }
    /** Create a task for every file that matches the glob. */
    match(pattern) {
        const base = this.path.base;
        const files = fast_glob_1.default.sync(path_1.default.join(this.path.fragment, pattern), {
            cwd: base && path_1.default.resolve(base),
            onlyFiles: true,
            globstar: true,
        });
        return new TaskArray_1.TaskArray(files.map(file => {
            return sourceInternal_1.getOrCreateSourceTask(Path_1.Path.from(base, file));
        }), this.path);
    }
    read() {
        const base = this.path.base;
        return fast_glob_1.default(path_1.default.join(this.path.fragment, '*'), {
            cwd: base && path_1.default.resolve(base),
            onlyFiles: true,
            globstar: true,
            dot: true,
        }).then(files => files.map(file => {
            return Path_1.Path.from(base, file);
        }));
    }
}
exports.DirectoryTask = DirectoryTask;
