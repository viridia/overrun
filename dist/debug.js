"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.setVerboseLogging = void 0;
const ansi_colors_1 = __importDefault(require("ansi-colors"));
let verbose = false;
function setVerboseLogging(enabled) {
    verbose = enabled;
}
exports.setVerboseLogging = setVerboseLogging;
function log(msg) {
    if (verbose) {
        console.log(ansi_colors_1.default.blue(msg));
    }
}
exports.log = log;
