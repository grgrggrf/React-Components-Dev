import { useRef, useState } from "react";
import { Button, Input, InputNumber, Segmented, Select, Switch } from "antd";
import { ResponsiveTabs } from "../../uiComponents";
import type { ResponsiveTabsProps, TabsVariant } from "../../uiComponents";
import { mockTabs } from "../../mocks/tabs";
import { buildTabsCode } from "./tabsCode";

const variants: { value: TabsVariant; label: string }[] = [
  { value: "line", label: "下划线" },
  { value: "card", label: "卡片式" },
  { value: "pill", label: "胶囊式" },
  { value: "sidebar", label: "侧边式" },
];
const widths = { 电脑: "100%", 平板: 820, 手机: 375 };
const panelClass = "rounded-xl border border-slate-200 bg-white p-4 sm:p-6";

/** 参数面板、四种样式示例和复制区，共用同一份实时配置。 */
export default function TabsShowcase() {
  const [variant, setVariant] = useState<TabsVariant>("line");
  const [title, setTitle] = useState("项目标签");
  const [titleAlign, setTitleAlign] =
    useState<ResponsiveTabsProps["titleAlign"]>("start");
  const [tabAlign, setTabAlign] =
    useState<ResponsiveTabsProps["tabAlign"]>("start");
  const [size, setSize] = useState<ResponsiveTabsProps["size"]>("middle");
  const [activeColor, setActiveColor] = useState("#1677ff");
  const [labelColor, setLabelColor] = useState("#334155");
  const [gap, setGap] = useState(16);
  const [device, setDevice] = useState<keyof typeof widths>("电脑");
  const [tabs, setTabs] = useState(mockTabs);
  const [activeKey, setActiveKey] = useState("overview");
  const [editingKey, setEditingKey] = useState("overview");
  const [closable, setClosable] = useState(true);
  const [addable, setAddable] = useState(true);
  const [copyFeedback, setCopyFeedback] = useState({ code: "", message: "" });
  const codeRef = useRef<HTMLElement>(null);
  const nextId = useRef(0);
  const current = tabs.find((tab) => tab.key === editingKey);
  const settings = {
    variant,
    title,
    titleAlign,
    tabAlign,
    size,
    activeColor,
    labelColor,
    tabBarGutter: gap,
    closable,
  };
  const code = buildTabsCode(tabs, activeKey, settings, addable);
  const items = tabs.map((tab) => ({
    key: tab.key,
    label: tab.label,
    disabled: tab.disabled,
    children: (
      <section className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-lg font-semibold">{tab.title}</h3>
        <p className="my-3 text-sm leading-6 text-slate-600">{tab.content}</p>
        <Input
          aria-label={tab.label + "备注"}
          placeholder="输入备注，切换后仍保留"
        />
      </section>
    ),
  }));

  function updateTab(patch: Partial<(typeof mockTabs)[number]>) {
    setTabs((previous) =>
      previous.map((tab) =>
        tab.key === editingKey ? { ...tab, ...patch } : tab,
      ),
    );
    if (patch.disabled && editingKey === activeKey) {
      setActiveKey(
        tabs.find((tab) => tab.key !== editingKey && !tab.disabled)?.key ?? "",
      );
    }
  }
  function addTab() {
    const key = "extra-" + ++nextId.current;
    setTabs((previous) => [
      ...previous,
      {
        key,
        label: "新标签 " + nextId.current,
        title: "新内容",
        content: "在这里放入业务组件。",
        disabled: false,
      },
    ]);
    setActiveKey(key);
    setEditingKey(key);
  }
  function closeTab(key: string) {
    const remaining = tabs.filter((tab) => tab.key !== key);
    setTabs(remaining);
    if (activeKey === key)
      setActiveKey(remaining.find((tab) => !tab.disabled)?.key ?? "");
    if (editingKey === key) setEditingKey(remaining[0]?.key ?? "");
  }
  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopyFeedback({ code, message: "已复制当前配置" });
    } catch {
      const range = document.createRange();
      if (codeRef.current) {
        range.selectNodeContents(codeRef.current);
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);
      }
      setCopyFeedback({
        code,
        message: "剪贴板不可用，已选中代码，请手动复制。",
      });
    }
  }
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-3 text-slate-800 sm:p-6">
      <h1 className="text-2xl font-semibold sm:text-3xl">多标签栏</h1>
      <section
        aria-label="样式示例"
        className="grid min-w-0 gap-4 md:grid-cols-2"
      >
        {variants.map((option) => (
          <section key={option.value} className={panelClass + " min-w-0"}>
            <ResponsiveTabs
              title={option.label}
              titleAlign={titleAlign}
              titleExtra={
                <Button
                  size="small"
                  onClick={() => {
                    setVariant(option.value);
                    if (option.value === "sidebar") setDevice("手机");
                  }}
                >
                  使用此样式
                </Button>
              }
              variant={option.value}
              tabAlign={tabAlign}
              size="small"
              items={mockTabs.map((tab) => ({
                key: tab.key,
                label: tab.label,
                children: (
                  <div className="rounded-lg bg-slate-50 p-3 text-sm">
                    <strong>{tab.title}</strong>
                    <p className="mt-2 text-slate-600">{tab.content}</p>
                  </div>
                ),
              }))}
            />
            {option.value === "sidebar" && (
              <p className="mt-3 text-xs text-slate-500">
                容器小于 600px 时显示侧栏，其余宽度显示顶部标签。
              </p>
            )}
          </section>
        ))}
      </section>
      <section className={panelClass} aria-label="实时预览">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">实时预览</h2>
          <Segmented
            value={device}
            options={Object.keys(widths)}
            onChange={(value) => setDevice(value as keyof typeof widths)}
          />
        </div>
        <div className="rounded-xl bg-slate-100 p-2 sm:p-4">
          <div
            className="mx-auto max-w-full rounded-lg bg-white p-3"
            style={{ width: widths[device] }}
          >
            <ResponsiveTabs
              {...settings}
              activeKey={activeKey}
              onChange={setActiveKey}
              items={items}
              onClose={closeTab}
              onAdd={variant === "card" && addable ? addTab : undefined}
            />
            {tabs.length === 0 && (
              <p className="p-4 text-sm text-slate-500">
                暂无标签，可新增标签或恢复示例。
              </p>
            )}
          </div>
        </div>
      </section>
      <section className={panelClass} aria-label="参数设置">
        <h2 className="mb-4 text-lg font-semibold">参数设置</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 [&_label]:grid [&_label]:content-start [&_label]:gap-2 [&_label]:text-sm">
          <label>
            主标题文字
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>
          <label>
            主标题位置
            <Segmented
              value={titleAlign}
              options={[
                { value: "start", label: "靠左" },
                { value: "center", label: "居中" },
                { value: "end", label: "靠右" },
              ]}
              onChange={setTitleAlign}
            />
          </label>
          <label>
            标签标题位置
            <Segmented
              value={tabAlign}
              options={[
                {
                  value: "start",
                  label: variant === "sidebar" ? "靠左 / 上" : "靠左",
                },
                { value: "center", label: "居中" },
                {
                  value: "end",
                  label: variant === "sidebar" ? "靠右 / 下" : "靠右",
                },
              ]}
              onChange={setTabAlign}
            />
          </label>
          <label>
            样式
            <Select<TabsVariant>
              value={variant}
              options={variants}
              onChange={setVariant}
            />
          </label>
          <label>
            尺寸
            <Segmented
              value={size}
              options={[
                { value: "small", label: "小" },
                { value: "middle", label: "中" },
                { value: "large", label: "大" },
              ]}
              onChange={setSize}
            />
          </label>
          <label>
            标签间距（px）
            <InputNumber
              min={0}
              max={48}
              value={gap}
              onChange={(value) => value !== null && setGap(value)}
            />
          </label>
          <label>
            主题颜色
            <input
              aria-label="主题颜色"
              type="color"
              value={activeColor}
              onChange={(event) => setActiveColor(event.target.value)}
              className="h-9 w-full cursor-pointer"
            />
          </label>
          <label>
            普通文字颜色
            <input
              aria-label="普通文字颜色"
              type="color"
              value={labelColor}
              onChange={(event) => setLabelColor(event.target.value)}
              className="h-9 w-full cursor-pointer"
            />
          </label>
          <label>
            编辑标签
            <Select
              aria-label="编辑标签"
              value={current?.key}
              options={tabs.map((tab) => ({
                value: tab.key,
                label: tab.label || "未命名标签",
              }))}
              onChange={setEditingKey}
            />
          </label>
          <label>
            标签文字
            <Input
              aria-label="标签文字"
              disabled={!current}
              value={current?.label ?? ""}
              onChange={(event) => updateTab({ label: event.target.value })}
            />
          </label>
          <label>
            内容标题
            <Input
              disabled={!current}
              value={current?.title ?? ""}
              onChange={(event) => updateTab({ title: event.target.value })}
            />
          </label>
          <label>
            内容文字
            <Input
              disabled={!current}
              value={current?.content ?? ""}
              onChange={(event) => updateTab({ content: event.target.value })}
            />
          </label>
          <label>
            禁用当前标签
            <Switch
              aria-label="禁用当前标签"
              className="w-fit"
              disabled={!current}
              checked={current?.disabled ?? false}
              onChange={(disabled) => updateTab({ disabled })}
            />
          </label>
          {variant === "card" && (
            <>
              <label>
                可关闭
                <Switch
                  aria-label="可关闭"
                  className="w-fit"
                  checked={closable}
                  onChange={setClosable}
                />
              </label>
              <label>
                允许新增
                <Switch
                  aria-label="允许新增"
                  className="w-fit"
                  checked={addable}
                  onChange={setAddable}
                />
              </label>
            </>
          )}
        </div>
        <Button
          className="mt-5"
          onClick={() => {
            setTabs(mockTabs);
            setActiveKey("overview");
            setEditingKey("overview");
          }}
        >
          恢复示例标签
        </Button>
      </section>
      <section className={panelClass}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">直接用在你的项目里</h2>
          <Button type="primary" onClick={copyCode}>
            复制代码
          </Button>
        </div>
        <p role="status" className="mt-2 text-sm">
          {copyFeedback.code === code && copyFeedback.message}
        </p>
        <pre className="mt-3 max-h-96 overflow-auto rounded-lg bg-slate-50 p-4 text-xs leading-6">
          <code ref={codeRef}>{code}</code>
        </pre>
      </section>
    </div>
  );
}
