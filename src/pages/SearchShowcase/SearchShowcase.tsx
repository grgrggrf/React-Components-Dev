import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button, Input, Segmented, Select, Switch } from "antd";
import { ResponsiveTabs, SearchInput } from "../../uiComponents";
import type { SearchInputProps, SearchVariant } from "../../uiComponents";
import { mockSearch, searchRecords } from "../../mocks/search";
import { buildSearchCode } from "./searchCode";

const variants: { value: SearchVariant; label: string }[] = [
  { value: "basic", label: "基础型" }, { value: "pill", label: "胶囊型" },
  { value: "button", label: "按钮型" }, { value: "suggest", label: "联想型" },
];
const devices = { 电脑: "100%", 平板: 820, 手机: 375 };
const suggestions = searchRecords.map(item => ({ value: item.title, description: item.category }));
const panel = "min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-6";

/** 搜索参数、Mock 请求和结果列表属于页面，组件只接收配置与事件。 */
export default function SearchShowcase() {
  const [variant, setVariant] = useState<SearchVariant>("button");
  const [value, setValue] = useState("品牌");
  const [placeholder, setPlaceholder] = useState("搜索项目、文件或成员");
  const [size, setSize] = useState<SearchInputProps["size"]>("middle");
  const [color, setColor] = useState("#1677ff");
  const [allowClear, setAllowClear] = useState(true);
  const [showIcon, setShowIcon] = useState(true);
  const [showButton, setShowButton] = useState(true);
  const [iconPosition, setIconPosition] = useState<"left" | "right">("left");
  const [buttonPosition, setButtonPosition] = useState<"left" | "right">("right");
  const [buttonText, setButtonText] = useState("搜索");
  const [disabled, setDisabled] = useState(false);
  const [device, setDevice] = useState<keyof typeof devices>("电脑");
  const [examples, setExamples] = useState<Partial<Record<SearchVariant, string>>>({});
  const [feedback, setFeedback] = useState({ code: "", text: "" });
  const codeRef = useRef<HTMLElement>(null);
  const request = useMutation({ mutationFn: mockSearch });
  const settings = { variant, placeholder, size, color, allowClear, showIcon, iconPosition, showButton, buttonPosition, buttonText, disabled };
  const code = buildSearchCode(settings, value);
  /** 每次输入新关键词，自动释放上一轮搜索状态，再由当前文字生成联想列表。 */
  function resetSearchState(nextValue: string) {
    request.reset();
    setValue(nextValue);
  }
  function choose(next: SearchVariant) {
    resetSearchState("");
    setVariant(next);
    setShowButton(next === "button");
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
      setFeedback({ code, text: "请手动复制已选中的代码。" });
    }
  }
  return <div className="mx-auto max-w-7xl space-y-6 p-3 text-slate-800 sm:p-6">
    <h1 className="text-2xl font-semibold sm:text-3xl">搜索框</h1>
    <div className="grid gap-4 md:grid-cols-2">
      {variants.map(option => <section key={option.value} className={panel}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-semibold">{option.label}</h2><Button size="small" onClick={() => choose(option.value)}>使用此样式</Button>
        </div>
        <SearchInput variant={option.value} defaultValue={option.value === "suggest" ? "品牌" : ""} suggestions={suggestions}
          onChange={() => setExamples(previous => ({ ...previous, [option.value]: undefined }))}
          onSearch={keyword => setExamples(previous => ({ ...previous, [option.value]: keyword }))} />
        {examples[option.value] !== undefined && <p role="status" className="mt-3 text-sm text-slate-500">已提交：{examples[option.value] || "全部内容"}</p>}
      </section>)}
    </div>
    <section className={panel}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">实时预览</h2>
        <Segmented value={device} options={Object.keys(devices)} onChange={next => setDevice(next as keyof typeof devices)} />
      </div>
      <div className="rounded-xl bg-slate-100 p-2 sm:p-4">
        <div className="mx-auto max-w-full space-y-4 rounded-lg bg-white p-3" style={{ width: devices[device] }}>
          <SearchInput {...settings} value={value} onChange={resetSearchState} onSearch={keyword => request.mutate(keyword)} loading={request.isPending} suggestions={suggestions} />
          {request.isPending ? <p role="status" className="text-sm text-slate-500">正在搜索…</p>
            : request.isError ? <p role="alert">搜索失败，请重新搜索。</p>
            : request.data ? <div aria-live="polite">
              <p className="mb-3 text-sm text-slate-500">“{request.data.keyword || "全部内容"}” · {request.data.items.length} 条结果</p>
              {request.data.items.map(item => <article key={item.id} className="border-t border-slate-100 py-3">
                <h3 className="font-medium">{item.title} <span className="text-xs font-normal text-slate-500">{item.category}</span></h3>
                <p className="mt-1 text-sm text-slate-600">{item.description}</p>
              </article>)}
              {request.data.items.length === 0 && <p className="text-sm">没有找到结果，请换个关键词。</p>}
            </div> : <p className="text-sm text-slate-500">输入“品牌”后按回车、点击搜索，或选择联想项。</p>}
        </div>
      </div>
    </section>
    <section className={panel}>
      <h2 className="mb-4 text-lg font-semibold">参数设置</h2>
      <ResponsiveTabs items={[
        { key: "appearance", label: "外观与文字", children: <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 [&_label]:grid [&_label]:gap-2 [&_label]:text-sm">
          <label>样式<Select value={variant} options={variants} onChange={choose} /></label>
          <label>提示文字<Input value={placeholder} onChange={event => setPlaceholder(event.target.value)} /></label>
          <label>按钮文字<Input value={buttonText} onChange={event => setButtonText(event.target.value)} /></label>
          <label>尺寸<Segmented value={size} options={[{ value: "small", label: "小" }, { value: "middle", label: "中" }, { value: "large", label: "大" }]} onChange={setSize} /></label>
          <label>主题颜色<input type="color" className="h-9 w-full" value={color} onChange={event => setColor(event.target.value)} /></label>
        </div> },
        { key: "positions", label: "位置与显示", children: <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 [&_label]:grid [&_label]:gap-2 [&_label]:text-sm">
          <label>搜索图标位置<Segmented value={iconPosition} options={[{ value: "left", label: "左侧" }, { value: "right", label: "右侧" }]} onChange={setIconPosition} /></label>
          <label>搜索按钮位置<Segmented value={buttonPosition} options={[{ value: "left", label: "左侧" }, { value: "right", label: "右侧" }]} onChange={setButtonPosition} /></label>
          <label>显示搜索图标<Switch className="w-fit" checked={showIcon} onChange={setShowIcon} /></label>
          <label>显示搜索按钮<Switch className="w-fit" checked={showButton} onChange={setShowButton} /></label>
          <label>允许清空<Switch className="w-fit" checked={allowClear} onChange={setAllowClear} /></label>
          <label>禁用<Switch className="w-fit" checked={disabled} onChange={setDisabled} /></label>
        </div> },
      ]} />
    </section>
    <section className={panel}>
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold">直接用在你的项目里</h2><Button type="primary" onClick={copy}>复制代码</Button></div>
      <p role="status" className="mt-2 text-sm">{feedback.code === code && feedback.text}</p>
      <pre className="mt-3 max-h-96 overflow-auto rounded-lg bg-slate-50 p-4 text-xs leading-6"><code ref={codeRef}>{code}</code></pre>
    </section>
  </div>;
}
