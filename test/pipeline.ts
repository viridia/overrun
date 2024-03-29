target(source({ root: './source', fragment: 'demo.txt' }).dest({ root: './output' }));

target(
  'source.text',
  directory({ root: './source' })
    .match('*.txt')
    .map(src => src.dest({ root: './output' }))
);

target(
  'source.index',
  directory('./source')
    .match('*.txt')
    .reduce<string[]>([], (acc, next) => [...acc, next.path.filename])
    .transform(json => JSON.stringify(json))
    .dest('./output/index.json')
);

target(
  'colors.text',
  directory({ root: './source', fragment: 'colors' })
    .match('*.md')
    .map(src => src.dest({ root: './output' }))
);

target(
  'colors.index',
  directory('./source', 'colors')
    .match('*.md')
    .reduce<string[]>([], (acc, next) => [...acc, next.path.filename])
    .transform(json => JSON.stringify(json))
    .dest('./output/colors/index.json')
);
