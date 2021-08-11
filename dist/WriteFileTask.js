"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WriteFileTask = void 0;
const promises_1 = require("fs/promises");
const Paths_1 = require("./Paths");
const source_1 = require("./source");
const errors_1 = require("./errors");
const AbstractTask_1 = require("./AbstractTask");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
const mkdir = util_1.default.promisify(fs_1.default.mkdir);
const exists = util_1.default.promisify(fs_1.default.exists);
/** A task which reads a source file and returns a buffer. */
class WriteFileTask extends AbstractTask_1.AbstractTask {
    source;
    filePath;
    dependencies = new Set();
    constructor(source, options) {
        super();
        this.source = source;
        source.addDependent(this, this.dependencies);
        if (options?.path) {
            if (typeof options.path === 'string') {
                this.filePath = new Paths_1.Path(options.path, options?.base);
            }
            else if (options.base) {
                this.filePath = options.path.withBase(options.base);
            }
            else {
                this.filePath = options.path;
            }
        }
        else if (options?.base && this.source.path) {
            this.filePath = this.source.path.withBase(options.base);
        }
        else if (this.source.path) {
            this.filePath = this.source.path;
        }
        else {
            throw new errors_1.BuildError('Write task must specify an output path.');
        }
    }
    get path() {
        return this.filePath;
    }
    getName() {
        return (this.path ?? this.source.path).toString();
    }
    /** Add a task as a dependent of this task. */
    addDependent(dependent, dependencies) {
        this.source.addDependent(dependent, dependencies);
    }
    /** True if any sources of this file are newer than the file. */
    get isModified() {
        return false;
        // return this.dependencies.s
    }
    /** Return a conduit containing the file path, which lazily reads the file. */
    read() {
        return this.source.read();
    }
    /** Run all tasks and generate the file. */
    async build(options) {
        // Don't allow overwriting of source files.
        const fullPath = this.filePath.fullPath;
        if (source_1.isSource(this.filePath)) {
            throw new errors_1.BuildError(`Cannot overwrite source file '${fullPath}'.`);
        }
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
            console.log(`Wrote ${this.filePath.toString()}: ${buffer.length}`);
            // TODO: get new modification time.
        }
        // console.log(`${c.greenBright('Wrote')}: ${this.filePath.toString()}`);
    }
}
exports.WriteFileTask = WriteFileTask;
