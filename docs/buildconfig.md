# Build configuration files

The build configuration is defined in a TypeScript file, typically named `pipeline.ts`.
Here's a minimal example of a build configuration:

```ts
// A build target which simply copies a bunch of files
target('images',
  directory(__dirname, 'images')
    .match('*.png')
    .map(src => src.pipe(output({ base: 'output' })))
);
```

This build configuration contains a single target. The target has a pipeline of tasks - it
first scans the `images` directory (using a `directory()` task) for any files matching the
pattern `*.png`. It then reads each file into a Buffer, and then pipes the buffer to a writer
task, which writes the buffer to a new location.

Instead of running the `overrun` cli command, you can make your pipeline file an executable
program and import overrun as a library:

```ts
#!/bin/env ts-node
import { target, source, write, build } from 'overrun';

// A build target which simply copies a bunch of files
target('images',
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
    .map(src => src.transform(async (srcBuffer: Buffer) => {
      const gltf = io.readBinary(srcBuffer.buffer);
      await gltf.transform(resample(), dedup());
      return Buffer.from(io.writeBinary(gltf));
    })
    .pipe(output({ base: dstBase })))
);

build();
```

## Concepts: Targets and Tasks

A build definition file consists of a number of *targets*, each of which is associated with
one or more build artifacts. The format of a target declaration is:

```
target(<name>, <pipeline>);
```

The `name` parameter is a string which uniquely identifies the target. The `pipeline` parameter
specified a sequence of tasks to be performed when the target is out of date.

A pipeline is built up out of *tasks*. Most commonly, a pipeline will consist of a *source*
task, followed by one or more *transform* tasks, and finally an *output* task. Note that a
pipeline *must* terminate with an output task in order to be valid - otherwise, the pipeline
will have no effect.

The source task can represent either a single source file (specified with the `source()` directive),
or it can represent a source directory containing multiple source files (specified via
`directory()`).

Subsequent tasks can be defined by calling either `.transform()`, `.pipe()` or `.reduce()` on
the previous task. Each of these methods generates a new task definition, which depends on
the previous task.

Finally, the transformed data can be written to an output file by piping it to an `output()`
task.

## Concepts: Path objects

A `Path` object contains a filesystem path. Path object are similar to, and are inspired by, the
Python `pathlib` module.

Each task contains an optional `path` property that represents the location of the file
being processed. For source and directory tasks, this path is the location of the source file
or directory specified. For other kinds of tasks, the `path` in inherited from the previous task
in the pipeline, unless the `path` is explicitly overridden. Typically, the last task in the
pipeline - the output task - will modify the `path` to point to the output location instead
of the source location.

Typically in build environments, there is both a source directory structure and a destination
directory structure; and it is often the case that these two are a mirror of each other, or at
least share some structural similarities.

As such, it is often convenient to be able to manipulate paths by swapping out the `source` part of
the path and replacing it with the `output` location, while leaving the rest of the path unchanged.
`Path` objects provide a means to do this easily, although it is not required that they be used
this way.

The canonical way to construct a Path is via `Path.from()`.

# Build file commands

## `target(name, pipeline)`

Defines a new build target. The `name` argument is a string indicating the name of the target.
This is used when printing build status; it can also be used to build a subset of all targets.

The `pipeline` parameter is a chain of tasks, the last of which must be an output task or an
array of output tasks.

## `source(base, fragment?)`

Creates a `SourceFileTask` representing a single source file. The task reads the file into memory
and provides subsequent tasks with a `Buffer` object containing the file data.

The two arguments are:

* `base` - either the whole path, or the base portion of the path (see section on paths
  below).
* `fragment` - (optional) The relative portion of the path.

## `directory(base, fragment?)`

Creates a `DirectoryTask` representing a directory of files. The list of files can be
further narrowed by calling `.match(pattern)` on the resulting task.

The two arguments are:

* `base` - either the whole path, or the base portion of the path (see section on paths
  below).
* `fragment` - (optional) The relative portion of the path.

## `output({ base?, path? })`

Creates an output task, which accepts either a `string` or `Buffer` as input, and writes it
to a file. It accepts an object which has several optional properties:

* `base` - Replaces the `base` part of the path associated with the output task.
* `path` - Replaces the entire path associated with the output task.

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

Note that the `In` type must match the output type of the previous task. For a source task,
that type will be `Buffer`. Similarly, the `Out` type must match the input type of the next
task, although it can also return a promise which resolves to that type. For output tasks,
the input type is either `string` or `Buffer`.

The `.transform()` method returns a new task containing your transformer - you can use this
to chain additional processing steps from that task.

The `.pipe(taskGen)` method is more complex, but allows greater flexibility. Instead of taking
in a simple transformation function, it takes a task constructor callback - that is, a function
which generates a `Task`. The signature of this function is:

  `taskGen<In, Out>(input: Task<In>) => Task<Out>`

(In fact `.transform()` internally calls `.pipe()`, but automatically creates a `TransformTask`
to handle the transformation.)

One of the advantages of `.pipe()` is that you can do more than simply convert the data. For
example, you can:

* Access the data from the input task using `input.read()`.
* Access the `.path` of the input task.
* Choose whether or not to read the file data (maybe all you care about is the file's name.)
* Create multiple tasks, either sequential or operating in parallel.

Note that any function that conforms to the `taskGen` signature is, for all intents and purposes,
a plugin. For example, the `output()` function is simply a function which returns another function
that is a task generator, one that generates an `OutputFileTask`.

# Tssk arrays - map() and reduce()

For targets that represent multiple files, things work a bit differently. You can still use
`.transform()` and `.pipe()`, but the data that will be provided to the next stage of the pipeline
will be a `TaskArray` object, which contains an array of tasks, one for each source file in the
collection.

Alternatively, you can use the `.map()` function to transform each file individually. The input
to `.map()` is a task constructor function, similar to what `.pipe()` uses. The output
of `.map()` is another `TaskArray`, containing all of the tasks that were generated by the mapping.

Sometimes you may want to process files one at a time, but combined them together into a single
result. This is where `.reduce()` comes in. It accepts an initial state and a reducer function.
The reducer function has the following signature:

  `reducer: (acc: Out, next: In) => Out | Promise<Out>`

This is similar to the callback used for `.transform()`, except that it has an additional parameter
that contains the accumulated value. It is called once for each task in the task array, where
`next` containes the data for the Nth task and `acc` contains the reduced data for tasks (0 .. N-1).

The `.reduce` function returns a single Task whose output is the accumulation of all of the
input tasks.

Next - [Command-line arguments](./commandline.html)
