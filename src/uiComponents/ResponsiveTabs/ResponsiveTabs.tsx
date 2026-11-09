import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ConfigProvider, Tabs, theme } from "antd";
import type { ResponsiveTabsProps } from "./ResponsiveTabs.types";
import styles from "./ResponsiveTabs.module.css";

/**
 * 多标签栏：只负责样式、窄屏方向及交互入口，内容和新增/删除数据由调用页面管理。
 * items 使用稳定且唯一的 key。默认保留已打开内容，切换标签后表单和加载器状态仍可继续使用。
 */
export function ResponsiveTabs({
  variant = "line",
  tabAlign,
  title,
  titleAlign = "start",
  titleExtra,
  centered = false,
  activeColor,
  labelColor,
  closable = false,
  onClose,
  onAdd,
  items = [],
  className = "",
  destroyOnHidden = false,
  ...props
}: ResponsiveTabsProps) {
  const container = useRef<HTMLDivElement>(null);
  const [isPhone, setIsPhone] = useState(false);
  const { token } = theme.useToken();
  useEffect(() => {
    const node = container.current;
    if (!node || variant !== "sidebar") return;
    // 使用容器宽度，所以测试页中的手机预览与真实窄屏使用相同规则。
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0)
        setIsPhone(entry.contentRect.width < 600);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [variant]);
  const editable = variant === "card" && ((closable && !!onClose) || !!onAdd);
  const color = activeColor ?? token.colorPrimary;
  const wrapperStyle = {
    "--rt-active": color,
    "--rt-surface": token.colorBgContainer,
  } as CSSProperties;

  return (
    <div ref={container} className={styles.container} style={wrapperStyle}>
      <ConfigProvider
        theme={{
          components: {
            Tabs: {
              inkBarColor: color,
              itemSelectedColor: color,
              itemHoverColor: color,
              itemActiveColor: color,
              itemColor: labelColor ?? token.colorText,
            },
          },
        }}
      >
        {(title || titleExtra != null) && (
          <div className={styles.headingContainer}>
            <div className={styles.heading} data-align={titleAlign}>
              {title && <h2 className={styles.title}>{title}</h2>}
              {titleExtra != null && <div className={styles.actions}>{titleExtra}</div>}
            </div>
          </div>
        )}
        <Tabs
          {...props}
          className={`${styles.tabs} ${className}`}
          data-variant={variant}
          data-align={tabAlign ?? (centered ? "center" : "start")}
          centered={false}
          type={
            editable ? "editable-card" : variant === "card" ? "card" : "line"
          }
          tabPlacement={variant === "sidebar" && isPhone ? "start" : "top"}
          destroyOnHidden={destroyOnHidden}
          classNames={{
            header: styles.nav,
            item: styles.item,
            indicator: styles.indicator,
            body: styles.body,
          }}
          items={items.map((item) => ({
            ...item,
            closable: closable && !!onClose && item.closable !== false,
          }))}
          hideAdd={!onAdd}
          locale={{
            addAriaLabel: "新增标签",
            removeAriaLabel: "关闭标签",
            dropdownAriaLabel: "更多标签",
          }}
          onEdit={(key, action) => {
            if (action === "add") onAdd?.();
            else if (typeof key === "string") onClose?.(key);
          }}
        />
      </ConfigProvider>
    </div>
  );
}
