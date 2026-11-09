/** 测试页和配置页共用配色和区域标签，方便对照同一个布局。 */
export const diagramTheme = {
  components: {
    Layout: {
      headerBg: "#4096ff",
      footerBg: "#4096ff",
      siderBg: "#1677ff",
      bodyBg: "#0958d9",
    },
    Drawer: { colorBgElevated: "#1677ff", colorText: "#fff" },
  },
};

export function regionLabel(name: string) {
  return (
    <span style={{ display: "grid", width: "100%", height: "100%", placeItems: "center", color: "#fff" }}>
      {name}
    </span>
  );
}
