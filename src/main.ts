import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { buildTargets } from './target';
import c from 'ansi-colors';

const argv = yargs(hideBin(process.argv))
  .version()
  .help()
  .options({
    // f: {
    //   alias: 'pipeline',
    //   describe: 'Pipeline file to use.',
    //   type: 'string',
    // },
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
    w: {
      alias: 'watch',
      describe: 'Watch mode.',
      boolean: true,
    },
    targets: {
      describe: 'List of targets to build (default all).',
      type: 'string',
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
  const watchMode = argv['w'];
  const success = await buildTargets({ dryRun, watchMode, targets: argv._.map(s => String(s)) });
  if (!watchMode || !success) {
    process.exit(success ? 0 : 1);
  } else {
    console.log(`Watching for changes...`);
  }
}

//   --tasks, -T             Print the task dependency tree for the loaded
