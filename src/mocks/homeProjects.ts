/** 首页示例数据；搜索、卡片和详情共用这份项目清单。 */
export const homeProjects = [
  { id: "website", category: "网站设计", title: "品牌官网改版", summary: "整理品牌故事、产品介绍与联系入口。", detail: "新版首页先介绍品牌，再展示代表作品。团队正在核对桌面与手机上的阅读顺序，下一步是确认首页导航。", status: "设计中", owner: "陈一" },
  { id: "identity", category: "视觉规范", title: "品牌字体手册", summary: "统一标题、正文与数字的排版规则。", detail: "手册收录中英文字体组合、字号和行距，附有页面标题与长文示例，可供设计和开发共同查阅。", status: "已归档", owner: "林禾" },
  { id: "mobile", category: "移动产品", title: "移动端阅读体验", summary: "让书架、目录与阅读页在小屏上更易用。", detail: "本轮原型聚焦从书架继续阅读的流程，重点检查单手操作、章节切换和夜间阅读的对比度。", status: "评审中", owner: "许舟" },
] as const;
