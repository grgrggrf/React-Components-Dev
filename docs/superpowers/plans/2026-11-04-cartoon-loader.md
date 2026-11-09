# CartoonLoader 实施计划

目标：可跨项目复制的 React 加载器，可配置大小、卡通形状和颜色，适配三端。

架构：React + TypeScript + 独立 CSS Module；演示页沿用 Ant Design 和 Tailwind。不增加依赖，不请求后端。

约束：公共组件放 src/component；参数、用途和非显然逻辑采用中文注释。组件不导入业务状态或 Mock。

- [x] 在 component/CartoonLoader 下实现组件、类型、样式及用法文档，统一导出。
- [x] 在 pages/LoaderShowcase 下实现参数演示；模拟请求放 mocks 下。
- [x] 验证 build、lint，以及手机、平板、电脑尺寸、颜色、形状、隐藏与减少动画。

验收关注：非法数字尺寸回退；长文案换行；固定尺寸不随断点变化；响应式缺省值继承；加载结束移除状态提示。
