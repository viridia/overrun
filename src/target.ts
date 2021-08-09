import c from 'ansi-colors';
import { BuildError } from './errors';

/** A target is anything that can be built. */
export interface Builder {
  getName(): string;
  build(): Promise<void>;
}

export interface Target {
  name: string;
  builder: Builder;
}

const targets: Target[] = [];

type Builders = Builder | Builder[];

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
      console.error(c.red(`No builders specified for rule '${nameOrBuilder}'.`));
      process.exit(1);
    } else if (Array.isArray(builder)) {
      builder.forEach(elem => {
        targets.push({
          builder: elem,
          name: nameOrBuilder,
        });
      });
    } else {
      targets.push({
        builder,
        name: nameOrBuilder,
      });
    }
  } else if (Array.isArray(nameOrBuilder)) {
    nameOrBuilder.forEach(builder => {
      targets.push({
        builder,
        name: builder.getName(),
      });
    });
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

export async function buildTargets(): Promise<boolean> {
  const results = await Promise.allSettled(
    targets.map(({ name, builder }) =>
      builder.build().catch(err => {
        if (err instanceof BuildError) {
          console.error(`${c.blue('Target')} ${c.magentaBright(name)}: ${c.red(err.message)}`);
        } else {
          console.error(err);
        }
        throw err;
      })
    )
  );

  const rejected = results.filter(result => result.status === 'rejected');
  if (rejected.length > 0) {
    console.log(c.red(`${rejected.length} targets failed.`));
    return false;
  }
  return true;
}
