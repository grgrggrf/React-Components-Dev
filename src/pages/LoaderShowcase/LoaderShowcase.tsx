import { useId, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Button,
  ConfigProvider,
  Input,
  Segmented,
  Select,
  Slider,
  Switch,
} from "antd";
import { CartoonLoader, CartoonLoadingButton, ResponsiveTabs } from "../../uiComponents";
import { getLoaderOptions, loaderStyles } from "../../uiComponents";
import type {
  LoaderShape,
  LoaderStatus,
  LoaderStyle,
} from "../../uiComponents";
import { mockLoadContent } from "../../mocks/loader";

/** 加载器演示页面：参数调节和模拟请求只属于页面，不混入公共组件。 */
function LoaderPlayground({
  status,
  visualStyle,
}: {
  status: LoaderStatus;
  visualStyle: LoaderStyle;
}) {
  const shapes = getLoaderOptions(visualStyle, status);
  const controlId = useId();
  const [clickCount, setClickCount] = useState(0);
  const [buttonLabel, setButtonLabel] = useState("点击保存");
  const [backgroundColor, setBackgroundColor] = useState(
    visualStyle === "business" ? "#253e60" : "#47725b",
  );
  const [buttonSize, setButtonSize] = useState<"sm" | "md" | "lg">("md");
  const [buttonShape, setButtonShape] = useState<"rounded" | "pill" | "square">(
    "rounded",
  );
  const [showIcon, setShowIcon] = useState(true);
  const [fullWidth, setFullWidth] = useState(false);
  const [shape, setShape] = useState<LoaderShape>(shapes[0].value);
  const [color, setColor] = useState<string>(shapes[0].color);
  const [size, setSize] = useState(status === "loading" ? 32 : 112);
  const [responsive, setResponsive] = useState(true);
  const [animated, setAnimated] = useState(true);
  const [showLabel, setShowLabel] = useState(true);
  const [label, setLabel] = useState(
    status === "error"
      ? "哎呀，加载失败了，请再试一次。"
      : status === "loading"
        ? "正在保存…"
        : "美好的事情，值得等一等…",
  );
  const [accentColor, setAccentColor] = useState(
    status === "error"
      ? "#e85d75"
      : visualStyle === "cartoon"
        ? "#79c9b8"
        : "#5688d4",
  );
  const [labelFontSize, setLabelFontSize] = useState(14);
  const [labelColor, setLabelColor] = useState(
    status === "loading" ? "#ffffff" : "#292524",
  );
  const [labelFontFamily, setLabelFontFamily] = useState("inherit");
  const [labelOpacity, setLabelOpacity] = useState(1);
  const codeRef = useRef<HTMLElement>(null);
  const [isCopying, setIsCopying] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<{
    code: string;
    success: boolean;
  } | null>(null);
  const request = useMutation({ mutationFn: mockLoadContent });
  const loaderSize = responsive
    ? {
        mobile: status === "loading" ? 24 : 64,
        tablet: status === "loading" ? 28 : 88,
        desktop: size,
      }
    : size;
  // 用 JSON.stringify 转义引号、换行和反斜杠，复制后仍是合法的 JSX 字符串。
  const code =
    status === "loading"
      ? `import { CartoonLoadingButton } from "./uiComponents";\n\nexport default function SaveButton() {\n  async function handleSave() {\n    // 替换为实际请求，并 await 请求完成\n    await new Promise((resolve) => setTimeout(resolve, 2000));\n  }\n\n  return (\n    <CartoonLoadingButton\n      visualStyle="${visualStyle}"\n      onAction={handleSave}\n      label={${JSON.stringify(buttonLabel)}}\n      loadingLabel={${JSON.stringify(label)}}\n      buttonSize="${buttonSize}"\n      buttonShape="${buttonShape}"\n      backgroundColor="${backgroundColor}"\n      iconShape="${shape}"\n      iconSize={${JSON.stringify(loaderSize)}}\n      iconColor="${color}"\n      accentColor="${accentColor}"\n      showIcon={${showIcon}}\n      showLabel={${showLabel}}\n      fullWidth={${fullWidth}}\n      animated={${animated}}\n      labelFontSize={${labelFontSize}}\n      labelColor="${labelColor}"\n      labelFontFamily={${JSON.stringify(labelFontFamily)}}\n      labelOpacity={${labelOpacity}}\n    />\n  );\n}`
      : `<CartoonLoader\n  visualStyle="${visualStyle}"\n  status="${status}"\n  shape="${shape}"\n  color="${color}"\n  accentColor="${accentColor}"\n  size={${responsive ? `{ mobile: 64, tablet: 88, desktop: ${size} }` : size}}\n  animated={${animated}}\n  showLabel={${showLabel}}\n  label={${JSON.stringify(label)}}\n  labelFontSize={${labelFontSize}}\n  labelColor="${labelColor}"\n  labelFontFamily={${JSON.stringify(labelFontFamily)}}\n  labelOpacity={${labelOpacity}}\n/>`;
  const buttonSettings = {
    visualStyle,
    label: buttonLabel,
    loadingLabel: label,
    buttonSize,
    buttonShape,
    backgroundColor,
    iconShape: shape,
    iconSize: loaderSize,
    iconColor: color,
    accentColor,
    animated,
    showIcon,
    showLabel,
    fullWidth,
    labelFontSize,
    labelColor,
    labelFontFamily,
    labelOpacity,
  };
  const previewProps = {
    visualStyle,
    status,
    shape,
    size: loaderSize,
    color,
    accentColor,
    animated,
    showLabel,
    label,
    labelFontSize,
    labelColor,
    labelFontFamily,
    labelOpacity,
  };
  const currentFeedback = copyFeedback?.code === code ? copyFeedback : null;

  /** 复制当前配置；浏览器禁止剪贴板时选中代码，方便用户手动复制。 */
  async function copyCode() {
    setIsCopying(true);
    setCopyFeedback(null);
    try {
      if (!navigator.clipboard?.writeText) throw new Error("剪贴板不可用");
      await navigator.clipboard.writeText(code);
      setCopyFeedback({ code, success: true });
    } catch {
      if (codeRef.current) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(codeRef.current);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      setCopyFeedback({ code, success: false });
    } finally {
      setIsCopying(false);
    }
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#47725b",
          borderRadius: 10,
          fontFamily: "inherit",
        },
      }}
    >
      <main className="min-h-screen bg-[#faf9f6] px-5 py-8 text-stone-800 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <header className="mb-12 flex items-center justify-between border-b border-stone-200 pb-5">
            <span className="text-sm font-semibold tracking-widest">
              LITTLE UI{" "}
              <span className="ml-3 font-normal tracking-normal text-stone-500">
                组件实验室
              </span>
            </span>
            <span className="rounded-full border border-stone-200 px-3 py-1 text-xs text-stone-500">
              {status === "normal"
                ? "01 / 页面加载"
                : status === "error"
                  ? "02 / 加载失败"
                  : "03 / 加载中"}
            </span>
          </header>
          <p className="mb-3 text-xs font-semibold tracking-[.2em] text-[#47725b]">
            A LITTLE MOMENT OF JOY
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            {visualStyle === "cartoon"
              ? "让等待，也有一点可爱。"
              : "让等待，清晰而从容。"}
          </h1>
          <p className="mt-5 max-w-xl leading-7 text-stone-500">
            {loaderStyles[visualStyle].description}
            。选择图标并调整参数，复制到你的 React 项目。
          </p>

          <section
            className="mt-10 grid overflow-hidden rounded-3xl border border-stone-200 bg-white lg:grid-cols-[1.4fr_1fr]"
            aria-label="加载器交互演示"
          >
            <div className="relative flex min-h-[340px] items-center justify-center bg-[#f3f1e9] p-10 sm:min-h-[460px]">
              <span className="absolute left-6 top-6 text-xs tracking-widest text-stone-500">
                LIVE PREVIEW · 实时预览
              </span>
              {status === "loading" ? (
                <div className="flex w-full min-w-0 flex-col items-center gap-6">
                  <CartoonLoadingButton
                    {...buttonSettings}
                    onAction={async () => {
                      await request.mutateAsync();
                      setClickCount((count) => count + 1);
                    }}
                  />
                  <p role="status" className="text-sm text-stone-500">
                    完成次数：{clickCount} · 点击后等待两秒恢复
                  </p>
                </div>
              ) : (
                <CartoonLoader {...previewProps} />
              )}
              <span className="absolute bottom-6 text-xs text-stone-500">
                {responsive
                  ? status === "loading"
                    ? "图标：手机 24px / 平板 28px / 电脑自定义"
                    : "手机 64px / 平板 88px / 电脑自定义"
                  : `所有设备固定 ${size}px`}
              </span>
            </div>
            <div className="space-y-7 p-6 sm:p-8">
              <div>
                <h2 className="text-lg font-semibold">调成你喜欢的样子</h2>
                <p className="mt-1 text-sm text-stone-500">
                  参数一改，效果即刻呈现。
                </p>
              </div>
              {status === "loading" && (
                <div className="space-y-3 rounded-xl bg-blue-50 p-4">
                  <p className="text-xs leading-6 text-stone-600">
                    点击左侧按钮后自动进入加载状态并禁用，等待操作完成后恢复。其他区域仍可正常操作。
                  </p>
                  <label
                    htmlFor={`${controlId}-button-label`}
                    className="block text-sm"
                  >
                    按钮文字
                  </label>
                  <Input
                    id={`${controlId}-button-label`}
                    value={buttonLabel}
                    onChange={(event) => setButtonLabel(event.target.value)}
                  />
                  <label
                    htmlFor={`${controlId}-button-background`}
                    className="block text-sm"
                  >
                    按钮背景颜色
                  </label>
                  <input
                    id={`${controlId}-button-background`}
                    type="color"
                    value={backgroundColor}
                    onChange={(event) => setBackgroundColor(event.target.value)}
                    className="h-9 w-12 rounded border border-stone-200 bg-white p-1"
                  />
                  <p className="text-sm">按钮尺寸</p>
                  <Segmented
                    block
                    aria-label="按钮尺寸"
                    options={[
                      { label: "小", value: "sm" },
                      { label: "中", value: "md" },
                      { label: "大", value: "lg" },
                    ]}
                    value={buttonSize}
                    onChange={setButtonSize}
                  />
                  <p className="text-sm">按钮形状</p>
                  <Segmented
                    block
                    aria-label="按钮形状"
                    options={[
                      { label: "圆角", value: "rounded" },
                      { label: "胶囊", value: "pill" },
                      { label: "直角", value: "square" },
                    ]}
                    value={buttonShape}
                    onChange={setButtonShape}
                  />
                  <div className="flex items-center justify-between">
                    <span id={`${controlId}-show-icon`}>显示图标</span>
                    <Switch
                      aria-labelledby={`${controlId}-show-icon`}
                      checked={showIcon}
                      onChange={setShowIcon}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span id={`${controlId}-full-width`}>按钮填满容器</span>
                    <Switch
                      aria-labelledby={`${controlId}-full-width`}
                      checked={fullWidth}
                      onChange={setFullWidth}
                    />
                  </div>
                </div>
              )}
              <div>
                <p className="mb-3 text-sm font-medium">01 · 图标形状</p>
                <Select<LoaderShape>
                  className="w-full"
                  aria-label="图标形状"
                  options={shapes.map(({ value, label }) => ({ value, label }))}
                  value={shape}
                  onChange={(value) => {
                    setShape(value);
                    const selected = shapes.find(
                      (item) => item.value === value,
                    );
                    if (selected) setColor(selected.color);
                    if (visualStyle === "cartoon" && status !== "error")
                      setAccentColor(value === "mochi" ? "#bdb4ef" : "#79c9b8");
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor={`${controlId}-loader-color`}
                  className="mb-3 block text-sm font-medium"
                >
                  02 · 主色调
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id={`${controlId}-loader-color`}
                    type="color"
                    value={color}
                    onChange={(event) => setColor(event.target.value)}
                    className="h-10 w-12 cursor-pointer rounded border border-stone-200 bg-white p-1"
                  />
                  <span className="font-mono text-sm text-stone-500">
                    {color.toUpperCase()}
                  </span>
                </div>
              </div>
              <div>
                <p
                  id={`${controlId}-size-label`}
                  className="mb-2 text-sm font-medium"
                >
                  03 · {responsive ? "电脑端" : "固定"}图标尺寸{" "}
                  <span className="float-right font-normal text-stone-500">
                    {size}px
                  </span>
                </p>
                <Slider
                  min={status === "loading" ? 16 : 24}
                  max={status === "loading" ? 64 : 180}
                  value={size}
                  onChange={setSize}
                  ariaLabelledByForHandle={`${controlId}-size-label`}
                />
              </div>
              {
                <div className="flex items-center gap-3">
                  <label htmlFor={`${controlId}-accent`} className="text-sm">
                    装饰颜色
                  </label>
                  <input
                    id={`${controlId}-accent`}
                    type="color"
                    value={accentColor}
                    onChange={(event) => setAccentColor(event.target.value)}
                    className="h-9 w-12 rounded border border-stone-200 bg-white p-1"
                  />
                </div>
              }
              <fieldset className="min-w-0 space-y-4 border-t border-stone-100 pt-5">
                <legend className="text-sm font-medium">
                  04 · 提示文字样式
                </legend>
                <div>
                  <label
                    htmlFor={`${controlId}-loader-label`}
                    className="mb-2 block text-sm"
                  >
                    {status === "loading" ? "加载时文字" : "文字内容"}
                  </label>
                  <Input.TextArea
                    id={`${controlId}-loader-label`}
                    value={label}
                    onChange={(event) => setLabel(event.target.value)}
                    autoSize={{ minRows: 2, maxRows: 4 }}
                    placeholder="输入加载时显示的提示文字"
                    aria-describedby={`${controlId}-loader-label-help`}
                  />
                  <p
                    id={`${controlId}-loader-label-help`}
                    className="mt-2 text-xs text-stone-500"
                  >
                    清空或只输入空格时显示组件默认提示；隐藏文字请关闭“显示提示文字”。
                  </p>
                </div>
                <div>
                  <p id={`${controlId}-label-font-size`} className="text-sm">
                    字号 · {labelFontSize}px
                  </p>
                  <Slider
                    min={10}
                    max={36}
                    value={labelFontSize}
                    onChange={setLabelFontSize}
                    ariaLabelledByForHandle={`${controlId}-label-font-size`}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label
                    htmlFor={`${controlId}-label-color`}
                    className="text-sm"
                  >
                    文字颜色
                  </label>
                  <input
                    id={`${controlId}-label-color`}
                    type="color"
                    value={labelColor}
                    onChange={(event) => setLabelColor(event.target.value)}
                    className="h-9 w-12 cursor-pointer rounded border border-stone-200 bg-white p-1"
                  />
                  <span className="font-mono text-xs text-stone-500">
                    {labelColor}
                  </span>
                </div>
                <div>
                  <label
                    htmlFor={`${controlId}-label-font-family`}
                    className="mb-2 block text-sm"
                  >
                    字体
                  </label>
                  <select
                    id={`${controlId}-label-font-family`}
                    value={labelFontFamily}
                    onChange={(event) => setLabelFontFamily(event.target.value)}
                    className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="inherit">继承页面字体</option>
                    <option value="Microsoft YaHei, sans-serif">
                      微软雅黑 / 无衬线
                    </option>
                    <option value="SimSun, serif">宋体 / 衬线</option>
                    <option value="monospace">等宽字体</option>
                  </select>
                </div>
                <div>
                  <p id={`${controlId}-label-opacity`} className="text-sm">
                    不透明度 · {Math.round(labelOpacity * 100)}%
                  </p>
                  <Slider
                    min={0}
                    max={1}
                    step={0.05}
                    value={labelOpacity}
                    onChange={setLabelOpacity}
                    ariaLabelledByForHandle={`${controlId}-label-opacity`}
                  />
                </div>
              </fieldset>
              <div className="space-y-4 border-t border-stone-100 pt-5">
                <div className="flex items-center justify-between text-sm">
                  <span id={`${controlId}-responsive-label`}>响应式尺寸</span>
                  <Switch
                    aria-labelledby={`${controlId}-responsive-label`}
                    checked={responsive}
                    onChange={setResponsive}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span id={`${controlId}-animation-label`}>播放动画</span>
                  <Switch
                    aria-labelledby={`${controlId}-animation-label`}
                    checked={animated}
                    onChange={setAnimated}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span id={`${controlId}-label-label`}>显示提示文字</span>
                  <Switch
                    aria-labelledby={`${controlId}-label-label`}
                    checked={showLabel}
                    onChange={setShowLabel}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="mt-12" aria-label="当前分类图标一览">
            <h2 className="text-xl font-semibold">
              {loaderStyles[visualStyle].label} · {shapes.length} 款可选图标
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {shapes.map((item) => (
                <article
                  key={item.value}
                  className="rounded-2xl border border-stone-200 bg-white p-7 text-center"
                >
                  {status === "loading" ? (
                    <CartoonLoadingButton
                      {...buttonSettings}
                      fullWidth={false}
                      iconShape={item.value}
                      iconColor={item.color}
                      onAction={mockLoadContent}
                    />
                  ) : (
                    <CartoonLoader
                      visualStyle={visualStyle}
                      status={status}
                      accentColor={accentColor}
                      shape={item.value}
                      color={item.color}
                      size="md"
                      showLabel={false}
                      label={`${item.label}加载演示`}
                      animated={animated}
                    />
                  )}
                  <h3 className="mt-5 font-semibold">{item.label}</h3>
                  <p className="mt-2 text-sm text-stone-500">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section
            className={`mt-10 grid gap-5 ${status === "loading" ? "" : "lg:grid-cols-2"}`}
          >
            <div className="min-w-0 rounded-2xl bg-[#272e29] p-6 text-stone-100">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-sm text-stone-300">直接用在你的项目里</h2>
                <Button
                  size="small"
                  loading={isCopying}
                  onClick={() => void copyCode()}
                >
                  {currentFeedback?.success ? "已复制" : "复制代码"}
                </Button>
              </div>
              <pre className="overflow-x-auto text-sm leading-7">
                <code ref={codeRef}>{code}</code>
              </pre>
              <p role="status" className="mt-3 text-xs text-stone-300">
                {currentFeedback
                  ? currentFeedback.success
                    ? "当前配置已复制，可粘贴到项目的 JSX 中。"
                    : "浏览器未允许自动复制，请选中代码后按 Ctrl+C（Mac 使用 ⌘C）或长按复制。"
                  : "代码随上方配置实时更新。"}
              </p>
            </div>
            {status !== "loading" && (
              <div className="flex flex-col  rounded-2xl border border-stone-200 bg-white p-6">
                <h2 className="font-semibold self-start">体验一次真实的等待</h2>
                <p className="mt-2 text-sm leading-6 text-stone-500">
                  用两秒模拟数据准备过程，加载完成后自动显示内容。
                </p>
                <div className="flex min-h-40 my-8  w-full items-center justify-center">
                  {request.isPending ? (
                    <CartoonLoader
                      visualStyle={visualStyle}
                      status="loading"
                      accentColor={accentColor}
                      shape={
                        status === "error"
                          ? getLoaderOptions(visualStyle, "normal")[0].value
                          : shape
                      }
                      color={color}
                      size={48}
                      animated={animated}
                      showLabel={showLabel}
                      label={label}
                      labelFontSize={labelFontSize}
                      labelColor={labelColor}
                      labelFontFamily={labelFontFamily}
                      labelOpacity={labelOpacity}
                    />
                  ) : (
                    <p role="status" className="text-sm  text-[#47725b]">
                      {request.data ?? "准备好了就开始吧。"}
                    </p>
                  )}
                </div>
                <div className=" text-center">
                  <Button
                    onClick={() => request.mutate()}
                    disabled={request.isPending}
                  >
                    {request.data ? "再体验一次" : "模拟加载"}
                  </Button>
                </div>
              </div>
            )}
          </section>
          <footer className="mt-12 border-t border-stone-200 py-6 text-xs leading-6 text-stone-500">
            React + TypeScript · SVG 清晰缩放 · 支持系统减少动画设置
          </footer>
        </div>
      </main>
    </ConfigProvider>
  );
}

/** 风格分类与图标目录分开管理，添加风格不需要复制一份演示页面。 */
export default function LoaderShowcase() {
  return (
    <div className="min-w-0 bg-[#faf9f6] px-2 pt-4 sm:px-4">
      <ResponsiveTabs
        defaultActiveKey="cartoon"
        tabBarGutter={20}
        items={(Object.keys(loaderStyles) as LoaderStyle[]).map((style) => ({
          key: style,
          label: loaderStyles[style].label,
          children: (
            <ResponsiveTabs
              defaultActiveKey="normal"
              items={(
                [
                  { key: "normal", label: "页面加载" },
                  { key: "loading", label: "按钮加载中" },
                  { key: "error", label: "加载失败" },
                ] as const
              ).map((tab) => ({
                ...tab,
                children: (
                  <LoaderPlayground status={tab.key} visualStyle={style} />
                ),
              }))}
            />
          ),
        }))}
      />
    </div>
  );
}
