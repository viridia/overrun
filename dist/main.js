"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = exports.getArgs = exports.argv = void 0;
const yargs_1 = __importDefault(require("yargs/yargs"));
const helpers_1 = require("yargs/helpers");
const target_1 = require("./target");
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const debug_1 = require("./debug");
exports.argv = yargs_1.default(helpers_1.hideBin(process.argv))
    .version()
    .help()
    .options({
    f: {
        alias: 'pipeline',
        describe: 'Pipeline file to use.',
        type: 'string',
    },
    'dry-run': {
        describe: "Don't actually write any files.",
        type: 'boolean',
    },
    cwd: {
        describe: 'Set current working directory.',
        normalize: true,
        type: 'string',
    },
    w: {
        alias: 'watch',
        describe: 'Watch mode.',
        boolean: true,
    },
    targets: {
        describe: 'List of targets to build (default all).',
        type: 'string',
    },
    color: {
        describe: 'Enable colored output.',
        boolean: true,
    },
    verbose: {
        alias: 'v',
        describe: 'Enable verbose logging.',
        boolean: true,
    },
})
    .describe('no-color', 'Disable colored output.').argv;
async function getArgs() {
    const args = await exports.argv;
    if (args.color !== undefined) {
        ansi_colors_1.default.enabled = args.color;
    }
    if (args.verbose !== undefined) {
        debug_1.setVerboseLogging(args.verbose);
    }
    if (args.cwd !== undefined) {
        process.chdir(args.cwd);
    }
    return args;
}
exports.getArgs = getArgs;
async function build() {
    const args = await exports.argv;
    const dryRun = args['dry-run'];
    const watchMode = args['w'];
    const success = await target_1.buildTargets({ dryRun, watchMode, targets: args._.map(s => String(s)) });
    if (!watchMode || !success) {
        process.exit(success ? 0 : 1);
    }
}
exports.build = build;
// --tasks, -T        Print the task dependency tree for the loaded
// --incremental, -i  Only build targets that are out of date
