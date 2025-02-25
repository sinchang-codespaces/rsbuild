Used to register Rsbuild plugins.

- **Type:** `RsbuildPlugin[]`
- **Default:** `undefined`
- **Example:** Registering the Stylus plugin.

```ts title="rsbuild.config.ts"
import { defineConfig } from '@rsbuild/core';
import { pluginStylus } from '@rsbuild/plugin-stylus';

export default defineConfig({
  plugins: [pluginStylus()],
});
```

### Execution Order

By default, plugins are executed in the order they appear in the `plugins` array. Built-in Rsbuild plugins are executed before user-registered plugins.

When a plugin internally uses fields that control the order, such as `pre` and `post`, the execution order is adjusted based on them. See [Pre Plugins](/plugins/dev/core#pre-pluginss) for more details.

### Local Plugins

If your local code repository contains Rsbuild plugins, you can directly import them using relative paths.

```ts title="rsbuild.config.ts"
import { defineConfig } from '@rsbuild/core';
import { pluginCustom } from './plugins/pluginCustom';

export default defineConfig({
  plugins: [pluginCustom()],
});
```

### Plugin Options

If a plugin provides custom options, you can pass the configurations through the plugin function's parameters.

```ts title="rsbuild.config.ts"
import { defineConfig } from '@rsbuild/core';
import { pluginStylus } from '@rsbuild/plugin-stylus';

export default defineConfig({
  plugins: [
    pluginStylus({
      stylusOptions: {
        lineNumbers: false,
      },
    }),
  ],
});
```
