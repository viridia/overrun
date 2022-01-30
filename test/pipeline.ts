target(source('./source', 'demo.txt').dest('./output', null));

target(
  'source.text',
  directory('./source', '.')
    .match('*.txt')
    .map(src => src.dest('./output', null))
);

target(
  'source.index',
  directory('./source')
    .match('*.txt')
    .reduce<string[]>([], (acc, next) => [...acc, next.path.filename])
    .transform(json => JSON.stringify(json))
    .dest('./output/index.json')
);
