/** 风格入口：新增风格时，在此登记名称，再为它补充图标。 */
export const loaderStyles = {
  cartoon: { label: "卡通", description: "有表情的小伙伴，让等待更轻松" },
  business: { label: "商务", description: "克制清晰的线条，适合业务系统" },
} as const;
export type LoaderStyle = keyof typeof loaderStyles;
type Scene = "normal" | "loading" | "error";

/** 图标目录是分类、下拉选项和画廊的共同来源。 */
export const loaderCatalog = [
  {
    value: "planet",
    label: "星球漫游",
    style: "cartoon",
    scenes: ["normal"],
    color: "#f6aa96",
    description: "微笑星球与绕行卫星",
  },
  {
    value: "cat-hourglass",
    label: "小猫沙漏",
    style: "cartoon",
    scenes: ["normal"],
    color: "#f5cf79",
    description: "抱着沙漏耐心等候的小猫",
  },
  {
    value: "rocket",
    label: "小火箭",
    style: "cartoon",
    scenes: ["loading"],
    color: "#86cfc0",
    description: "小火箭正在加速处理",
  },
  {
    value: "mochi",
    label: "弹跳团子",
    style: "cartoon",
    scenes: ["loading"],
    color: "#f5b5b8",
    description: "三个小团子依次弹跳",
  },
  {
    value: "bandaged-heart",
    label: "创可贴爱心",
    style: "cartoon",
    scenes: ["error"],
    color: "#f3a1a5",
    description: "贴着创可贴的小爱心",
  },
  {
    value: "lost-envelope",
    label: "迷路信封",
    style: "cartoon",
    scenes: ["error"],
    color: "#a8d4ef",
    description: "带着问号的迷路信封",
  },
  {
    value: "star",
    label: "小星星",
    style: "cartoon",
    scenes: ["normal", "loading", "error"],
    color: "#fbbf24",
    description: "微笑小星星",
  },
  {
    value: "cloud",
    label: "小云朵",
    style: "cartoon",
    scenes: ["normal", "loading", "error"],
    color: "#93c5fd",
    description: "轻柔小云朵",
  },
  {
    value: "robot",
    label: "小机器人",
    style: "cartoon",
    scenes: ["normal", "loading", "error"],
    color: "#a7d7b5",
    description: "认真小机器人",
  },
  {
    value: "segmented-ring",
    label: "分段旋环",
    style: "business",
    scenes: ["normal"],
    color: "#285eac",
    description: "逐段流转的径向加载环",
  },
  {
    value: "orbit-dots",
    label: "轨道圆点",
    style: "business",
    scenes: ["normal"],
    color: "#49a99b",
    description: "沿轨道旋转的简洁圆点",
  },
  {
    value: "thin-ring",
    label: "细环加载",
    style: "business",
    scenes: ["loading"],
    color: "#ffffff",
    description: "紧凑的细线旋转加载环",
  },
  {
    value: "pulse-dots",
    label: "三点脉冲",
    style: "business",
    scenes: ["loading"],
    color: "#ffffff",
    description: "依次明暗变化的三个圆点",
  },
  {
    value: "alert-circle",
    label: "警示圆环",
    style: "business",
    scenes: ["error"],
    color: "#f47c79",
    description: "清晰可辨的失败感叹号",
  },
  {
    value: "broken-link",
    label: "连接中断",
    style: "business",
    scenes: ["error"],
    color: "#536171",
    description: "断开的链接与失败标记",
  },
] as const;
export type LoaderShape = (typeof loaderCatalog)[number]["value"];

/** 只筛选目录，不在页面里分别维护多套图标列表。 */
export function getLoaderOptions(style: LoaderStyle, scene: Scene) {
  return loaderCatalog.filter(
    (item) =>
      item.style === style && (item.scenes as readonly Scene[]).includes(scene),
  );
}

/** 旧调用不传风格时仍默认星星；跨风格误传图标时使用该风格的默认图标。 */
export function resolveLoaderShape(
  style: LoaderStyle,
  shape: LoaderShape | undefined,
  scene: Scene,
): LoaderShape {
  if (
    shape &&
    loaderCatalog.some((item) => item.value === shape && item.style === style)
  )
    return shape;
  return style === "cartoon" ? "star" : getLoaderOptions(style, scene)[0].value;
}
