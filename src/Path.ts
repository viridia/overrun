import path from 'path';

export type PathMapping = (path: Path) => Path;
export interface PathSpec {
  root?: string;
  fragment?: string;
}

/**
    A `Path` object contains a filesystem path. Path object are similar to, and are inspired by, the
    Python `pathlib` module.

    Typically in build environments, there is both a source directory structure and a destination
    directory structure; and it is often the case that these two are a mirror of each other, or at
    least share some structural similarities.

    As such, it is often convenient to be able to manipulate paths by swapping out the `source`
    part of the path and replacing it with the `output` location, while leaving the rest of the
    path unchanged. `Path` objects provide a means to do this easily, although it is not required
    that they be used this way.

    The `Path` object actually contains two path strings, known as the `root` and the `fragment`.
    The `root` represents either the source or destination directory, while the `fragment`
    represents the location of a file or directory within the root. The complete path is simply the
    concatenation of `root` and `fragment` together.

    The `root` part of the path is optional; if not present then the `fragment` represents the
    complete path. (If the fragment is a relative path, it will be relative to the current working
    directory.)

    The `root` path need not be an absolute path, although it often is. If it is a relative path,
    it will be resolved relative to the current working directory.

    The canonical way to construct a Path is via `Path.from()`, which has two forms:
 */
export class Path {
  /** The base portion of the path. */
  public readonly root: string | undefined;
  private readonly frag: string;

  /** Create a path from a string or Path. This method has two overloaded forms:

      If supplied with a single argument, that argument represents the `fragment` part of the path.
      Otherwise, the first argument is the `root` and the second argument is the `fragment`.

      You can also construct a `Path` object direcly by calling the constructor.
  */
  static from(path: string | Path | PathSpec): Path;
  static from(path: string | Path | PathSpec, fragment?: string): Path;
  static from(path: string | Path | PathSpec, fragment?: string): Path {
    if (typeof path === 'object' && !(path instanceof Path)) {
      return new Path(path.root, path.fragment ?? '');
    }
    return fragment !== undefined
      ? new Path(path, fragment)
      : typeof path === 'string'
      ? new Path(undefined, path)
      : path;
  }

  /** Construct a new path from a string. Note: this normalizes the path.
      @param fragment A string representing the file path.
      @param root Optional root path, which `value` is relative to.
  */
  constructor(root: string | Path | undefined, fragment: string) {
    this.root = typeof root === 'string' ? path.normalize(root) : root?.complete;
    this.frag = path.normalize(fragment);
  }

  /** The part of the path relative to the root. */
  public get fragment(): string {
    return this.frag;
  }

  /** The complete path, including both root and fragment. Does not make the path absolute. */
  public get complete(): string {
    return this.root && !path.isAbsolute(this.frag) ? path.join(this.root, this.frag) : this.frag;
  }

  /** The complete absolute path, including both root and fragment. */
  public get full(): string {
    return this.root ? path.resolve(this.root, this.frag) : path.resolve(this.frag);
  }

  /** The filename extension, including the leading '.' */
  public get ext(): string {
    return path.extname(this.frag);
  }

  /** The filename, without the directory or file extension. */
  public get stem(): string {
    return path.basename(this.frag, path.extname(this.frag));
  }

  /** The filename part of the path, including the filename extension. */
  public get filename(): string {
    return path.basename(this.frag);
  }

  /** Return a new Path object representing the parent directory of this path. */
  public get parent(): Path {
    return new Path(this.root, path.dirname(this.frag));
  }

  /** Return a string containing the parent directory of this path. */
  public get parentName(): string {
    return path.dirname(this.frag);
  }

  /** Returns true if this is an absolute path, false otherwise. */
  public get isAbsolute(): boolean {
    return path.isAbsolute(this.root ?? this.frag);
  }

  /** Return a new Path object representing the concatenation of this path with one or
      more relative paths. */
  public resolve(...fragment: string[]): Path {
    return new Path(this.root, path.resolve(this.frag, ...fragment));
  }

  /** Return a copy of this Path object, but with the root replaced by `root`.
      @param ext The new root path.
  */
  public withRoot(root: string | Path): Path {
    return new Path(root, this.frag);
  }

  /** Return a copy of this Path object, but with the fragment replaced by `fragment`.
      @param fragment The new path fragment.
  */
  public withFragment(fragment: string): Path {
    return new Path(this.root, fragment);
  }

  /** Return a copy of this Path object, but with the file extension replaced by `ext`.
      @param newExt The new file extension.
  */
  public withExtension(newExt: string): Path {
    const parsed = path.parse(this.frag);
    return new Path(this.root, path.format({ ...parsed, base: undefined, ext: newExt }));
  }

  /** Return a copy of this Path object, but with the stem replaced by 'newStem'.
      @param newStem The new filename, not including file extension.
  */
  public withStem(newStem: string): Path {
    const parsed = path.parse(this.frag);
    return new Path(this.root, path.format({ ...parsed, name: newStem, base: undefined }));
  }

  /** Return a copy of this Path object, but with the filename (including extension) replaced
      by 'newFilename'.
      @param newFilename The new filename, with extension.
  */
  public withFilename(newFilename: string): Path {
    const parsed = path.parse(this.frag);
    return new Path(this.root, path.format({ ...parsed, base: newFilename }));
  }

  /** Combine two paths, replacing either the root or the fragment or both.
      @param newRootOrPath Either a function which transforms the path, or the new root
        of the path. If there is no second argument, then this represents the complete path.
      @param newFragment The new fragment. If this is `null` it means we want to keep the
        existing fragment. If it's a string, it means we want to replace it.
   */
  public compose(
    newRootOrPath: Path | PathSpec | PathMapping | string | null,
    newFragment?: string | null
  ): Path {
    if (typeof newRootOrPath === 'function') {
      if (newFragment !== undefined) {
        throw new Error(
          'Invalid path combination: may not provide both fragment and transform function.'
        );
      } else {
        return newRootOrPath(this);
      }
    }

    if (newFragment === undefined) {
      // We're replacing the entire path
      if (newRootOrPath instanceof Path) {
        return newRootOrPath;
      } else if (typeof newRootOrPath === 'string') {
        return Path.from(newRootOrPath);
      } else {
        return this;
      }
    } else {
      // We're replacing the fragment, and possibly the root.
      const frag = typeof newFragment === 'string' ? newFragment : this.fragment;
      if (newRootOrPath instanceof Path) {
        return newRootOrPath.withFragment(frag);
      } else if (typeof newRootOrPath === 'string') {
        return new Path(newRootOrPath, frag);
      } else {
        return this.withFragment(frag);
      }
    }
  }
}
