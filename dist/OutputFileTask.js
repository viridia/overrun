"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputFileTask = void 0;
const fs_1 = __importDefault(require("fs"));
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("util"));
const AbstractTask_1 = require("./AbstractTask");
const ctors_1 = require("./ctors");
const debug_1 = require("./debug");
const errors_1 = require("./errors");
const sourceInternal_1 = require("./sourceInternal");
const Task_1 = require("./Task");
const version_1 = require("./version");
const mkdir = util_1.default.promisify(fs_1.default.mkdir);
const exists = util_1.default.promisify(fs_1.default.exists);
/** A task which writes to an output file. */
class OutputFileTask extends AbstractTask_1.AbstractTask {
    source;
    path;
    dependencies = new Set();
    stats;
    version;
    /** Construct a new {@link OutputFileTask}.
        @param source The input task that provides the data to output.
        @param path The location of where to write the data.
     */
    constructor(source, path) {
        super();
        this.source = source;
        this.path = path;
        source.addDependencies(this.dependencies);
        this.version = Math.max(0, ...Array.from(this.dependencies).map(dep => Task_1.isDirectoryDependency(dep) ? dep.getVersion() : 0));
    }
    getName() {
        return (this.path ?? this.source.path).fragment;
    }
    /** Add a task as a dependent of this task. */
    addDependencies(out) {
        this.source.addDependencies(out);
    }
    /** True if any sources of this file are newer than the file.
        @internal
    */
    async isModified() {
        const stats = await this.getStats();
        if (stats === null) {
            return true;
        }
        else {
            for (const dep of this.dependencies) {
                if (Task_1.isFileDependency(dep)) {
                    const depTime = await dep.getModTime();
                    if (depTime > stats.mtime) {
                        debug_1.log(`Rebuilding ${this.path.full} because source file ${dep.path.full} is newer.`);
                        return true;
                    }
                }
                else if (Task_1.isDirectoryDependency(dep)) {
                    if (this.version < dep.getVersion()) {
                        debug_1.log(`Rebuilding ${this.path.full} because directory ${dep.path.full} changed.`);
                        return true;
                    }
                }
            }
            return false;
        }
    }
    /** Return a conduit containing the file path, which lazily reads the file. */
    read() {
        return this.source.read();
    }
    async gatherOutOfDate(force) {
        if (force || (await this.isModified())) {
            return [this];
        }
        return [];
    }
    /** Run all tasks and generate the file. */
    async build(options) {
        // Don't allow overwriting of source files.
        const fullPath = this.path.complete;
        if (sourceInternal_1.hasSourceTask(this.path)) {
            throw new errors_1.BuildError(`Cannot overwrite source file '${fullPath}'.`);
        }
        this.version = version_1.currentVersion();
        // Ensure output directory exists.
        if (options.dryRun) {
            await this.source.read();
        }
        else {
            const dirPath = path_1.default.dirname(fullPath);
            const dirPathExists = await exists(dirPath);
            if (!dirPathExists) {
                await mkdir(dirPath, { recursive: true });
            }
            // Write the file.
            const buffer = await this.source.read();
            const fh = await promises_1.open(fullPath, 'w', 0o666);
            await fh.writeFile(buffer);
            await fh.close();
            this.stats = undefined;
            // console.log(` - ${c.greenBright('Wrote')}: ${this.filePath.toString()} - ${buffer.length} bytes.`);
            // TODO: get new modification time.
        }
    }
    /** @internal */
    getStats() {
        const srcPath = this.path.complete;
        if (this.stats === undefined) {
            this.stats = promises_1.stat(srcPath).then(st => {
                if (!st.isFile()) {
                    throw new errors_1.BuildError(`'${srcPath}' is not a regular file.`);
                }
                return st;
            }, err => {
                if (err.code === 'ENOENT') {
                    return null;
                }
                throw err;
            });
        }
        return this.stats;
    }
}
exports.OutputFileTask = OutputFileTask;
ctors_1.taskContructors.output = (source, path) => new OutputFileTask(source, path);
