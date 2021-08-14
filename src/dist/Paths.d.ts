/** Class representing a file path. This can represent either a single unified path string,
    (either absolute or relative to the current directory), or it can represent the combination
    of a 'base' directory and a relative path from that base. The latter representation is
    convenient when there is a source directory tree that has the same hierarchical structure
    as the destination directory tree - this allows the 'base' path to be replaced without changing
    the relative portion of the path.
 */
export declare class Path {
    private readonly frag;
    private readonly basepath;
    /** Create a path from a string or Path. */
    static from(base: string | Path, fragment?: string): Path;
    /** Construct a new path from a string. Note: this normalizes the path.
        @param value A string representing the file path.
        @param base Optional base path, which `value` is relative to.
  
        If `base` is not present and value is a Path, it will use value.base as the base.
    */
    constructor(value: string, base?: string | Path);
    /** Return the relative part of the path - the part relative to the base. */
    get fragment(): string;
    /** Return the complete path, including both base and fragment. */
    get complete(): string;
    /** Return the base path. */
    get base(): string | undefined;
    /** Return the filename extension, including the leading '.' */
    get ext(): string;
    /** Return the filename, without the directory or file extension. */
    get stem(): string;
    /** Return the filename, without the directory, but including the extension. */
    get filename(): string;
    /** Return a new Path object representing the parent directory of this path. */
    get parent(): Path;
    /** Return a string containing the parent directory of this path. */
    get parentName(): string;
    /** Returns true if this is an absolute path. */
    get isAbsolute(): boolean;
    /** Return a new Path object representing the concatenation of this path with one or
        more relative paths. */
    resolve(...fragment: string[]): Path;
    /** Return a new Path object, but with the base replaced by `base`.
        @param ext The new base path.
    */
    withBase(base: string | Path): Path;
    /** Return a new Path object, but with the file extension replaced by `ext`.
        @param newExt The new file extension.
    */
    withExtension(newExt: string): Path;
    /** Return a new Path object, but with the filename 'name'.
        @param newStem The new filename, not including file extension.
    */
    withStem(newStem: string): Path;
    /** Return a new Path object, but with the filename and extension replaced by 'name'.
        @param newFilename The new filename, with extension.
    */
    withFilename(newFilename: string): Path;
}
