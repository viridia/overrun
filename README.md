# Overrun

**Overrun** is a framework for setting up asset processing pipelines in Node.js.

[![npm](https://img.shields.io/npm/v/overrun.svg)](https://www.npmjs.com/package/overrun)
![npm test](https://github.com/viridia/overrun/actions/workflows/node.js.yml/badge.svg)

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

## Documentation

  * [Installation](https://viridia.github.io/overrun/install.html)
  * [Build configuration files](https://viridia.github.io/overrun/buildconfig.html)
  * [Command-line arguments](https://viridia.github.io/overrun/commandline.html)
  * [Examples](https://viridia.github.io/overrun/examples.html)
  * [Roadmap](https://viridia.github.io/overrun/roadmap.html)
  * [API Reference](https://viridia.github.io/overrun/api/modules/index.html)

# Contributors

* Talin

# License

* MIT
