- **类型：** `boolean`
- **默认值：** `true`

是否对静态资源启用 gzip 压缩。

如果你需要禁用 gzip 压缩，可以将 `compress` 设置为 `false`：

```ts
export default {
  dev: {
    compress: false,
  },
};
```
