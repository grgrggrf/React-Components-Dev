import type { ReactNode } from "react";

export interface SidebarItem {
  key: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  children?: SidebarItem[];
}
export interface ResponsiveSidebarProps {
  items: SidebarItem[];
  children?: ReactNode;
  placement?: "left" | "right";
  title?: string;
  width?: number;
  collapsedWidth?: number;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  selectedKey?: string;
  defaultSelectedKey?: string;
  onSelect?: (key: string) => void;
  openKeys?: string[];
  defaultOpenKeys?: string[];
  onOpenChange?: (keys: string[]) => void;
  /** 同一父级下只展开一个分支，保留该分支的祖先。 */
  accordion?: boolean;
  backgroundColor?: string;
  textColor?: string;
  selectedColor?: string;
  selectedBackground?: string;
  fontSize?: number;
  iconSize?: number;
  showIcons?: boolean;
  indent?: number;
  minHeight?: number;
  className?: string;
}
