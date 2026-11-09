# cloneDeep · 深拷贝

用于创建独立的表单草稿、配置副本或嵌套业务数据。实现位于 `cloneDeep.ts`，通过 `src/utils/index.ts` 统一导出，直接引用项目已安装的 es-toolkit 函数。调用时没有额外包装、重复预遍历或 JSON 序列化。

## 导入与参数

以下导入路径以 `src/pages/example.ts` 为例，其他目录按相对位置调整。

```ts
import { cloneDeep } from '../utils';

const source = {
  name: '小明',
  address: { city: '上海' },
  tags: ['开发'],
};
const draft = cloneDeep(source);

draft.address.city = '杭州';
draft.tags.push('设计');
console.log(source.address.city); // '上海'
console.log(source.tags); // ['开发']
console.log(draft.address === source.address); // false
```

函数签名为 `cloneDeep<T>(value: T): T`，返回类型自动推断。例如上面的 `draft.address.city` 仍为 `string`。调用为同步执行。

## 循环引用和共享对象

```ts
import { cloneDeep } from '../utils';

interface TreeNode {
  name: string;
  self?: TreeNode;
}

const node: TreeNode = { name: '根节点' };
node.self = node;
const copiedNode = cloneDeep(node);
console.log(copiedNode !== node); // true
console.log(copiedNode.self === copiedNode); // true

const shared = { count: 1 };
const result = cloneDeep({ first: shared, second: shared });
console.log(result.first === result.second); // true，副本内保留共享关系
console.log(result.first === shared); // false，已独立于原对象
```

## 数据范围与边界

| 输入 | 结果 |
| --- | --- |
| 普通对象 | 创建同原型的新对象，递归复制自身可枚举的字符串和 Symbol 属性。 |
| 数组 | 递归复制元素。空位会转为显式 `undefined`，一般自定义属性不复制。 |
| Map | 创建新容器并递归复制值，对象键保留原引用。 |
| Set | 创建新容器，递归复制元素。 |
| Date / RegExp | 创建新实例，RegExp 保留 `lastIndex`。 |
| 浏览器 TypedArray / ArrayBuffer / DataView | 复制数据，多视图之间的底层缓冲区共享关系可能改变。 |
| 基础类型 | 原值返回，支持 `undefined`、`bigint` 和 `symbol`。 |
| 函数 / Promise / WeakMap / WeakSet / DOM 节点 | 保留原引用，修改这些对象仍可能影响源数据。 |

普通对象、数组、Map 和 Set 通过引用缓存处理循环引用。Date、RegExp、ArrayBuffer 等类型的重复引用可能生成多个副本，不能把普通对象的共享关系保证推广到所有类型。

对象 getter 会在读取时执行。属性描述符、不可枚举属性和 class 的私有字段不保留。优先将业务数据转换为普通对象再复制。Node.js Buffer 的底层数据仍可能共享，需要独立字节副本时使用 `Buffer.from`。

Map 的对象键保持可用，例如下方副本仍可用原键查找，其值已经独立复制。

```ts
import { cloneDeep } from '../utils';

const key = { id: 1 };
const source = new Map([[key, { enabled: true }]]);
const copied = cloneDeep(source);

console.log(copied.has(key)); // true
console.log(copied.get(key) === source.get(key)); // false
```

## 性能与调用时机

沿用已采用的 [es-toolkit](https://github.com/toss/es-toolkit)，使用现代 API 的 `cloneDeep`。普通对象和数组的引用缓存使重复访问可以复用已生成的副本，也支持循环引用。一次复制需要遍历相关数据并分配内存，递归深度受 JavaScript 调用栈限制。

创建草稿时复制一次并复用草稿。每次渲染、滚动或输入时复制整个大对象会增加分配和垃圾回收压力。仅更新顶层字段时优先使用 `clone`。

以下为本地临时性能测量，单位为 μs/次，数值越小越快。

| 数据样本 | es-toolkit cloneDeep | structuredClone |
| --- | ---: | ---: |
| 100 个数值字段的普通对象 | 7.84 | 8.77 |
| 100 条记录，含 id、name、meta、标签数组 | 116.18 | 140.46 |
| 含 self 自引用及 children 数组的普通对象 | 0.77 | 2.15 |

记录于 2026-11-07，Windows x64、Node.js v24.20.0、es-toolkit 1.53.1。每种方法预热 300 次、测量 5 轮，普通对象和循环引用每轮 3,000 次，嵌套列表每轮 500 次。轮前显式 GC，取单次平均耗时的中位数，保留调用结果以供读取。样本仅包含两种方法都能处理的数据。

这些结果支持本项目沿用 es-toolkit 的选择。具体速度取决于数据形状、大小及引擎，其他库与真实浏览器业务负载尚未做本地计时比较。
