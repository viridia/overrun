import path from 'path';

/** Class representing a file path. This can represent either a single unified path string,
    (either absolute or relative to the current directory), or it can represent the combination
    of a 'base' directory and a relative path from that base. The latter representation is
    convenient when there is a source directory tree that has the same hierarchical structure
    as the destination directory tree - this allows the 'base' path to be replaced without changing
    the relative portion of the path.
 */
export class Path {
  private readonly frag: string;
  private readonly base: string | undefined;

  /** Create a path from a string or Path. */
  static from(base: string | Path, fragment?: string): Path {
    return fragment !== undefined
      ? new Path(fragment, base)
      : typeof base === 'string'
      ? new Path(base)
      : base;
  }

  /** Construct a new path from a string. Note: this normalizes the path.
      @param value A string representing the file path.
      @param base Optional base path, which `value` is relative to.

      If `base` is not present and value is a Path, it will use value.base as the base.
  */
  constructor(value: string, base?: string | Path) {
    this.frag = path.normalize(value);
    this.base = typeof base === 'string' ? path.normalize(base) : base?.frag;
  }

  /** Return the relative part of the path - the part relative to the base. */
  public get fragment(): string {
    return this.frag;
  }

  /** Return the full path, including the base. */
  public get fullPath(): string {
    return this.base ? path.resolve(this.base, this.frag) : this.frag;
  }

  /** Return the base path. */
  public get basePath(): string | undefined {
    return this.base;
  }

  /** Return the filename extension, including the leading '.' */
  public get ext(): string {
    return path.extname(this.frag);
  }

  /** Return the filename, without the directory or file extension. */
  public get stem(): string {
    return path.basename(this.frag, path.extname(this.frag));
  }

  /** Return the filename, without the directory, but including the extension. */
  public get filename(): string {
    return path.basename(this.frag);
  }

  /** Return a new Path object representing the parent directory of this path. */
  public get parent(): Path {
    return new Path(path.dirname(this.frag), this.base);
  }

  /** Return a string containing the parent directory of this path. */
  public get parentName(): string {
    return path.dirname(this.frag);
  }

  /** Returns true if this is an absolute path. */
  public get isAbsolute(): boolean {
    return path.isAbsolute(this.frag);
  }

  /** Return a new Path object representing the concatenation of this path with one or
      more relative paths. */
  public resolve(...fragment: string[]): Path {
    return new Path(path.resolve(this.frag, ...fragment), this.base);
  }

  /** Return a new Path object, but with the file extension replaced by `ext`.
      @param ext The new file extension.
  */
  public withBase(base: string | Path): Path {
    return new Path(this.frag, base);
  }

  /** Return a new Path object, but with the file extension replaced by `ext`.
      @param ext The new file extension.
  */
  public withExtension(ext: string): Path {
    const parsed = path.parse(this.frag);
    return new Path(path.format({ ...parsed, base: undefined, ext }), this.base);
  }

  /** Return a new Path object, but with the filename 'name'.
      @param name The new filename, not including file extension.
  */
  public withFilename(name: string): Path {
    const parsed = path.parse(this.frag);
    return new Path(path.format({ ...parsed, name, base: undefined }), this.base);
  }

  /** Return a new Path object, but with the filename and extension replaced by 'name'.
      @param nameAndExt The new filename, with extension.
  */
  public withFilenameAndExt(nameAndExt: string): Path {
    const parsed = path.parse(this.frag);
    return new Path(path.format({ ...parsed, base: nameAndExt }), this.base);
  }
}
