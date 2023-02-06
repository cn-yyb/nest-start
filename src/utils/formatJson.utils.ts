/*
 * @Author: zq
 * @Date: 2023-02-06 14:15:30
 * @Last Modified by: zq
 * @Last Modified time: 2023-02-06 14:16:03
 */
/**
 * 过滤掉json数据中的 null 值
 * @param origin 格式化数据
 * @returns
 */
export function formatJsonNull<T = any>(origin = {}): T {
  return JSON.parse(JSON.stringify(origin).replace(/:null,/g, ':"",'));
}
