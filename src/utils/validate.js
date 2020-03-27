/**
 * validate ip address with port
 * @param value
 * @return {Boolean}
 */
export function isIpAddress(value) {
  const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)($|\:[0-9]{1,5})$/
  return ipRegex.test(value)
}

export function isValidInt(value) {
  const intRegex = /^-?\d+$/
  return intRegex.test(value)
}

/**
 * validate Number
 * @param value
 * @return {Boolean}
 */
export function isValidNumber(value) {
  const intRegex = /^[0-9]+$/
  return intRegex.test(value)
}

/**
 * validate 是否为字母和数字
 * @param value
 * @return {Boolean}
 */
export function isValidCharNum(value) {
  const intRegex = /^[a-zA-Z0-9]*$/;
  return intRegex.test(value)
}

/**
 * validate Price
 * @param value
 * 整数最多七位，小数最多两位最少一位
 * @return {Boolean}
 */
export function isValidPrice(value) {
  const intRegex = /^([0-9]|[1-9]\d{0,6})(\.\d{1,2})?$/;
  return intRegex.test(value)
}

/**
 * validate PassWord
 * @param value
 * @return {Boolean}
 */
export function isValidPwd(value) {
  const intRegex = /^[0-9a-zA-Z]{6,18}$/
  return intRegex.test(value)
}

export function isValidUNIXUser(value) {
  const regex = /^[a-z_][a-z0-9_-]{0,31}$/
  return regex.test(value)
}

export function isValidFloat(value) {
  if (typeof value === 'string' && value.trim() === '') {
    return false
  }
  const floatRegex = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
  return floatRegex.test(value)
}

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/* 特殊字符*/
export function validatSpecialCharact(str) {
  const regEn = /[`~!@#$%^&*_+<>?:"{},\/;'[\]]/im;
  const regCn = /[！#￥——：；“”‘、，|《。》？、【】[\]]/im;
  return regEn.test(str) || regCn.test(str)
}
/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

/**
 * Validate msisdn
 * @param {string} value
 * @returns {boolean}
 */
export function isValidMsisdn(value) {
  const msisdnRegex = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/
  return msisdnRegex.test(value)
}

/**
 * Validate telephone
 * @param {string} value
 * @returns {boolean}
 */
export function isValidPhone(value) {
  const phoneRegex = /^1(3|4|5|7|8)\d{9}$/
  return phoneRegex.test(value)
}

/**
 * Validate 固定电话
 * @param {string} value
 * @returns {boolean}
 */
export function isValidTelePhone(value) {
  const phoneRegex = /^(0\d{2,3}\-)?([2-9]\d{6,7})+(\-\d{1,6})?$/
  return phoneRegex.test(value)
}


/**
 * Validate endTime
 * @param {string} value
 * @returns {boolean}
 */
export function isValidEndTime(value, cValue) {
  if (!value) {
    return true;
  }
  const start = cValue ? (new Date(cValue). getTime()) : null;
  const end = value ? (new Date(value). getTime()) : null;
  if (!start) {
    return true;
  }
  if (start && end < start) {
    return false;
  } else {
    return true;
  }
}

/**
 * Validate name
 * @param {string} value
 * @returns {boolean}
 */
export function isValidName(value) {
  const nameRegex = /^[\s]/;
  return nameRegex.test(value);
}

/**
 * Validate 正整数
 * @param {string} value
 * @returns {boolean}
 */
export function isValidInteger(value) {
  const intRegex = /^[1-9]\d*$/;
  return intRegex.test(value);
}