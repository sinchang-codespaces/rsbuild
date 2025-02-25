import type HtmlWebpackPlugin from 'html-webpack-plugin';
import type { Compiler, RspackPluginInstance } from '@rspack/core';

type NonceOptions = {
  nonce: string;
  HtmlPlugin: typeof HtmlWebpackPlugin;
};

export class HtmlNoncePlugin implements RspackPluginInstance {
  readonly name: string;

  readonly nonce: string;

  readonly HtmlPlugin: typeof HtmlWebpackPlugin;

  constructor(options: NonceOptions) {
    const { nonce } = options;
    this.name = 'HtmlNoncePlugin';
    this.nonce = nonce;
    this.HtmlPlugin = options.HtmlPlugin;
  }

  apply(compiler: Compiler): void {
    if (!this.nonce) {
      return;
    }

    compiler.hooks.compilation.tap(this.name, (compilation) => {
      // @ts-expect-error compilation type mismatch
      this.HtmlPlugin.getHooks(compilation).alterAssetTags.tap(
        this.name,
        (alterAssetTags) => {
          const {
            assetTags: { scripts },
          } = alterAssetTags;

          scripts.forEach((script) => (script.attributes.nonce = this.nonce));
          return alterAssetTags;
        },
      );
    });
  }
}
