import { isValidNumber, isValidPrice, validatSpecialCharact } from "@/utils/validate";

/**
 * Validate Name
 * @param {string} value
 * @returns {boolean}
 */
const validName = function(rule, value, callback) {
  if (value == "" || typeof value == "undefined") {
    callback(new Error("请输入商品名称"));
    return false;
  }
  if (validatSpecialCharact(value)) {
    callback(new Error("不能输入特殊字符"));
    return false;
  }
  if (value.trim() == "") {
    callback(new Error("不能输入纯空格"));
    return false;
  }
  callback();
}

/**
 * Validate detailDesc
 * 取消特殊字符限制
 * @param {string} value
 * @returns {boolean}
 */
const validdetailDesc = function(rule, value, callback) {
  if (value == "" || typeof value == "undefined") {
    callback(new Error("请输入商品详情"));
    return false;
  }
  if (value.trim() == "") {
    callback(new Error("不能输入纯空格"));
    return false;
  }
  callback();
}

/**
 * Validate displayPic
 * @param {string} value
 * @returns {boolean}
 */
const validPic = function(rule, value, callback) {
  if (!this.data[rule["field"]]) {
    callback(new Error("请上传图片"));
  } else {
    callback();
  }
}

/**
 * Validate cheapPrice
 * @param {string} value
 * @returns {boolean}
 */
const ValidCheapPrice = function(rule, value, callback) {
  if (!isValidPrice(value)) {
    callback(new Error("请输入整数最多7位，小数点后1到2位的数字"));
    return false;
  }
  if (value == 0) {
    callback(new Error("价格不能为0"));
    return false;
  }
  if (this.$parent.$parent.activeTab == 2 && value > 9.9) {
    callback(new Error("价格不能超过9.9"));
    return false;
  }
  callback();
}

/**
 * Validate prePrice
 * @param {string} value
 * @returns {boolean}
 */
const ValidPrePrice = function(rule, value, callback) {
  if (!isValidPrice(value)) {
    callback(new Error("请输入整数最多7位，小数点后1到2位的数字"));
    return false;
  }
  if (value == 0) {
    callback(new Error("价格不能为0"));
    return false;
  }
  if (this.data.cheapPrice && parseFloat(this.data.cheapPrice) >= parseFloat(value)) {
    callback(new Error("原价不能小于抢购价"));
    return false;
  } 
  callback();
}

/**
 * Validate allStock
 * @param {string} value
 * @returns {boolean}
 */
const ValidAllStock = function(rule, value, callback) {
  if (!isValidNumber(value) || value == "0") {
    callback(new Error("请输入合理的库存数量（库存不能为0）"));
    return false;
  } 
  callback();
}

/**
 * Validate industryId
 * @param {string} value
 * @returns {boolean}
 */
const ValidIndustryId = function(rule, value, callback) {
  if (value == "" || typeof value == "undefined") {
    callback(new Error("请选择商品分类"));
    return false;
  } else {
    callback();
  }
}

/**
 * Validate limitBuy
 * @param {string} value
 * @returns {boolean}
 */
const ValidlimitBuy = function(rule, value, callback) {
  if (this.islimitBuy == 0) {
    callback();
    this.$refs["goodInfoForm"].clearValidate(["limitBuy"]);
    return false;
  } 
  if (value == "0" || !isValidNumber(value)) {
    callback(new Error("请输入合理的限购数量"));
    return false;
  } 
  if (this.data.allStock && parseFloat(this.data.allStock) < parseFloat(value)) {
    callback(new Error("限购数量不能大于库存数量"));
  } else {
    callback();
  }
}

export default {
  data() {
    return {
      rules: {
        displayPic: [
          { validator: validPic.bind(this), trigger: "blur" }
        ],
        name: [
          { validator: validName, trigger: "change" },
          { validator: validName, trigger: "blur" }
        ],
        cheapPrice: [
          { validator: ValidCheapPrice.bind(this), trigger: "change" },
          { validator: ValidCheapPrice.bind(this), trigger: "blur" }
        ],
        prePrice: [
          { validator: ValidPrePrice.bind(this), trigger: "change" },
          { validator: ValidPrePrice.bind(this), trigger: "blur" }
        ],
        allStock: [
          { validator: ValidAllStock, trigger: "change" },
          { validator: ValidAllStock, trigger: "blur" }
        ],
        industryId: [
          { validator: ValidIndustryId, trigger: "change" },
          { validator: ValidIndustryId, trigger: "blur" }
        ],
        limitBuy: [
          { validator: ValidlimitBuy.bind(this), trigger: "change" },
          { validator: ValidlimitBuy.bind(this), trigger: "blur" }
        ],
        detailDesc: [
          { validator: validdetailDesc, trigger: "change" },
          { validator: validdetailDesc, trigger: "blur" }
        ],
        detailPic: [
          { validator: validPic.bind(this), trigger: "blur" }
        ]
      }
    }
  }
}