import { isValidNumber, isValidPhone, isValidPwd } from "@/utils/validate";

/**
 * Validate Name
 * @param {string} value
 * @returns {boolean}
 */
export function validName (rule, value, callback) {
  if (value == "") {
    callback(new Error("请输入姓名"));
    return false;
  }
  if (value.trim() == "") {
    callback(new Error("不能输入纯空格"));
  } else {
    callback();
  }
}

/**
 * Validate JobNumber
 * @param {string} value
 * @returns {boolean}
 */
export function validJobNumber (rule, value, callback) {
  if (value == "") {
    callback(new Error("请输入工号"));
    return false;
  }
  if (!isValidNumber(value)) {
    callback(new Error("请输入最多6位数字的工号"));
  } else {
    callback();
  }
}

/**
 * Validate Tel
 * @param {string} value
 * @returns {boolean}
 */
export function validTel (rule, value, callback) {
  if (value == "") {
    callback(new Error("请输入手机号"));
    return false;
  }
  if (!isValidPhone(value)) {
    callback(new Error("请输入正确的手机号"));
  } else {
    callback();
  }
}

/**
 * Validate Tel
 * @param {string} Password
 * @returns {boolean}
 */
export function validPassword (rule, value, callback) {
  if (value == "") {
    callback(new Error("请输入密码"));
    return false;
  }
  if (!isValidPwd(value)) {
    callback(new Error("请输入字母或数字组成的6位至18位密码"));
  } else {
    callback();
  }
}

/**
 * Validate Tel
 * @param {string} ConfirmPassword
 * @returns {boolean}
 */
export function validConfirmPassword (rule, value, callback) {
  if (value == "") {
    callback(new Error("请输入确认密码"));
    return false;
  }
  if (value != this.staffInfoForm.password) {
    callback(new Error("两次输入密码不一致"));
  } else {
    callback();
  }
}

/**
 * Validate Tel
 * @param {string} VerifyCode
 * @returns {boolean}
 */
export function validverifyCode (rule, value, callback) {
  if (value == "" || value.trim() == "") {
    callback(new Error("请输入验证码"));
    return false;
  } else {
    callback();
  }
}