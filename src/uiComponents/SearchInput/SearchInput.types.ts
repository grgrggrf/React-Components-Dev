export type SearchVariant = "basic" | "pill" | "button" | "suggest";
export interface SearchSuggestion {
  value: string;
  description?: string;
}
export interface SearchInputProps {
  variant?: SearchVariant;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** 点击搜索、按回车或选择联想项时调用；请求和 loading 由页面管理。 */
  onSearch?: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  size?: "small" | "middle" | "large";
  color?: string;
  allowClear?: boolean;
  showIcon?: boolean;
  iconPosition?: "left" | "right";
  /** 默认仅按钮型显示；也可在其他样式中显式开启。 */
  showButton?: boolean;
  buttonPosition?: "left" | "right";
  buttonText?: string;
  disabled?: boolean;
  loading?: boolean;
  /** 联想型使用此列表；本地按 value 匹配，远程已过滤的数据可设 filterSuggestions=false。 */
  suggestions?: SearchSuggestion[];
  filterSuggestions?: boolean;
  className?: string;
}
