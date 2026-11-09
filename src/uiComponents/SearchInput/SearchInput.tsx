import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { AutoComplete, Button, ConfigProvider, Input } from "antd";
import type { SearchInputProps } from "./SearchInput.types";
import styles from "./SearchInput.module.css";

/** 搜索框统一处理输入、清空和提交；位置和显示开关独立，业务请求放在页面。 */
export function SearchInput({
  variant = "basic", value, defaultValue = "", onChange, onSearch,
  placeholder = "输入关键词", ariaLabel = "搜索", size = "middle", color,
  allowClear = true, showIcon = true, iconPosition = "left",
  showButton = variant === "button", buttonPosition = "right", buttonText = "搜索",
  disabled = false, loading = false, suggestions = [], filterSuggestions = true, className = "",
}: SearchInputProps) {
  const [innerValue, setInnerValue] = useState(defaultValue);
  const composing = useRef(false);
  const selectedDuringEnter = useRef(false);
  const text = value ?? innerValue;
  const blocked = disabled || loading;
  /** 新输入开始时释放上一次候选选择，让本次回车和候选列表重新响应。 */
  function resetSuggestionState() {
    selectedDuringEnter.current = false;
  }
  function change(next: string) {
    resetSuggestionState();
    if (value === undefined) setInnerValue(next);
    onChange?.(next);
  }
  function submit(next: string) {
    if (!blocked && !composing.current) onSearch?.(next.trim());
  }
  const icon = showIcon ? (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" />
    </svg>
  ) : null;
  const input = (
    <Input aria-label={ariaLabel} autoComplete="off" placeholder={placeholder}
      size={size} disabled={blocked} allowClear={allowClear}
      // 联想型由 AutoComplete 注入 value/onChange，必须省略这两个属性。
      // 显式传 undefined 会覆盖注入的事件，造成输入已清空但候选仍按旧词筛选。
      {...(variant === "suggest" ? {} : {
        value: text,
        onChange: (event: ChangeEvent<HTMLInputElement>) => change(event.target.value),
      })}
      prefix={iconPosition === "left" ? icon : undefined}
      suffix={iconPosition === "right" ? icon : undefined}
      onCompositionStart={() => { composing.current = true; }}
      onCompositionEnd={() => { composing.current = false; }}
      onKeyDownCapture={event => {
        if (event.key === "Enter") selectedDuringEnter.current = false;
      }}
      onPressEnter={event => {
        if (event.nativeEvent.isComposing || event.keyCode === 229 || composing.current) return;
        event.preventDefault();
        // 等候候选项处理完本次键盘事件，再提交自由输入的文字，避免重复搜索。
        queueMicrotask(() => {
          if (!selectedDuringEnter.current) submit(text);
        });
      }}
    />
  );
  const button = showButton && (
    <Button type="primary" size={size} disabled={disabled} loading={loading}
      className={styles.button} onClick={() => submit(text)}>
      {buttonText.trim() || "搜索"}
    </Button>
  );
  return (
    <ConfigProvider theme={{ token: { ...(color ? { colorPrimary: color } : {}), ...(variant === "pill" ? { borderRadius: 24, borderRadiusSM: 24, borderRadiusLG: 24 } : {}) } }}>
      <div className={`${styles.root} ${className}`} data-variant={variant} aria-busy={loading}>
        {buttonPosition === "left" && button}
        <div className={styles.field}>
          {variant === "suggest" ? (
            <AutoComplete<string> value={text} onChange={change} disabled={blocked}
              showSearch={{ filterOption: false }}
              style={{ width: "100%" }} defaultActiveFirstOption={false}
              options={suggestions.filter(item => !filterSuggestions || item.value.toLowerCase().includes(text.trim().toLowerCase())).map(item => ({
                value: item.value,
                label: <span className={styles.option}><span>{item.value}</span><small>{item.description}</small></span>,
              }))}
              onSelect={next => {
                selectedDuringEnter.current = true;
                submit(next);
              }}
            >{input}</AutoComplete>
          ) : input}
        </div>
        {buttonPosition === "right" && button}
      </div>
    </ConfigProvider>
  );
}
