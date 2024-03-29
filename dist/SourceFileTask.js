"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceFileTask = void 0;
const AbstractTask_1 = require("./AbstractTask");
const promises_1 = require("fs/promises");
const errors_1 = require("./errors");
/** A task which reads a source file and returns a buffer. */
class SourceFileTask extends AbstractTask_1.AbstractTask {
    path;
    modTime = null;
    stats;
    constructor(path, stats) {
        super();
        this.path = path;
        if (stats) {
            this.stats = Promise.resolve(stats);
        }
    }
    dispose() {
        // this.dependants.clear();
    }
    addDependencies(trackingSet) {
        trackingSet.add(this);
    }
    /** Return the modification date of this source file. */
    getModTime() {
        return this.prep().then(st => st.mtime);
    }
    /** Used when we detect the file has been modified. */
    updateModTime(modTime) {
        this.modTime = modTime;
    }
    /** Return the output of the task. */
    read() {
        return this.prep().then(() => this.readFile());
    }
    /** Used when we detect the file is modified.
        @internal
    */
    updateStats(stats) {
        this.stats = Promise.resolve(stats);
    }
    prep() {
        const srcPath = this.path.complete;
        if (!this.stats) {
            this.stats = promises_1.stat(srcPath).then(st => {
                if (!st.isFile()) {
                    throw new errors_1.BuildError(`'${srcPath}' is not a regular file.`);
                }
                return st;
            }, err => {
                if (err.code === 'ENOENT') {
                    throw new errors_1.BuildError(`Input file '${srcPath}' not found.`);
                }
                throw err;
            });
        }
        return this.stats;
    }
    async readFile() {
        const srcPath = this.path.complete;
        try {
            const fh = await promises_1.open(srcPath, 'r', 0o666);
            const buffer = fh.readFile();
            fh.close();
            return buffer;
        }
        catch (e) {
            if (e.code === 'ENOENT') {
                throw new errors_1.BuildError(`Input file '${srcPath}' not found.`);
            }
            console.error(e);
            throw e;
        }
    }
}
exports.SourceFileTask = SourceFileTask;
