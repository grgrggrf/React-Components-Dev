# ResponsiveTabs

基于项目现有 Ant Design Tabs 封装。复制 ResponsiveTabs 文件夹到支持 CSS Modules 的 React + TypeScript 项目即可使用，依赖 antd，不依赖业务页面或其他公共组件。

## 使用

```tsx
import { ResponsiveTabs } from "./uiComponents";

<ResponsiveTabs
  variant="line"
  tabAlign="center"
  items={[
    { key: "details", label: "详情", children: <Details /> },
    { key: "files", label: "文件", children: <Files /> },
  ]}
/>;
```

Details 和 Files 替换成项目中的业务组件。每项使用稳定且唯一的 key。

主标题通过 title 和 titleAlign 设置。例如 title="胶囊式"、titleAlign="center"。titleExtra 可传入按钮或其他操作控件。标题靠左时操作区在右，标题靠右时操作区在左；居中时两侧预留等宽空间，操作区在右。容器宽度不超过 480px 时，操作区移到下一行；居中标题下的操作区也居中，长文字可换行。

使用 tabAlign 调整整组标签标题的位置：start 靠左、center 居中、end 靠右。侧边式显示为纵向时，对应靠上、居中、靠下。对齐仅在导航区域有剩余空间时明显；标签溢出时采用滑动导航。旧 centered 参数仍可用，同时传入时优先采用 tabAlign。

| 参数                     | 默认                | 用途                                                         |
| ------------------------ | ------------------- | ------------------------------------------------------------ |
| variant                  | line                | line 下划线、card 卡片、pill 胶囊、sidebar 侧边式            |
| title / titleAlign       | 无 / start          | 主标题文字及对齐方式 start / center / end |
| titleExtra               | 无                  | 主标题旁的操作区，随标题位置调整，窄屏换行 |
| tabAlign                 | start（centered=true 时为 center） | start / center / end，调整标题组的位置 |
| items                    | []                  | 标签清单，包含 key、label、children，可传 disabled、closable |
| activeKey / onChange     | 自动管理            | 传入时由调用页面控制当前标签                                 |
| defaultActiveKey         | 第一项              | 未受控时初始选择的标签                                       |
| size                     | Ant Design 当前尺寸 | small / middle / large                                       |
| activeColor / labelColor | 继承主题            | 选中态主色和普通文字颜色                                     |
| tabBarGutter             | Ant Design 默认     | 标签间距，单位 px                                            |
| closable / onClose       | false / 无          | 仅卡片式生效，页面在回调中更新 items                         |
| onAdd                    | 无                  | 仅卡片式生效，传入回调后显示新增按钮                         |
| destroyOnHidden          | false               | 默认保留访问过的内容，true 时离开后销毁                      |
| centered                 | false               | 顶部标签居中                                                 |
| className / style        | 无                  | 标签根节点样式                                               |

侧边式按组件容器宽度适配，小于 600px 显示左侧栏，其余宽度显示顶部标签。侧边栏宽度限制为 72–116px，长标题换行。其余三种始终顶部排列，溢出标签通过 Ant Design 的滑动和“更多标签”菜单访问。窄的嵌入式预览也会应用窄屏规则。

卡片式只发出新增、关闭事件，业务页面管理数据。关闭当前项时请同步更新 activeKey，选择剩余可用标签；关闭全部时可传空数组。切换样式和方向不更改内容 key，默认保留输入状态。显示与关闭状态受 items 控制。

## 测试页

- 首页为多标签栏测试页，提供四种实时样式示例、设备宽度选择、参数编辑和完整 JSX 复制。
- 顶部“加载器”和“布局”接入同一个 ResponsiveTabs，原有参数与模拟加载可继续使用。
- 单独测试入口为 src/test/TabsTest.tsx，App 通过 Test 包裹该页面。

手动检查：输入备注后切换标签并返回；修改标签文字（包括引号）再复制代码；卡片式新增/关闭直到为空，再恢复；在 375px、820px、1440px 下查看四种样式；点击加载按钮后切走再返回；确认按钮恢复且原有设置保留。
