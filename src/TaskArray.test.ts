import { describe, test, expect, beforeEach } from 'vitest';
import { TaskArray } from './TaskArray';
import { Path } from './Path';
import { AbstractTask } from './AbstractTask';
import type { SourceTask, Task } from './Task';
import './TransformTask';

/** A task which simply produces a constant value. */
export class ConstantValueTask extends AbstractTask<string> {
  private readonly dependants = new Set<Task<unknown>>();

  constructor(private value: string, public readonly path: Path) {
    super();
  }

  public addDependent(dependent: Task<unknown>, dependencies: Set<SourceTask>): void {
    this.dependants.add(dependent);
    // dependencies.add(this);
  }

  /** Return the output of the task. */
  public async read(): Promise<string> {
    return this.value;
  }
}

describe('TaskArray', () => {
  let files: string[] = [];

  beforeEach(() => {
    files = ['one', 'two', 'three'];
  });

  test('basic', () => {
    const ta = new TaskArray(
      () => files,
      a => new ConstantValueTask(a, Path.from('xx', a)),
      Path.from('yy')
    );
    expect(ta.length).toBe(3);
    expect(ta.items()).toHaveLength(3);
    expect(ta.read()).resolves.toHaveLength(3);

    expect(
      ta.read().then(tasks => {
        return Promise.all(tasks.map(t => t.read()));
      })
    ).resolves.toEqual(['one', 'two', 'three']);
  });

  test('.map()', () => {
    const ta = new TaskArray(
      () => files,
      a => new ConstantValueTask(a, Path.from('xx', a)),
      Path.from('yy')
    );

    const mapTask = ta.map(input => input.transform(str => `${str}some`));
    expect(
      mapTask.read().then(tasks => {
        return Promise.all(tasks.map(t => t.read()));
      })
    ).resolves.toEqual(['onesome', 'twosome', 'threesome']);
  });

  test('.reduce()', () => {
    const ta = new TaskArray(
      () => files,
      a => new ConstantValueTask(a, Path.from('xx', a)),
      Path.from('yy')
    );

    const reduceTask = ta.reduce('', async (acc, out) => `${acc}, ${await out.read()}`);

    expect(reduceTask.read()).resolves.toEqual(', one, two, three');
  });

  describe('should recompute generated tasks when array of inputs changes', () => {
    test('basic', () => {
      const ta = new TaskArray(
        () => files,
        a => new ConstantValueTask(a, Path.from('xx', a)),
        Path.from('yy')
      );
      expect(ta.length).toBe(3);

      files.push('four');
      ta.setInputsModified();

      expect(ta.length).toBe(4);
      expect(ta.items()).toHaveLength(4);
      expect(ta.read()).resolves.toHaveLength(4);

      expect(
        ta.read().then(tasks => {
          return Promise.all(tasks.map(t => t.read()));
        })
      ).resolves.toEqual(['one', 'two', 'three', 'four']);
    });

    test('.map()', () => {
      const ta = new TaskArray(
        () => files,
        a => new ConstantValueTask(a, Path.from('xx', a)),
        Path.from('yy')
      );
      const mapTask = ta.map(input => input.transform(str => `${str}some`));
      expect(ta.length).toBe(3);

      files.push('four');
      ta.setInputsModified();

      expect(
        mapTask.read().then(tasks => {
          return Promise.all(tasks.map(t => t.read()));
        })
      ).resolves.toEqual(['onesome', 'twosome', 'threesome', 'foursome']);
    });

    test('.reduce()', () => {
      const ta = new TaskArray(
        () => files,
        a => new ConstantValueTask(a, Path.from('xx', a)),
        Path.from('yy')
      );
      const reduceTask = ta.reduce('', async (acc, out) => `${acc}, ${await out.read()}`);
      expect(ta.length).toBe(3);

      files.push('four');
      ta.setInputsModified();

      expect(reduceTask.read()).resolves.toEqual(', one, two, three, four');
    });
  });
});
