- **类型：** `boolean`
- **默认值：** `false`

是否禁用 CSS 提取逻辑，并将 CSS 文件内联到 JS 文件中。

默认情况下，Rsbuild 会把 CSS 提取为独立的 `.css` 文件，并输出到构建产物目录。设置该选项为 `true` 后，CSS 文件会被内联到 JS 文件中，并在运行时通过 `<style>` 标签插入到页面上。

### 示例

```ts
export default {
  output: {
    disableCssExtract: true,
  },
};
```

### 注意事项

建议仅在开发环境在开启 `disableCssExtract` 选项。

对于生产环境构建，建议使用 Rsbuild 的默认行为，将 CSS 抽取为单独的 bundle，以便浏览器能够并行加载 CSS 和 JS 资源。

比如：

```ts
export default {
  output: {
    disableCssExtract: process.env.NODE_ENV === 'development',
  },
};
```

如果你需要在生产环境下开启该选项，请留意内联的 CSS 代码不会经过 Rsbuild 默认的 CSS 压缩器，你可以手动注册 PostCSS 的 [cssnano](https://cssnano.co/) 插件来对内联代码进行压缩。

1. 安装 cssnano：

```bash
npm add cssnano -D
```

2. 使用 `tools.postcss` 注册 cssnano：

```ts
export default {
  tools: {
    postcss: (opts) => {
      opts.postcssOptions.plugins.push(require('cssnano'));
    },
  },
};
```
