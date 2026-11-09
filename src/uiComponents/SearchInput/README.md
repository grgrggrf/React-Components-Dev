# SearchInput

依赖 React、Ant Design 和 CSS Modules。组件内不请求 API，页面通过 onChange 获取输入，通过 onSearch 执行搜索。搜索图标为装饰图标；回车、搜索按钮、联想选项负责提交。

```tsx
<SearchInput
  variant="button"
  iconPosition="right"
  buttonPosition="left"
  allowClear
  showIcon
  showButton
  onSearch={keyword => console.log(keyword)}
/>
```

| 参数 | 默认 | 说明 |
| --- | --- | --- |
| variant | basic | basic 基础 / pill 胶囊 / button 按钮 / suggest 联想 |
| value / defaultValue | 空字符串 | 受控值 / 初始值 |
| onChange | 无 | 输入与清空时收到完整字符串 |
| onSearch | 无 | 提交时收到去除首尾空格的字符串；空字符串可用于搜索全部 |
| placeholder / ariaLabel | 输入关键词 / 搜索 | 提示文字 / 无障碍名称 |
| size | middle | small / middle / large |
| color | 外层主题 | 主题颜色 |
| allowClear | true | 有文字时显示右侧清空入口，清空仅更新输入 |
| showIcon / iconPosition | true / left | 搜索图标显示开关及 left / right 位置 |
| showButton / buttonPosition | 按钮型默认显示 / right | 搜索按钮显示开关及 left / right 位置 |
| buttonText | 搜索 | 按钮文字 |
| disabled / loading | false | 禁用 / 加载中，两者都阻止输入和提交 |
| suggestions | [] | 联想项，每项包含唯一 value 和可选 description |
| filterSuggestions | true | 本地按 value 匹配；远程列表可设 false |
| className | 空 | 外层类名 |

宽度跟随容器，输入区可收缩，按钮最多占 40% 宽度，长按钮文字可换行。可独立设置图标与按钮位置，例如按钮在左、图标在右。隐藏图标和按钮后仍可用回车搜索。中文输入法确认文字时不提交。

联想型的自定义 Input 由 AutoComplete 注入 value 和 onChange，不能显式传 undefined 覆盖它们。候选只按组件当前 text 筛选一次；空字符串恢复传入的完整 suggestions，输入新关键词后重新筛选。清空事件同时通知页面移除旧搜索结果。

测试页入口 /search，使用 Mock 数据和 TanStack Query 演示加载与结果；复制代码需放在 QueryClientProvider 内，本项目已有 QueryProvider。

搜索状态重置通过页面的 resetSearchState(nextValue) 自动处理。把它传给 onChange 后，每次重新输入或清空都会移除上一轮结果与错误，并按当前关键词重新筛选联想列表；复制代码包含同样逻辑。request.reset() 解除页面对旧请求的订阅，旧 Mock 请求可以继续结束，但不会重新显示旧结果。组件在重新输入时释放上次候选选择，列表的展开、收起与键盘导航由 Ant Design 管理。清空后可重新查看完整候选，输入后按新的关键词筛选。

自行验收建议：切换四种样式；交换图标和按钮位置；分别关闭三个显示开关；用中文输入法输入后搜索；选择联想项；清空后重新搜索；检查 375px、820px 和桌面宽度；复制当前配置到测试页。此次未运行测试、构建、类型检查、Lint 或浏览器验收。
