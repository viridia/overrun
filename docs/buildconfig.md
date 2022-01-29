---
layout: default
title: Build configuration files
nav_order: 2
---

# Build configuration files

The build configuration is defined in a TypeScript file, typically named `pipeline.ts`.
Here's a minimal example of a build configuration:

```ts
// A build target which simply copies a bunch of files
target(
  'images',
  directory(__dirname, 'images')
    .match('*.png')
    .map(src => src.pipe(output({ base: 'output' })))
);
```

This build configuration contains a single target. The target has a "pipeline" of tasks - it
first scans the `images` directory (using a `directory()` task) for any files matching the
glob pattern `*.png`. It then reads each file into a `Buffer`, and then pipes the buffer to a
"writer" task, which writes the buffer to a new location.

Instead of running the `overrun` cli command, you can make your pipeline file an executable
program and import overrun as a library:

```ts
#!/bin/env ts-node
import { target, source, write, build } from 'overrun';

// A build target which simply copies a bunch of files
target(
  'images',
  directory(__dirname, 'images')
    .match('*.png')
    .map(src => src.pipe(output({ base: 'output' })))
);

build();
```

Here's more elaborate example which optimizes 3D models files in `.glb` format, using the
`gltf-transform` library.

```ts
import { build, directory, target, write } from 'overrun';
import { NodeIO, Document, Logger } from '@gltf-transform/core';
import { resample, dedup } from '@gltf-transform/functions';
import path from 'path';

const srcBase = path.resolve(__dirname, '../../artwork');
const dstBase = path.resolve(__dirname, '../assets');
const io = new NodeIO();

// Optimize character model files.
target(
  'characters',
  directory(srcBase, 'characters')
    .match('*.glb')
    .map(src =>
      src
        .transform(async (srcBuffer: Buffer) => {
          const gltf = io.readBinary(srcBuffer.buffer);
          await gltf.transform(resample(), dedup());
          return Buffer.from(io.writeBinary(gltf));
        })
        .pipe(output({ base: dstBase }))
    )
);

build();
```

## Concepts: Targets and Tasks

A build configuration file consists of a number of _targets_, each of which is associated with
one or more build artifacts. The format of a target declaration is:

```
target(<name>, <pipeline>);
```

The `name` parameter is a string which uniquely identifies the target, and is printed to the
console when the target build is complete. The `pipeline` parameter specified a sequence of
tasks to be performed when the target is out of date.

A pipeline is built up out of _tasks_. Most commonly, a pipeline will consist of a _source_
task, followed by one or more _transform_ tasks, and finally an _output_ task. A pipeline
_must_ terminate with an output task in order to be valid - otherwise, the pipeline
will have no effect.

The source task can represent either a single source file (specified with the `source()`
directive), or it can represent a source directory containing multiple source files (specified via
`directory()`).

Subsequent tasks can be defined by calling either `.transform()`, `.pipe()` or `.reduce()` on
the previous task. Each of these methods generates a new task definition, which depends on
the previous task.

Finally, the transformed data can be written to an output file by piping it to an `output()`
task.

## Concepts: Path objects

A `Path` object contains a filesystem path. Path object are similar to, and are inspired by, the
Python `pathlib` module. Note that `Path` objects are immutable.

Overrun uses `Path` objects to represent the location of a source or output file. Each task contains an optional `path` property that represents the location of the file being processed.
For `source()` and `directory()` tasks, this path is the location of the source file or directory specified. For other kinds of tasks, the `path` in inherited from the previous task
in the pipeline, unless the `path` is explicitly overridden. Typically, the last task in the
pipeline - the output task - will modify the `path` to point to the output location instead
of the source location.

Often times in build environments, there is both a "source" directory structure and a "destination"
directory structure; and it is frequently the case that these two hierarchies are a mirror of each
other, or at least share some structural similarities.

As such, it is often convenient to be able to manipulate paths by swapping out the `source` part of
the path and replacing it with the `output` location, while leaving the rest of the path unchanged.
`Path` objects provide a means to do this easily, although it is not required that they be used
this way.

Internally, a `Path` object contains two strings: a "base" and a "fragment". The "base" represents
the root directory of your build (either source or destination), while the "fragment" represents
the relative path from the base directory. Thus, given a source path object, you can easily
generate a new path object with a different base but keeping the same fragment.

