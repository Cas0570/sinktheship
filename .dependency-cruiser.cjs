const graph = require('./scripts/package-graph.json');
const root = (name) => (name === 'web' ? 'apps/web' : `packages/${name}`);

module.exports = {
  forbidden: [
    {
      name: 'no-cycles-including-types',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
    {
      name: 'no-unresolved',
      severity: 'error',
      from: {},
      to: { couldNotResolve: true },
    },
    ...Object.entries(graph).map(([name, allowed]) => ({
      name: `${name}-dependency-direction`,
      severity: 'error',
      from: { path: `^${root(name)}/src/` },
      to: {
        path: '^(packages|apps)/',
        pathNot: `^(${[name, ...allowed].map(root).join('|')})/`,
      },
    })),
  ],
  options: {
    tsPreCompilationDeps: true,
    doNotFollow: { path: '(^|/)(node_modules|dist)/' },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['types', 'import', 'default'],
    },
  },
};
