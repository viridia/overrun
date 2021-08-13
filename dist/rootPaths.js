"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootPaths = void 0;
/** Reduce a set of strings to common prefixes. */
function rootPaths(input) {
    let result = [];
    for (const s of input) {
        result = result.filter(t => !t.startsWith(s));
        const unique = !result.some(t => s.startsWith(t));
        if (unique) {
            result = [...result, s];
        }
    }
    return result;
}
exports.rootPaths = rootPaths;
