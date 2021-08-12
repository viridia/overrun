# Overrun

Overrun is a framework for setting up asset pipelines in Node.js.

## Features

### Differences from other task runners

It is similar in concept to tools such as Gulp, Grunt or Brunch, but it has a few differences:

- It is primarily intended for processing of art assets, 3D models, and other media files.
  There is no built-in functionality for generating JavaScript bundles, which most of these
  other tools have.
- It uses Promises (as opposed to Node.js streams), making it easy to write new build rules.
- Build files can be written in TypeScript, and all target and task definitions are strongly
  typed. This means that your editor's autocompletion can assist in writing build files.
- Since everything is async and based on Promises, multiple tasks can execute simultaneously.

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
    .map(src => src.pipe(write({ base: 'output' })))
);

build();
```

This build configuration contains a single target. The target has a pipeline of tasks - it
first scans the `images` directory (using a `directory()` task) for any files matching the
pattern `*.png`. It then reads each file into a Buffer, and then pipes the buffer to a writer
task, which writes the buffer to a new location.
