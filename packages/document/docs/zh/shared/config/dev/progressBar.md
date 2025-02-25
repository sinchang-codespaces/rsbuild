- **类型：**

```ts
type ProgressBar =
  | boolean
  | {
      id?: string;
    };
```

- **默认值：** `process.env.NODE_ENV === 'production'`

是否在编译过程中展示进度条。

默认情况下，Rsbuild 仅会在生产环境构建时开启进度条。

- **示例：** 开启进度条。

```js
export default {
  dev: {
    progressBar: true,
  },
};
```

- **示例：** 禁用进度条。

```js
export default {
  dev: {
    progressBar: false,
  },
};
```

- **示例：** 修改进度条 `id`

如果你需要修改进度条左侧显示的文本内容，可以设置 `id` 选项：

```ts
export default {
  dev: {
    progressBar: {
      id: 'Some Text',
    },
  },
};
```
