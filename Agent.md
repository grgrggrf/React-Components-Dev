######

| 目录            | 负责什么              |
| --------------- | --------------------- |
| `api/`          | API 请求模块          |
| `assets/`       | 图片、字体等静态资源  |
| `components/`   | 项目组件              |
| `uiComponents/` | 公共UI组件            |
| `hooks/`        | 自定义 Hooks          |
| `layouts/`      | 页面布局              |
| `pages/`        | 页面                  |
| `routes/`       | 路由配置              |
| `services/`     | 业务服务 / Axios 封装 |
| `store/`        | Zustand               |
| `types/`        | TypeScript 类型       |
| `utils/`        | 通用工具函数          |

######

# React 项目开发规范

## 技术栈

- React
- TypeScript
- Vite
- Tailwind CSS v4
- Ant Design
- Axios
- TanStack Query
- Zustand
- React Router
- React Hook Form

## 状态管理

服务器状态：
使用 TanStack Query

客户端全局状态：
使用 Zustand

组件内部状态：
使用 useState

## API

所有 HTTP 请求统一通过 Axios Instance。

不要在组件中直接创建 axios 实例。

## 类型

API Request / Response 类型放在 types/。

禁止无理由使用 any。

## 组件

公共组件放 components/。

页面放 pages/。

业务 API 放 api/。

## CSS

优先使用 Tailwind CSS。

Ant Design 负责通用 UI 组件。

不要引入其他 CSS 框架。

## 开发原则

1.优先复用已有组件和工具。
2.uiComponents文件夹不能有耦合。
3.测试页尽量使用uiComponents已有的组件，第二优先级Ant Design，第三优先级手动手写组件。
4.除了uiComponents里面的组件，开发测试页CSS技术优先使用tailwindCss,除非不兼容。
5.不要为了简单功能随意增加第三方依赖。

## 新 UI 组件与演示页

- 每个新 UI 组件及其演示页都要适配手机、平板和电脑。示例内容、按钮和参数控件在窄屏下也应可读、可操作。
- 为主要样式或状态提供示例图，并在演示页用真实组件呈现对应效果。
- 参照 CartoonLoader，演示页提供与组件参数对应的控件。修改参数后，实时预览和“直接用在你的项目里”的 JSX 示例同步更新；用户可以一键复制当前配置。
