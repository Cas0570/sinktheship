import { readFileSync, readdirSync } from 'node:fs';
import { resolve, relative, sep } from 'node:path';
import ts from 'typescript';

const graph = JSON.parse(readFileSync(new URL('./package-graph.json', import.meta.url)));
const errors = [];
const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const fail = (path, message) => errors.push(`${path}: ${message}`);
const packageRoot = (name) => name === 'web' ? 'apps/web' : `packages/${name}`;

function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = `${directory}/${entry.name}`;
    return entry.isDirectory() ? files(path) : /\.[cm]?[jt]sx?$/.test(path) ? [path] : [];
  });
}

for (const [name, allowed] of Object.entries(graph)) {
  const root = packageRoot(name);
  const manifest = readJson(`${root}/package.json`);
  const runtime = { ...manifest.dependencies, ...manifest.peerDependencies, ...manifest.optionalDependencies };
  const all = { ...runtime, ...manifest.devDependencies };
  if (name === 'game-core' && Object.keys(runtime).length) {
    fail(root, 'core-runtime-dependency: core must have no runtime, optional or peer dependencies');
  }
  for (const [dependency, version] of Object.entries(all)) {
    if (!dependency.startsWith('@sinktheship/')) continue;
    const target = dependency.slice('@sinktheship/'.length);
    const config = ['tsconfig', 'eslint-config'].includes(target);
    if (version !== 'workspace:*') fail(root, `workspace-protocol: ${dependency}`);
    if (!allowed.includes(target) && !(config && manifest.devDependencies?.[dependency])) {
      fail(root, `package-dag: ${name} cannot depend on ${target}`);
    }
  }
  const exports = manifest.exports ?? {};
  if ((name !== 'web' && !exports['.']) || Object.keys(exports).some((key) => key !== '.' && !['tsconfig', 'eslint-config'].includes(name))) {
    fail(root, 'root-exports: only explicit public roots are allowed');
  }
  if (JSON.stringify(exports).includes('*') || JSON.stringify(exports).includes('/src/')) {
    fail(root, 'root-exports: wildcard and source exports are forbidden');
  }
  const config = readJson(`${root}/tsconfig.json`);
  if (config.compilerOptions?.paths || config.compilerOptions?.baseUrl) fail(root, 'no-path-aliases: use package exports');
  const refs = (config.references ?? []).map((ref) => resolve(root, ref.path)).sort();
  const expected = Object.keys(runtime).filter((key) => key.startsWith('@sinktheship/'))
    .map((key) => resolve(packageRoot(key.slice('@sinktheship/'.length)))).sort();
  if (JSON.stringify(refs) !== JSON.stringify(expected)) fail(root, 'project-references: must match internal runtime dependencies');

  for (const file of files(`${root}/src`)) {
    const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
    function checkSpecifier(specifier) {
      if (specifier.startsWith('.')) {
        const target = resolve(file, '..', specifier);
        const path = relative(resolve(root, 'src'), target);
        if (path === '..' || path.startsWith(`..${sep}`)) fail(file, `cross-package-relative: ${specifier}`);
        return;
      }
      const dependency = specifier.startsWith('@') ? specifier.split('/').slice(0, 2).join('/') : specifier.split('/')[0];
      if (specifier.startsWith('@sinktheship/') && specifier !== dependency) fail(file, `deep-import: ${specifier}`);
      if (specifier.startsWith('@sinktheship/') && !allowed.includes(dependency.slice('@sinktheship/'.length))) {
        fail(file, `package-dag: ${specifier}`);
      }
      if (name === 'game-core') fail(file, `core-runtime-import: ${specifier}`);
      if (specifier.startsWith('node:') && name === 'benchmark') return;
      if (!runtime[dependency]) fail(file, `undeclared-import: ${specifier}`);
    }
    function visit(node) {
      if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteralLike(node.moduleSpecifier)) {
        checkSpecifier(node.moduleSpecifier.text);
      }
      if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument) && ts.isStringLiteralLike(node.argument.literal)) {
        checkSpecifier(node.argument.literal.text);
      }
      if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference) && node.moduleReference.expression && ts.isStringLiteralLike(node.moduleReference.expression)) {
        checkSpecifier(node.moduleReference.expression.text);
      }
      if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(node.expression) && node.expression.text === 'require'))) {
        const specifier = node.arguments[0];
        if (specifier && ts.isStringLiteralLike(specifier)) checkSpecifier(specifier.text);
        else fail(file, 'dynamic-import: module paths must be literal for boundary verification');
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else console.log('Package manifests, public imports and project references are valid.');
