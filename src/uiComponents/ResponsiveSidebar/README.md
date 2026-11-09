# ResponsiveSidebar

复用 Ant Design Menu、Drawer。依赖 React、antd 和 CSS Modules，组件文件可整体复制到其他项目。

```tsx
<ResponsiveSidebar
  placement="left"
  items={items}
  defaultOpenKeys={["projects", "website"]}
  defaultSelectedKey="design"
  onSelect={key => setCurrentPage(key)}
>
  <YourPage />
</ResponsiveSidebar>
```

组件同时容纳侧栏和主内容，左右位置可直接切换。可将整体放在 ResponsiveLayout 的内容区域内使用。菜单点击通过 onSelect 返回 key，调用页面负责导航或切换内容。

| 参数 | 默认 | 说明 |
| --- | --- | --- |
| items | 必填 | 每项 key 全树唯一，label 文字，icon 接收 ReactNode，children 表示多级 |
| placement | left | left / right |
| title | 菜单 | 导航标题和手机入口文字 |
| width / collapsedWidth | 240 / 64 | 展开与收起宽度，px；展开宽度最多占容器 42% |
| collapsed / defaultCollapsed | 未受控 / false | 当前或初始收起状态 |
| onCollapsedChange | 无 | 收起状态变化 |
| selectedKey / defaultSelectedKey | 无 | 当前或初始选中项 |
| onSelect | 无 | 点击可用叶子菜单 |
| openKeys / defaultOpenKeys | 未受控 / [] | 当前或初始展开分支 |
| onOpenChange | 无 | 展开项变化，传入 openKeys 时应更新对应状态 |
| accordion | false | 同父级只展开一个分支 |
| backgroundColor / textColor | 白 / 深灰 | 菜单背景、文字颜色 |
| selectedColor / selectedBackground | 蓝 / 浅蓝 | 选中项文字和背景 |
| fontSize / iconSize | 14 / 18 | 字号、图标大小，px |
| showIcons | true | 显示图标；收起时无图标的项以首字提示 |
| indent | 16 | 每一级缩进，px |
| minHeight | 380 | 整个侧栏与主内容区域的最小高度 |
| children / className | 无 | 主内容与根节点类名 |

容器小于 600px 时使用抽屉，点击“打开菜单”显示，选择菜单、点击关闭或遮罩后收起；方向跟随 placement。平板、桌面使用常驻侧栏。改变左右布局或收起状态时主内容节点保持挂载。抽屉在当前组件区域内显示。

多级树不做 JSON 深拷贝。组件创建渲染所需的新节点对象，保留图标引用。父节点关闭时过滤其后代展开状态；手风琴规则按同一父级处理，不会把当前分支的祖先一起关闭。Menu 负责键盘导航和禁用项。

## 自行查看

打开 /sidebar 或测试页顶部“侧边栏”。可选择四个示例，修改位置、颜色、尺寸、图标及展开模式，并复制整段 JSX。

建议依次查看三级菜单、同级手风琴、左右切换、收起后展开、手机左右抽屉和禁用项。再修改颜色、字号与图标，确认复制代码对应当前配置。输入内容区备注后切换位置，查看备注是否保留。

本次未执行测试、构建、类型检查、Lint 或浏览器验收。
