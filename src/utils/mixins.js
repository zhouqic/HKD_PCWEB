import {
  Message
} from "element-ui";

/**
 * validate file
 * @param {file} value
 * @returns {boolean}
*/
export default function checkFile(file) {
  const reg = /.(gif|jpg|jpeg|png)$/gi;
  if (!reg.test(file.type)) {
    Message({
      message: "图片类型必须是.gif,jpeg,jpg,png中的一种",
      type: 'error',
      duration: 3 * 1000
    });
    return false;
  }
  if ((file.size / 1024 / 1024) > 5) {
    Message({
      message: "文件过大，请上传5M以内的图片",
      type: 'error',
      duration: 3 * 1000
    });
    return false;
  }
  return true;
}