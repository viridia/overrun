"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceDirectoryTask = void 0;
const Paths_1 = require("./Paths");
const AbstractTask_1 = require("./AbstractTask");
const SourceFileTask_1 = require("./SourceFileTask");
const TaskArray_1 = require("./TaskArray");
const fast_glob_1 = __importDefault(require("fast-glob"));
const path_1 = __importDefault(require("path"));
const sourceInternal_1 = require("./sourceInternal");
/** A task which reads the contents of a directory. */
class SourceDirectoryTask extends AbstractTask_1.AbstractTask {
    dirPath;
    constructor(dirPath) {
        super();
        this.dirPath = dirPath;
    }
    // No-op: we don't support recompilation based on directory changes.
    addDependent(dependent, dependencies) { }
    get path() {
        return this.dirPath;
    }
    /** Create a task for every file in the directory. */
    files() {
        return this.match('*');
    }
    /** Create a task for every file that matches the glob. */
    match(pattern) {
        const base = this.dirPath.basePath;
        const files = fast_glob_1.default.sync(path_1.default.join(this.dirPath.toString(), pattern), {
            cwd: base,
            onlyFiles: true,
            globstar: true,
        });
        return new TaskArray_1.TaskArray(files.map(file => {
            const task = new SourceFileTask_1.SourceFileTask(new Paths_1.Path(file, base));
            sourceInternal_1.addSource(task);
            return task;
        }), this.dirPath);
    }
    read() {
        const base = this.dirPath.basePath;
        return fast_glob_1.default(path_1.default.join(this.dirPath.toString(), '*'), {
            cwd: base,
            onlyFiles: true,
            globstar: true,
            dot: true,
        }).then(files => files.map(file => new Paths_1.Path(file, base)));
    }
}
exports.SourceDirectoryTask = SourceDirectoryTask;
