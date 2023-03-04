target(source({ base: './source', fragment: 'demo.txt' }).dest({ base: './output' }));

target(
  'source.text',
  directory({ base: './source' })
    .match('*.txt')
    .map(src => src.dest({ base: './output' }))
);

target(
  'source.index',
  directory('./source')
    .match('*.txt')
    .reduce<string[]>([], (acc, next) => [...acc, next.path.filename])
    .transform(json => JSON.stringify(json))
    .dest('./output/index.json')
);
