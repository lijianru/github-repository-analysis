import { ceil, floor, orderBy } from 'lodash';

/**
 * @param created_at 创建时间
 * @param closed_at 关闭时间
 * @returns 相差 x 天
 */
export function calculationInterval(created_at: string, closed_at: string) {
  const createdDate = new Date(created_at).getTime();
  const closedDate = new Date(closed_at).getTime();
  return ceil((closedDate - createdDate) / 1000 / 60 / 60 / 24);
}

/**
 * @param arr 目标数组
 * @param percentile 目标百分位
 * @returns 百分位数
 */
export function percentile(arr: number[], percentile: number = 0.8) {
  const orderedArr = orderBy(arr);

  const i = ceil(orderedArr.length * percentile) - 1;

  if (orderedArr.length % 2 === 0) {
    return floor((orderedArr[i] + orderedArr[i + 1]) / 2, 1);
  } else {
    return orderedArr[i];
  }
}
