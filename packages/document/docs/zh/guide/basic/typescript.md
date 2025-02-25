# 使用 TypeScript

Rsbuild 默认支持 TypeScript，你可以直接在项目中使用 `.ts` 和 `.tsx` 文件。

## TypeScript 转译

Rsbuild 默认使用 SWC 来转译 TypeScript 代码，也支持切换到 Babel 进行转译。

### 配置 tsconfig.json

当项目的根目录存在 `tsconfig.json` 文件时，Rsbuild 会开启对 TypeScript 文件的转译。如果当前项目中没有 `tsconfig.json` 文件，编译 TS 文件时，Rsbuild 会抛出异常。

下面是一份 `tsconfig.json` 文件的例子，你也可以根据项目的需求进行调整：

```json title="tsconfig.json"
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "ES2020"],
    "module": "ESNext",
    "strict": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "resolveJsonModule": true,
    "moduleResolution": "bundler"
  },
  "include": ["src"]
}
```

注意 `tsconfig.json` 中的字段并不会影响 Rsbuild 的编译行为和产物，只会影响类型检查的结果。

### isolatedModules

与 TypeScript 原生编译器不同，像 SWC 和 Babel 这样的工具会将每个文件单独编译，它无法确定导入的名称是一个类型还是一个值。因此，当你在 Rsbuild 中使用 TypeScript 时，需要启用 `tsconfig.json` 中的 [isolatedModules](https://typescriptlang.org/tsconfig/#isolatedModules) 选项：

```json title="tsconfig.json"
{
  "compilerOptions": {
    "isolatedModules": true
  }
}
```

该选项可以帮助你避免使用一些 SWC 和 Babel 无法正确编译的写法，比如跨文件的类型引用问题，它会引导你更正对应的用法：

```ts
// 错误
export { SomeType } from './types';

// 正确
export type { SomeType } from './types';
```

## 类型检查

在进行 TypeScript 转译时，SWC 和 Babel 等工具不会执行类型检查。

Rsbuild 提供了 Type Check 插件，用于在单独的进程中运行 TypeScript 类型检查，插件内部集成了 [fork-ts-checker-webpack-plugin](https://github.com/TypeStrong/fork-ts-checker-webpack-plugin)。

请参考 [Type Check 插件](/plugins/list/plugin-type-check) 了解用法。
