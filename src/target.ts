import c from 'ansi-colors';
import { TaskArray } from './TaskArray';
import { BuildError } from './errors';
import { Builder, BuilderContainer, BuilderOptions, Task } from './Task';
import chokidar from 'chokidar';
import { getDirectoryTasks, getSourceTask, getWatchDirs } from './sourceInternal';
import './TransformTask';
import './OutputFileTask';
import path from 'path';

/** @internal */
export interface Target {
  name: string;
  builders: BuilderContainer[];
}

const targets: Target[] = [];

type Builders = BuilderContainer | BuilderContainer[] | TaskArray<any, Builder & Task<unknown>>;

/**
 *
 * @param name
 * @param builders
 */
export function target(builder: Builders): void;
export function target(name: string, builder: Builders): void;
export function target(nameOrBuilder: string | Builders, builder?: Builders): void {
  if (typeof nameOrBuilder === 'string') {
    if (!builder) {
      console.error(c.red(`No builders specified for target '${nameOrBuilder}'.`));
      process.exit(1);
    } else if (Array.isArray(builder)) {
      if (builder.length > 0) {
        targets.push({
          builders: builder,
          name: nameOrBuilder,
        });
      } else {
        console.error(c.red(`No tasks specified for target '${nameOrBuilder}'.`));
      }
    } else if (builder instanceof TaskArray) {
      if (builder.length > 0) {
        // This needs to recalculate when directory changes.
        // What we need is something like an output task array.
        targets.push({
          builders: [builder],
          name: nameOrBuilder,
        });
      } else {
        console.error(c.red(`No tasks specified for rule '${nameOrBuilder}'.`));
      }
    } else {
      targets.push({
        builders: [builder],
        name: nameOrBuilder,
      });
    }
  } else if (Array.isArray(nameOrBuilder)) {
    if (nameOrBuilder.length > 0) {
      targets.push({
        builders: nameOrBuilder,
        name: nameOrBuilder[0].getName(),
      });
    } else {
      console.error(c.red(`No tasks specified for unnamed target'.`));
    }
  } else if (nameOrBuilder instanceof TaskArray) {
    if (nameOrBuilder.length > 0) {
      targets.push({
        builders: [nameOrBuilder],
        name: nameOrBuilder.items()[0].getName(),
      });
    } else {
      console.error(c.red(`No tasks specified for unnamed target'.`));
    }
  } else if (nameOrBuilder) {
    targets.push({
      builders: [nameOrBuilder],
      name: nameOrBuilder.getName(),
    });
  } else {
    console.error(c.red('No builders specified for unnamed target.'));
    process.exit(1);
  }
}

async function checkOutOfDateTargets(
  builders: BuilderContainer[],
  force: boolean
): Promise<Set<Builder>> {
  const toBuild = new Set<Builder>();
  await Promise.all(
    builders.map(async b => {
      const outOfDate = await b.gatherOutOfDate(force);
      outOfDate.forEach(b => {
        toBuild.add(b);
      });
    })
  );
  return toBuild;
}

/** @internal */
export async function buildTargets(options: BuilderOptions = {}): Promise<boolean> {
  let targetsToBuild = targets;
  if (options.targets !== undefined && options.targets.length > 0) {
    targetsToBuild = targets.filter(t => options.targets!.includes(t.name));
  }

  getWatchDirs();

  const buildTargets = (force: boolean) => {
    return targetsToBuild.map(async ({ name, builders }) => {
      const toBuild = Array.from(new Set(await checkOutOfDateTargets(builders, force)));
      if (toBuild.length > 0) {
        const promises = toBuild.map(b =>
          b.build(options).catch(err => {
            if (err instanceof BuildError) {
              console.error(`${c.blue('Target')} ${c.magentaBright(name)}: ${c.red(err.message)}`);
            } else {
              console.log(`Not a build error?`);
              console.error(err);
            }
            throw err;
          })
        );

        await Promise.all(promises);
        if (force) {
          console.log(`${c.greenBright('Finished')}: ${name}`);
        } else {
          console.log(`${c.greenBright('Rebuilt')}: ${name}`);
        }
      }
    });
  };

  const results = await Promise.allSettled(buildTargets(true));
  const rejected = results.filter(result => result.status === 'rejected');
  if (rejected.length > 0) {
    console.log(c.red(`${rejected.length} targets failed.`));
    return false;
  }

  if (options.watchMode && !options.dryRun) {
    const dirs = getWatchDirs();
    // console.log(dirs);
    const watcher = chokidar.watch(dirs, {
      persistent: true,
      alwaysStat: true,
    });
    let debounceTimer: NodeJS.Timeout | null = null; //  = global.setTimeout();
    let isChanged = false;
    let isReady = false;

    const rebuild = async () => {
      isChanged = false;
      const results = await Promise.allSettled(buildTargets(false));
      const rejected = results.filter(result => result.status === 'rejected');
      if (rejected.length > 0) {
        console.log(c.red(`${rejected.length} targets failed.`));
        return false;
      }

      // Don't clear the timer until build is done; that way we don't schedule a new build
      // until the previous one has finished.
      debounceTimer = null;
      if (isChanged) {
        rebuild();
      }
    };

    watcher.on('error', error => {
      console.error('Watcher error:', error);
    });

    watcher.on('ready', () => {
      isReady = true;
      console.log(`Watching for changes...`);
    });

    watcher.on('change', (filePath, stats) => {
      if (isReady && filePath && stats) {
        if (stats.isFile()) {
          const task = getSourceTask(filePath);
          if (task) {
            task.updateStats(stats);
            task.updateModTime(stats.mtime);
            isChanged = true;
            if (!debounceTimer) {
              debounceTimer = global.setTimeout(rebuild, 300);
            }
          }
        }
      }
    });

    watcher.on('add', filePath => {
      if (isReady && filePath) {
        const dirname = path.dirname(filePath);
        getDirectoryTasks(dirname).forEach(task => {
          task.bumpVersion();
          isChanged = true;
          if (!debounceTimer) {
            debounceTimer = global.setTimeout(rebuild, 300);
          }
        });
      }
    });

    watcher.on('unlink', filePath => {
      if (isReady && filePath) {
        const dirname = path.dirname(filePath);
        getDirectoryTasks(dirname).forEach(task => {
          task.bumpVersion();
          isChanged = true;
          if (!debounceTimer) {
            debounceTimer = global.setTimeout(rebuild, 300);
          }
        });
      }
    });
  }

  return true;
}

/** Remove all targets. Mainly used for testing. */
export function clearTargets() {
  targets.length = 0;
}
