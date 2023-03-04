/// <reference types="node" />
import { Path } from './Path';
import { Task, WritableData } from './Task';
export interface TaskContructors {
    transform<In, Out>(source: Task<In>, transform: (input: In) => Promise<Out> | Out): Task<Out>;
    output(source: Task<WritableData>, path: Path): Task<string | Buffer>;
}
/** Needed to avoid circular dependencies in ES modules. */
export declare const taskContructors: TaskContructors;
