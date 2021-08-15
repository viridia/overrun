import { source, build, target, output, directory } from '../dist';

target(source('./source', 'demo.txt').pipe(output({ base: './output' })));
target(
  'source.text',
  directory('./source', '.')
    .match('*.txt')
    .map(output({ base: './output' }))
);
target(
  'source.index',
  directory('./source')
    .match('*.txt')
    .reduce<string[]>([], (acc, next) => [...acc, next.path.filename])
    .transform(json => JSON.stringify(json))
    .pipe(output({ base: './output', path: 'index.json' }))
);

build();
