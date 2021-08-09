import { Path } from "./Paths";

describe('FilePath', () => {
  test('constructor', () => {
    const path = new Path('/home/work/index.html');
    expect(path.ext).toBe('.html');
    expect(path.filename).toBe('index.html');
    expect(path.basename).toBe('index');
    expect(path.parentName).toBe('/home/work');
    expect(path.parent.toString()).toBe('/home/work');
  });

  test('withFilename', () => {
    const path = new Path('/home/work/index.html');
    expect(path.withFilename('icon.svg').toString()).toBe('/home/work/icon.svg');
  });

  test('withBasename', () => {
    const path = new Path('/home/work/index.html');
    expect(path.withFilenameAndExt('assets').toString()).toBe('/home/work/assets.html');
  });

  test('withExtension', () => {
    const path = new Path('/home/work/index.html');
    expect(path.withExtension('.png').toString()).toBe('/home/work/index.png');
  });
});
