import type { TabsProps } from "antd";
import type { ReactNode } from "react";

export type TabsVariant = "line" | "card" | "pill" | "sidebar";
export type ResponsiveTabItem = NonNullable<TabsProps["items"]>[number];

export interface ResponsiveTabsProps extends Pick<
  TabsProps,
  | "items"
  | "activeKey"
  | "defaultActiveKey"
  | "onChange"
  | "size"
  | "tabBarGutter"
  | "centered"
  | "destroyOnHidden"
  | "className"
  | "style"
> {
  /** 侧边式只在组件宽度小于 600px 时显示在左侧，其余宽度显示在顶部。 */
  variant?: TabsVariant;
  /** 标签标题组的对齐方式。横排对应左/中/右，侧边式对应上/中/下；优先于 centered。 */
  tabAlign?: "start" | "center" | "end";
  /** 标签栏上方的主标题，如“胶囊式”。 */
  title?: string;
  /** 主标题的位置，与标签标题组 tabAlign 分开设置。 */
  titleAlign?: "start" | "center" | "end";
  /** 主标题旁的操作区；组件按标题位置安排按钮，窄屏自动换行。 */
  titleExtra?: ReactNode;
  /** 不传时跟随外层 Ant Design 主题。 */
  activeColor?: string;
  labelColor?: string;
  /** 卡片式支持关闭。传入回调后，由页面更新 items。单项 closable=false 可保护该项。 */
  closable?: boolean;
  onClose?: (key: string) => void;
  /** 卡片式传入此回调时显示新增按钮，由页面创建新标签。 */
  onAdd?: () => void;
}
