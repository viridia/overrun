#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const ts = require('typescript');
const { createRequire } = require('module');
const { Script, createContext } = require('vm');
const { getArgs, build } = require('../dist/main');

async function overrun() {
  const args = await getArgs();
  if (args.f) {
    const filename = path.resolve(args.f);
    const buildDef = fs.readFileSync(filename);
    let result = ts.transpileModule(buildDef.toString(), {
      fileName: filename,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
        moduleResolution: 'node',
      },
    });
    if (result.diagnostics && result.diagnostics.length > 0) {
      console.warn(result.diagnostics);
    } else {
      (function () {
        const overrun = require('../dist');
        const context = createContext({
          ...overrun,
          Buffer: Buffer,
          exports: {},
          require: createRequire(filename),
          __filename: filename,
          __dirname: path.dirname(filename),
        });
        const script = new Script(result.outputText, { filename });
        script.runInContext(context);
      })();
      build();
    }
  } else {
    console.error('No input file specified');
  }
}

overrun();
