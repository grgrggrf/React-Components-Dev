# clone · 浅拷贝

用于复制对象或数组的外层，例如更新顶层字段、创建新列表。嵌套对象继续共享引用，减少递归遍历和内存分配。实现位于 `clone.ts`，通过 `src/utils/index.ts` 统一导出，直接复用项目已安装的 es-toolkit。

## 导入与参数

以下导入路径以 `src/pages/example.ts` 为例，其他目录按相对位置调整。

```ts
import { clone } from '../utils';

const source = { name: '旧名称', settings: { enabled: true } };
const copy = clone(source);

copy.name = '新名称';
console.log(source.name); // '旧名称'
console.log(copy === source); // false
console.log(copy.settings === source.settings); // true

copy.settings.enabled = false;
console.log(source.settings.enabled); // false，共享嵌套对象
```

函数签名为 `clone<T>(value: T): T`。只需传入待复制的值，返回类型自动推断。

## 数组与 Map

```ts
import { clone } from '../utils';

const users = [{ id: 1, name: '小明' }];
const copiedUsers = clone(users);
copiedUsers.push({ id: 2, name: '小红' });
console.log(users.length); // 1
console.log(copiedUsers[0] === users[0]); // true

const scores = new Map([['alice', { score: 90 }]]);
const copiedScores = clone(scores);
console.log(copiedScores === scores); // false
console.log(copiedScores.get('alice') === scores.get('alice')); // true
```

## 数据范围

| 输入 | 结果 |
| --- | --- |
| 普通对象 | 创建同原型的新对象，复制自身可枚举的字符串和 Symbol 属性。嵌套对象保留引用。 |
| 数组 | 创建新数组，元素保留引用，稀疏数组的空位保留。数组自定义属性不在复制范围内。 |
| Map / Set | 创建新容器，对象键、值和元素保留引用。 |
| Date / RegExp | 创建新实例，RegExp 保留 `lastIndex`。 |
| 浏览器 TypedArray / ArrayBuffer / DataView | 按内置类型规则复制二进制数据，耗时取决于字节数。 |
| number / string / boolean / bigint / symbol / null / undefined | 原值返回。 |
| 函数 | 保留原引用。 |

普通对象的 getter 会在读取属性时执行，属性描述符和不可枚举属性不保留。业务 class 的私有字段、DOM、Promise、WeakMap 等带内部状态的实例应使用其专用 API。Node.js Buffer 的底层数据可能共享，独立复制应使用 `Buffer.from`。

## 性能使用方式

只更新顶层字段时使用 `clone`。例如数组增删元素时，通常复制外层数组即可。若需要独立修改嵌套内容，使用 `cloneDeep`。

本工具直接引用 es-toolkit 的函数，调用时没有额外包装。通用类型识别有一定成本，明确是普通对象时，原生展开语法可能更快。本地 100 个数值字段对象的样本中，`clone` 为 0.31 μs/次，展开语法为 0.14 μs/次。100 个元素数组的样本中，`clone` 为 0.13 μs/次，`slice()` 为 0.11 μs/次。

记录于 2026-11-07，Windows x64、Node.js v24.20.0、es-toolkit 1.53.1。每个方法预热 300 次，执行 5 轮，每轮 10,000 次，轮前显式 GC，取单次平均耗时的中位数。该结果仅代表这些样本及环境，浏览器和真实数据需分别评估。

项目来源见 [es-toolkit](https://github.com/toss/es-toolkit)。
