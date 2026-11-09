# Axios GET / POST 封装

`axios.ts` 保留原有的 `axiosInstance` 默认导出，并提供 `get`、`post` 两个具名函数。它们返回完整的响应体 `response.data`，不会假定后端响应体里有 `data`、`code` 等字段，也不会自动显示错误提示或添加 Token。

```ts
import { get, post } from "../services/axios";

interface User {
  id: number;
  name: string;
}
interface CreateUser {
  name: string;
}

// GET 查询参数会放入 URL。可按需指定第二个泛型约束参数类型。
const users = await get<User[]>("/users", { page: 1, pageSize: 10 });

// POST 数据作为请求体；JSON 对象由 Axios 负责序列化。
const user = await post<User, CreateUser>("/users", { name: "小明" });

// 按需传原生 Axios 配置，例如自定义请求头、超时和取消信号。
const controller = new AbortController();
const request = get<User[]>("/users", undefined, {
  signal: controller.signal,
  timeout: 5000,
  headers: { "X-Request-Source": "demo" },
});
controller.abort();
try {
  await request;
} catch (error) {
  // 判断 axios.isCancel(error)；其余网络错误、超时、非 2xx 响应也从这里处理。
}
```

地址和超时沿用实例的现有配置：`https://localhost:7234/api` 和 10000ms。它只是示例地址，接后端时应按实际环境修改；调用时也可通过第三个参数传 `baseURL` 覆盖。跨域和 HTTPS 证书由后端及部署环境处理。

泛型只是 TypeScript 编译期约束，不能验证服务器返回的数据。真实服务返回什么结构，应按照实际接口声明类型；需要运行时校验时可在业务 API 层使用 Zod。下载文件可以传入 `responseType: 'blob'` 并将响应类型设为 `Blob`。

业务 API 放在 `src/api/`，组件不直接创建 Axios 实例。此封装不会重试请求，不会自动登录或刷新凭证；这些行为需要根据后端协议单独设计。

## 由你手动测试

1. 先在终端执行 `npm run lint` 和 `npm run build` 检查代码。
2. 准备你自己控制的测试后端，提供 `GET /users?page=1` 和 `POST /users`；让服务允许当前前端来源跨域。在临时页面或业务 API 中调用上面的示例，并通过第三个参数的 `baseURL` 指向该测试服务。
3. 在浏览器开发者工具 Network 中确认 GET 的查询字符串、POST 的 JSON 请求体，以及结果是否与服务响应体完全一致。不要使用真实用户资料。
4. 令后端返回 400 或 500，确认调用方 `catch` 能收到 Axios 错误，`axios.isAxiosError(error)` 为 true，HTTP 状态可从 `error.response?.status` 读取。
5. 使用会延迟响应的测试接口，分别设置较短 `timeout`、调用 `AbortController.abort()`，确认请求被拒绝，取消请求可由 `axios.isCancel(error)` 判断。
6. 不传 `baseURL` 时请求会使用上方示例本地地址；如果该服务没有启动，网络失败是预期行为，不应显示为成功。

本次按用户要求未执行测试、构建或 Lint。
