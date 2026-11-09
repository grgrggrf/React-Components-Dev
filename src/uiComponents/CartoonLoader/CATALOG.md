# 加载图标目录

新增 12 款 SVG 图标，保留原有 3 款。设计按已确认的预览图制作，实际动画通过 CSS 实现，不依赖图片或图标库。

演示页采用两级标签：先选“卡通 / 商务”，再选“页面加载 / 按钮加载中 / 加载失败”。每个面板独立保存配置；复制代码包含当前 visualStyle 和 shape（按钮为 iconShape）。

| 分类 | 场景 | 编号 / 名称 | shape / iconShape |
| --- | --- | --- | --- |
| 卡通 | 页面加载 | A1 星球漫游 | planet |
| 卡通 | 页面加载 | A2 小猫沙漏 | cat-hourglass |
| 卡通 | 按钮加载中 | B1 小火箭 | rocket |
| 卡通 | 按钮加载中 | B2 弹跳团子 | mochi |
| 卡通 | 加载失败 | C1 创可贴爱心 | bandaged-heart |
| 卡通 | 加载失败 | C2 迷路信封 | lost-envelope |
| 卡通 | 全部场景 | 原有星星 | star |
| 卡通 | 全部场景 | 原有云朵 | cloud |
| 卡通 | 全部场景 | 原有机器人 | robot |
| 商务 | 页面加载 | D1 分段旋环 | segmented-ring |
| 商务 | 页面加载 | D2 轨道圆点 | orbit-dots |
| 商务 | 按钮加载中 | E1 细环加载 | thin-ring |
| 商务 | 按钮加载中 | E2 三点脉冲 | pulse-dots |
| 商务 | 加载失败 | F1 警示圆环 | alert-circle |
| 商务 | 加载失败 | F2 连接中断 | broken-link |

## 使用示例

```tsx
import { CartoonLoader, CartoonLoadingButton } from "./uiComponents";

<CartoonLoader
  visualStyle="business"
  shape="segmented-ring"
  size={{ mobile: 48, tablet: 64, desktop: 80 }}
  label="正在读取数据…"
/>;

<CartoonLoader
  visualStyle="cartoon"
  status="error"
  shape="bandaged-heart"
  label="加载失败，请重试"
/>;

<CartoonLoadingButton
  visualStyle="business"
  iconShape="thin-ring"
  iconColor="#ffffff"
  backgroundColor="#253e60"
  label="保存"
  loadingLabel="正在保存…"
  onAction={async () => {
    // 替换成自己的业务请求，并等待它结束。
    await saveData();
  }}
/>;
```

组件名称继续沿用，旧代码省略 visualStyle 时仍使用卡通。shape 与 visualStyle 不匹配时回退到该风格默认图标；指定商务图标时请同时传 visualStyle="business"。不指定主色时使用目录推荐色，传入 color / iconColor 可覆盖主色。accentColor 控制支持装饰色的图形部分，不是所有图标都有第二种颜色。

尺寸、文字内容/字号/颜色/字体/透明度、动画开关沿用原有参数。按钮还支持背景色、尺寸、形状；等待 onAction Promise 期间禁用，仅影响按钮本身。失败图标保持静态。手机、平板、电脑共用 SVG，并按原有响应式尺寸规则适配。

## 以后增加风格

1. 在 loaderCatalog.ts 的 loaderStyles 增加风格名称和说明，LoaderStyle 类型自动更新。
2. 在同文件 loaderCatalog 登记图标、所属风格、适用场景、推荐色和说明。每种风格的 normal、loading、error 场景各保留至少一款，作为默认选项。
3. 在 LoaderArtwork.tsx 实现 SVG，在 LoaderArtwork.module.css 添加需要的动画，遵守 animated 和减少动态效果设置。
4. 演示页从目录生成风格标签、图标选项及画廊，无需复制整套页面。

## 自行测试步骤

1. 在项目根目录运行 npm run dev，打开终端显示的本地地址。依次切换两种风格和三个场景，核对上表全部图标；卡通每个场景也应保留三款旧图标。
2. 修改图标、尺寸、颜色、文字内容及文字样式。切换风格/场景再返回，确认各面板配置独立保留。
3. 在“按钮加载中”点击按钮：应立即禁用、切换文字并播放动画，约两秒后恢复，完成次数增加一次。等待时连续点击或按 Enter/空格，不应重复执行；页面其他控件仍可操作。
4. 修改按钮背景、尺寸、圆角及图标后复制代码，确认 visualStyle、iconShape 和配置与界面一致；页面加载/失败场景复制 shape。将代码粘贴到项目，按实际位置调整导入路径并替换示例业务函数。
5. 用浏览器设备工具分别检查 375px、820px、1440px 视口：布局无横向溢出，响应式尺寸生效，按钮文字可读。
6. 关闭动画或开启系统“减少动态效果”，检查动画停止且按钮禁用逻辑仍正常；失败场景始终静态。

按用户自行测试约定，本次未运行测试、构建、lint 或浏览器验收。以上为预期行为与手动验收清单。
