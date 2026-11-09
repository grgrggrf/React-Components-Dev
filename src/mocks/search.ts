/** 搜索与联想共用 Mock 数据，后续可在页面替换为 API 请求。 */
export const searchRecords = [
  { id: "website", title: "品牌官网改版", category: "项目", description: "品牌故事、产品介绍和首页设计。" },
  { id: "guide", title: "品牌视觉规范", category: "文档", description: "配色、标志与页面排版规则。" },
  { id: "type", title: "品牌字体手册", category: "文档", description: "中英文字体、字号与行距说明。" },
  { id: "mobile", title: "移动端阅读体验", category: "项目", description: "手机和平板上的书架及阅读页面。" },
];
export async function mockSearch(keyword: string) {
  await new Promise(resolve => setTimeout(resolve, 500));
  const query = keyword.trim().toLowerCase();
  return { keyword, items: searchRecords.filter(item => (item.title + item.category + item.description).toLowerCase().includes(query)) };
}
