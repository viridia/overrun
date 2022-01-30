---
layout: default
title: Examples
nav_order: 4
---

# Examples

## Copy files from source to output directory

This example simply copies audio files with the extension `.ogg`.

```ts
import path from 'path';
import { directory, target, output, DirectoryTask } from 'overrun';

const srcBase = path.resolve(__dirname, '../myproject/assets');
const dstBase = path.resolve(__dirname, '../myproject/dist/assets');

target(
  'audio',
  directory(`${srcBase}/audio`, '')
    .match('*.ogg')
    .map((src) => src.dest(`${dstBase}/audio/fx`))
);
```

## Create a JSON file listing the contents of a directory

This example collects source files using a wildcard match and then generates a JSON
file with the names of all the source files found.

```ts
import path from 'path';
import { directory, target, output } from 'overrun';

const srcBase = path.resolve(__dirname, '../myproject/assets');
const dstBase = path.resolve(__dirname, '../myproject/dist/assets');

// Helper to build catalog index.
const catalogIndex = (pattern: string) => {
  return (dir: DirectoryTask) => {
    return dir
      .match(pattern)
      .reduce([], (acc, src) => [...acc, src.path.filename])
      .transform((json) => JSON.stringify(json));
  };
};

// Scenery index file.
target(
  'scenery-index',
  directory(srcBase, 'scenery')
    .pipe(catalogIndex('*.glb'))
    .dest(dstBase, 'scenery/index.json')
);

```

## Optimize GLTF files using @gltf-transform

This example finds GLTF files with the extendion `.glb` and runs a number of optimization
passes on them, using the `transform()` method.

```ts
import path from 'path';
import { directory, target, output } from 'overrun';
import { NodeIO, Document, Logger } from '@gltf-transform/core';
import { resample, dedup } from '@gltf-transform/functions';

const srcBase = path.resolve(__dirname, '../myproject/assets');
const dstBase = path.resolve(__dirname, '../myproject/dist/assets');

const io = new NodeIO();
io.setLogger(new Logger(Logger.Verbosity.ERROR));

const modelOpt = async (src: Buffer): Promise<Buffer> => {
  const gltf = io.readBinary(src.buffer);
  await gltf.transform(resample(), dedup());
  return Buffer.from(io.writeBinary(gltf));
};

target(
  'characters',
  directory(srcBase, 'characters')
    .match('*.glb')
    .map((src) => src.transform(modelOpt).dest(dstBase, null))
);
```

## Optimize SVG files using svgo

This example optimizes icons using SVGO. Because SVGO wants to know the file path, and not
merely its contents, we make a `pipe()` operator rather than the simpler `transform()` method.

```ts
import path from 'path';
import { directory, target, output, SourceFileTask, WritableTask} from 'overrun';
import { optimize } from 'svgo';

const srcBase = path.resolve(__dirname, '../myproject/assets');
const dstBase = path.resolve(__dirname, '../myproject/dist/assets');

const svgConvert = () => {
  return (src: SourceFileTask): WritableTask => {
    return src.transform<string>((srcBuff) => {
      return optimize(srcBuff.toString(), {
        path: src.path,
        plugins: ['preset-default', 'prefixIds'],
      }).data;
    });
  };
};

// SVG files.
target(
  'svg/modifiers',
  directory(srcBase, 'modifiers')
    .match('*.svg')
    .map((src) => src.pipe(svgConvert()).dest(dstBase, null))
);
```

**Next**: [API Reference](./apidoc.md)
