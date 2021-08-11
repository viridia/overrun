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
    const success = await target_1.buildTargets({ dryRun });
    process.exit(success ? 0 : 1);
}
exports.build = build;
// Options:
//   --require               Will require a module before running the gulpfile.
//                           This is useful for transpilers but also has other
//   --verify                Will verify plugins referenced in project's
//                           package.json against the plugins blacklist.
//   --tasks, -T             Print the task dependency tree for the loaded
//                           gulpfile.                                    [boolean]
//   --tasks-simple          Print a plaintext list of tasks for the loaded
//                           gulpfile.                                    [boolean]
//   --tasks-json            Print the task dependency tree, in JSON format, for
//                           the loaded gulpfile.
//   --tasks-depth, --depth  Specify the depth of the task dependency tree.[number]
//   --compact-tasks         Reduce the output of task dependency tree by printing
//                           only top tasks and their child tasks.        [boolean]
//   --sort-tasks            Will sort top tasks of task dependency tree. [boolean]
//   --silent, -S            Suppress all gulp logging.                   [boolean]
//   --continue              Continue execution of tasks upon failure.    [boolean]
//   --series                Run tasks given on the CLI in series (the default is
//                           parallel).                                   [boolean]
//   --log-level, -L         Set the loglevel. -L for least verbose and -LLLL for
//                           most verbose. -LLL is default.                 [count]
