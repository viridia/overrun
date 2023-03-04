"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextVersion = exports.currentVersion = void 0;
let headVersion = 0;
function currentVersion() {
    return headVersion;
}
exports.currentVersion = currentVersion;
function nextVersion() {
    return ++headVersion;
}
exports.nextVersion = nextVersion;
