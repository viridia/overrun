"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractTask = void 0;
const ctors_1 = require("./ctors");
/** An abstract base class useful for defining custom tasks. It implements most of the methods
    of the {@link Task} interface.
 */
class AbstractTask {
    transform(transform) {
        return ctors_1.taskContructors.transform(this, transform);
    }
    pipe(taskGen) {
        return taskGen(this);
    }
    dest(baseOrPath, fragment) {
        return ctors_1.taskContructors.output(this, this.path.compose(baseOrPath, fragment));
    }
}
exports.AbstractTask = AbstractTask;
