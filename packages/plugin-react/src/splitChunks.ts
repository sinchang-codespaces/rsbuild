import { createDependenciesRegExp } from '@rsbuild/core/plugins/splitChunks';
import {
  isProd,
  isPackageInstalled,
  type CacheGroup,
  type SharedRsbuildPluginAPI,
} from '@rsbuild/shared';

export async function splitByExperience(rootPath: string): Promise<CacheGroup> {
  const experienceCacheGroup: CacheGroup = {};

  const packageRegExps: Record<string, RegExp> = {
    react: createDependenciesRegExp(
      'react',
      'react-dom',
      'scheduler',
      ...(isProd()
        ? []
        : ['react-refresh', '@pmmmwh/react-refresh-webpack-plugin']),
    ),
    router: createDependenciesRegExp(
      'react-router',
      'react-router-dom',
      '@remix-run/router',
      'history',
    ),
  };

  // Detect if the package is installed in current project
  // If installed, add the package to cache group
  if (isPackageInstalled('antd', rootPath)) {
    packageRegExps.antd = createDependenciesRegExp('antd');
  }
  if (isPackageInstalled('@arco-design/web-react', rootPath)) {
    packageRegExps.arco = createDependenciesRegExp(/@?arco-design/);
  }
  if (isPackageInstalled('@douyinfe/semi-ui', rootPath)) {
    packageRegExps.semi = createDependenciesRegExp(
      /@(ies|douyinfe)[\\/]semi-.*/,
    );
  }

  Object.entries(packageRegExps).forEach(([name, test]) => {
    const key = `lib-${name}`;

    experienceCacheGroup[key] = {
      test,
      priority: 0,
      name: key,
      reuseExistingChunk: true,
    };
  });

  return experienceCacheGroup;
}

export const applySplitChunksRule = (api: SharedRsbuildPluginAPI) => {
  api.modifyRsbuildConfig(async (rsbuildConfig) => {
    const { chunkSplit } = rsbuildConfig.performance || {};

    if (chunkSplit?.strategy !== 'split-by-experience') {
      return;
    }

    const cacheGroups = await splitByExperience(api.context.rootPath);
    const override = rsbuildConfig.performance!.chunkSplit!.override;

    rsbuildConfig.performance!.chunkSplit!.override = {
      cacheGroups: {
        ...cacheGroups,
        ...(override ? override.cacheGroups : {}),
      },
      ...(override || {}),
    };
  });
};
