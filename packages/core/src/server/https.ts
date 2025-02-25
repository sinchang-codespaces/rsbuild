import { color, logger, type DevServerHttpsOptions } from '@rsbuild/shared';

export const genHttpsOptions = async (
  userOptions: DevServerHttpsOptions,
  pwd: string,
): Promise<{
  key?: Buffer | string;
  cert?: Buffer | string;
}> => {
  const httpsOptions: { key?: string; cert?: string } =
    typeof userOptions === 'boolean' ? {} : userOptions;

  if (!httpsOptions.key || !httpsOptions.cert) {
    let devcertPath: string;

    try {
      devcertPath = require.resolve('devcert', { paths: [pwd, __dirname] });
    } catch (err) {
      const command = color.bold(color.yellow(`npm add devcert@1.2.2 -D`));
      logger.error(
        `You have enabled "dev.https" option, but the "devcert" package is not installed.`,
      );
      logger.error(
        `Please run ${command} to install manually, otherwise the https can not work.`,
      );
      throw new Error('[https] "devcert" is not found.');
    }

    const devcert = require(devcertPath);
    const selfsign = await devcert.certificateFor(['localhost']);
    return selfsign;
  }

  return httpsOptions;
};
