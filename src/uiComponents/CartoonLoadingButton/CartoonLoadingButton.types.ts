import type { CSSProperties } from "react";
import type { CartoonLoaderProps } from "../CartoonLoader";

export interface CartoonLoadingButtonProps {
  /** 图标风格分类，默认 cartoon；支持 business。 */
  visualStyle?: CartoonLoaderProps["visualStyle"];
  /** 点击操作。返回请求 Promise，按钮会等待其结束后解除禁用。 */
  onAction: () => unknown | Promise<unknown>;
  /** 可选的外部加载状态，与内部异步状态共同控制禁用。 */
  loading?: boolean;
  disabled?: boolean;
  label?: string;
  loadingLabel?: string;
  /** 按钮尺寸与图标尺寸分别控制。 */
  buttonSize?: "sm" | "md" | "lg";
  buttonShape?: "rounded" | "pill" | "square";
  backgroundColor?: CSSProperties["backgroundColor"];
  labelColor?: CSSProperties["color"];
  labelFontSize?: CSSProperties["fontSize"];
  labelFontFamily?: CSSProperties["fontFamily"];
  labelOpacity?: number;
  iconShape?: CartoonLoaderProps["shape"];
  iconSize?: CartoonLoaderProps["size"];
  iconColor?: string;
  accentColor?: string;
  animated?: boolean;
  showIcon?: boolean;
  showLabel?: boolean;
  fullWidth?: boolean;
  className?: string;
}
