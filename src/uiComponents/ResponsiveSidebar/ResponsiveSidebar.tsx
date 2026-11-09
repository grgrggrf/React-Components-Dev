import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Button, ConfigProvider, Drawer, Menu } from "antd";
import type { MenuProps } from "antd";
import type { ResponsiveSidebarProps, SidebarItem } from "./ResponsiveSidebar.types";
import { normalizeOpenKeys } from "./menuTree";
import styles from "./ResponsiveSidebar.module.css";

/** 菜单与主内容组合；按容器宽度切换手机抽屉。业务导航通过 onSelect 交给调用方。 */
export function ResponsiveSidebar({
  items, children, placement = "left", title = "菜单", width = 240, collapsedWidth = 64,
  collapsed, defaultCollapsed = false, onCollapsedChange, selectedKey, defaultSelectedKey,
  onSelect, openKeys, defaultOpenKeys = [], onOpenChange, accordion = false,
  backgroundColor = "#ffffff", textColor = "#1f2937", selectedColor = "#1677ff",
  selectedBackground = "#e6f4ff", fontSize = 14, iconSize = 18, showIcons = true,
  indent = 16, minHeight = 380, className = "",
}: ResponsiveSidebarProps) {
  const container = useRef<HTMLDivElement>(null);
  const [phone, setPhone] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [innerCollapsed, setInnerCollapsed] = useState(defaultCollapsed);
  const [innerSelected, setInnerSelected] = useState(defaultSelectedKey);
  const [innerOpen, setInnerOpen] = useState(defaultOpenKeys);
  const narrow = !phone && (collapsed ?? innerCollapsed);
  const selected = selectedKey ?? innerSelected;
  const expanded = normalizeOpenKeys(items, openKeys ?? innerOpen, accordion);
  const safeWidth = Number.isFinite(width) ? Math.max(160, width) : 240;
  const safeCollapsedWidth = Number.isFinite(collapsedWidth) ? Math.max(48, Math.min(collapsedWidth, safeWidth)) : 64;
  useEffect(() => {
    const node = container.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width <= 0) return;
      const small = entry.contentRect.width < 600;
      setPhone(small);
      if (!small) setDrawerOpen(false);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  function changeOpen(keys: string[]) {
    // 收起切换时 Menu 会发出空数组，保留展开模式的分支以便恢复。
    if (narrow) return;
    const next = normalizeOpenKeys(items, keys, accordion);
    if (openKeys === undefined) setInnerOpen(next);
    onOpenChange?.(next);
  }
  function menuItems(nodes: SidebarItem[]): MenuProps["items"] {
    return nodes.map(item => ({
      key: item.key, label: item.label, title: item.label, disabled: item.disabled,
      icon: showIcons && item.icon ? <span style={{ fontSize: iconSize }}>{item.icon}</span> : narrow ? <span aria-hidden="true">{item.label.slice(0, 1)}</span> : undefined,
      children: item.children?.length ? menuItems(item.children) : undefined,
    }));
  }
  const menu = <Menu aria-label={title} mode="inline" inlineCollapsed={narrow}
    inlineIndent={indent} items={menuItems(items)} selectedKeys={selected ? [selected] : []}
    {...(narrow ? {} : { openKeys: expanded })}
    onOpenChange={changeOpen}
    style={{ background: backgroundColor, borderInlineEnd: 0 }}
    onClick={({ key }) => {
      if (selectedKey === undefined) setInnerSelected(key);
      onSelect?.(key);
      setDrawerOpen(false);
    }} />;
  return <ConfigProvider theme={{ token: { fontSize, colorText: textColor, colorPrimary: selectedColor },
    components: { Menu: {
      itemBg: backgroundColor, subMenuItemBg: backgroundColor, popupBg: backgroundColor,
      itemColor: textColor, itemSelectedColor: selectedColor, itemSelectedBg: selectedBackground,
      itemHoverColor: selectedColor, itemHoverBg: selectedBackground, iconSize,
      collapsedWidth: safeCollapsedWidth,
    }, Drawer: { colorBgElevated: backgroundColor, colorText: textColor } } }}>
    <div ref={container} className={`${styles.root} ${className}`} data-side={placement} data-phone={phone}
      style={{ "--sidebar-width": `${narrow ? safeCollapsedWidth : safeWidth}px`, minHeight } as CSSProperties}>
      {phone ? <div className={styles.mobileBar}>
        <Button aria-haspopup="dialog" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)}>打开{title}</Button>
        <Drawer title={title} placement={placement} open={drawerOpen} onClose={() => setDrawerOpen(false)}
          getContainer={false} rootStyle={{ position: "absolute" }} size={`min(${safeWidth}px, 85%)`}
          styles={{ body: { padding: 0, background: backgroundColor } }}>
          {menu}
        </Drawer>
      </div> : <aside className={styles.sider} style={{ background: backgroundColor, color: textColor }}>
        <div className={styles.header}>
          {!narrow && <strong>{title}</strong>}
          <Button size="small" aria-label={narrow ? "展开侧栏" : "收起侧栏"} aria-expanded={!narrow}
            onClick={() => {
              if (collapsed === undefined) setInnerCollapsed(!narrow);
              onCollapsedChange?.(!narrow);
            }}>{narrow === (placement === "left") ? "»" : "«"}</Button>
        </div>
        {menu}
      </aside>}
      <div className={styles.content}>{children}</div>
    </div>
  </ConfigProvider>;
}
