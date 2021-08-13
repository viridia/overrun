# Overrun

**Overrun** is a framework for setting up asset processing pipelines in Node.js.

## Features

- Support for abitrary transformations of files.
- Strongly-typed build definition files written in TypeScript.
- Supports parallel build operations via promises.
- Filesystem watch mode looks for source files that have changed and automatically rebuilds
  the targets that are out of date.
- Promise-based API makes it easy to extend with arbitrary transformation steps.
- Supports `reduce()` operations for combining multiple input files into a single output.

### Differences from other task runners:

**Overrun** is similar in concept to tools such as [Gulp](https://gulpjs.com/),
[Grunt](https://gruntjs.com/) or [Brunch](https://brunch.io/), but it has a few
differences. The primary use case for Overrun is processing 3D models and textures for games, but
it can be used to convert other kinds of media as well.

- There is no built-in functionality for generating JavaScript bundles or processing HTML, which
  most of these other tools have.
- It is built around `Promise/await` functionality, as opposed to Node.js streams, making it easy
  to extend with new build rules.
- Build files can be written in TypeScript, and all target and task definitions are strongly
  typed. This means that your editor's autocompletion can assist in writing build files.

## Getting started

```sh
npm install overrun
```

## Build configuration files

Overrun currently functions as a library, and not a stand-alone cli command (that may change).
Your build configuration file is actually your 'main' script. Typically this is called
`pipeline.ts`. Here's a sample build file:

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

This build configuration contains a single target. The target has a pipeline of tasks - it
first scans the `images` directory (using a `directory()` task) for any files matching the
pattern `*.png`. It then reads each file into a Buffer, and then pipes the buffer to a writer
task, which writes the buffer to a new location.

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

A pipeline is built up out of tasks. Most commonly, a pipeline will consist of a *source*
task, followed by one or more *transform* tasks, and finally an *output* task. Note that a
pipeline *must* terminate with an output task in order to be valid - otherwise, the pipeline
would have no effect.

The source task can represent either a single source file (specified with the `source()` directive),
or it can represent a source directory containing multiple source files (specified via
`directory()`).

Subsequent tasks can be defined by calling either `.transform()`, `.pipe()` or `.reduce()` on
the previous task. Each of these methods generates a new task definition, which depends on
the previous task.

Finally, the transformed data can be written to an output file by piping it to an `output()`
task.

## API Reference

### `target(name, pipeline)`

Defines a new build target. The `name` argument is a string indicating the name of the target.
This is used when printing build status; it can also be used to build a subset of all targets.

The `pipeline` parameter is a chain of tasks, the last of which must be an output task or an
array of output tasks.

### `source(base, fragment?)`

Creates a `SourceFileTask` representing a single source file. The task reads the file into memory
and provides subsequent tasks with a `Buffer` object containing the file data.

The two arguments are:

* `base` - either the whole path, or the base portion of the path (see section on paths
  below).
* `fragment` - (optional) The relative portion of the path.

### `directory(base, fragment?)`

Creates a `DirectoryTask` representing a directory of files. The list of files can be
further narrowed by calling `.match(pattern)` on the resulting task.

The two arguments are:

* `base` - either the whole path, or the base portion of the path (see section on paths
  below).
* `fragment` - (optional) The relative portion of the path.

### `output({ base?, path? })`

Creates an output task.

### `Task<T>`:

A `Task` is a TypeScript interface representing an object which produces data asynchronously. It
takes a single template parameter, which represents the type of data produced.

**Methods:**

* `.path` - returns a `Path` object representing the file location for this task's data.
* `.read()` - returns a Promise that resolves to the data output by this task. This is
    generally called by pipeline operators to read the data from the previous step, however operators
    are not required to do this.
* `.transform(transformer)` - creates a new task which transforms the output of this task's
    data. The `transformer` argument is a function which accepts the task's output as an argument,
    and which returns either the transformed data or a promise which resolves to that data.
    The task created will list the current task as a dependency, so if the source file is changed
    the transform task will be re-run.
* `.pipe(taskGen)` - similar to `transform()`, except that it allows more flexibility
    in processing. The `taskGen` is a function which takes a single argument, the current task,
    and which returns a new task. One of things that this gives you is access to the path
    information for the input task.
* `.addDependent(dependent, dependencySet)` - adds a child (dependent) task to this task's list
    of dependents. Used during pipeline construction.

### `TaskArray<T>`:

A `TaskArray` is a `Task` which contains an array of other `Tasks`. This can be used in several
ways - for example, calling `.map()` on a `TaskArray` produces a new `TaskArray` which represents
applying the specified transformation to each item in the array individually.

`TaskArrays` are created by the directory `.files()` and `.match()` methods.

**Methods:**

* `.length` - The number of tasks in the task array.
* `.items` - Returns the array of tasks contained in the TaskArray.
* `.transform(transformer)` - Similar to `Task.transform()` except that it is called with an
  array containing all of the output data for each of the tasks in the `TaskArray`.
* `.pipe(transformer)` - Similar to `Task.pipe()` except that it is called with an
  array containing all of the tasks in the `TaskArray`.
* `.map(taskGen)` - This operates similarly to the `pipe()` function, except that it calls
  the `taskGen` function, not for the entire list of tasks, but for each task individually.
* `.reduce(init, reducer)` - used to combine all of the outputs in the task array together.
  The reducer function operates much like `Array.reduce()` except that it is asynchronous.
  The signature for the reducer is:

  ```
  .reduce<Out>(initVal, (acc, prev) => Out | Promise<Out>): Task<Out>
  ```

  The output of this method is a new Task which produces the combined output of the reduction.

### `AbstractTask<T>`:

An abstract base class useful for defining custom tasks. It implements most of the methods
of the `Task` interface.

### `SourceFileTask`:

A task representing a single source input file. It implements

### `DirectoryTask`:

A task that lists the contents of a directory.

**Methods:**

  * `.files()` - returns a `TaskArray` representing an array of `SourceFileTask`s, one for each file
    in the directory.
  * `.match(pattern)` - returns a `TaskArray` representing an array of `SourceFileTask`s, one for
    each file whose name matches the given pattern.
  * ...plus all of the normal methods of Task.

### `Path`:

Typically in build environments, there is a source directory structure, and a destination
directory structure; and it is often the case that these two are a mirror of each other, or at
least share some structural similarities. As such, it is often convenient to be able to manipulate
paths by swapping out the `source` part of the path and replacing it with the `output` location,
while leaving the rest of the path unchanged. `Path` objects provide a means to do this easily,
although it is not required that they be used this way.

The canonical way to construct a Path is via `Path.from()`:

```ts
const path = Path.from(base, fragment);
```

The `fragment` parameter is optional - if absent then the first argument represents the whole path.
Otherwise, the `base` represents a directory, and the `fragment` argument a path relative to
that directory.

#### `Path` methods:

(Note: Path object are similar to, and are inspired by, the Python pathlib module.)

## Command-line Arguments

* **--version** - Displays the version number of overrun.
* **--help** - Prints help information.
* **-f**, **--pipeline** - Pipeline file to load.
* **--dry-run** - Don't actually write any files.
* **--cwd** - Set current working directory.
* **-w**, **--watch** - Enable watch mode.
* **--targets** - List of targets to build (default all).
* **--color** - Enabled colored output.
* **--no-color** - Disable colored output.

# Author

* Talin
