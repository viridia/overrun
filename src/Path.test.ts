import { Path } from './Path';

describe('Path', () => {
  describe('no base path', () => {
    test('absolute', () => {
      const path = new Path('/home/work/index.html');
      expect(path.complete).toBe('/home/work/index.html');
      expect(path.ext).toBe('.html');
      expect(path.filename).toBe('index.html');
      expect(path.stem).toBe('index');
      expect(path.parentName).toBe('/home/work');
      expect(path.parent.fragment).toBe('/home/work');
      expect(path.parent.complete).toBe('/home/work');
      expect(path.fragment).toBe('/home/work/index.html');
    });

    test('relative', () => {
      const path = new Path('home/work/index.html');
      expect(path.complete).toBe('home/work/index.html');
      expect(path.ext).toBe('.html');
      expect(path.filename).toBe('index.html');
      expect(path.stem).toBe('index');
      expect(path.parentName).toBe('home/work');
      expect(path.parent.fragment).toBe('home/work');
      expect(path.parent.complete).toBe('home/work');
      expect(path.fragment).toBe('home/work/index.html');
    });

    test('.withFilename', () => {
      const path = new Path('/home/work/index.html').withStem('assets');
      expect(path.complete).toBe('/home/work/assets.html');
      expect(path.fragment).toBe('/home/work/assets.html');
    });

    test('.withFilenameAndExt', () => {
      const path = new Path('/home/work/index.html').withFilename('icon.svg');
      expect(path.complete).toBe('/home/work/icon.svg');
      expect(path.fragment).toBe('/home/work/icon.svg');
    });

    test('.withExtension', () => {
      const path = new Path('/home/work/index.html').withExtension('.png');
      expect(path.complete).toBe('/home/work/index.png');
      expect(path.fragment).toBe('/home/work/index.png');
    });
  });

  describe('with base path', () => {
    test('absolute', () => {
      const path = new Path('/work/index.html', '/home');
      expect(path.complete).toBe('/work/index.html');
      expect(path.ext).toBe('.html');
      expect(path.filename).toBe('index.html');
      expect(path.stem).toBe('index');
      expect(path.parentName).toBe('/work');
      expect(path.parent.fragment).toBe('/work');
      expect(path.parent.complete).toBe('/work');
    });

    test('relative', () => {
      const path = new Path('work/index.html', '/home');
      expect(path.complete).toBe('/home/work/index.html');
      expect(path.ext).toBe('.html');
      expect(path.filename).toBe('index.html');
      expect(path.stem).toBe('index');
      expect(path.parentName).toBe('work');
      expect(path.parent.fragment).toBe('work');
      expect(path.parent.complete).toBe('/home/work');
    });

    test('relative parent', () => {
      const path = new Path('../index.html', '/home/work');
      expect(path.complete).toBe('/home/index.html');
      expect(path.ext).toBe('.html');
      expect(path.filename).toBe('index.html');
      expect(path.stem).toBe('index');
      expect(path.parentName).toBe('..');
      expect(path.parent.fragment).toBe('..');
      expect(path.parent.complete).toBe('/home');
    });

    test('.withFilename', () => {
      const path = new Path('work/index.html', '/home').withStem('assets');
      expect(path.complete).toBe('/home/work/assets.html');
      expect(path.fragment).toBe('work/assets.html');
    });

    test('.withFilenameAndExt', () => {
      const path = new Path('work/index.html', '/home').withFilename('icon.svg');
      expect(path.complete).toBe('/home/work/icon.svg');
      expect(path.fragment).toBe('work/icon.svg');
    });

    test('.withExtension', () => {
      const path = new Path('work/index.html', '/home').withExtension('.png');
      expect(path.complete).toBe('/home/work/index.png');
      expect(path.fragment).toBe('work/index.png');
    });

    test('.withFragment', () => {
      const path = new Path('work/index.html', '/home').withFragment('play/icon.svg');
      expect(path.complete).toBe('/home/play/icon.svg');
      expect(path.fragment).toBe('play/icon.svg');
    });

    test('.compose', () => {
      const path = new Path('work/index.html', '/home');
      expect(path.compose('/office/foo.txt').complete).toBe('/office/foo.txt');
      expect(path.compose('/office', null).complete).toBe('/office/work/index.html');
      expect(path.compose(null, 'icon.svg').complete).toBe('/home/icon.svg');
      expect(path.compose(Path.from('/office/foo.txt')).complete).toBe('/office/foo.txt');
      expect(path.compose(Path.from('/office', '.'), null).complete).toBe('/office/work/index.html');
      expect(path.compose(p => p.withExtension('.ico')).complete).toBe('/home/work/index.ico');
    });
  });

  test('.from', () => {
    expect(Path.from('/home/work/index.html').complete).toBe('/home/work/index.html');
    expect(Path.from('/home', 'work/index.html').complete).toBe('/home/work/index.html');
  });
});
