"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Path = void 0;
const path_1 = __importDefault(require("path"));
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

    The `Path` object actually contains two path strings, known as the `base` and the `fragment`.
    The `base` represents either the source or destination directory, while the `fragment`
    represents the location of a file or directory within the base. The complete path is simply the
    concatenation of `base` and `fragment` together.

    The `base` part of the path is optional; if not present then the `fragment` represents the
    complete path. (If the fragment is a relative path, it will be relative to the current working
    directory.)

    The `base` path need not be an absolute path, although it often is. If it is a relative path,
    it will be resolved relative to the current working directory.

    The canonical way to construct a Path is via `Path.from()`, which has two forms:
 */
class Path {
    frag;
    basepath;
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
        this.basepath = typeof base === 'string' ? path_1.default.normalize(base) : base?.complete;
    }
    /** The part of the path relative to the base. */
    get fragment() {
        return this.frag;
    }
    /** The complete path, including both base and fragment. */
    get complete() {
        return this.basepath ? path_1.default.resolve(this.basepath, this.frag) : this.frag;
    }
    /** Return the base path. */
    get base() {
        return this.basepath;
    }
    /** The filename extension, including the leading '.' */
    get ext() {
        return path_1.default.extname(this.frag);
    }
    /** The filename, without the directory or file extension. */
    get stem() {
        return path_1.default.basename(this.frag, path_1.default.extname(this.frag));
    }
    /** The filename part of the path, including the filename extension. */
    get filename() {
        return path_1.default.basename(this.frag);
    }
    /** Return a new Path object representing the parent directory of this path. */
    get parent() {
        return new Path(path_1.default.dirname(this.frag), this.basepath);
    }
    /** Return a string containing the parent directory of this path. */
    get parentName() {
        return path_1.default.dirname(this.frag);
    }
    /** Returns true if this is an absolute path, false otherwise. */
    get isAbsolute() {
        return path_1.default.isAbsolute(this.basepath ?? this.frag);
    }
    /** Return a new Path object representing the concatenation of this path with one or
        more relative paths. */
    resolve(...fragment) {
        return new Path(path_1.default.resolve(this.frag, ...fragment), this.basepath);
    }
    /** Return a copy of this Path object, but with the base replaced by `base`.
        @param ext The new base path.
    */
    withBase(base) {
        return new Path(this.frag, base);
    }
    /** Return a copy of this Path object, but with the fragment replaced by `base`.
        @param fragment The new path fragment.
    */
    withFragment(fragment) {
        return new Path(fragment, this.base);
    }
    /** Return a copy of this Path object, but with the file extension replaced by `ext`.
        @param newExt The new file extension.
    */
    withExtension(newExt) {
        const parsed = path_1.default.parse(this.frag);
        return new Path(path_1.default.format({ ...parsed, base: undefined, ext: newExt }), this.basepath);
    }
    /** Return a copy of this Path object, but with the stem replaced by 'newStem'.
        @param newStem The new filename, not including file extension.
    */
    withStem(newStem) {
        const parsed = path_1.default.parse(this.frag);
        return new Path(path_1.default.format({ ...parsed, name: newStem, base: undefined }), this.basepath);
    }
    /** Return a copy of this Path object, but with the filename (including extension) replaced
        by 'newFilename'.
        @param newFilename The new filename, with extension.
    */
    withFilename(newFilename) {
        const parsed = path_1.default.parse(this.frag);
        return new Path(path_1.default.format({ ...parsed, base: newFilename }), this.basepath);
    }
    /** Combine two paths, replacing either the base or the fragment or both.
        @param newBaseOrPath Either a function which transforms the path, or the new base
          of the path. If there is no second argument, then this represents the complete path.
        @param newFragment The new fragment. If this is `null` it means we want to keep the
          existing fragment. If it's a string, it means we want to replace it.
     */
    compose(newBaseOrPath, newFragment) {
        if (typeof newBaseOrPath === 'function') {
            if (newFragment !== undefined) {
                throw new Error('Invalid path combination: may not provide both fragment and transform function.');
            }
            else {
                return newBaseOrPath(this);
            }
        }
        if (newFragment === undefined) {
            // We're replacing the entire path
            if (newBaseOrPath instanceof Path) {
                return newBaseOrPath;
            }
            else if (typeof newBaseOrPath === 'string') {
                return Path.from(newBaseOrPath);
            }
            else {
                return this;
            }
        }
        else {
            // We're replacing the fragment, and possibly the base.
            const frag = typeof newFragment === 'string' ? newFragment : this.fragment;
            if (newBaseOrPath instanceof Path) {
                return newBaseOrPath.withFragment(frag);
            }
            else if (typeof newBaseOrPath === 'string') {
                return new Path(frag, newBaseOrPath);
            }
            else {
                return this.withFragment(frag);
            }
        }
    }
}
exports.Path = Path;
