# throttle · 节流

适用于滚动、拖动、调整窗口大小等高频事件。持续触发事件时，复用同一个节流函数可以限制回调的执行频率。默认首次调用立即执行，短时间内又有调用时，后续执行会使用最新的参数。

例如，从 `src/pages/example.ts` 导入并在开始观察滚动时注册监听：

```ts
import { throttle } from '../utils';

const onScroll = throttle(() => console.log(window.scrollY), 200);
window.addEventListener('scroll', onScroll);
```

实现位于 `throttle.ts`，通过 `src/utils/index.ts` 统一导出。结束观察时，移除同一个监听函数，再取消尚未执行的回调：

```ts
window.removeEventListener('scroll', onScroll);
onScroll.cancel();
```

## 参数与清理

- `throttle(fn, wait, options?)` 接受回调和节流间隔，`wait` 单位为毫秒。返回的函数接受与 `fn` 相同的参数，调用结果为 `void`。
- `options.edges` 默认是 `['leading', 'trailing']`。`leading` 允许在开始时执行，`trailing` 允许在结束时处理仍待执行的调用，也可以只指定其中一项。
- `onScroll.cancel()` 丢弃待执行的回调。`onScroll.flush()` 则立即处理待执行的回调。
- `options.signal` 接受 `AbortSignal`。调用对应 `AbortController` 的 `abort()` 可取消待执行的回调。

## React 中使用

在组件的 effect 中创建并注册监听。卸载时通过清理函数移除监听并取消待执行的回调。

```tsx
import { useEffect } from 'react';
import { throttle } from '../utils';

function useScrollLogger() {
  useEffect(() => {
    const onScroll = throttle(() => console.log(window.scrollY), 200);
    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      onScroll.cancel();
    };
  }, []);
}
```

示例只读取 `window.scrollY`。如果回调读取 props 或 state，将相关值列入 effect 的依赖数组，React 会在值改变时先清理旧监听，再注册新监听。
