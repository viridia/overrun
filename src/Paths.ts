import path from 'path';

/** Class representing a file path. */
export class Path {
  private readonly value: string;
  private readonly base: string | undefined;

  /** Construct a new path from a string. Note: this normalizes the path.
      @param value A string representing the file path.
      @param base Optional base path, which `value` is relative to.

      If `base` is not present and value is a Path, it will use value.base as the base.
  */
  constructor(value: string | Path, base?: string | Path) {
    this.value = typeof value === 'string' ? path.normalize(value) : value.toString();
    this.base =
      typeof base === 'string'
        ? path.normalize(base)
        : base
        ? base.toString()
        : value instanceof Path
        ? value.base
        : undefined;
  }

  /** Return the string form of the path. */
  public toString(): string {
    return this.value;
  }

  /** Return the full path, including the base. */
  public fullPath(): string {
    return this.base ? path.resolve(this.base, this.value) : this.value;
  }

  /** Return the filename extension, including the leading '.' */
  public get ext(): string {
    return path.extname(this.value);
  }

  /** Return the filename, without the directory or file extension. */
  public get basename(): string {
    return path.basename(this.value, path.extname(this.value));
  }

  /** Return the filename, without the directory, but including the extension. */
  public get filename(): string {
    return path.basename(this.value);
  }

  /** Return a new Path object representing the parent directory of this path. */
  public get parent(): Path {
    return new Path(path.dirname(this.value), this.base);
  }

  /** Return a string containing the parent directory of this path. */
  public get parentName(): string {
    return path.dirname(this.value);
  }

  /** Returns true if this is an absolute path. */
  public get isAbsolute(): boolean {
    return path.isAbsolute(this.value);
  }

  /** Return a new Path object representing the concatenation of this path with one or
      more relative paths. */
  public resolve(...relPath: string[]): Path {
    return new Path(path.resolve(this.value, ...relPath), this.base);
  }

  /** Return a new Path object, but with the file extension replaced by `ext`.
      @param ext The new file extension.
  */
  public withBase(base: string | Path): Path {
    return new Path(this.value, base);
  }

  /** Return a new Path object, but with the file extension replaced by `ext`.
      @param ext The new file extension.
  */
  public withExtension(ext: string): Path {
    const parsed = path.parse(this.value);
    return new Path(path.format({ ...parsed, base: undefined, ext }), this.base);
  }

  /** Return a new Path object, but with the filename 'name'.
      @param name The new filename, not including file extension.
  */
  public withFilenameAndExt(name: string): Path {
    const parsed = path.parse(this.value);
    return new Path(path.format({ ...parsed, name, base: undefined }), this.base);
  }

  /** Return a new Path object, but with the filename and extension replaced by 'name'.
      @param name The new filename, with extension.
  */
  public withFilename(name: string): Path {
    const parsed = path.parse(this.value);
    return new Path(path.format({ ...parsed, base: name }), this.base);
  }
}
