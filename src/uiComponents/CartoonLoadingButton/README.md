# CartoonLoadingButton 加载按钮（卡通 / 商务）

首页各风格下的“按钮加载中”标签使用本组件。页面加载与失败图标继续使用 CartoonLoader。通过 visualStyle 选择卡通或商务，图标清单见 [图标目录](../CartoonLoader/CATALOG.md)。

```tsx
import { CartoonLoadingButton } from "./uiComponents";
import { axiosPost } from "./services/axios";

<CartoonLoadingButton
  label="保存"
  loadingLabel="正在保存…"
  onAction={async () => {
    // 必须返回或 await Promise，按钮才会等待请求完成。
    await axiosPost("/save", { name: "小明" });
  }}
  buttonSize="md"
  buttonShape="pill"
  backgroundColor="#47725b"
  iconShape="robot"
  iconSize={{ mobile: 24, tablet: 28, desktop: 32 }}
  iconColor="#fbbf24"
/>;
```

按钮始终为 type="button"，不会隐式提交外层表单。点击时立即上锁并禁用，等待 onAction 结束，无论成功失败都会释放内部加载状态。错误信息会显示在按钮下方，用户可重新点击。该组件不会自动重试，也不会取消业务请求；取消功能由业务通过 AbortController 等自行实现。

| 参数                    | 默认                 | 作用                                                           |
| ----------------------- | -------------------- | -------------------------------------------------------------- |
| onAction                | 必填                 | 点击操作，返回 Promise 后等待其完成                            |
| loading                 | false                | 外部加载状态；与内部加载状态取或，true 时持续禁用              |
| disabled                | false                | 额外禁用开关，不显示加载动画                                   |
| label / loadingLabel    | 点击保存 / 正在处理… | 普通文字、加载时文字                                           |
| buttonSize              | md                   | sm / md / lg，按钮内边距和基础字号                             |
| buttonShape             | rounded              | rounded 圆角 / pill 胶囊 / square 直角矩形                     |
| backgroundColor         | #47725b              | 按钮背景颜色                                                   |
| visualStyle             | cartoon              | cartoon 卡通 / business 商务                                  |
| iconShape               | 按风格选择           | 卡通默认 star；商务默认 thin-ring，其他选项见图标目录           |
| iconSize                | 24 / 28 / 32px       | 数字、sm/md/lg 预设或 mobile/tablet/desktop 对象               |
| iconColor / accentColor | 目录推荐色 / #93c5fd | 图标主色、装饰颜色                                             |
| showIcon / showLabel    | true / true          | 是否显示图标/文字，两者关闭时仍保留文字，避免空白按钮          |
| animated                | true                 | 加载动画开关，系统减少动画偏好优先                             |
| fullWidth               | false                | 是否填满容器宽度                                               |
| labelFontSize           | 随按钮尺寸           | 文字字号，数字表示 px，支持 CSS 字符串；设置后覆盖尺寸预设字号 |
| labelColor              | #ffffff              | 文字颜色                                                       |
| labelFontFamily         | 继承                 | 文字字体                                                       |
| labelOpacity            | 1                    | 文字透明度，限制到 0–1                                         |
| className               | 空                   | 最外层样式类                                                   |

需要复制到其他项目时，同时复制 CartoonLoadingButton 和 CartoonLoader 文件夹，二者相对路径保持同级。依赖 React 和 CSS Modules，无需 Ant Design。

## 手动测试

1. 进入首页“加载中”，点击预览按钮：立即变成加载图标和加载文字，约两秒后恢复，完成次数加一。
2. 等待期间快速点击、按 Enter/空格：操作不应重复触发，其他页面控件仍可使用。
3. 调整背景色、按钮尺寸/形状、图标形状/大小、文字等参数；切换手机、平板、电脑视口检查不超出容器。
4. 调整普通文字和加载文字，再复制代码；代码应使用 CartoonLoadingButton，并包含当前配置和返回 Promise 的 handleSave 示例。按放置文件的位置调整导入路径。
5. 将自己的 onAction 临时改为抛出 Error('模拟失败')，确认错误显示、按钮恢复，可以再次点击。
6. 测试外部 loading=true 或 disabled=true，按钮不应触发 onAction；解除后可操作。

本次未运行构建或浏览器测试，以上是供用户自行验收的预期行为。
