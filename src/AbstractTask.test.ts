import { describe, beforeEach, test, expect } from 'vitest';
import { AbstractTask } from './AbstractTask';
import { Path } from './Path';
import { SourceTask, Task } from './Task';
import './TransformTask';
import './OutputFileTask';

export class MockTask extends AbstractTask<string> {
  constructor(public readonly path: Path) {
    super();
  }

  public addDependent(dependent: Task<unknown>, dependencies: Set<SourceTask>): void {}

  /** Return the output of the task. */
  public read(): Promise<string> {
    return Promise.resolve('test');
  }
}

describe('AbstractTask', () => {
  let task: MockTask;

  beforeEach(() => {
    task = new MockTask(Path.from('/a/b', 'c'));
  });

  test('path', async () => {
    expect(task.path.base).toBe('/a/b');
    expect(task.path.fragment).toBe('c');
  });

  test('read()', async () => {
    expect(task.read()).resolves.toBe('test');
  });

  test('transform', async () => {
    const transform = task.transform(s => s.toUpperCase());
    expect(transform.path.base).toBe('/a/b');
    expect(transform.path.fragment).toBe('c');
    expect(transform.read()).resolves.toBe('TEST');
  });

  test('dest', async () => {
    const output = task.dest('/f', null);
    expect(output.path.base).toBe('/f');
    expect(output.path.fragment).toBe('c');

    expect(task.dest('/c').path.complete).toBe('/c');
    expect(task.dest(path => path.withFragment('x')).path.complete).toBe('/a/b/x');
  });
});
