import { cloneDeep as esCloneDeep } from 'es-toolkit';

/**
 * 深拷贝数据，递归创建受支持的嵌套对象，并保留输入的 TypeScript 类型。
 *
 * 适合需要独立修改的表单草稿、配置或普通业务数据。
 * 支持普通对象、数组、Date、RegExp、Map、Set 等常见数据类型。
 * 普通对象和数组的循环引用、共享引用由上游实现的引用缓存处理。
 * Map 的值递归复制，但对象键保留原引用，方便继续使用原键查找。
 * 函数、Promise、WeakMap 等值保留原引用，不能视作完全独立的快照。
 *
 * 性能设计：直接绑定 es-toolkit 的实现，无额外包装或重复预遍历。
 * 深拷贝会遍历数据并分配新对象，应在创建草稿等必要时机调用。
 * 递归深度受运行环境调用栈限制，类型边界与本地性能记录见同目录 README。
 *
 * @param value 待复制的数据。
 * @returns 与输入类型相同的深拷贝结果，特殊引用类型遵循上述规则。
 * @example
 * const source = { settings: { enabled: true } };
 * const draft = cloneDeep(source);
 * draft.settings.enabled = false; // source.settings.enabled 仍为 true
 */
export const cloneDeep: typeof esCloneDeep = esCloneDeep;
