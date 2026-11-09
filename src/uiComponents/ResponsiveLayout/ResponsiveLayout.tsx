import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Button, Drawer, Layout } from "antd";
import type { ResponsiveLayoutProps } from "./ResponsiveLayout.types";
import styles from "./ResponsiveLayout.module.css";

/** 小屏只显示入口按钮，侧栏抽屉在当前布局内展开。 */
function MobileSider({
  children,
  right,
}: {
  children: ReactNode;
  right: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.trigger}>
      <Button
        size="small"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        打开侧栏
      </Button>
      <Drawer
        title="侧栏"
        placement={right ? "right" : "left"}
        getContainer={false}
        rootStyle={{ position: "absolute" }}
        size="min(280px, 85%)"
        open={open}
        onClose={() => setOpen(false)}
      >
        {children}
      </Drawer>
    </div>
  );
}

/** 用 variant 调整各区域的位置。主内容始终在同一个 React 节点，切换布局可保留其输入状态。 */
export function ResponsiveLayout({
  variant = "stack",
  header,
  footer,
  sider,
  children,
  headerHeight = 64,
  footerHeight = 56,
  siderWidth = 200,
  minHeight = 320,
  className,
}: ResponsiveLayoutProps) {
  const container = useRef<HTMLDivElement>(null);
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const node = container.current;
    if (!node) return;
    // 监听组件自己的宽度，让嵌入式预览和真实设备遵循同一条规则。
    const observer = new ResizeObserver(([entry]) =>
      setPhone(entry.contentRect.width < 600),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const withSider = variant !== "stack" && sider != null;
  const dimensions = {
    "--rl-sider": `${siderWidth}px`,
    minHeight,
  } as CSSProperties;
  return (
    <div ref={container} className={`${styles.container} ${className ?? ""}`}>
      <Layout
        className={styles.grid}
        style={dimensions}
        data-variant={withSider && !phone ? variant : "stack"}
      >
        {header != null && (
          <Layout.Header
            className={styles.header}
            style={{ minHeight: headerHeight }}
          >
            {header}
          </Layout.Header>
        )}
        {withSider && phone && (
          <MobileSider right={variant === "right"}>{sider}</MobileSider>
        )}
        {withSider && !phone && (
          <Layout.Sider className={styles.sider} width="100%">
            {sider}
          </Layout.Sider>
        )}
        <Layout.Content className={styles.content}>{children}</Layout.Content>
        {footer != null && (
          <Layout.Footer
            className={styles.footer}
            style={{ minHeight: footerHeight }}
          >
            {footer}
          </Layout.Footer>
        )}
      </Layout>
    </div>
  );
}
