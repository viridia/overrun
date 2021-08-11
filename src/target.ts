import c from 'ansi-colors';
import { TaskArray } from "./TaskArray";
import { BuildError } from './errors';
import { Task } from './Task';

export interface BuilderOptions {
  dryRun?: boolean;
}

/** A target is anything that can be built. */
export interface Builder {
  build(options: BuilderOptions): Promise<void>;
  get isModified(): boolean;
}

export interface NamedBuilder extends Builder {
  getName(): string;
}

export interface Target {
  name: string;
  builder: Builder | Builder[];
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
          builder,
          name: nameOrBuilder,
        });
      } else {
        console.error(c.red(`No tasks specified for target '${nameOrBuilder}'.`));
      }
    } else if (builder instanceof TaskArray) {
      if (builder.items().length > 0) {
        targets.push({
          builder: builder.items(),
          name: nameOrBuilder,
        });
      } else {
        console.error(c.red(`No tasks specified for rule '${nameOrBuilder}'.`));
      }
    } else {
      targets.push({
        builder,
        name: nameOrBuilder,
      });
    }
  } else if (Array.isArray(nameOrBuilder)) {
    if (nameOrBuilder.length > 0) {
      targets.push({
        builder: nameOrBuilder,
        name: nameOrBuilder[0].getName(),
      });
    } else {
      console.error(c.red(`No tasks specified for unnamed target'.`));
    }
  } else if (nameOrBuilder instanceof TaskArray) {
    if (nameOrBuilder.length > 0) {
      targets.push({
        builder: nameOrBuilder.items(),
        name: nameOrBuilder.items()[0].getName(),
      });
    } else {
      console.error(c.red(`No tasks specified for unnamed target'.`));
    }
  } else if (nameOrBuilder) {
    targets.push({
      builder: nameOrBuilder,
      name: nameOrBuilder.getName(),
    });
  } else {
    console.error(c.red('No builders specified for unnamed target.'));
    process.exit(1);
  }
}

export async function buildTargets(options: BuilderOptions = {}): Promise<boolean> {
  const results = await Promise.allSettled(
    targets.map(({ name, builder }) => {
      if (Array.isArray(builder)) {
        const promises = builder.map(b =>
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
        return builder.build(options).then(
          () => {
            console.log(`${c.greenBright('Finished')}: ${name}`);
          },
          err => {
            if (err instanceof BuildError) {
              console.error(`${c.blue('Target')} ${c.magentaBright(name)}: ${c.red(err.message)}`);
            } else {
              console.log(`Not a build error?`);
              console.error(err);
            }
            throw err;
          }
        );
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
