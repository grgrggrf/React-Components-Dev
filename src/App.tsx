// import { NavLink, Outlet } from "react-router";
import Test from "./test/Test.tsx";
import TabsTest from "./test/TabsTest";

function App() {
  return (
    <Test>
      <TabsTest />
    </Test>
  );
  // return (
  //   <Test>
  //     <StackLayoutTest />
  //   </Test>
  // );

  //组件联调时可恢复以下导航和路由出口。
  /* return (
    <div>
      <nav
        aria-label="组件测试页"
        className="flex gap-5 border-b border-slate-200 px-5 py-3 text-sm"
      >
        {[
          { to: "/layout", label: "布局测试" },
          { to: "/", label: "加载器测试" },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            end
            to={to}
            className={({ isActive }) =>
              isActive ? "font-semibold text-blue-700" : "text-slate-600"
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <Test>
        <Outlet />
      </Test>
    </div>
  ); */

  /* 单独调试加载器时的参数示例：
      <CartoonLoader
        status="error"
        shape="star"
        color="#fbbf24"
        accentColor="#e85d75"
        size={{ mobile: 64, tablet: 88, desktop: 112 }}
        animated={true}
        showLabel={true}
        label={"哎呀，加载失败了，请再试一次。"}
        labelFontSize={14}
        labelColor="#292524"
        labelFontFamily={"inherit"}
        labelOpacity={1}
      />
  */
}

export default App;
