import { Task } from './Task';
import { TaskArray } from './TaskArray';

/** Pipe the output through several downstream tasks in parallel.
    @param taskGens An array of functions which generate tasks.
    @returns A TaskArray representing all of the .
  */
export function tee<In, Out, Dependant extends Task<Out>>(
  taskGens: ReadonlyArray<(input: Task<In>) => Dependant>
): (input: Task<In>) => TaskArray<Task<Out>> {
  return input =>
    new TaskArray(
      taskGens.map(t => t(input)),
      input.path
    );
}
