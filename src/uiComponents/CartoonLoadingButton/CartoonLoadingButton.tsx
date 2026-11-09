import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { CartoonLoader } from "../CartoonLoader";
import type { CartoonLoadingButtonProps } from "./CartoonLoadingButton.types";
import styles from "./CartoonLoadingButton.module.css";
import { resolveLoaderShape } from "../CartoonLoader/loaderCatalog";

/**
 * 卡通加载按钮：点击后立即禁用，等待 onAction 返回的 Promise 结束后恢复。
 * 使用原生 disabled 同时拦截鼠标和键盘，ref 防止重渲染前的快速重复点击。
 * 失败时恢复按钮并展示错误；本组件不决定业务重试或发起网络请求。
 */
export function CartoonLoadingButton({
  visualStyle = "cartoon",
  onAction,
  loading = false,
  disabled = false,
  label = "点击保存",
  loadingLabel = "正在处理…",
  buttonSize = "md",
  buttonShape = "rounded",
  backgroundColor = "#47725b",
  labelColor = "#ffffff",
  labelFontSize,
  labelFontFamily,
  labelOpacity = 1,
  iconShape,
  iconSize = { mobile: 24, tablet: 28, desktop: 32 },
  iconColor,
  accentColor = "#93c5fd",
  animated = true,
  showIcon = true,
  showLabel = true,
  fullWidth = false,
  className = "",
}: CartoonLoadingButtonProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const locked = useRef(false);
  const busy = loading || pending;
  const text = busy
    ? loadingLabel.trim() || "正在处理…"
    : label.trim() || "点击保存";

  async function handleClick() {
    if (disabled || loading || locked.current) return;
    locked.current = true;
    setPending(true);
    setError("");
    try {
      await onAction();
    } catch (reason) {
      setError(
        reason instanceof Error && reason.message
          ? reason.message
          : "操作失败，请重试。",
      );
    } finally {
      locked.current = false;
      setPending(false);
    }
  }

  const buttonStyle = {
    "--button-background": backgroundColor,
    color: labelColor,
    fontFamily: labelFontFamily,
    fontSize:
      typeof labelFontSize === "number" &&
      (!Number.isFinite(labelFontSize) || labelFontSize < 0)
        ? undefined
        : labelFontSize,
  } as CSSProperties;

  return (
    <span
      className={`${styles.wrapper} ${className}`}
      data-full-width={fullWidth}
    >
      <button
        type="button"
        className={styles.button}
        style={buttonStyle}
        data-size={buttonSize}
        data-shape={buttonShape}
        disabled={disabled || busy}
        aria-busy={busy}
        aria-label={text}
        onClick={() => void handleClick()}
      >
        {showIcon && (
          <span aria-hidden="true" className={styles.icon}>
            <CartoonLoader
              visualStyle={visualStyle}
              status={busy ? "loading" : "normal"}
              shape={resolveLoaderShape(visualStyle, iconShape, "loading")}
              size={iconSize}
              color={iconColor}
              accentColor={accentColor}
              animated={busy && animated}
              showLabel={false}
            />
          </span>
        )}
        {(showLabel || !showIcon) && (
          <span
            className={styles.text}
            style={{
              opacity: Number.isFinite(labelOpacity)
                ? Math.min(1, Math.max(0, labelOpacity))
                : 1,
            }}
          >
            {text}
          </span>
        )}
      </button>
      {error && (
        <span role="alert" className={styles.error}>
          {error}
        </span>
      )}
    </span>
  );
}
