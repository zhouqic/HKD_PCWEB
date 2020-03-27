import { isValidPhone, isValidTelePhone, validatSpecialCharact } from "@/utils/validate";

/**
 * Validate 图片上传
 * @param {string} value
 * @returns {boolean}
 */
const validLogo = function(rule, value, callback) {
  if (!this.data[rule["field"]]) {
    callback(new Error("请上传图片"));
  } else {
    callback();
  }
}

/**
 * Validate name
 * @param {string} value
 * @returns {boolean}
 */
const validName = function(rule, value, callback) {
  if (value == "" || typeof value == "undefined") {
    callback(new Error("请输入门店名称"));
    return false;
  }
  if (validatSpecialCharact(value)) {
    callback(new Error("不能输入特殊字符"));
    return false;
  }
  if (value.trim() == "") {
    callback(new Error("不能输入纯空格"));
  } else {
    callback();
  }
}

/**
 * Validate 门店客服二维码图片上传
 * @param {string} value
 * @returns {boolean}
 */
const validPic = function(rule, value, callback) {
  if (!this.data[rule["field"]]) {
    callback(new Error("请上传门店客服二维码"));
  } else {
    callback();
  }
}

/**
 * Validate 门店图片上传
 * @param {string} value
 * @returns {boolean}
 */
const validPics = function(rule, value, callback) {
  if (!this.data.pic1) {
    callback(new Error("请上传门头照"));
    return false;
  }
  if (!this.data.pic2) {
    callback(new Error("请上传店内图片"));
    return false;
  } 
  if (!this.data.pic3) {
    callback(new Error("请上传店内图片"));
    return false;
  }
  callback();
}

/**
 * Validate 介绍
 * @param {string} value
 * @returns {boolean}
 */
const validIntroduction = function(rule, value, callback) {
  if (value == "" || typeof value == "undefined") {
    callback(new Error("请输入门店介绍"));
    return false;
  }
  if (value.trim() == "") {
    callback(new Error("不能输入纯空格"));
  } else {
    callback();
  }
}

/**
 * Validate 行业
 * @param {string} value
 * @returns {boolean}
 */
const validIndustry = function(rule, value, callback) {
  if (this.industryValue.length == 0) {
    callback(new Error("请选择行业"));
    return false;
  }
  callback();
}

/**
 * Validate 联系人
 * @param {string} value
 * @returns {boolean}
 */
const validContacts = function(rule, value, callback) {
  if (value == "" || typeof value == "undefined") {
    callback(new Error("请输入联系人"));
    return false;
  }
  if (validatSpecialCharact(value)) {
    callback(new Error("不能输入特殊字符"));
    return false;
  }
  if (value.trim() == "") {
    callback(new Error("不能输入纯空格"));
  } else {
    callback();
  }
}

/**
 * Validate 联系方式
 * @param {string} value
 * @returns {boolean}
 */
const validTel = function(rule, value, callback) {
  if (value == "") {
    callback(new Error("请输入联系方式"));
    return false;
  }
  if (isValidPhone(value) || isValidTelePhone(value)) {
    callback();
  } else {
    callback(new Error("请输入正确的联系方式"))
  }
}

/**
 * Validate 联系地址
 * @param {string} value
 * @returns {boolean}
 */
const validAddress = function(rule, value, callback) {
  if (value == "") {
    callback(new Error("请输入联系地址"));
    return false;
  } 
  if (value.trim() == "") {
    callback(new Error("不能输入纯空格"));
    return false;
  }
  if (validatSpecialCharact(value)) {
    callback(new Error("不能输入特殊字符"));
    return false;
  }
  callback();
}

/**
 * Validate 营业时间
 * @param {string} value
 * @returns {boolean}
 */
const validTime = function(rule, value, callback) {
  if (!value || value.indexOf("") != -1) {
    callback(new Error("请选择营业时间"));
  } else {
    callback();
  }
}

export default {
  data() {
    return {
      rules: {
        logo: [
          { validator: validLogo.bind(this), trigger: "blur" }
        ],
        pic: [
          { validator: validPics.bind(this), trigger: "blur" }
        ],
        customerServiceCode: [
          { validator: validPic.bind(this), trigger: "blur" }
        ],
        name: [
          { validator: validName.bind(this), trigger: "blur" },
          { validator: validName.bind(this), trigger: "change" }
        ],
        introduction: [
          { validator: validIntroduction.bind(this), trigger: "blur" },
          { validator: validIntroduction.bind(this), trigger: "change" }
        ],
        industryValue: [
          { validator: validIndustry.bind(this), trigger: "blur" },
          { validator: validIndustry.bind(this), trigger: "change" }
        ],
        contacts: [
          { validator: validContacts.bind(this), trigger: "blur" },
          { validator: validContacts.bind(this), trigger: "change" }
        ],
        tel: [
          { validator: validTel.bind(this), trigger: "blur" },
          { validator: validTel.bind(this), trigger: "change" }
        ],
        address: [
          { validator: validAddress.bind(this), trigger: "blur" },
          { validator: validAddress.bind(this), trigger: "change" }
        ],
        businessTime: [
          { validator: validTime.bind(this), trigger: "blur" },
          { validator: validTime.bind(this), trigger: "change" }
        ]
      }
    }
  },
  methods: {
    handleOnLogoChange(file) {
      if (this.$checkFile(file.raw)) {
        this.$bus.emit('send-file', { file: file.raw,  ratio: 1/1 });
        this.$bus.once('set-file', val => {
          this.data.logo = val;
          this.$forceUpdate();
        });
      }
    },
    handleShopPic1(file) {
      if (this.$checkFile(file.raw)) {
        this.$bus.emit('send-file', { file: file.raw,  ratio: 720/400 });
        this.$bus.once('set-file', val => {
          this.data.pic1 = val;
          this.$forceUpdate();
        });
      }
    },
    handleShopPic2(file) {
      if (this.$checkFile(file.raw)) {
        this.$bus.emit('send-file', { file: file.raw,  ratio: 720/400 });
        this.$bus.once('set-file', val => {
          this.data.pic2 = val;
          this.$forceUpdate();
        });
      }
    },
    handleShopPic3(file) {
      if (this.$checkFile(file.raw)) {
        this.$bus.emit('send-file', { file: file.raw,  ratio: 720/400 });
        this.$bus.once('set-file', val => {
          this.data.pic3 = val;
          this.$forceUpdate();
        });
      }
    },
    handleShopServiceQRCode(file) {
      if (this.$checkFile(file.raw)) {
        this.$bus.emit('send-file', { file: file.raw,  ratio: 1/1 });
        this.$bus.once('set-file', val => {
          this.data.customerServiceCode = val;
          this.$forceUpdate();
        });
      }
    },
  },
}