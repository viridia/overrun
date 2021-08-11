import path from "path";
import { directory } from "./directory";

describe('directory', () => {
  test('files()', async () => {
    const dir = directory(__dirname, '.');
    const files = await dir.read();
    expect(files.some(path => path.filename === 'main.ts')).toBe(true);
    expect(files.some(path => path.filename === 'niam.ts')).toBe(false);

    const tasks = dir.files();
    expect(tasks.length).toBeGreaterThan(0);
    const main = tasks.find(task => task.path!.filename === 'main.ts');
    expect(main).not.toBeUndefined();
    expect(main!.path!.withBase('/a/b').fullPath).toBe('/a/b/main.ts');
  });

  test('relative files()', async () => {
    const parentDir = path.resolve(__dirname, '..');
    const dir = directory(parentDir, 'src');
    const files = await dir.read();
    expect(dir.path.filename).toBe('src');
    expect(files.some(path => path.toString() === 'src/main.ts')).toBe(true);

    const tasks = dir.files();
    expect(tasks.length).toBeGreaterThan(0);
    const main = tasks.find(task => task.path!.toString() === 'src/main.ts');
    expect(main).not.toBeUndefined();
    expect(main!.path!.withBase('/a/b').fullPath).toBe('/a/b/src/main.ts');
  });

  test('path', async () => {
    const dir = directory('/a/b/c', 'd');
    expect(dir.path.fullPath).toBe('/a/b/c/d');
    expect(dir.path.withBase('/e/f').toString()).toBe('d');
    expect(dir.path.withBase('/e/f').fullPath).toBe('/e/f/d');
  });
});
