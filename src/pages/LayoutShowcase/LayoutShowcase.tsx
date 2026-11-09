import { useState } from "react";
import {
  Button,
  ConfigProvider,
  InputNumber,
  Segmented,
  Switch,
  Typography,
} from "antd";
import { ResponsiveLayout, ResponsiveTabs, type LayoutVariant } from "../../uiComponents";
import styles from "./LayoutShowcase.module.css";
import { diagramTheme, regionLabel as label } from "./layoutDiagram";

const layouts: { value: LayoutVariant; label: string }[] = [
  { value: "stack", label: "上下布局" },
  { value: "left", label: "左侧栏" },
  { value: "right", label: "右侧栏" },
  { value: "full-height-left", label: "通高侧栏" },
];
const devices = { 电脑: "100%", 平板: "768px", 手机: "375px" };

/** 用四块色块画出布局位置，让用户在切换前就能看懂每个标签。 */
function Thumbnail({ variant }: { variant: LayoutVariant }) {
  return (
    <span
      aria-hidden="true"
      className={styles.thumbnail}
      data-variant={variant}
    >
      <i />
      <i />
      <i />
      {variant !== "stack" && <i />}
    </span>
  );
}

/** 预览和复制代码共用当前参数；设备选择仅调整预览容器宽度。 */
export default function LayoutShowcase() {
  const [variant, setVariant] = useState<LayoutVariant>("stack");
  const [device, setDevice] = useState<keyof typeof devices>("电脑");
  const [headerHeight, setHeaderHeight] = useState(64);
  const [footerHeight, setFooterHeight] = useState(56);
  const [siderWidth, setSiderWidth] = useState(200);
  const [showFooter, setShowFooter] = useState(true);
  const [feedback, setFeedback] = useState({ code: "", message: "" });
  const hasSider = variant !== "stack";
  const dimensions = {
    variant,
    headerHeight,
    footerHeight,
    ...(hasSider ? { siderWidth } : {}),
  };
  const code = [
    'import { ConfigProvider } from "antd";',
    'import { ResponsiveLayout } from "./uiComponents";',
    "",
    `const theme = ${JSON.stringify(diagramTheme, null, 2)};`,
    "",
    `const region = (name: string) => <span style={{ display: "grid", width: "100%", height: "100%", placeItems: "center", color: "#fff" }}>{name}</span>;`,
    "",
    "export default function Example() {",
    "  return (",
    "    <ConfigProvider theme={theme}>",
    "      <ResponsiveLayout",
    `        variant="${variant}"`,
    `        headerHeight={${headerHeight}}`,
    ...(showFooter
      ? [
          `        footerHeight={${footerHeight}}`,
          '        footer={region("Footer")}',
        ]
      : []),
    ...(hasSider
      ? [
          `        siderWidth={${siderWidth}}`,
          '        sider={region("Sider")}',
        ]
      : []),
    '        header={region("Header")}',
    "      >",
    '        {region("Content")}',
    "      </ResponsiveLayout>",
    "    </ConfigProvider>",
    "  );",
    "}",
  ].join("\n");
  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setFeedback({ code, message: "已复制" });
    } catch {
      setFeedback({ code, message: "请选中下方代码手动复制" });
    }
  }
  return (
    <div className={styles.page}>
      <h1>布局测试</h1>
      <ResponsiveTabs
        activeKey={variant}
        onChange={(key) => setVariant(key as LayoutVariant)}
        items={layouts.map(({ value, label }) => ({
          key: value,
          label: (
            <span className={styles.tab}>
              <Thumbnail variant={value} />
              {label}
            </span>
          ),
        }))}
      />
      <section className={styles.card} aria-label="实时预览">
        <div className={styles.heading}>
          <h2>实时预览</h2>
          <Segmented
            value={device}
            options={Object.keys(devices)}
            onChange={(value) => setDevice(value as keyof typeof devices)}
          />
        </div>
        <div className={styles.stage}>
          <div className={styles.frame} style={{ width: devices[device] }}>
            <ConfigProvider theme={diagramTheme}>
              <ResponsiveLayout
                {...dimensions}
                header={label("Header")}
                footer={showFooter ? label("Footer") : undefined}
                sider={hasSider ? label("Sider") : undefined}
              >
                {label("Content")}
              </ResponsiveLayout>
            </ConfigProvider>
          </div>
        </div>
      </section>
      <section className={styles.card}>
        <h2>布局参数</h2>
        <div className={styles.controls}>
          <label>
            顶栏高度（px）
            <InputNumber
              min={32}
              max={200}
              value={headerHeight}
              onChange={(n) => n !== null && setHeaderHeight(n)}
            />
          </label>
          <label>
            底栏高度（px）
            <InputNumber
              min={24}
              max={160}
              disabled={!showFooter}
              value={footerHeight}
              onChange={(n) => n !== null && setFooterHeight(n)}
            />
          </label>
          {hasSider && (
            <label>
              侧栏宽度（px）
              <InputNumber
                min={80}
                max={400}
                value={siderWidth}
                onChange={(n) => n !== null && setSiderWidth(n)}
              />
            </label>
          )}
          <label>
            显示底栏
            <Switch
              aria-label="显示底栏"
              checked={showFooter}
              onChange={setShowFooter}
            />
          </label>
        </div>
      </section>
      <section className={styles.card}>
        <div className={styles.heading}>
          <h2>直接用在你的项目里</h2>
          <Button type="primary" onClick={copyCode}>
            复制代码
          </Button>
        </div>
        <span role="status">{feedback.code === code && feedback.message}</span>
        <pre className={styles.code}>
          <code>{code}</code>
        </pre>
        <Typography.Text type="secondary">
          将导入路径改为你项目中组件所在的位置。
        </Typography.Text>
      </section>
    </div>
  );
}
