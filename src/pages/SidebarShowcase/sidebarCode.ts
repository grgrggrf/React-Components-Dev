import { sidebarPages } from "../../mocks/sidebar";
import type { ResponsiveSidebarProps, SidebarItem } from "../../uiComponents/ResponsiveSidebar";

export type SidebarSettings = Required<Pick<ResponsiveSidebarProps,
  "placement" | "title" | "width" | "collapsedWidth" | "backgroundColor" | "textColor" |
  "selectedColor" | "selectedBackground" | "fontSize" | "iconSize" | "showIcons" | "indent" | "accordion"
>>;

/** 复制完整菜单与当前外观参数，事件和页面内容也包含在示例中。 */
export function buildSidebarCode(settings: SidebarSettings, collapsed: boolean, selectedKey: string, openKeys: string[], items: SidebarItem[]) {
  return [
    'import { useState } from "react";',
    'import { ResponsiveSidebar } from "./uiComponents";',
    `const items = ${JSON.stringify(items, null, 2)};`,
    `const pages: Record<string, { title: string; files: string[] }> = ${JSON.stringify(sidebarPages, null, 2)};`,
    "",
    "export default function Example() {",
    `  const [selectedKey, setSelectedKey] = useState(${JSON.stringify(selectedKey)});`,
    `  const [collapsed, setCollapsed] = useState(${collapsed});`,
    `  const [openKeys, setOpenKeys] = useState<string[]>(${JSON.stringify(openKeys)});`,
    "  const content = pages[selectedKey] ?? pages.home;",
    "  return (",
    "    <ResponsiveSidebar",
    "      items={items}",
    ...Object.entries(settings).map(([key, value]) => `      ${key}={${JSON.stringify(value)}}`),
    "      collapsed={collapsed} onCollapsedChange={setCollapsed}",
    "      selectedKey={selectedKey} onSelect={setSelectedKey}",
    "      openKeys={openKeys} onOpenChange={setOpenKeys}",
    "    >",
    '      <section style={{ padding: 20 }}>',
    "        <h1>{content.title}</h1>",
    "        <ul>{content.files.map(file => <li key={file}>{file}</li>)}</ul>",
    "      </section>",
    "    </ResponsiveSidebar>",
    "  );",
    "}",
  ].join("\n");
}
