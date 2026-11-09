/** 模拟接口耗时，不访问网络；组件本身不依赖此文件。 */
export async function mockLoadContent(): Promise<string> {
  await new Promise<void>((resolve) => setTimeout(resolve, 2000));
  return "内容已准备好，可以继续啦。";
}
