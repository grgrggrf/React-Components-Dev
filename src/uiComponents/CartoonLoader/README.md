# CartoonLoader 加载器（卡通 / 商务）

组件名称保留以兼容现有引用。通过 `visualStyle="cartoon"` 或 `visualStyle="business"` 选择风格；完整图标清单、扩展方法和验收步骤见 [图标目录](./CATALOG.md)。演示页先选择风格，再选择页面加载、按钮加载中或加载失败。

首页“加载中”标签已改为点击后禁用的 `CartoonLoadingButton`，按钮背景、尺寸、形状等参数见同级 `../CartoonLoadingButton/README.md`。本组件仍负责正常/失败/加载图标，并保留此前的内容区遮罩 API，现有调用不需要修改。

复制整个 CartoonLoader 文件夹到其他 React + TypeScript 项目即可使用。项目需支持 CSS Modules（如 Vite）。无需 Ant Design、Tailwind、图片资源或额外依赖。

```tsx
import { CartoonLoader } from "./uiComponents/CartoonLoader";

<CartoonLoader
  shape="cloud"
  color="#93c5fd"
  size={{ mobile: 48, tablet: 72, desktop: 96 }}
  label="正在获取内容…"
  labelFontSize={16}
  labelColor="#64748b"
  labelFontFamily="Microsoft YaHei, sans-serif"
  labelOpacity={0.8}
  loading={isPending}
/>;
```

## 参数

| 参数            | 默认                     | 说明                                                    |
| --------------- | ------------------------ | ------------------------------------------------------- |
| status          | normal                   | normal 正常图标、error 失败图标、loading 加载中图标     |
| accentColor     | 失败为粉红，其余为蓝色   | 失败徽章/加载圆环的颜色                                 |
| overlayColor    | rgba(255, 255, 255, 0.9) | 内容区加载遮罩背景色，不影响禁用逻辑                    |
| children        | 无                       | 要保护的内容；loading 状态且显示图标时禁用此 DOM 内容区 |
| visualStyle     | cartoon                  | cartoon 卡通 / business 商务                            |
| shape           | 按风格与状态选择         | 卡通默认 star；商务默认当前场景的第一款，详见图标目录    |
| size            | md                       | 正数像素；sm/md/lg；或 mobile/tablet/desktop 对象       |
| color           | 图标目录推荐色           | 图标主色，支持 CSS 颜色及 CSS 变量                      |
| outlineColor    | #292524                  | 轮廓和表情颜色                                          |
| label           | 正在加载，请稍候…        | 加载提示，也用于屏幕阅读器                              |
| labelFontSize   | 0.875rem                 | 文字大小：数字单位 px，或 CSS 字符串（如 1rem）         |
| labelColor      | 继承父元素               | 文字颜色，支持 CSS 颜色和变量                           |
| labelFontFamily | 继承父元素               | 字体名称或候选列表，组件不会下载字体                    |
| labelOpacity    | 1                        | 文字透明度，范围 0–1，0 完全透明，1 完全不透明          |
| showLabel       | true                     | false 时仅视觉隐藏文案，保留无障碍说明                  |
| loading         | true                     | false 时隐藏图标和遮罩；子内容仍保留并可操作            |
| animated        | true                     | 播放动画；系统减少动画设置优先                          |
| display         | block                    | block 居中、inline 行内展示                             |
| className       | 空字符串                 | 外层自定义类名                                          |

尺寸为 SVG 图标画布宽度，不含底部阴影、间距和文案。窄容器下图标最大不超过容器宽度。

文字样式参数仅影响提示文字，不改变图标。省略这些参数保持原样式。
`labelFontSize={16}` 表示 16px；需要响应式字号可传 `labelFontSize="clamp(14px, 2vw, 20px)"`。
数字字号为负数、NaN 或 Infinity 时使用默认字号；CSS 字符串需要符合 CSS 语法。
`labelOpacity` 超出 0–1 会被限制到该范围，NaN 或 Infinity 回退到 1。
透明度为 0 时仍保留文字占位与屏幕阅读器提示；若需要隐藏文字且不占位，请用 `showLabel={false}`。

