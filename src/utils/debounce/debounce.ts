import { debounce as esDebounce } from 'es-toolkit';

/**
 * 创建防抖函数：连续调用时重新计时，默认在最后一次调用后执行。
 *
 * @param func 需要防抖的函数，执行时接收最后一次调用的参数和 this。
 * @param wait 等待时间，单位毫秒。
 * @param options edges 控制开始或结束时执行；signal 可取消待执行任务。
 * @returns 防抖函数，附带 cancel、flush 和 schedule 方法。
 * @see https://es-toolkit.dev/reference/function/debounce.html
 */
export const debounce: typeof esDebounce = esDebounce;
