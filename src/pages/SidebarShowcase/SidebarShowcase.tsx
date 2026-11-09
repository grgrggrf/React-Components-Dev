import { useRef, useState } from "react";
import { Button, Input, InputNumber, Segmented, Switch } from "antd";
import { ResponsiveSidebar, ResponsiveTabs } from "../../uiComponents";
import { getSidebarItems, sidebarPages } from "../../mocks/sidebar";
import { buildSidebarCode } from "./sidebarCode";
import type { SidebarSettings } from "./sidebarCode";

const widths = { 电脑: "100%", 平板: 820, 手机: 375 };
const panel = "min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-6";
const initialSettings: SidebarSettings = {
  placement: "left", title: "项目导航", width: 240, collapsedWidth: 64,
  backgroundColor: "#ffffff", textColor: "#1f2937", selectedColor: "#1677ff",
  selectedBackground: "#e6f4ff", fontSize: 14, iconSize: 18, showIcons: true, indent: 16, accordion: false,
};
const presets = ["左侧多级菜单", "右侧深色菜单", "收起模式", "手机抽屉"];

/** 侧栏配置和主内容联动；外观、展开与选中状态都同步写入复制代码。 */
export default function SidebarShowcase() {
  const [settings, setSettings] = useState(initialSettings);
  const [iconStyle, setIconStyle] = useState<"symbol" | "emoji">("symbol");
  const items = getSidebarItems(iconStyle);
  const [device, setDevice] = useState<keyof typeof widths>("电脑");
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("design");
  const [openKeys, setOpenKeys] = useState(["projects", "website"]);
  const [feedback, setFeedback] = useState({ code: "", text: "" });
  const codeRef = useRef<HTMLElement>(null);
  const content = sidebarPages[selectedKey] ?? sidebarPages.home;
  const code = buildSidebarCode(settings, collapsed, selectedKey, openKeys, items);
  function update(patch: Partial<SidebarSettings>) {
    setSettings(previous => ({ ...previous, ...patch }));
  }
  function usePreset(index: number) {
    setSettings({ ...initialSettings, ...(index === 1 ? {
      placement: "right" as const, backgroundColor: "#172536", textColor: "#e2e8f0",
      selectedColor: "#ffffff", selectedBackground: "#1256a4",
    } : {}) });
    setCollapsed(index === 2);
    setDevice(index === 3 ? "手机" : "电脑");
    setOpenKeys(["projects", "website"]);
    setSelectedKey("design");
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setFeedback({ code, text: "已复制当前配置" });
    } catch {
      if (codeRef.current) {
        const range = document.createRange();
        range.selectNodeContents(codeRef.current);
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);
      }
      setFeedback({ code, text: "请手动复制下方已选中的代码。" });
    }
  }
  const colorFields = [
    { key: "backgroundColor", label: "背景颜色" }, { key: "textColor", label: "文字颜色" },
    { key: "selectedColor", label: "选中文字颜色" }, { key: "selectedBackground", label: "选中背景颜色" },
  ] as const;
  const numberFields = [
    { key: "width", label: "侧栏宽度", min: 160, max: 360 },
    { key: "collapsedWidth", label: "收起宽度", min: 48, max: 100 },
    { key: "fontSize", label: "文字大小", min: 12, max: 22 },
    { key: "iconSize", label: "图标大小", min: 12, max: 28 },
    { key: "indent", label: "层级缩进", min: 8, max: 24 },
  ] as const;
  return <div className="mx-auto max-w-7xl space-y-6 p-3 text-slate-800 sm:p-6">
    <h1 className="text-2xl font-semibold sm:text-3xl">侧边栏</h1>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {presets.map((name, index) => <button key={name} type="button" className="rounded-xl border border-slate-200 bg-white p-3 text-left hover:border-blue-500 focus-visible:outline-2 focus-visible:outline-blue-500" onClick={() => usePreset(index)}>
        <span aria-hidden="true" className={`mb-3 flex h-20 overflow-hidden rounded border border-slate-200 ${index === 1 ? "flex-row-reverse" : ""}`}>
          <span className={`flex shrink-0 flex-col gap-2 p-2 ${index === 2 ? "w-8" : index === 3 ? "w-2/3" : "w-1/3"} ${index === 1 ? "bg-slate-800" : "bg-blue-50"}`}>
            <i className="h-1 w-full bg-blue-400" /><i className="ml-1 h-1 bg-blue-300" /><i className="ml-2 h-1 bg-blue-500" />
          </span>
          <span className={`flex-1 ${index === 3 ? "bg-slate-400" : "bg-slate-50"}`} />
        </span>
        <span className="text-sm font-medium">{name}</span>
      </button>)}
    </div>
    <section className={panel}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold">实时预览</h2>
        <Segmented value={device} options={Object.keys(widths)} onChange={next => setDevice(next as keyof typeof widths)} />
      </div>
      <div className="rounded-xl bg-slate-100 p-2 sm:p-4">
        <div className="mx-auto max-w-full" style={{ width: widths[device] }}>
          <ResponsiveSidebar {...settings} items={items} collapsed={collapsed} onCollapsedChange={setCollapsed}
            selectedKey={selectedKey} onSelect={setSelectedKey} openKeys={openKeys} onOpenChange={setOpenKeys}>
            <section className="space-y-4 p-4 sm:p-6">
              <h2 className="text-xl font-semibold">{content.title}</h2>
              <ul className="space-y-3">{content.files.map(file => <li className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm" key={file}>{file}</li>)}</ul>
              <Input aria-label="页面备注" placeholder="输入备注，切换侧栏位置后保留" />
            </section>
          </ResponsiveSidebar>
        </div>
      </div>
    </section>
    <section className={panel}><h2 className="mb-4 text-lg font-semibold">参数设置</h2>
      <ResponsiveTabs items={[
        { key: "layout", label: "布局与菜单", children: <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 [&_label]:grid [&_label]:content-start [&_label]:gap-2 [&_label]:text-sm">
          <label>位置<Segmented value={settings.placement} options={[{ value: "left", label: "左侧" }, { value: "right", label: "右侧" }]} onChange={placement => update({ placement })} /></label>
          <label>标题<Input value={settings.title} onChange={event => update({ title: event.target.value })} /></label>
          <label>收起侧栏<Switch className="w-fit" checked={collapsed} onChange={setCollapsed} /></label>
          <label>显示图标<Switch className="w-fit" checked={settings.showIcons} onChange={showIcons => update({ showIcons })} /></label>
          <label>图标样式<Segmented value={iconStyle} options={[{ value: "symbol", label: "简洁符号" }, { value: "emoji", label: "彩色图标" }]} onChange={setIconStyle} /></label>
          <label>手风琴展开<Switch className="w-fit" checked={settings.accordion} onChange={accordion => { update({ accordion }); setOpenKeys(["projects", "website"]); }} /></label>
        </div> },
        { key: "appearance", label: "颜色与尺寸", children: <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 [&_label]:grid [&_label]:gap-2 [&_label]:text-sm">
          {colorFields.map(field => <label key={field.key}>{field.label}<input type="color" className="h-9 w-full cursor-pointer" value={settings[field.key]} onChange={event => update({ [field.key]: event.target.value })} /></label>)}
          {numberFields.map(field => <label key={field.key}>{field.label}（px）<InputNumber min={field.min} max={field.max} value={settings[field.key]} onChange={value => { if (value !== null) update({ [field.key]: value }); }} /></label>)}
        </div> },
      ]} />
    </section>
    <section className={panel}><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold">直接用在你的项目里</h2><Button type="primary" onClick={copy}>复制代码</Button></div>
      <p role="status" className="mt-2 text-sm">{feedback.code === code && feedback.text}</p>
      <pre className="mt-3 max-h-96 overflow-auto rounded-lg bg-slate-50 p-4 text-xs leading-6"><code ref={codeRef}>{code}</code></pre>
    </section>
  </div>;
}
