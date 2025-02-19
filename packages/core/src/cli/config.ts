import fs from 'fs';
import jiti from 'jiti';
import { join } from 'path';
import type {
  RsbuildPlugin,
  RsbuildConfig as BaseRsbuildConfig,
} from '@rsbuild/shared';
import { restartDevServer } from '../server/restart';

export type RsbuildConfig = BaseRsbuildConfig & {
  plugins?: RsbuildPlugin[];
  /**
   * @private only for testing
   */
  provider?: any;
};

export const defineConfig = (config: RsbuildConfig) => config;

const resolveConfigPath = () => {
  const CONFIG_FILES = [
    'rsbuild.config.ts',
    'rsbuild.config.js',
    'rsbuild.config.mjs',
    'rsbuild.config.cjs',
    'rsbuild.config.mts',
    'rsbuild.config.cts',
  ];

  const root = process.cwd();

  for (const file of CONFIG_FILES) {
    const configFile = join(root, file);

    if (fs.existsSync(configFile)) {
      return configFile;
    }
  }

  return null;
};

async function watchConfig(configFile: string) {
  const chokidar = await import('@rsbuild/shared/chokidar');
  const watcher = chokidar.watch(configFile, {});
  const callback = async () => {
    watcher.close();
    await restartDevServer({ filePath: configFile });
  };

  watcher.on('change', callback);
  watcher.on('unlink', callback);
}

export async function loadConfig(): Promise<ReturnType<typeof defineConfig>> {
  const configFile = resolveConfigPath();

  if (configFile) {
    const loadConfig = jiti(__filename, {
      esmResolve: true,
      // disable require cache to support restart CLI and read the new config
      requireCache: false,
      interopDefault: true,
    });

    const command = process.argv[2];
    if (command === 'dev') {
      watchConfig(configFile);
    }

    return loadConfig(configFile);
  }

  return {};
}
