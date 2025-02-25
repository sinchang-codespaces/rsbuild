import { join } from 'path';
import { expect, test } from '@playwright/test';
import { build, getHrefByEntryName } from '@scripts/shared';
import { webpackOnlyTest } from '@scripts/helper';

const fixtures = __dirname;

test('should minify template js & css', async ({ page }) => {
  const rsbuild = await build({
    cwd: fixtures,
    runServer: true,
    rsbuildConfig: {
      html: {
        template: './static/index.html',
      },
      performance: {
        removeConsole: ['log', 'warn'],
      },
    },
  });

  await page.goto(getHrefByEntryName('index', rsbuild.port));

  const test = page.locator('#test');

  await expect(test).toHaveCSS('text-align', 'center');
  await expect(test).toHaveCSS('font-size', '146px');
  await expect(test).toHaveText('Hello Rsbuild!');
  await expect(page.evaluate(`window.b`)).resolves.toBe(2);

  const files = await rsbuild.unwrapOutputJSON();

  const content =
    files[Object.keys(files).find((file) => file.endsWith('.html'))!];

  expect(
    content.includes('.test{font-size:146px;background-color:green}'),
  ).toBeTruthy();
  expect(
    content.includes('#a{text-align:center;line-height:1.5;font-size:1.5rem}'),
  ).toBeTruthy();
  expect(content.includes('window.a=1,window.b=2')).toBeTruthy();
  expect(content.includes('console.info(111111)')).toBeTruthy();
  expect(content.includes('console.warn(111111)')).toBeFalsy();

  // keep html comments
  expect(content.includes('<!-- HTML COMMENT-->')).toBeTruthy();

  await rsbuild.close();
});

webpackOnlyTest(
  'should minify template success when enableInlineScripts & enableInlineStyles',
  async ({ page }) => {
    const rsbuild = await build({
      cwd: fixtures,
      runServer: true,
      rsbuildConfig: {
        html: {
          template: './static/index.html',
          // avoid Minified React error #200;
          inject: 'body',
        },
        output: {
          enableInlineScripts: true,
          enableInlineStyles: true,
        },
      },
    });

    await page.goto(getHrefByEntryName('index', rsbuild.port));

    const test = page.locator('#test');

    await expect(test).toHaveCSS('text-align', 'center');
    await expect(test).toHaveCSS('font-size', '146px');
    await expect(test).toHaveText('Hello Rsbuild!');
    await expect(page.evaluate(`window.b`)).resolves.toBe(2);

    const files = await rsbuild.unwrapOutputJSON();

    const content =
      files[Object.keys(files).find((file) => file.endsWith('.html'))!];

    expect(
      content.includes('.test{font-size:146px;background-color:green}'),
    ).toBeTruthy();
    expect(content.includes('window.a=1,window.b=2')).toBeTruthy();

    await rsbuild.close();
  },
);
