import { clone as esClone } from 'es-toolkit';

/**
 * 浅拷贝一个值，保留输入的 TypeScript 类型。
 *
 * 普通对象只复制自身可枚举属性（含 Symbol），数组只复制外层容器。
 * 因此修改副本的顶层字段不会改动原对象，修改共享的嵌套对象仍会影响原对象。
 * Map、Set 会创建新容器，其中的对象键、值或元素仍保持原引用。
 * 基础类型直接返回原值，Date 等受支持的内置类型按各自规则复制。
 *
 * 性能设计：直接绑定已有实现，调用时没有额外包装、深层遍历或序列化。
 * 只需要更新顶层属性时优先使用浅拷贝，以减少对象分配和垃圾回收。
 * 函数及依赖内部状态的实例不属于通用数据复制范围，详见同目录 README。
 *
 * @param value 待复制的值，通常为普通对象或数组。
 * @returns 与输入类型相同的浅拷贝结果；嵌套对象共享引用。
 * @example
 * const source = { name: '原名称', settings: { enabled: true } };
 * const copy = clone(source);
 * copy.name = '新名称'; // source.name 仍为「原名称」
 * copy.settings.enabled = false; // source.settings.enabled 也变为 false
 */
export const clone: typeof esClone = esClone;
