import { describe, beforeEach, test, expect } from 'vitest';
import path from 'path';
import { directory } from './directory';
import { clearSourceTasks } from './sourceInternal';

describe('directory', () => {
  beforeEach(() => {
    clearSourceTasks();
  });

  test('files()', async () => {
    const dir = directory(__dirname, '.');
    expect(dir.path.base).toBe(__dirname);
    expect(dir.path.fragment).toBe('.');

    const files = await dir.read();
    expect(files.length).toBeGreaterThan(5);
    const mainFile = files.find(path => path.filename === 'main.ts')!;
    expect(mainFile).not.toBeUndefined();
    expect(mainFile.base).toBe(__dirname);
    expect(mainFile.fragment).toBe('main.ts');
    expect(mainFile.complete).toBe(`${__dirname}/main.ts`);

    const tasks = dir.files();
    expect(tasks.length).toBeGreaterThan(5);
    const main = tasks.find(task => task.path.filename === 'main.ts')!;
    expect(main).not.toBeUndefined();
    expect(main.path.base).toBe(__dirname);
    expect(main.path.fragment).toBe('main.ts');
    expect(main.path.complete).toBe(`${__dirname}/main.ts`);
    expect(main.path.withBase('/a/b').complete).toBe('/a/b/main.ts');
  });

  test('relative files()', async () => {
    const parentDir = path.resolve(__dirname, '..');
    const dir = directory(parentDir, 'src');
    expect(dir.path.base).toBe(parentDir);
    expect(dir.path.fragment).toBe('src');
    expect(dir.path.filename).toBe('src');

    const files = await dir.read();
    expect(files.length).toBeGreaterThan(5);
    const mainFile = files.find(path => path.filename === 'main.ts')!;
    expect(mainFile).not.toBeUndefined();
    expect(mainFile.base).toBe(parentDir);
    expect(mainFile.fragment).toBe('src/main.ts');
    expect(mainFile.complete).toBe(`${parentDir}/src/main.ts`);

    const tasks = dir.files();
    expect(tasks.length).toBeGreaterThan(5);
    const main = tasks.find(task => task.path.filename === 'main.ts')!;
    expect(main).not.toBeUndefined();
    expect(main.path.base).toBe(parentDir);
    expect(main.path.fragment).toBe('src/main.ts');
    expect(main.path.complete).toBe(`${parentDir}/src/main.ts`);
    expect(main.path.withBase('/a/b').complete).toBe('/a/b/src/main.ts');

    const matches = dir.match('main.*');
    expect(matches.length).toBe(1);
    const mainMatch = matches.find(task => task.path.filename === 'main.ts')!;
    expect(mainMatch).not.toBeUndefined();
    expect(mainMatch.path.base).toBe(parentDir);
    expect(mainMatch.path.fragment).toBe('src/main.ts');
    expect(mainMatch.path.complete).toBe(`${parentDir}/src/main.ts`);
    expect(mainMatch.path.withBase('/a/b').complete).toBe('/a/b/src/main.ts');
  });

  test('path', async () => {
    const dir = directory('/a/b/c', 'd');
    expect(dir.path.complete).toBe('/a/b/c/d');
    expect(dir.path.withBase('/e/f').fragment).toBe('d');
    expect(dir.path.withBase('/e/f').complete).toBe('/e/f/d');
  });
});
