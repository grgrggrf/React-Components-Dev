# debounce · 防抖

适用于搜索联想、自动保存等需要等输入暂停再处理的场景。连续调用同一个防抖函数会重新计时，默认在最后一次调用后等待指定时长，再把最新参数交给回调。

例如，从 `src/pages/example.ts` 导入：

```ts
import { debounce } from '../utils';

const search = debounce((keyword: string) => console.log(keyword), 300);

search('工');
search('工具'); // 如果没有新的调用，约 300 毫秒后只输出「工具」
```

实现位于 `debounce.ts`，通过 `src/utils/index.ts` 统一导出。请在多次输入之间复用同一个 `search` 实例，每次输入时调用它。

## 参数与清理

- `debounce(fn, wait, options?)`：`fn` 是实际执行的回调，`wait` 单位为毫秒。
- `options.edges` 默认为 `['trailing']`。用 `['leading']` 可在一轮输入开始时立即执行，用 `['leading', 'trailing']` 可在开始时执行，并在后续输入停下时处理最后一次调用。
- 有待执行的搜索时，`search.flush()` 立即处理它。例如用户按回车时可以跳过剩余等待时间。
- `search.cancel()` 丢弃待执行的搜索。React 组件卸载时可在 effect 的清理函数中调用它。它仅影响待执行的回调，已发出的网络请求需单独取消。
- `options.signal` 接受 `AbortSignal`，也可用于取消待执行调用。`search.schedule()` 用于重新安排计时，普通输入事件直接调用 `search(keyword)` 即可。

返回的防抖函数用于触发调度，调用结果为 `void`。需要使用异步搜索结果时，在回调中处理结果。
