"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformTask = exports.AbstractTask = void 0;
/** An abstract base class useful for defining custom tasks. It implements most of the methods
    of the `Task` interface.
 */
class AbstractTask {
    /** Transform the output of this task through a function.
        @param transform A function which accepts the input type and returns the output type.
        @returns A new Task which transforms the output when run.
    */
    transform(transform) {
        return new TransformTask(this, transform);
    }
    /** Pipe the output of this task through another task.
        @param taskGen A function which creates a task, given a reference to this task.
        @returns A new Task which transforms the output when run.
    */
    pipe(taskGen) {
        return taskGen(this);
    }
}
exports.AbstractTask = AbstractTask;
/** A simplified transform task which accepts a synchronous transform function. */
class TransformTask extends AbstractTask {
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
