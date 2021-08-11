import c from 'ansi-colors';
import { TaskArray } from './TaskArray';
import { BuildError } from './errors';
import { Task } from './Task';

export interface BuilderOptions {
  dryRun?: boolean;
}

/** A target is anything that can be built. */
export interface Builder {
  build(options: BuilderOptions): Promise<void>;
  isModified(): Promise<boolean>;
}

export interface NamedBuilder extends Builder {
  getName(): string;
}

export interface Target {
  name: string;
  builders: Builder[];
}

const targets: Target[] = [];

type Builders = NamedBuilder | NamedBuilder[] | TaskArray<NamedBuilder & Task<unknown>>;

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
      if (builder.items().length > 0) {
        targets.push({
          builders: builder.items(),
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
        builders: nameOrBuilder.items(),
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

export async function buildTargets(options: BuilderOptions = {}): Promise<boolean> {
  const results = await Promise.allSettled(
    targets.map(async ({ name, builders }) => {
      const toBuild = new Set<Builder>();
      await Promise.all(builders.map(async b => {
        const modified = await b.isModified();
        if (modified) {
          toBuild.add(b);
        }
      }))

      // const toBuild = builders.filter(b => !upToDate.has(b));
      if (toBuild.size > 0) {
        const promises = builders.map(b =>
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
        return Promise.all(promises).then(() => {
          console.log(`${c.greenBright('Finished')}: ${name}`);
        });
      } else {
        console.log(`${c.cyanBright('Already up to date')}: ${name}`);
        return Promise.resolve();
      }
    })
  );

  const rejected = results.filter(result => result.status === 'rejected');
  if (rejected.length > 0) {
    console.log(c.red(`${rejected.length} targets failed.`));
    return false;
  }
  return true;
}
