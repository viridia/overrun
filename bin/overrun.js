#!/usr/bin/env node
const fs = require('fs');
const ts = require('typescript');
const { argv, build } = require('../dist/main');

if (argv.f) {
  const buildDef = fs.readFileSync(argv.f);
  let result = ts.transpileModule(buildDef.toString(), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  });
  if (result.diagnostics && result.diagnostics.length > 0) {
    console.log(result.diagnostics);
  } else {
    (function () {
      const { target, source, output, directory } = require('../dist');
      eval(result.outputText);
    })();
    build();
  }
} else {
  console.error('No input file specified');
}
