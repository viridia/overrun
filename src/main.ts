import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { buildTargets } from './target';
import c from 'ansi-colors';

export const argv = yargs(hideBin(process.argv))
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

export async function getArgs() {
  const args = await argv;

  if (args.color !== undefined) {
    c.enabled = args.color;
  }

  if (args.cwd !== undefined) {
    process.chdir(args.cwd);
  }

  return args;
}

export async function build() {
  const args = await argv;
  const dryRun = args['dry-run'];
  const watchMode = args['w'];
  const success = await buildTargets({ dryRun, watchMode, targets: args._.map(s => String(s)) });
  if (!watchMode || !success) {
    process.exit(success ? 0 : 1);
  }
}

// --tasks, -T        Print the task dependency tree for the loaded
// --incremental, -i  Only build targets that are out of date
