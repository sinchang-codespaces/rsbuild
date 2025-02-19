import { isServerTarget, type SharedRsbuildPluginAPI } from '@rsbuild/shared';

const getAntdMajorVersion = (appDirectory: string) => {
  try {
    const pkgJsonPath = require.resolve('antd/package.json', {
      paths: [appDirectory],
    });
    const { version } = require(pkgJsonPath);
    return Number(version.split('.')[0]);
  } catch (err) {
    return null;
  }
};

export const applyAntdSupport = (api: SharedRsbuildPluginAPI) => {
  api.modifyRsbuildConfig((rsbuildConfig) => {
    rsbuildConfig.source ??= {};

    if (
      rsbuildConfig.source.transformImport === false ||
      rsbuildConfig.source.transformImport?.some(
        (item) => item.libraryName === 'antd',
      )
    ) {
      return;
    }

    const antdMajorVersion = getAntdMajorVersion(api.context.rootPath);
    // antd >= v5 no longer need babel-plugin-import
    // see: https://ant.design/docs/react/migration-v5#remove-babel-plugin-import
    if (antdMajorVersion && antdMajorVersion < 5) {
      rsbuildConfig.source ??= {};
      rsbuildConfig.source.transformImport = [
        ...(rsbuildConfig.source.transformImport || []),
        {
          libraryName: 'antd',
          libraryDirectory: isServerTarget(api.context.target) ? 'lib' : 'es',
          style: true,
        },
      ];
    }
  });
};
