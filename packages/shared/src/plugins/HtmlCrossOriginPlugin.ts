import type HtmlWebpackPlugin from 'html-webpack-plugin';
import type { CrossOrigin } from '../types';
import type { Compiler, RspackPluginInstance } from '@rspack/core';

type CrossOriginOptions = {
  crossOrigin: CrossOrigin;
  HtmlPlugin: typeof HtmlWebpackPlugin;
};

export class HtmlCrossOriginPlugin implements RspackPluginInstance {
  readonly name: string;

  readonly crossOrigin: CrossOrigin;

  readonly HtmlPlugin: typeof HtmlWebpackPlugin;

  constructor(options: CrossOriginOptions) {
    const { crossOrigin } = options;
    this.name = 'HtmlCrossOriginPlugin';
    this.crossOrigin = crossOrigin;
    this.HtmlPlugin = options.HtmlPlugin;
  }

  apply(compiler: Compiler): void {
    if (!this.crossOrigin) {
      return;
    }

    compiler.hooks.compilation.tap(this.name, (compilation) => {
      // @ts-expect-error compilation type mismatch
      this.HtmlPlugin.getHooks(compilation).alterAssetTags.tap(
        this.name,
        (alterAssetTags) => {
          const {
            assetTags: { scripts, styles },
          } = alterAssetTags;

          scripts.forEach(
            (script) => (script.attributes.crossorigin = this.crossOrigin),
          );
          styles.forEach(
            (style) => (style.attributes.crossorigin = this.crossOrigin),
          );

          return alterAssetTags;
        },
      );
    });
  }
}
