# 模块热更新

模块热更新（HMR - hot module replacement）功能会在应用程序运行过程中，替换、添加或删除模块，而无需重新加载整个页面。主要是通过以下几种方式，来显著加快开发速度：

- 保留在完全重新加载页面期间丢失的应用程序状态。
- 只更新变更内容，以节省宝贵的开发时间。
- 在源代码中 CSS/JS 产生修改时，会立刻在浏览器中进行更新，这几乎相当于在浏览器 devtools 直接更改样式。

## 启用 HMR

Rsbuild 已内置了对 HMR 的支持，在开发环境下默认启用。

如果你不需要使用 HMR 能力，可以将 [dev.hmr](/config/options/dev.html#devhmr) 设置为 false，此时将不再提供热更新和 react-refresh 功能。

```ts
export default {
  dev: {
    hmr: false,
  },
};
```

## 自定义 HMR URL

在默认情况下，Rsbuild 使用当前页面的 host 和端口号来拼接 HMR 对应的 WebSocket URL。

当出现 HMR 连接失败的情况时，你可以通过自定义 `dev.client` 配置的方式来指定 WebSocket URL。

### 默认配置

默认配置如下，Rsbuild 会根据当前页面的 location 自动推导 WebSocket 请求的 URL：

```ts
export default {
  dev: {
    client: {
      path: '/rsbuild-hmr',
      // 默认设置为 dev server 的端口号
      port: '',
      // 默认设置为 location.hostname
      host: '',
      // 默认设置为 location.protocol === 'https:' ? 'wss' : 'ws'
      protocol: '',
    },
  },
};
```

### 线上代理

如果你将一个线上页面代理到本地进行开发，WebSocket 请求将会连接失败。此时你可以尝试将 `dev.client` 配置成如下值，使 HMR 请求能打到本地的 Dev Server。

```ts
export default {
  dev: {
    client: {
      host: 'localhost',
      protocol: 'ws',
    },
  },
};
```

## 常见问题

请参考 [热更新问题](/guide/faq/hmr)。
