import { readdir, readFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

export function productionGuard() {
  return {
    name: 'exclude-test-infrastructure',
    moduleParsed({ id }) {
      const path = id.replaceAll('\\', '/');
      if (
        /\/(tests|__tests__|test)\//.test(path) &&
        !path.includes('/node_modules/')
      ) {
        throw new Error(`Test module in production graph: ${id}`);
      }
    },
  };
}

export async function inspectProduction(directory) {
  const files = await readdir(directory, {
    recursive: true,
    withFileTypes: true,
  });
  let inspected = 0;
  for (const file of files) {
    if (!file.isFile()) continue;
    const path = resolve(file.parentPath, file.name);
    const content = await readFile(path, 'utf8');
    if (
      /STS_TEST_ONLY_|createFixtureSession|__test|testseed|debugglobals/i.test(
        content,
      )
    ) {
      throw new Error(
        `Test fixture marker in production: ${relative(directory, path)}`,
      );
    }
    inspected++;
  }
  if (!inspected) throw new Error('Production artifact is empty');
  return inspected;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  console.log(
    `Production artifact inspected: ${await inspectProduction(resolve('apps/web/dist'))} files`,
  );
}
