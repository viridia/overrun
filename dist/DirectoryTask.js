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
const version_1 = require("./version");
/** A task which reads the contents of a directory. */
class DirectoryTask extends AbstractTask_1.AbstractTask {
    path;
    version = version_1.currentVersion();
    constructor(path) {
        super();
        this.path = path;
    }
    addDependencies(dependencies) {
        dependencies.add(this);
    }
    /** Create a task for every file in the directory. */
    files() {
        return this.match('*');
    }
    /** Create a task for every file that matches the glob. */
    match(pattern) {
        const base = this.path.base;
        return new TaskArray_1.TaskArray(() => fast_glob_1.default.sync(path_1.default.join(this.path.fragment, pattern), {
            cwd: base && path_1.default.resolve(base),
            onlyFiles: true,
            globstar: true,
        }), file => sourceInternal_1.getOrCreateSourceTask(Path_1.Path.from(base, file)), this.path, this);
    }
    getVersion() {
        return this.version;
    }
    bumpVersion() {
        this.version = version_1.nextVersion();
    }
    async read() {
        const base = this.path.base;
        const files = await fast_glob_1.default(path_1.default.join(this.path.fragment, '*'), {
            cwd: base && path_1.default.resolve(base),
            onlyFiles: true,
            globstar: true,
            dot: true,
        });
        return files.map(file => {
            return Path_1.Path.from(base, file);
        });
    }
}
exports.DirectoryTask = DirectoryTask;
