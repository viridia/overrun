import { Path } from './Paths';

describe('Path', () => {
  describe('no base path', () => {
    test('absolute', () => {
      const path = new Path('/home/work/index.html');
      expect(path.fullPath).toBe('/home/work/index.html');
      expect(path.ext).toBe('.html');
      expect(path.filename).toBe('index.html');
      expect(path.stem).toBe('index');
      expect(path.parentName).toBe('/home/work');
      expect(path.parent.toString()).toBe('/home/work');
      expect(path.parent.fullPath).toBe('/home/work');
      expect(path.toString()).toBe('/home/work/index.html');
    });

    test('relative', () => {
      const path = new Path('home/work/index.html');
      expect(path.fullPath).toBe('home/work/index.html');
      expect(path.ext).toBe('.html');
      expect(path.filename).toBe('index.html');
      expect(path.stem).toBe('index');
      expect(path.parentName).toBe('home/work');
      expect(path.parent.toString()).toBe('home/work');
      expect(path.parent.fullPath).toBe('home/work');
      expect(path.toString()).toBe('home/work/index.html');
    });

    test('.withFilename', () => {
      const path = new Path('/home/work/index.html').withFilename('assets');
      expect(path.fullPath).toBe('/home/work/assets.html');
      expect(path.toString()).toBe('/home/work/assets.html');
    });

    test('.withFilenameAndExt', () => {
      const path = new Path('/home/work/index.html').withFilenameAndExt('icon.svg');
      expect(path.fullPath).toBe('/home/work/icon.svg');
      expect(path.toString()).toBe('/home/work/icon.svg');
    });

    test('.withExtension', () => {
      const path = new Path('/home/work/index.html').withExtension('.png');
      expect(path.fullPath).toBe('/home/work/index.png');
      expect(path.toString()).toBe('/home/work/index.png');
    });
  });

  describe('with base path', () => {
    test('absolute', () => {
      const path = new Path('/work/index.html', '/home');
      expect(path.fullPath).toBe('/work/index.html');
      expect(path.ext).toBe('.html');
      expect(path.filename).toBe('index.html');
      expect(path.stem).toBe('index');
      expect(path.parentName).toBe('/work');
      expect(path.parent.toString()).toBe('/work');
      expect(path.parent.fullPath).toBe('/work');
    });

    test('relative', () => {
      const path = new Path('work/index.html', '/home');
      expect(path.fullPath).toBe('/home/work/index.html');
      expect(path.ext).toBe('.html');
      expect(path.filename).toBe('index.html');
      expect(path.stem).toBe('index');
      expect(path.parentName).toBe('work');
      expect(path.parent.toString()).toBe('work');
      expect(path.parent.fullPath).toBe('/home/work');
    });

    test('relative parent', () => {
      const path = new Path('../index.html', '/home/work');
      expect(path.fullPath).toBe('/home/index.html');
      expect(path.ext).toBe('.html');
      expect(path.filename).toBe('index.html');
      expect(path.stem).toBe('index');
      expect(path.parentName).toBe('..');
      expect(path.parent.toString()).toBe('..');
      expect(path.parent.fullPath).toBe('/home');
    });

    test('.withFilename', () => {
      const path = new Path('work/index.html', '/home').withFilename('assets');
      expect(path.fullPath).toBe('/home/work/assets.html');
      expect(path.toString()).toBe('work/assets.html');
    });

    test('.withFilenameAndExt', () => {
      const path = new Path('work/index.html', '/home').withFilenameAndExt('icon.svg');
      expect(path.fullPath).toBe('/home/work/icon.svg');
      expect(path.toString()).toBe('work/icon.svg');
    });

    test('.withExtension', () => {
      const path = new Path('work/index.html', '/home').withExtension('.png');
      expect(path.fullPath).toBe('/home/work/index.png');
      expect(path.toString()).toBe('work/index.png');
    });
  });

  test('.from', () => {
    expect(Path.from('/home/work/index.html').fullPath).toBe('/home/work/index.html');
    expect(Path.from('/home', 'work/index.html').fullPath).toBe('/home/work/index.html');
  });
});
