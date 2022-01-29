---
layout: default
title: Installation and setup
nav_order: 1
---

# Overview

Overrun is similar to existing task runners such as Gulp, Grunt and so on. However, most of these
tools are intended for building websites - that is, they have a lot of built-in functionality
for processing HTML and JavaScript files. While it is possible to use existing tools for other,
non-web use cases, it can be a struggle. Overrun is intended to be a simpler tool, one which is
easy to build on.

Overrun built on a foundation of `Promise/await` rather than Node.js streams, which makes it
overall much easier to understand and customize.

Build files can be written in TypeScript, and all target and task definitions are strongly
typed. This means that your editor's autocompletion can assist in writing build files.

Overrun supports parallel builds via asynchronous i/o. It does not currently fork new processes
for building, although that may be added in the future.

Overrun supports a "watch mode" that rebuilds output files whenever their input source files
are modified.

# Installation and setup

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

Where `pipeline.ts` represents the name of your build configuration file (described in the
[next section](./buildconfig.md)).

You can also import overrun as a library and execute builds programmatically.

**Next**: [Build Configuration Files](./buildconfig.md)
