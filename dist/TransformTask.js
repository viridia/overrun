"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformTask = void 0;
const AbstractTask_1 = require("./AbstractTask");
/** A simplified transform task which accepts a synchronous transform function. */
class TransformTask extends AbstractTask_1.AbstractTask {
    source;
    transformer;
    /** Construct a new transform task.
        @param source The input to the transform.
        @param transformer A function which accepts an input value and returns an output
          value. This function will be called during the build, once the input data is ready.
     */
    constructor(source, transformer) {
        super();
        this.source = source;
        this.transformer = transformer;
    }
    addDependent(dependent, dependencies) {
        // For transforms, just add a dependency directly on the source.
        this.source.addDependent(dependent, dependencies);
    }
    get path() {
        return this.source.path;
    }
    read() {
        return this.source.read().then(data => this.transformer(data));
    }
}
exports.TransformTask = TransformTask;
