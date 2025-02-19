import {
  removeTailSlash,
  type Define,
  type DefaultRsbuildPlugin,
} from '@rsbuild/shared';

export const pluginDefine = (): DefaultRsbuildPlugin => ({
  name: 'plugin-define',

  setup(api) {
    api.modifyBundlerChain((chain, { CHAIN_ID, bundler }) => {
      const config = api.getNormalizedConfig();
      const publicPath = chain.output.get('publicPath');
      const assetPrefix =
        publicPath && typeof publicPath === 'string'
          ? publicPath
          : config.output.assetPrefix;

      const builtinVars: Define = {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.ASSET_PREFIX': JSON.stringify(
          removeTailSlash(assetPrefix),
        ),
      };

      chain
        .plugin(CHAIN_ID.PLUGIN.DEFINE)
        .use(bundler.DefinePlugin, [
          { ...builtinVars, ...config.source.define },
        ]);
    });
  },
});
