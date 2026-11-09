import { throttle as esThrottle } from 'es-toolkit';

/**
 * 创建节流函数：持续调用时限制原函数的执行频率。
 *
 * @param func 需要节流的函数，执行时保留对应调用的参数和 this。
 * @param wait 节流间隔，单位毫秒。
 * @param options edges 控制开始或结束时执行；signal 可取消待执行任务。
 * @returns 节流函数，附带 cancel 和 flush 方法。
 * @see https://es-toolkit.dev/reference/function/throttle.html
 */
export const throttle: typeof esThrottle = esThrottle;
