import type { ReactNode } from "react";

export type LayoutVariant = "stack" | "left" | "right" | "full-height-left";

export interface ResponsiveLayoutProps {
  /** 从上到下、左侧栏、右侧栏，或左侧栏贯穿整个页面。 */
  variant?: LayoutVariant;
  header?: ReactNode;
  footer?: ReactNode;
  sider?: ReactNode;
  children: ReactNode;
  /** 数值单位为 px；平板上的侧栏会自动收窄。 */
  headerHeight?: number;
  footerHeight?: number;
  siderWidth?: number;
  minHeight?: number;
  className?: string;
}
