import { useLocation, useNavigate } from "react-router";
import { ResponsiveTabs } from "../uiComponents";
import TabsShowcase from "../pages/TabsShowcase/TabsShowcase";
import LoaderShowcase from "../pages/LoaderShowcase/LoaderShowcase";
import LayoutShowcase from "../pages/LayoutShowcase/LayoutShowcase";
import SearchShowcase from "../pages/SearchShowcase/SearchShowcase";
import SidebarShowcase from "../pages/SidebarShowcase/SidebarShowcase";

/** 用公共标签栏承载组件测试页，浏览器返回和直接地址均可切换页面。 */
export default function TabsTest() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <div className="min-w-0 p-2 sm:p-4">
      <ResponsiveTabs
        activeKey={
          pathname === "/sidebar" ? "sidebar" : pathname === "/search" ? "search" : pathname === "/layout"
            ? "layout"
            : pathname === "/loader"
              ? "loader"
              : "tabs"
        }
        onChange={(key) => navigate(key === "tabs" ? "/" : "/" + key)}
        items={[
          { key: "sidebar", label: "侧边栏", children: <SidebarShowcase /> },
          { key: "search", label: "搜索框", children: <SearchShowcase /> },
          { key: "tabs", label: "多标签栏", children: <TabsShowcase /> },
          { key: "loader", label: "加载器", children: <LoaderShowcase /> },
          { key: "layout", label: "布局", children: <LayoutShowcase /> },
        ]}
      />
    </div>
  );
}
