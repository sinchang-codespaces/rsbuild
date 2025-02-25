import path from 'path';
import { expect } from '@playwright/test';
import { webpackOnlyTest } from '@scripts/helper';
import { build } from '@scripts/shared';
import { logger } from '@rsbuild/shared';

webpackOnlyTest('should emit progress log in non-TTY environment', async () => {
  process.stdout.isTTY = false;

  const { info, ready } = logger;
  const infoMsgs: any[] = [];
  const readyMsgs: any[] = [];

  logger.info = (message) => {
    infoMsgs.push(message);
  };
  logger.ready = (message) => {
    readyMsgs.push(message);
  };

  await build({
    cwd: __dirname,
    rsbuildConfig: {
      dev: {
        progressBar: true,
      },
    },
  });

  expect(
    infoMsgs.some((message) => message.includes('Client compile progress')),
  ).toBeTruthy();
  expect(
    readyMsgs.some((message) => message.includes('Client compiled')),
  ).toBeTruthy();

  process.stdout.isTTY = true;
  logger.info = info;
  logger.ready = ready;
});
