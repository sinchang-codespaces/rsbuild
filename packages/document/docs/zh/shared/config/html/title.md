- **类型：** `string ｜ Function`
- **默认值：** `'Rsbuild App'`

配置 HTML 页面的 title 标签。

### 字符串用法

当 `html.title` 可以直接设置为一个字符串：

```js
export default {
  html: {
    title: 'Example',
  },
};
```

最终在 HTML 中生成的 `title` 标签为：

```html
<title>Example</title>
```

### 函数用法

- **类型：**

```ts
type TitleFunction = ({ value: string; entryName: string }) => string | void;
```

当 `html.title` 为 Function 类型时，函数接收一个对象作为入参，对象的值包括：

- `value`：Rsbuild 的默认 title 配置。
- `entryName`: 当前入口的名称。

在 MPA（多页面应用）场景下，你可以基于入口名称返回不同的 `title` 字符串，从而为每个页面生成不同的 `title` 标签：

```js
export default {
  html: {
    title({ entryName }) {
      const titles = {
        foo: 'Foo Page',
        bar: 'Bar Page',
      };
      return titles[entryName] || 'Other Page';
    },
  },
};
```
