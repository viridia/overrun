import { source, build, target, write } from '../src';

target(source('demo.txt', './source').pipe(write({ base: './output' })));
// target('hello');

build();
