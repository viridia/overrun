"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Path = void 0;
const path_1 = __importDefault(require("path"));
/** Class representing a file path. This can represent either a single unified path string,
    (either absolute or relative to the current directory), or it can represent the combination
    of a 'base' directory and a relative path from that base. The latter representation is
    convenient when there is a source directory tree that has the same hierarchical structure
    as the destination directory tree - this allows the 'base' path to be replaced without changing
    the relative portion of the path.
 */
class Path {
    frag;
    base;
    /** Create a path from a string or Path. */
    static from(base, fragment) {
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
    constructor(value, base) {
        this.frag = path_1.default.normalize(value);
        this.base = typeof base === 'string' ? path_1.default.normalize(base) : base?.frag;
    }
    /** Return the relative part of the path - the part relative to the base. */
    get fragment() {
        return this.frag;
    }
    /** Return the full path, including the base. */
    get fullPath() {
        return this.base ? path_1.default.resolve(this.base, this.frag) : this.frag;
    }
    /** Return the base path. */
    get basePath() {
        return this.base;
    }
    /** Return the filename extension, including the leading '.' */
    get ext() {
        return path_1.default.extname(this.frag);
    }
    /** Return the filename, without the directory or file extension. */
    get stem() {
        return path_1.default.basename(this.frag, path_1.default.extname(this.frag));
    }
    /** Return the filename, without the directory, but including the extension. */
    get filename() {
        return path_1.default.basename(this.frag);
    }
    /** Return a new Path object representing the parent directory of this path. */
    get parent() {
        return new Path(path_1.default.dirname(this.frag), this.base);
    }
    /** Return a string containing the parent directory of this path. */
    get parentName() {
        return path_1.default.dirname(this.frag);
    }
    /** Returns true if this is an absolute path. */
    get isAbsolute() {
        return path_1.default.isAbsolute(this.frag);
    }
    /** Return a new Path object representing the concatenation of this path with one or
        more relative paths. */
    resolve(...fragment) {
        return new Path(path_1.default.resolve(this.frag, ...fragment), this.base);
    }
    /** Return a new Path object, but with the file extension replaced by `ext`.
        @param ext The new file extension.
    */
    withBase(base) {
        return new Path(this.frag, base);
    }
    /** Return a new Path object, but with the file extension replaced by `ext`.
        @param ext The new file extension.
    */
    withExtension(ext) {
        const parsed = path_1.default.parse(this.frag);
        return new Path(path_1.default.format({ ...parsed, base: undefined, ext }), this.base);
    }
    /** Return a new Path object, but with the filename 'name'.
        @param name The new filename, not including file extension.
    */
    withFilename(name) {
        const parsed = path_1.default.parse(this.frag);
        return new Path(path_1.default.format({ ...parsed, name, base: undefined }), this.base);
    }
    /** Return a new Path object, but with the filename and extension replaced by 'name'.
        @param nameAndExt The new filename, with extension.
    */
    withFilenameAndExt(nameAndExt) {
        const parsed = path_1.default.parse(this.frag);
        return new Path(path_1.default.format({ ...parsed, base: nameAndExt }), this.base);
    }
}
exports.Path = Path;
