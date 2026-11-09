import type { ResponsiveTabsProps } from "../../uiComponents/ResponsiveTabs";
import type { mockTabs } from "../../mocks/tabs";

/** 生成可独立运行的示例，同时包含卡片式新增、关闭所需的数据更新逻辑。 */
export function buildTabsCode(
  data: typeof mockTabs,
  activeKey: string,
  settings: Pick<
    ResponsiveTabsProps,
    | "variant"
    | "title"
    | "titleAlign"
    | "tabAlign"
    | "size"
    | "activeColor"
    | "labelColor"
    | "tabBarGutter"
    | "closable"
  >,
  addable: boolean,
) {
  const editable = settings.variant === "card";
  const add = editable && addable;
  const close = editable && settings.closable;
  return [
    `import { ${add ? "useRef, " : ""}useState } from "react";`,
    'import { ResponsiveTabs } from "./uiComponents";',
    "",
    "type TabData = { key: string; label: string; title: string; content: string; disabled: boolean };",
    `const initialTabs: TabData[] = ${JSON.stringify(data, null, 2)};`,
    "",
    "export default function Example() {",
    `  const [tabs${add || close ? ", setTabs" : ""}] = useState(initialTabs);`,
    `  const [activeKey, setActiveKey] = useState(${JSON.stringify(activeKey)});`,
    ...(add
      ? [
          "  const nextId = useRef(0);",
          "  function addTab() {",
          "    let key: string;",
          '    do { key = "extra-" + ++nextId.current; } while (tabs.some(tab => tab.key === key));',
          '    setTabs(current => [...current, { key, label: "新标签", title: "新内容", content: "在这里放入业务组件。", disabled: false }]);',
          "    setActiveKey(key);",
          "  }",
        ]
      : []),
    ...(close
      ? [
          "  function closeTab(key: string) {",
          "    const remaining = tabs.filter(tab => tab.key !== key);",
          "    setTabs(remaining);",
          '    if (key === activeKey) setActiveKey(remaining.find(tab => !tab.disabled)?.key ?? "");',
          "  }",
        ]
      : []),
    "  return (",
    "    <ResponsiveTabs",
    `      variant=${JSON.stringify(settings.variant)}`,
    `      title={${JSON.stringify(settings.title ?? "")}}`,
    `      titleAlign=${JSON.stringify(settings.titleAlign ?? "start")}`,
    `      tabAlign=${JSON.stringify(settings.tabAlign ?? "start")}`,
    `      size=${JSON.stringify(settings.size)}`,
    `      activeColor=${JSON.stringify(settings.activeColor)}`,
    `      labelColor=${JSON.stringify(settings.labelColor)}`,
    `      tabBarGutter={${settings.tabBarGutter}}`,
    "      activeKey={activeKey}",
    "      onChange={setActiveKey}",
    ...(close ? ["      closable", "      onClose={closeTab}"] : []),
    ...(add ? ["      onAdd={addTab}"] : []),
    "      items={tabs.map(tab => ({",
    "        key: tab.key, label: tab.label, disabled: tab.disabled,",
    "        children: (",
    '          <section style={{ padding: 16, border: "1px solid #e2e8f0", borderRadius: 12 }}>',
    "            <h2>{tab.title}</h2>",
    "            <p>{tab.content}</p>",
    '            <input aria-label={tab.label + "备注"} placeholder="输入备注，切换后仍保留" style={{ maxWidth: "100%", boxSizing: "border-box" }} />',
    "          </section>",
    "        ),",
    "      }))}",
    "    />",
    "  );",
    "}",
  ].join("\n");
}
