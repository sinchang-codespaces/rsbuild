import { join, dirname } from 'path';
import { expect, test } from '@playwright/test';
import { fse } from '@rsbuild/shared';
import { build } from '@scripts/shared';
import { pluginReact } from '@rsbuild/plugin-react';

const fixtures = __dirname;

test.describe('output configure multi', () => {
  const distFilePath = join(fixtures, 'rem/dist-1/test.json');

  let rsbuild: Awaited<ReturnType<typeof build>>;

  test.beforeAll(async () => {
    await fse.mkdir(dirname(distFilePath), { recursive: true });
    await fse.writeFile(
      distFilePath,
      `{
      "test": 1
    }`,
    );

    rsbuild = await build({
      cwd: join(fixtures, 'rem'),
      plugins: [pluginReact()],
      rsbuildConfig: {
        output: {
          distPath: {
            root: 'dist-1',
            js: 'aa/js',
          },
          copy: [{ from: './src/assets', to: '' }],
        },
      },
    });
  });

  test.afterAll(async () => {
    await rsbuild.close();
    await rsbuild.clean();
  });

  test('cleanDistPath default (enable)', async () => {
    expect(fse.existsSync(distFilePath)).toBeFalsy();
  });

  test('copy', async () => {
    expect(fse.existsSync(join(fixtures, 'rem/dist-1/icon.png'))).toBeTruthy();
  });

  test('distPath', async () => {
    expect(
      fse.existsSync(join(fixtures, 'rem/dist-1/index.html')),
    ).toBeTruthy();

    expect(fse.existsSync(join(fixtures, 'rem/dist-1/aa/js'))).toBeTruthy();
  });

  test('sourcemap', async () => {
    const files = await rsbuild.unwrapOutputJSON(false);

    const jsMapFiles = Object.keys(files).filter((files) =>
      files.endsWith('.js.map'),
    );
    const cssMapFiles = Object.keys(files).filter((files) =>
      files.endsWith('.css.map'),
    );
    expect(jsMapFiles.length).toBeGreaterThanOrEqual(1);
    expect(cssMapFiles.length).toBe(0);
  });
});

test('cleanDistPath disable', async () => {
  const distFilePath = join(fixtures, 'rem/dist-2/test.json');

  await fse.mkdir(dirname(distFilePath), { recursive: true });
  await fse.writeFile(
    distFilePath,
    `{
    "test": 1
  }`,
  );

  const rsbuild = await build({
    cwd: join(fixtures, 'rem'),
    plugins: [pluginReact()],
    rsbuildConfig: {
      output: {
        distPath: {
          root: 'dist-2',
        },
        cleanDistPath: false,
      },
    },
  });

  expect(fse.existsSync(distFilePath)).toBeTruthy();

  await rsbuild.close();
  rsbuild.clean();
});

test('disableSourcemap', async () => {
  const rsbuild = await build({
    cwd: join(fixtures, 'rem'),
    plugins: [pluginReact()],
    rsbuildConfig: {
      output: {
        distPath: {
          root: 'dist-3',
        },
        disableSourceMap: true,
      },
    },
  });

  const files = await rsbuild.unwrapOutputJSON(false);

  const jsMapFiles = Object.keys(files).filter((files) =>
    files.endsWith('.js.map'),
  );
  const cssMapFiles = Object.keys(files).filter((files) =>
    files.endsWith('.css.map'),
  );
  expect(jsMapFiles.length).toBe(0);
  expect(cssMapFiles.length).toBe(0);
});
