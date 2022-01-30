import { Path } from "./Path";
import { Task, WritableTask } from "./Task";

export interface TaskContructors {
  transform<In, Out>(source: Task<In>, transform: (input: In) => Promise<Out> | Out): Task<Out>;
  output(source: WritableTask, path: Path): Task<string | Buffer>;
}

/** Needed to avoid circular dependencies in ES modules. */
export const taskContructors: TaskContructors = {
  transform: null as any,
  output: null as any,
}