Note that the "base" is optional; if it is not specified, then the fragment is treated as a single
absolute path.

The canonical way to construct a Path is via `Path.from()`. This has two forms, one which takes
a single argument which is a complete path (either absolute or relative to the current directory),
and the other form which accepts a base and a fragment path. The method `.withBase(newBase)` can be used construct a copy of the current path but with a different base path.

# Build file commands

This section describes the various build commands that can be invoked from within the build
configuration file.

Note that it is not necessary to `import` the various commands from overrun, but it does not
hurt to do so either. Overrun will inject these definitions into the runtime environment if
they are not explicitly imported.

## `target(name, pipeline)`

Defines a new build target. The `name` argument is a string indicating the name of the target.
The name is used when printing build status; it can also be used to build a subset of all targets.

The `pipeline` parameter is a chain of tasks, the last of which must be an output task or an
array of output tasks. The pipeline parameter should contain a chain of build commands, starting
with either `source()` or `directory()`.

## `source(base, fragment?)`

Creates a `SourceFileTask` representing a single source file. The task reads the file into memory
and provides subsequent tasks with a `Buffer` object containing the file data.

The two arguments are:

- `base` - either the whole path, or the base portion of the path (see section on paths
  above).
- `fragment` - (optional) The relative portion of the path.

## `directory(base, fragment?)`

Creates a `DirectoryTask` representing a directory of files. The list of files can be
further narrowed by calling `.match(pattern)` on the resulting task.

The two arguments are:

- `base` - either the whole path, or the base portion of the path (see section on paths
  below).
- `fragment` - (optional) The relative portion of the path.

## `output({ base?, path? })`

Creates an output task, which accepts either a `string` or `Buffer` as input, and writes it
to a file. It accepts an object which has several optional properties:

- `base` - Replaces the `base` part of the path associated with the output task.
- `path` - Replaces the entire path associated with the output task.

Replacing the path causes the task to write to a different location than the default.

## `build()`

This function tells overrun to initiate a build. This is only needed if you are using overrun
as a library - if you are running the `overrun` command, this will happen automatically.

Note that even when running overrun as a library, it still recognizes command-line arguments.
(This may change.)

# Transforms and Pipes

Most of the time you'll want to do more than simply copy files from place to place, but instead
will want to modify the data in some way. The two main ways this is done is via `.transform()` and
`.pipe()` methods.

The `.transform(transformer)` method provides a simple way to transform data. It takes as it's
argument a callback which converts data from one form to another, with the following signature:

`transformer<In, Out>(input: In) => Out | Promise<Out>`

The transformer function has a single argument, `input`, whose type must match the output
type of the previous task in the task chain. For a `source` file task, that type will be `Buffer`.

Similarly, transformer function has an `Out` type which must match the input type of the next
task, although it can also return a promise which resolves to that type. Output tasks
(generated by `output`) expects the input to be of either type `string` or `Buffer`.

Other kinds of tasks may have any data type. For example, one can easily imagine a chain of
tasks which read a file (`Buffer`), convert to JSON (`JsonValue`), do some processing on the
JSON (`JsonValue`), serialized the JSON (`string`), and then write to a file, which might
look something like the following:

```ts
target(
  'json-pretty',
  source(srcBase, 'config.json')
    .transform(str => JSON.parse(str))
    .transform(sortKeys) // Some function that changes the JSON
    .transform(json => JSON.stringify(json))
    .pipe(output({ base: dstBase }))
);
```

The `.transform()` method returns a new task containing your transformer - you can use this
to chain additional processing steps from that task.

The `.transform()` does have some limitations - for example, it can only access the content
of the file being processed, and not any other attributes (like the file name).

The `.pipe(taskGen)` method is more complex to use, but allows greater flexibility. Instead of
taking in a simple transformation function, it takes a task constructor callback - that is, a function which generates a `Task`. The signature of this function is:

`taskGen<In, Out>(input: Task<In>) => Task<Out>`

