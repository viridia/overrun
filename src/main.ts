import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { buildTargets } from './target';
import c from 'ansi-colors';

const argv = yargs(hideBin(process.argv))
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
  c.enabled = argv.color;
}

if (argv.cwd !== undefined) {
  process.chdir(argv.cwd);
}

export async function build() {
  const dryRun = argv['dry-run'];
  const success = await buildTargets({ dryRun });
  process.exit(success ? 0 : 1);
}

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
