/**
 * Validate featureTitle
 * @param {string} value
 * @returns {boolean}
 */
const validTitle = function(rule, value, callback) {
  if (value == "" || typeof value == "undefined") {
    callback(new Error("请输入特色产品名称"));
    return false;
  }
  if (value.trim() == "") {
    callback(new Error("不能输入纯空格"));
  } else {
    callback();
  }
}

/**
 * Validate 产品图片上传
 * @param {string} value
 * @returns {boolean}
 */
const validPic = function(rule, value, callback) {
  if (!this.data[rule["field"]]) {
    callback(new Error("请上传特色产品图片"));
  } else {
    callback();
  }
}

/**
 * Validate 介绍
 * @param {string} value
 * @returns {boolean}
 */
const validDetail = function(rule, value, callback) {
  if (value == "" || typeof value == "undefined") {
    callback(new Error("请输入特色产品描述"));
    return false;
  }
  if (value.trim() == "") {
    callback(new Error("不能输入纯空格"));
  } else {
    callback();
  }
}

export default {
  data() {
    return {
      rules: {
        featurePic: [
          { validator: validPic.bind(this), trigger: "blur" }
        ],
        featureTitle: [
          { validator: validTitle.bind(this), trigger: "blur" },
          { validator: validTitle.bind(this), trigger: "change" }
        ],
        featureDetail: [
          { validator: validDetail.bind(this), trigger: "blur" },
          { validator: validDetail.bind(this), trigger: "change" }
        ]
      }
    }
  }
}