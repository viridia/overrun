"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
const yargs_1 = __importDefault(require("yargs/yargs"));
const helpers_1 = require("yargs/helpers");
const target_1 = require("./target");
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const argv = yargs_1.default(helpers_1.hideBin(process.argv))
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
        describe: 'Enabled colored output.',
        boolean: true,
    },
})
    .describe('no-color', 'Disable colored output.').argv;
if (argv.color !== undefined) {
    ansi_colors_1.default.enabled = argv.color;
}
if (argv.cwd !== undefined) {
    process.chdir(argv.cwd);
}
async function build() {
    const dryRun = argv['dry-run'];
    const watchMode = argv['w'];
    const success = await target_1.buildTargets({ dryRun, watchMode, targets: argv._.map(s => String(s)) });
    if (!watchMode || !success) {
        process.exit(success ? 0 : 1);
    }
    else {
        console.log(`Watching for changes...`);
    }
}
exports.build = build;
//   --tasks, -T             Print the task dependency tree for the loaded