This looks similar to the signature for the transform function; in fact `.transform()`
internally calls `.pipe()`. But the difference is that instead of accepting and returning
the actual data from the file, it accepts an input `Task` object, which means that it has
access to all of the methods and attributes of the input task. The return result of the function
is a new `Task` object (usually a `TransformTask`) which represents the processing step
being performed.

With `.pipe()`, you can do more than simply convert the data. For example, you can:

- Access the `.path` of the input task.
- Create multiple tasks, either sequential or operating in parallel.
- Choose whether or not to read the file data (maybe all you care about is the file's name.)
- Access the data from the input task using `input.read()`.

Here's a variation of the previous example that uses `pipe`: internally, we are creating a new
task by calling `.transform()` on the previous task. This task adds a new property to the JSON
which is the name of the file being processed. Why didn't we just call `.transform()` directly
instead of bothering with `.pipe()`? Because `transform` by itself doesn't have access to the
name of the input file, only the data contained within it.

```ts
target(
  'json-add-name',
  source(srcBase, 'config.json')
    .transform(str => JSON.parse(str))
    .pipe(inputTask => {
      return inputTask.transform(jsonData => {
        return {
          ...jsonData,
          name: inputTask.path.filename,
        }
      });
    });
    .transform(json => JSON.stringify(json))
    .pipe(output({ base: dstBase }))
);
```

We could instead have constructed a `TransformTask` directly, which looks almost the same:

```ts
target(
  'json-add-name',
  source(srcBase, 'config.json')
    .transform(str => JSON.parse(str))
    .pipe(inputTask => {
      return new TransformTask(inputTask, jsonData => {
        return {
          ...jsonData,
          name: inputTask.path.filename,
        };
      });
    })
    .transform(json => JSON.stringify(json))
    .pipe(output({ base: dstBase }))
);
```

Note that any function that conforms to the `taskGen` signature - that is, takes in one task and
returns another - is for all intents and purposes a plugin. For example, the `output()` function
is simply a function which returns another function that is a task generator, one that
generates an `OutputFileTask`.

# Task arrays - map() and reduce()

Unlike the `source()` function, the `directory()` function represents multiple files to be
processed. For these kinds of targets, things work a bit differently. You can still use
`.transform()` and `.pipe()`, but the input data that will be provided will be just a list
of all the filenames, not the file contents. Most of the time this is not what you want.

To get access to the actual file content, you'll need to call the `.files()` method or
the `.match(pattern)` method of the `DirectoryTask`. These will return a `TaskArray`
object, which contains an array of tasks, one for each source file in the collection.

There are several ways to use `TaskArray`s, but most of the time you'll use one of two
transformer methods, `.map` and `.reduce`.

The `.map()` method can be used to transform each file in the `TaskArray` individually. The
input to `.map()` is a task constructor function, similar to what `.pipe()` accepts. The `map()`
method calls the task constructor function for each task, and then takes all of those
newly-created tasks and binds them together into a new `TaskArray`.

Here's an example which simply copies all files matching a glob pattern to the output directory:

```ts
target(
  "records",
  directory(srcBase, '')
    .match("*.json")
    .map((src) => src.pipe(output({ base: dstBase })))
);
```

Note that in this example, we're using the base/fragment functionality of the `Path` object:
all of the source files have the same base path, but different fragments. So when the output
step replaces the base portion of the path, the fragment is unchanged, meaning that each
mapped file gets written to a different output location.

Sometimes you may want to combine a bunch of input files together into a single
result. This is where `.reduce()` comes in. It accepts an initial state and a *reducer* function.
The reducer function has the following signature:

`reducer: (acc: Out, next: In) => Out | Promise<Out>`

This is similar to the callback used for `.transform()`, except that it has an additional parameter
that contains the accumulated value. It is called once for each task in the task array, where
`next` containes the data for the Nth task and `acc` contains the reduced data for tasks
(0 .. N-1).

So let's say you wanted to concatenate a bunch of text files together:

```ts
target(
  "example",
  directory(srcBase, '')
    .match("*.json")
    .reduce('', (acc, src) => src + acc)
    .pipe(output({ base: dstBase, path: 'combined.txt' }))
);
```

The `.reduce` function returns a single `Task` whose output is the accumulation of all of the
input tasks.

**Next**: [Command Line Arguments](./commandline.md)
