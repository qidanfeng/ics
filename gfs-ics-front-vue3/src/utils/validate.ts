/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email: string): boolean {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return reg.test(email);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str: any): boolean {
  if (typeof str === 'string' || str instanceof String) {
    return true;
  }
  return false;
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg: any): boolean {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]';
  }
  return Array.isArray(arg);
}

/**
 * 电话号码
 * @param {string} s
 */
export function isPhone(s: string): boolean {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s);
}

/**
 * 手机号码
 * @param {string} s
 */
export function isMobile(s: string): boolean {
  return /^((\+?86)|(\(\+86\)))?(19[012356789][0-9]{8}|13[0123456789][0-9]{8}|15[012356789][0-9]{8}|166[0-9]{8}|18[0123456789][0-9]{8}|17[012356789][0-9]{8}|14[579][0-9]{8}|1349[0-9]{7})$/.test(s);
}

/**
 * 密码校验（至少1大写1小写1数字且长度>=8的密码）
 * @param {string} password
 */
export function isPassword(password: string): boolean {
  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password);
}
