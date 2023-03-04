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
class Path {
    /** The base portion of the path. */
    root;
    frag;
    static from(path, fragment) {
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
    constructor(root, fragment) {
        this.root = typeof root === 'string' ? path_1.default.normalize(root) : root?.complete;
        this.frag = path_1.default.normalize(fragment);
    }
    /** The part of the path relative to the root. */
    get fragment() {
        return this.frag;
    }
    /** The complete path, including both root and fragment. Does not make the path absolute. */
    get complete() {
        return this.root && !path_1.default.isAbsolute(this.frag) ? path_1.default.join(this.root, this.frag) : this.frag;
    }
    /** The complete absolute path, including both root and fragment. */
    get full() {
        return this.root ? path_1.default.resolve(this.root, this.frag) : path_1.default.resolve(this.frag);
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
        return new Path(this.root, path_1.default.dirname(this.frag));
    }
    /** Return a string containing the parent directory of this path. */
    get parentName() {
        return path_1.default.dirname(this.frag);
    }
    /** Returns true if this is an absolute path, false otherwise. */
    get isAbsolute() {
        return path_1.default.isAbsolute(this.root ?? this.frag);
    }
    /** Return a new Path object representing the concatenation of this path with one or
        more relative paths. */
    resolve(...fragment) {
        return new Path(this.root, path_1.default.resolve(this.frag, ...fragment));
    }
    /** Return a copy of this Path object, but with the root replaced by `root`.
        @param ext The new root path.
    */
    withRoot(root) {
        return new Path(root, this.frag);
    }
    /** Return a copy of this Path object, but with the fragment replaced by `fragment`.
        @param fragment The new path fragment.
    */
    withFragment(fragment) {
        return new Path(this.root, fragment);
    }
    /** Return a copy of this Path object, but with the file extension replaced by `ext`.
        @param newExt The new file extension.
    */
    withExtension(newExt) {
        const parsed = path_1.default.parse(this.frag);
        return new Path(this.root, path_1.default.format({ ...parsed, base: undefined, ext: newExt }));
    }
    /** Return a copy of this Path object, but with the stem replaced by 'newStem'.
        @param newStem The new filename, not including file extension.
    */
    withStem(newStem) {
        const parsed = path_1.default.parse(this.frag);
        return new Path(this.root, path_1.default.format({ ...parsed, name: newStem, base: undefined }));
    }
    /** Return a copy of this Path object, but with the filename (including extension) replaced
        by 'newFilename'.
        @param newFilename The new filename, with extension.
    */
    withFilename(newFilename) {
        const parsed = path_1.default.parse(this.frag);
        return new Path(this.root, path_1.default.format({ ...parsed, base: newFilename }));
    }
    /** Combine two paths, replacing either the root or the fragment or both.
        @param newRootOrPath Either a function which transforms the path, or the new root
          of the path. If there is no second argument, then this represents the complete path.
        @param newFragment The new fragment. If this is `null` it means we want to keep the
          existing fragment. If it's a string, it means we want to replace it.
     */
    compose(newRootOrPath, newFragment) {
        if (typeof newRootOrPath === 'function') {
            if (newFragment !== undefined) {
                throw new Error('Invalid path combination: may not provide both fragment and transform function.');
            }
            else {
                return newRootOrPath(this);
            }
        }
        if (newFragment === undefined) {
            // We're replacing the entire path
            if (newRootOrPath instanceof Path) {
                return newRootOrPath;
            }
            else if (typeof newRootOrPath === 'string') {
                return Path.from(newRootOrPath);
            }
            else {
                return this;
            }
        }
        else {
            // We're replacing the fragment, and possibly the root.
            const frag = typeof newFragment === 'string' ? newFragment : this.fragment;
            if (newRootOrPath instanceof Path) {
                return newRootOrPath.withFragment(frag);
            }
            else if (typeof newRootOrPath === 'string') {
                return new Path(newRootOrPath, frag);
            }
            else {
                return this.withFragment(frag);
            }
        }
    }
}
exports.Path = Path;
