- **类型：** `'ascii' | 'utf8'`
- **默认值：** `'ascii'`

默认情况下，Rsbuild 的产物内容是纯 ASCII 的，并且会转义所有非 ASCII 字符。

如果你不希望对字符进行转义，而是输出所有原始字符，可以将 `output.charset` 设置为 `utf8`。

```js
export default {
  output: {
    charset: 'utf8',
  },
};
```
