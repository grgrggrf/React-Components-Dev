import type { CSSProperties } from "react";
import type {
  CartoonLoaderProps,
  ResponsiveLoaderSize,
} from "./CartoonLoader.types";
import styles from "./CartoonLoader.module.css";
import { LoaderArtwork } from "./LoaderArtwork";
import { loaderCatalog, resolveLoaderShape } from "./loaderCatalog";

const presets: Record<"sm" | "md" | "lg", ResponsiveLoaderSize> = {
  sm: { mobile: 32, tablet: 40, desktop: 48 },
  md: { mobile: 64, tablet: 80, desktop: 96 },
  lg: { mobile: 96, tablet: 120, desktop: 144 },
};

// 过滤 0、负数和 NaN，避免接口或表单传入异常尺寸后图标消失。
function validSize(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : fallback;
}

/**
 * 卡通加载器：只负责展示，不发请求，也不管理业务数据。
 * @example <CartoonLoader shape="cloud" size={80} color="#7dd3fc" />
 * @example <CartoonLoader size={{ mobile: 48, tablet: 72, desktop: 96 }} />
 * 将 loading 设置为请求的 isPending，即可在请求结束时自动隐藏。
 */
export function CartoonLoader({
  visualStyle = "cartoon",
  status = "normal",
  accentColor,
  overlayColor = "rgba(255, 255, 255, 0.9)",
  children,
  size = "md",
  shape,
  color,
  outlineColor = "#292524",
  label,
  labelFontSize,
  labelColor,
  labelFontFamily,
  labelOpacity = 1,
  showLabel = true,
  loading = true,
  animated = true,
  display = "block",
  className = "",
}: CartoonLoaderProps) {
  const resolvedShape = resolveLoaderShape(visualStyle, shape, status);
  const isLegacy = ["star", "cloud", "robot"].includes(resolvedShape);
  const resolvedColor =
    color ?? loaderCatalog.find((item) => item.value === resolvedShape)!.color;
  const sizes =
    typeof size === "number"
      ? { mobile: size, tablet: size, desktop: size }
      : typeof size === "string"
        ? presets[size]
        : size;
  const mobile = validSize(sizes.mobile, 64);
  const tablet = validSize(sizes.tablet, mobile);
  const desktop = validSize(sizes.desktop, tablet);
  // 用 CSS 断点切换尺寸，不读取 window，支持服务端渲染且不会产生监听器。
  const variables = {
    "--cl-mobile": `${mobile}px`,
    "--cl-tablet": `${tablet}px`,
    "--cl-desktop": `${desktop}px`,
    "--cl-color": resolvedColor,
    "--cl-outline": outlineColor,
    "--cl-accent": accentColor ?? (status === "error" ? "#e85d75" : "#5688d4"),
  } as CSSProperties;
  const accessibleLabel =
    label?.trim() ||
    (status === "error" ? "加载失败，请重试" : "正在加载，请稍候…");
  // 只给文字设置样式，不影响图标、阴影或整个组件的透明度。
  // 数字字号异常时交回 CSS 默认样式；CSS 字符串由浏览器解析。
  const labelStyle: CSSProperties = {
    fontSize:
      typeof labelFontSize === "number" &&
      (!Number.isFinite(labelFontSize) || labelFontSize < 0)
        ? undefined
        : labelFontSize,
    color: labelColor,
    fontFamily: labelFontFamily,
    opacity: Number.isFinite(labelOpacity)
      ? Math.min(1, Math.max(0, labelOpacity))
      : 1,
  };

  const icon = (
    <span
      className={`${styles.loader} ${display === "inline" ? styles.inline : ""} ${className}`}
      style={variables}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-animated={animated}
      data-status={status}
      data-visual-style={visualStyle}
    >
      <span className={styles.art} aria-hidden="true">
        <svg
          className={isLegacy ? styles.character : styles.customCharacter}
          viewBox="0 0 100 100"
          fill="none"
          focusable="false"
        >
          {isLegacy ? (
            <>
              <g
                fill="var(--cl-color)"
                stroke="var(--cl-outline)"
                strokeWidth="3.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              >
                {resolvedShape === "star" && (
                  <path d="M50 10 Q53 10 56 19 L64 35 83 38 Q94 39 86 48 L72 62 75 82 Q77 93 67 87 L50 77 33 87 Q23 93 25 82 L28 62 14 48 Q6 39 17 38 L36 35 44 19 Q47 10 50 10Z" />
                )}
                {resolvedShape === "cloud" && (
                  <path d="M25 76 C2 76 2 44 22 42 C20 17 57 9 67 34 C91 27 104 72 79 76Z" />
                )}
                {resolvedShape === "robot" && (
                  <>
                    <path d="M50 27V16" />
                    <circle cx="50" cy="12" r="5" />
                    <rect x="16" y="28" width="68" height="54" rx="17" />
                    <path d="M16 46H9V63H16M84 46H91V63H84" />
                  </>
                )}
              </g>
              {status === "error" ? (
                <g
                  stroke="var(--cl-outline)"
                  strokeWidth="3"
                  strokeLinecap="round"
                >
                  <path d="M34 49L42 53M58 53L66 49M43 66Q50 59 57 66" />
                  <path
                    d="M29 54Q21 65 29 65Q37 65 29 54"
                    fill="var(--cl-accent)"
                    stroke="none"
                  />
                </g>
              ) : (
                <g fill="var(--cl-outline)">
                  <ellipse cx="38" cy="51" rx="3" ry="4" />
                  <ellipse cx="62" cy="51" rx="3" ry="4" />
                </g>
              )}
              <g fill="#fb7185" opacity=".55">
                <ellipse cx="29" cy="60" rx="5" ry="3" />
                <ellipse cx="71" cy="60" rx="5" ry="3" />
              </g>
              {status !== "error" && (
                <path
                  d="M43 62 Q50 70 57 62"
                  stroke="var(--cl-outline)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}
              {status === "error" && (
                <g>
                  <circle
                    cx="80"
                    cy="22"
                    r="12"
                    fill="var(--cl-accent)"
                    stroke="var(--cl-outline)"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M76 18L84 26M84 18L76 26"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </g>
              )}
              {status === "loading" && (
                <g className={styles.orbit}>
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    stroke="var(--cl-accent)"
                    strokeWidth="3"
                    strokeDasharray="24 18"
                    opacity=".6"
                  />
                  <circle cx="50" cy="4" r="4" fill="var(--cl-accent)" />
                </g>
              )}
            </>
          ) : (
            <LoaderArtwork shape={resolvedShape} />
          )}
        </svg>
        {isLegacy && <span className={styles.shadow} />}
      </span>
      <span
        className={showLabel ? styles.label : styles.srOnly}
        style={showLabel ? labelStyle : undefined}
      >
        {accessibleLabel}
      </span>
    </span>
  );

  if (children === undefined || children === null) return loading ? icon : null;
  const blocked = loading && status === "loading";

  // 内容始终挂载在同一位置，加载结束不会丢失表单输入或组件内部状态。
  // inert 同时禁止点击和键盘聚焦；遮罩拦截事件，避免冒泡触发祖先点击行为。
  return (
    <div className={styles.boundary} data-blocked={blocked}>
      <div className={styles.content} inert={blocked} aria-busy={blocked}>
        {children}
      </div>
      {blocked ? (
        <div
          className={styles.overlay}
          style={{ background: overlayColor }}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onKeyDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          {icon}
        </div>
      ) : loading ? (
        <div className={styles.inlineStatus}>{icon}</div>
      ) : null}
    </div>
  );
}
