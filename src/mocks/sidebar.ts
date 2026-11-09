/** 纯数据菜单，图标用可复制的字符演示；业务可替换为 React 图标组件。 */
import type { SidebarItem } from "../uiComponents/ResponsiveSidebar";
export const sidebarItems = [
  { key: "home", label: "工作台", icon: "⌂" },
  { key: "projects", label: "项目管理", icon: "▱", children: [
    { key: "website", label: "官网项目", icon: "▱", children: [
      { key: "design", label: "设计资料", icon: "▤" },
      { key: "development", label: "开发任务", icon: "☷" },
    ] },
    { key: "mobile", label: "移动端项目", icon: "▱", children: [
      { key: "reading", label: "阅读体验", icon: "▤" },
    ] },
  ] },
  { key: "team", label: "团队设置", icon: "⚙", children: [
    { key: "members", label: "成员管理", icon: "♙" },
    { key: "permissions", label: "权限配置", icon: "⚿", disabled: true },
  ] },
];
export const sidebarPages: Record<string, { title: string; files: string[] }> = {
  home: { title: "项目概览", files: ["官网项目", "移动端项目"] },
  design: { title: "设计资料", files: ["首页设计稿", "品牌规范"] },
  development: { title: "开发任务", files: ["首页布局", "搜索交互"] },
  reading: { title: "阅读体验", files: ["书架原型", "目录导航"] },
  members: { title: "成员管理", files: ["林禾 · 设计", "陈一 · 开发"] },
};

/** 只创建需要变换图标的节点，不改动原始示例菜单。 */
export function getSidebarItems(style: "symbol" | "emoji"): SidebarItem[] {
  const icons: Record<string, string> = {
    home: "🏠", projects: "📁", website: "🌐", design: "📄", development: "📋",
    mobile: "📱", reading: "📖", team: "⚙️", members: "👤", permissions: "🔒",
  };
  function map(nodes: SidebarItem[]): SidebarItem[] {
    return nodes.map(item => ({ ...item,
      icon: style === "emoji" ? icons[item.key] : item.icon,
      children: item.children ? map(item.children) : undefined,
    }));
  }
  return map(sidebarItems);
}
