import type { CSSProperties, ReactNode } from "react";

import type { LoaderShape, LoaderStyle } from "./loaderCatalog";
export type { LoaderShape, LoaderStyle } from "./loaderCatalog";
/** normal 保留原来的微笑图标；error 显示失败表情；loading 显示忙碌动画。 */
export type LoaderStatus = "normal" | "error" | "loading";

/** 单位为像素。未填写的尺寸沿用较小屏幕的设置。 */
export interface ResponsiveLoaderSize {
  mobile: number;
  tablet?: number;
  desktop?: number;
}

export interface CartoonLoaderProps {
  /** 风格分类：cartoon 卡通、business 商务。默认卡通，保持旧代码兼容。 */
  visualStyle?: LoaderStyle;
  /** 图标状态，默认 normal，兼容原有调用。 */
  status?: LoaderStatus;
  /** 状态装饰颜色：失败徽章或加载圆环；默认随状态选择。 */
  accentColor?: string;
  /** 加载遮罩的背景色，仅在 loading 状态且有 children 时使用。 */
  overlayColor?: string;
  /** 要保护的内容区：status='loading' 且 loading=true 时禁用交互。 */
  children?: ReactNode;
  /** 图标尺寸：像素、预设，或者按屏幕分别设置。默认 md（64/80/96px）。 */
  size?: number | "sm" | "md" | "lg" | ResponsiveLoaderSize;
  /** 图标标识，完整清单见 loaderCatalog；不传时使用当前风格默认图标。 */
  shape?: LoaderShape;
  /** 图标主色，支持 CSS 颜色，包括 var(--brand-color)。 */
  color?: string;
  /** 轮廓和表情颜色，可按项目主题修改。 */
  outlineColor?: string;
  /** 提示文字；即使隐藏文字，屏幕阅读器也会读出它。 */
  label?: string;
  /** 文字大小：数字表示 px，也支持 '1rem'、'clamp(...)' 等 CSS 值。默认 0.875rem。 */
  labelFontSize?: CSSProperties["fontSize"];
  /** 文字颜色，支持 CSS 颜色或变量；不传时继承父元素颜色。 */
  labelColor?: CSSProperties["color"];
  /** 文字字体，例如 'Microsoft YaHei, sans-serif'；字体需由项目提供或系统安装。 */
  labelFontFamily?: CSSProperties["fontFamily"];
  /** 仅文字的透明度：0 完全透明，1 完全不透明；默认 1，超出范围自动限制。 */
  labelOpacity?: number;
  /** 是否显示提示文字，默认显示。 */
  showLabel?: boolean;
  /** 是否显示状态图标。false 时隐藏图标；有 children 时保留内容并解除禁用。 */
  loading?: boolean;
  /** 是否播放动画，默认 true；系统减少动画设置优先。 */
  animated?: boolean;
  /** block 在父容器中居中；inline 适合嵌入一行内容。 */
  display?: "block" | "inline";
  /** 给外层容器补充项目自己的样式。 */
  className?: string;
}
