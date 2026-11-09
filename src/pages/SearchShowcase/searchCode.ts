import type { SearchInputProps } from "../../uiComponents/SearchInput";
import { searchRecords } from "../../mocks/search";

/** 把当前配置转成可复制的 JSX，文字使用 JSON 转义以支持引号和换行。 */
export function buildSearchCode(settings: Pick<SearchInputProps,
  "variant" | "placeholder" | "size" | "color" | "allowClear" | "showIcon" |
  "iconPosition" | "showButton" | "buttonPosition" | "buttonText" | "disabled"
>, keyword: string) {
  return [
    'import { useState } from "react";',
    'import { useMutation } from "@tanstack/react-query";',
    'import { SearchInput } from "./uiComponents";',
    "",
    `const records = ${JSON.stringify(searchRecords, null, 2)};`,
    "",
    "// 在应用入口提供 QueryClientProvider（本项目已有 QueryProvider）。",
    "export default function Example() {",
    `  const [value, setValue] = useState(${JSON.stringify(keyword)});`,
    "  const request = useMutation({",
    "    mutationFn: async (keyword: string) => {",
    "      await new Promise(resolve => setTimeout(resolve, 500));",
    "      const query = keyword.trim().toLowerCase();",
    "      return records.filter(item => (item.title + item.category + item.description).toLowerCase().includes(query));",
    "    },",
    "  });",
    "  // 每次输入新关键词，自动清除上一轮结果与错误。",
    "  function resetSearchState(nextValue: string) {",
    "    request.reset();",
    "    setValue(nextValue);",
    "  }",
    "  return (",
    "    <div>",
    "      <SearchInput",
    ...Object.entries(settings).map(([key, value]) => `        ${key}={${JSON.stringify(value)}}`),
    "        value={value}",
    "        onChange={resetSearchState}",
    "        onSearch={keyword => request.mutate(keyword)}",
    "        loading={request.isPending}",
    ...(settings.variant === "suggest" ? ['        suggestions={records.map(item => ({ value: item.title, description: item.category }))}'] : []),
    "      />",
    '      {request.isPending && <p role="status">正在搜索…</p>}',
    '      {request.isError && <p role="alert">搜索失败，请重试。</p>}',
    "      {!request.isPending && request.data?.map(item => <article key={item.id}><h3>{item.title}</h3><p>{item.description}</p></article>)}",
    '      {!request.isPending && request.data?.length === 0 && <p>没有找到结果。</p>}',
    "    </div>",
    "  );",
    "}",
  ].join("\n");
}
