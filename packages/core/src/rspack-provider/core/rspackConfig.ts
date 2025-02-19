import {
  debug,
  CHAIN_ID,
  castArray,
  BundlerConfig,
  modifyBundlerChain,
  mergeChainedOptions,
  type NodeEnv,
  type RspackConfig,
  type RsbuildTarget,
  type ModifyChainUtils,
  type ModifyRspackConfigUtils,
} from '@rsbuild/shared';
import { getCompiledPath } from '../shared';
import type { Context } from '../types';

async function modifyRspackConfig(
  context: Context,
  rspackConfig: RspackConfig,
  utils: ModifyRspackConfigUtils,
) {
  debug('modify Rspack config');
  let [modifiedConfig] = await context.hooks.modifyRspackConfigHook.call(
    rspackConfig,
    utils,
  );

  if (context.config.tools?.rspack) {
    modifiedConfig = mergeChainedOptions({
      defaults: modifiedConfig,
      options: context.config.tools.rspack,
      utils,
      mergeFn: utils.mergeConfig,
    });
  }

  debug('modify Rspack config done');
  return modifiedConfig;
}

async function getConfigUtils(
  config: RspackConfig,
  chainUtils: ModifyChainUtils,
): Promise<ModifyRspackConfigUtils> {
  const { merge } = await import('@rsbuild/shared/webpack-merge');
  const rspack = await import('@rspack/core');

  return {
    ...chainUtils,

    rspack,

    mergeConfig: merge,

    addRules(rules) {
      const ruleArr = castArray(rules);
      if (!config.module) {
        config.module = {};
      }
      if (!config.module.rules) {
        config.module.rules = [];
      }
      config.module.rules.unshift(...ruleArr);
    },

    prependPlugins(plugins) {
      const pluginArr = castArray(plugins);
      if (!config.plugins) {
        config.plugins = [];
      }
      config.plugins.unshift(...pluginArr);
    },

    appendPlugins(plugins) {
      const pluginArr = castArray(plugins);
      if (!config.plugins) {
        config.plugins = [];
      }
      config.plugins.push(...pluginArr);
    },

    removePlugin(pluginName) {
      if (config.plugins) {
        config.plugins = config.plugins.filter((p) => p.name !== pluginName);
      }
    },
  };
}

async function getChainUtils(target: RsbuildTarget): Promise<ModifyChainUtils> {
  const nodeEnv = process.env.NODE_ENV as NodeEnv;
  const { default: HtmlPlugin } = await import('html-webpack-plugin');

  return {
    env: nodeEnv,
    target,
    isProd: nodeEnv === 'production',
    isServer: target === 'node',
    isServiceWorker: target === 'service-worker',
    isWebWorker: target === 'web-worker',
    getCompiledPath,
    CHAIN_ID,
    HtmlPlugin,
  };
}

/**
 * BundlerConfig type is similar to WebpackConfig.
 *
 * The type is not strictly compatible with rspack, such as devtool (string or const).
 *
 * There is no need to consider it in Rsbuild, and it is handed over to rspack for verification
 */
const convertToRspackConfig = (config: BundlerConfig): RspackConfig => {
  return config as unknown as RspackConfig;
};

export async function generateRspackConfig({
  target,
  context,
}: {
  target: RsbuildTarget;
  context: Context;
}) {
  const chainUtils = await getChainUtils(target);
  const { BannerPlugin, DefinePlugin, ProvidePlugin } = await import(
    '@rspack/core'
  );

  const chain = await modifyBundlerChain(context, {
    ...chainUtils,
    bundler: {
      BannerPlugin,
      DefinePlugin,
      ProvidePlugin,
    },
  });

  let rspackConfig = convertToRspackConfig(chain.toConfig());

  rspackConfig = await modifyRspackConfig(
    context,
    rspackConfig,
    await getConfigUtils(rspackConfig, chainUtils),
  );

  return rspackConfig;
}