手动检查：在首页演示面板调整文字字号、颜色、字体和不透明度，确认只改变文字；将不透明度调为 0 时图标仍可见，关闭“显示提示文字”后文案隐藏。未传新参数的其他加载器应保持原样式。

演示页的“文字内容”输入框可以修改 `label`，实时预览和模拟加载使用同一段文字。“直接用在你的项目里”会同步生成包含 `label` 的 JSX，点击“复制代码”即可复制整段配置。文字中的引号、反斜杠和换行会被转义，不会破坏生成的 JSX。清空内容时仍沿用组件原有的默认提示逻辑。

手动检查复制：输入 `正在加载 "用户资料"…`，点击“复制代码”，粘贴到编辑器确认包含正确的 `label` 和其余样式参数。修改文字后再次复制，应得到新内容；若浏览器禁止剪贴板访问，页面会提示手动复制，不会报告复制成功。

| 预设 | 手机 <768px | 平板 768–1023px | 电脑 >=1024px |
| ---- | ----------- | --------------- | ------------- |
| sm   | 32          | 40              | 48            |
| md   | 64          | 80              | 96            |
| lg   | 96          | 120             | 144           |

`size={80}` 在所有屏幕固定 80px。对象省略 tablet 或 desktop 时沿用前一档；非法数字回退有效尺寸。断点按视口 CSS 像素判断，不检测设备型号。

组件只显示不确定进度，不伪造百分比；业务请求和重试由页面管理。动画用 CSS 完成，无计时器或 window 监听，支持服务端渲染。演示 Mock 单独放在 src/mocks/loader.ts。

## 三种状态

默认 `status="normal"`，用于页面加载。`status="error"` 默认文案为“加载失败，请重试”，停止动画；`status="loading"` 用于加载中。原有 star/cloud/robot 继续按状态变化表情、徽章和圆环；新增图标按所选 shape 展示各自造型。`animated={false}` 或系统减少动画设置会停止动画。

这些状态均支持原有 shape、size、color 和所有 label 参数。`status` 负责外观与禁用模式；`loading` 保留原有的显示开关语义，默认 true。`error` 状态请保持 loading=true 才能显示错误图标。

## 加载中禁用一块内容

```tsx
<CartoonLoader
  status="loading"
  loading={isPending}
  shape="robot"
  size={{ mobile: 48, tablet: 72, desktop: 96 }}
  label="正在保存，请稍等…"
  color="#a7d7b5"
  accentColor="#5688d4"
>
  <form>
    <input aria-label="姓名" defaultValue="小明" />
    <button type="submit">保存</button>
  </form>
</CartoonLoader>
```

传入 children 后采用块级容器；加载期间，遮罩覆盖内容，原生 `inert` 禁止其 DOM 子树中的鼠标/触摸交互和键盘聚焦。内容保持挂载，解除加载后保留输入值和内部组件状态。禁用只作用于包裹的 DOM 区域，不是整个页面，也不管理通过 Portal 渲染在区域外的弹层。

`loading={false}` 时保留内容、移除图标和遮罩并解除 inert。`normal` 和 `error` 不禁用子内容，只在内容后显示图标；单独使用图标时仍和原来一样，不创建内容遮罩。className 和 display 控制图标部分；如需设置内容区域的布局，可在外层或 children 中设置。

## 原有内容遮罩 API 的手动验收

以下针对上方 children 示例单独接入页面后的行为，不是当前第三个按钮标签页。

1. 将 loading 绑定页面状态并开启，尝试点击、输入以及 Tab 聚焦：只有包裹的内容区被禁用。
2. 关闭 loading 恢复操作；再次开启/关闭后，输入内容和内部状态仍保留。
3. 在手机、平板、电脑视口检查遮罩和图标尺寸；系统减少动画设置应停止动画而不影响禁用逻辑。

本轮沿用用户自行测试约定，以上为预期行为，尚未执行浏览器验收或构建检查。
