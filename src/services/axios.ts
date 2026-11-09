import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
// 请求配置继续使用 Axios 原生类型；URL、请求方法和数据由下方函数传入，
//避免同一个参数在多个位置出现。其余选项（如 headers、signal、timeout）照常支持。
type GetConfig = Omit<AxiosRequestConfig, "url" | "method" | "params" | "data">;
type PostConfig<Body> = Omit<
  AxiosRequestConfig<Body>,
  "url" | "method" | "data"
>;
export const axiosInstance = axios.create({
  //这里只是示例地址,具体接口地址要跟后端协商
  baseURL: "https://localhost:7234/api",
  timeout: 10000,
});

async function axiosGet<Response, Params = Record<string, unknown>>(
  url: string,
  params?: Params,
  config?: GetConfig,
): Promise<Response> {
  const response = await axiosInstance.get<Response>(url, {
    ...config,
    params,
  });
  return response.data;
}
async function axiosPost<Response, Body = unknown>(
  url: string,
  body?: Body,
  config?: PostConfig<Body>,
): Promise<Response> {
  const response = await axiosInstance.post<
    Response,
    AxiosResponse<Response>,
    Body
  >(url, body, config);
  return response.data;
}
export { axiosPost, axiosGet };
