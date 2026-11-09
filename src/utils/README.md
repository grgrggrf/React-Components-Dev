# 工具函数

| 函数 | 适用场景 |
| --- | --- |
| [debounce（防抖）](./debounce/README.md) | 输入暂停后，用最新关键词执行搜索。 |
| [throttle（节流）](./throttle/README.md) | 持续滚动时，限制回调的执行频率。 |
| [clone（浅拷贝）](./clone/README.md) | 复制外层对象或数组，嵌套对象共享引用。 |
| [cloneDeep（深拷贝）](./cloneDeep/README.md) | 创建可独立修改的嵌套业务数据，支持普通对象的循环引用。 |

在 `src/pages/example.ts` 中可以统一导入：

```ts
import { debounce, throttle, clone, cloneDeep } from '../utils';
```

每个工具函数使用同名目录和同名实现文件，例如 `debounce/debounce.ts` 和 `throttle/throttle.ts`。实现文件包含中文注释，同目录的 `README.md` 放参数、用法示例和清理方式。除非必须分离，统一从 `src/utils/index.ts` 导出，调用方通过 `utils` 入口导入。新增工具时，在上表添加文档链接。
