import { createBrowserRouter } from "react-router";
import App from "../App";

// 测试页由 App 内的标签栏切换，URL 支持直接打开和浏览器前进/后退。
const router = createBrowserRouter(
  ["/", "/layout", "/loader", "/tabs", "/search", "/sidebar"].map((path) => ({
    path,
    element: <App />,
  })),
);

export default router;
