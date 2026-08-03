/**
 * 获取当前日期 day天的数据，传入的day为一个数字
 * @param day  若为0表示获取今天的日期；若为正数表示获取后day天的日期；若为负数表示获取前day天的日期
 * @returns {string}  日期字符串
 */
export function getDay(day: number): string {
  const date = new Date();
  return getDateByAddDay(date, day);
}

/**
 * 获取指定日期 day天的数据，传入的day为一个数字
 * @param dateParam 指定日期
 * @param day  若为0表示获取今天的日期；若为正数表示获取后day天的日期；若为负数表示获取前day天的日期
 * @returns {string}  日期字符串
 */
export function getDateByAddDay(dateParam: Date | string, day: number): string {
  const date = typeof dateParam === 'string' ? new Date(dateParam) : dateParam;
  const getTime = date.getTime() + 1000 * 60 * 60 * 24 * day;
  date.setTime(getTime);
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let today = date.getDate();

  if (month < 10) {
    month = parseInt('0' + month, 10);
  }
  if (today < 10) {
    today = parseInt('0' + today, 10);
  }

  return `${year}-${month}-${today}`;
}
