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

Then, in your project's package.json:

```
{
  "build": "overrun -f pipeline.ts",
  "build:watch": "overrun -f pipeline.ts --watch",
}
```

You can also import overrun as a library and excute builds programmatically.

## Command-line Arguments

* **--version** - Displays the version number of overrun.
* **--help** - Prints help information.
* **-f**, **--pipeline** - Pipeline configuration file to run.
* **--dry-run** - Don't actually write any files.
* **--cwd** - Set current working directory before building.
* **-w**, **--watch** - Enable watch mode, .
* **--targets** - List of targets to build (default all).
* **--color** - Enabled colored output.
* **--no-color** - Disable colored output.

## Build configuration files

The build configuration is defined in a TypeScript file, typically named `pipeline.ts`.

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

Each target contains an optional `path` property that represents the location of the file
being processed. Each task in the pipeline inherits the `path` of the previous task in the chain
unless the `path` is explicitly overridden. Typically, the last task in the pipeline - the output
task - will modify the `path` to point to the output location instead of the source location.

# API Reference

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

Creates an output task.

## `interface Task<T>`:

A `Task` is a TypeScript interface representing an object which produces data asynchronously. It
takes a single template parameter, which represents the type of data produced.

**Properties and methods:**

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

## `TaskArray<T>`:

A `TaskArray` is a `Task` which contains an array of other `Tasks`. This can be used in several
ways - for example, calling `.map()` on a `TaskArray` produces a new `TaskArray` which represents
applying the specified transformation to each item in the array individually.

`TaskArrays` are created by the directory `.files()` and `.match()` methods.

**Properties and methods:**

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

## `AbstractTask<T>`:

An abstract base class useful for defining custom tasks. It implements most of the methods
of the `Task` interface.

## `SourceFileTask`:

A task representing a single source input file. It implements

## `DirectoryTask`:

A task that lists the contents of a directory.

**Properties and methods:**

  * `.files()` - returns a `TaskArray` representing an array of `SourceFileTask`s, one for each file
    in the directory.
  * `.match(pattern)` - returns a `TaskArray` representing an array of `SourceFileTask`s, one for
    each file whose name matches the given pattern.
  * ...plus all of the normal methods of Task.

## `Path`:

A `Path` object contains a filesystem path. Path object are similar to, and are inspired by, the
Python `pathlib` module.

Typically in build environments, there is both a source directory structure and a destination
directory structure; and it is often the case that these two are a mirror of each other, or at
least share some structural similarities.

As such, it is often convenient to be able to manipulate paths by swapping out the `source` part of
the path and replacing it with the `output` location, while leaving the rest of the path unchanged.
`Path` objects provide a means to do this easily, although it is not required that they be used
this way.

The `Path` object actually contains two path strings, known as the `base` and the `fragment`.
The `base` represents either the source or destination directory, while the `fragment` represents
the location of a file or directory within the base. The full path is simply the concatenation
of `base` and `fragment` together.

The `base` part of the path is optional; if not present then the `fragment` represents the
complete path. (If the fragment is a relative path, it will be relative to the current working
directory.)

The `base` path need not be an absolute path, although it often is. If it is a relative path,
it will be resolved relative to the current working directory.

The canonical way to construct a Path is via `Path.from()`, which has two forms:

```ts
const path = Path.from(fragment);
const path = Path.from(base, fragment);
```

If supplied with a single argument, that argument represents the `fragment` part of the path.
Otherwise, the first argument is the `base` and the second argument is the `fragment`.

You can also construct a Path object directory, however note that the order of arguments is
reversed, making the second parameter the optional one:

```ts
const path = new Path(fragment, base);
```

**Properties and methods:**

  * `base` - The base portion of the path.
  * `fragment` - The part of the path relative to the base.
  * `complete` - The complete path, including both base and fragment.
  * `filename` - The filename part of the path, including the filename extension.
  * `ext` - The filename extension portion of the path.
  * `stem` - The filename part of the path, **not** including the filename extension.
  * `parent` - Returns a `Path` object representing the enclosing directory of this path.
  * `parentName` - Returns a string giving the path to the enclosing directory of this path.
  * `isAbsolute` - True if this is an absolute path, false otherwise.
  * `resolve(...fragment)` - Returns a new Path object representing the concatenation of this
    path with one or more relative paths.
  * `withBase(newBase)` - Returns a copy of this `Path` object, with the same fragment as this
    path, but with a different base path. The `newBase` parameter can either be a string or
    a `Path` object.
  * `withExtension(newExt)` - Returns a copy of this `Path` object, but with the file
    extension replaced by `newExt`.
  * `withStem(newStem)` - Returns a copy of this `Path` object, but with the stem portion of
    the path replaced by `newStem`.
  * `withFilename(newFilename: string)` - Returns a copy of this path, but with the filename
    portion (including extension) replaced by `newFilename`.

# Contributors

* Talin

# License

* MIT
