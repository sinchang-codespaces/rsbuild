- **Type:** `boolean`
- **Default:** `true`

Whether to enable gzip compression for served static assets.

If you want to disable the gzip compression, you can set `compress` to `false`:

```ts
export default {
  dev: {
    compress: false,
  },
};
```
