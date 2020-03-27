<template>
  <div id="add-goods-order" class="main-content">
    <el-breadcrumb separator="/" style="margin-left: 15px;">
      <el-breadcrumb-item :to="{ path: '/marketManage/goodManage_view' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{ id ? '编辑商品' : '添加商品' }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="add-goods-search">
      <!-- 基本信息 -->
      <el-main>
        <p class="add-goods-title">基本信息</p>
        <el-form :model="data" :rules="formRules" ref="GoodInfoForm" class="add-goods-form" label-position="left" label-width="100px">
          <el-form-item label="商品图片：" prop="filePicture">
            <el-upload class="add-goods-uploader" action :show-file-list="false" :on-change="handleOnFilePictureChange" :auto-upload="false">
              <img v-if="data.filePicture" :src="typeof data.filePicture == 'string' ? data.filePicture : URL.createObjectURL(data.filePicture)" width="420">
              <i v-else class="el-icon-plus add-goods-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="商品名称：" prop="title">
            <el-input v-model.trim="data.title" placeholder="请输入商品名称" maxlength="20"></el-input>
          </el-form-item>

          <el-form-item label="商品分类：" prop="classifyId">
            <el-cascader v-model="data.classifyId" :options="flData" @active-item-change="handleOnItemChange" :props="{ value: 'id', label: 'title', children: 'list' }"></el-cascader>
          </el-form-item>

          <el-form-item label="轮播图：" prop="filePic">
            <el-upload class="add-goods-uploader" action :show-file-list="false" :on-change="handleOnfilePic1Change" :auto-upload="false">
              <img v-if="data.filePic1" :src="typeof data.filePic1 == 'string' ? data.filePic1 : URL.createObjectURL(data.filePic1)" width="300">
              <i v-else class="el-icon-plus add-goods-uploader-icon"></i>
              <i v-show="data.filePic1" class="el-icon-close add-goods-close" @click.stop="data.filePic1 = ''"></i>
            </el-upload>

            <el-upload class="add-goods-uploader" action :show-file-list="false" :on-change="handleOnfilePic2Change" :auto-upload="false" style="margin: 10px 10px 0 10px">
              <img v-if="data.filePic2" :src="typeof data.filePic2 == 'string' ? data.filePic2 : URL.createObjectURL(data.filePic2)" width="300">
              <i v-else class="el-icon-plus add-goods-uploader-icon"></i>
              <i v-show="data.filePic2" class="el-icon-close add-goods-close" @click.stop="data.filePic2 = ''"></i>
            </el-upload>

            <el-upload class="add-goods-uploader" action :show-file-list="false" :on-change="handleOnfilePic3Change" :auto-upload="false">
              <img v-if="data.filePic3" :src="typeof data.filePic3 == 'string' ? data.filePic3 : URL.createObjectURL(data.filePic3)" width="300">
              <i v-else class="el-icon-plus add-goods-uploader-icon"></i>
              <i v-show="data.filePic3" class="el-icon-close add-goods-close" @click.stop="data.filePic3 = ''"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="活动商品：" prop="isCampaign">
            <el-radio-group v-model="data.isCampaign">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
            <small class="add-goods-small-title">（活动商品只在砍价活动中使用）</small>
          </el-form-item>

          <el-form-item label="热卖商品：" prop="isHot">
            <el-radio-group v-model="data.isHot">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="发货地址：" prop="departure">
            <el-input v-model.trim="data.departure" placeholder="请输入发货地址" maxlength="40"></el-input>
          </el-form-item>

          <el-form-item label="商品简介：" prop="dsc">
            <el-input type="textarea" v-model.trim="data.dsc" placeholder="请输入商品简介" maxlength="1024" style="width:420px;"></el-input>
          </el-form-item>

          <el-form-item label="详情图片：" prop="details">
            <template v-for="(item, i) in data.details">
              <el-upload v-if="item" :key="i" class="add-goods-uploader" action :show-file-list="false" :auto-upload="false" style="margin: 10px 10px 0 10px">
                <img :src="item" width="300">
                <i class="el-icon-close add-goods-close" @click.stop="data.details.splice(i, 1)"></i>
              </el-upload>
            </template>
            
            <el-upload v-if="data.details.length <= 4" class="add-goods-uploader" action :show-file-list="false" :on-change="handleOnDetailPicChange" :auto-upload="false">
              <i class="el-icon-plus add-goods-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="选择规格模板:" label-width="110px">
            <el-select v-model="data.moudelId" placeholder="请选择商品规格" @change="handleOnGgChange">
              <el-option v-for="item in ggOptions" :key="item.id" :label="item.modelName" :value="item.id"></el-option>
            </el-select>
            <el-button type="primary" style="margin-left: 20px;" @click="handleAddTempRow()">添加规格</el-button>
          </el-form-item>
        </el-form>
      </el-main>
      <!-- 商品规格表 -->
      <el-main v-if="ggTableForm.tableData.length">
        <p class="add-goods-title">商品规格</p>
        <el-table :data="ggTableForm.tableData" border>
          <!-- 规格列 -->
          <el-table-column v-for="(item, i) in ggColumn" :key="i" :label="item" :prop="item" align="center"></el-table-column>

          <el-table-column label="价格" prop="price" align="center"></el-table-column>

          <el-table-column v-if="isSetMemberCard" label="会员价格" prop="memberPrice" align="center"></el-table-column>

          <el-table-column label="库存" prop="num" align="center"></el-table-column>

          <el-table-column label="规格图片" width="120px" align="center">
            <template slot-scope="{ row }">
              <img v-if="row.picture" :src="row.picture" width="100" height="64">
            </template>
          </el-table-column>

          <el-table-column label="操作" width="150px" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button class="table_operate" @click="handleEditGgCloumn(scope.$index)" type="primary">编辑</el-button>
              <el-button class="table_operate" @click="ggTableForm.tableData.splice(scope.$index, 1)" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </div>
    <!-- 操作 -->
    <div class="add-goods-button">
      <el-button type="primary" :disabled="isSubmit ? true : false" @click="handleSubmitForm('data')">确认并提交</el-button>
      <el-button @click="handleGoBack" style="margin-left:60px;">返回</el-button>
    </div>
    <!-- 规格值编辑 -->
    <el-dialog title="规格信息设置" :visible.sync="showDialog" id="ggInfoForm" width="400px" @closed="formData = {}" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form v-if="showDialog" :model="formData" ref="ggInfoForm" label-width="100px">
        <template v-for="(item, i) in ggColumn">
          <el-form-item :label="item + '：'" :prop="item" :key="i"  :rules="{ required: true, message: '*必填项', trigger: 'change' }">
            <el-input v-model.trim="formData[item]" maxlength="10" style="width: 80%"></el-input>
          </el-form-item>
        </template>

        <el-form-item label="价格：" prop="price" :rules="[{required: true, message: '*必填项', trigger: 'blur' },
        { validator: handleValidPrice, trigger: 'blur' }]">
          <el-input v-model.trim="formData.price" maxlength="10" style="width: 80%"></el-input>
        </el-form-item>

        <el-form-item v-if="isSetMemberCard" label="会员价格：" prop="memberPrice" :rules="[{ validator: handleValidPrice, trigger: 'blur' }]">
          <el-input v-model.trim="formData.memberPrice" maxlength="10" style="width: 80%"></el-input>
        </el-form-item>

        <el-form-item label="库存：" prop="num" :rules="[{required: true, message: '*必填项', trigger: 'blur' },
        { validator: isInteger, trigger: 'blur' }]">
          <el-input v-model.trim="formData.num" maxlength="5" style="width: 80%"></el-input>
        </el-form-item>

        <el-form-item label="规格图片：">
          <el-upload style="display: inline-block;" action :show-file-list="false" :on-change="handleOnFormPicChange" :auto-upload="false">
            <img v-if="formData.picture" :src="typeof formData.picture == 'string' ? formData.picture : URL.createObjectURL(formData.picture)" width="200">
            <i v-else class="el-icon-plus" style="width: 200px;line-height: 150px;color: #8c939d;;background: #E8E8E8;text-align: center;"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false; formData = {};">取 消</el-button>
        <el-button type="primary" @click="handleSubmitGgInfoForm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getProductListAsync, getProductModelList, addProduct, saveImages, flagShopCard, getProductById } from "@/api/marketCommodity";
import Tinymce from "@/components/Tinymce";
import { isValidPrice, isValidNumber } from "@/utils/validate";
import _ from "lodash";

export default {
  components: { Tinymce },
  data() {
    const ValidFilePic = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请上传商品图片"));
        return false;
      }
      callback();
    }
    const ValidClassify = (rule, value, callback) => {
      if (!this.isMinClassify) {
        callback(new Error("请选择子商品分类"));
        return false;
      }
      callback();
    }
    const ValidSlidePic = (rule, value, callback) => {
      if (!this.data.filePic1 && !this.data.filePic2 && !this.data.filePic3) {
        callback(new Error("请至少添加一张轮播图"));
        return false;
      }
      callback();
    }
    const ValidDetailPic = (rule, value, callback) => {
      if (this.data.details.length == 0) {
        callback(new Error("请至少添加一张详情图片"));
        return false;
      }
      callback();
    }
    return {
      id: '',
      URL: URL,
      isMinClassify: true,
      isSetMemberCard: false,//商家是否设置会员卡
      isSubmit: false,
      data: {
        title: "",
        classifyId: [],
        details: [],
        dsc: '',
        isCampaign: 0,
        isHot: 0,
        filePicture: "",
        maxPrice: "",
        minPrice: "",
        filePic1: "",
        filePic2: "",
        filePic3: "",
        content: '',
        departure: "", // 详细地址
        moudelId: ""
      },
      formRules: {
        filePicture: { validator: ValidFilePic.bind(this), trigger: "blur" },
        departure: { required: true, message: "请输入发货地址", trigger: "blur" },
        dsc: { required: true, message: "请输入商品简介", trigger: "blur" },
        title: { required: true, message: "请输入商品名称", trigger: "blur" },
        classifyId: [
          { required: true, message: "请选择商品分类", trigger: "change" },
          { validator: ValidClassify.bind(this), trigger: "blur" }
        ],
        filePic: { validator: ValidSlidePic.bind(this), trigger: "blur" },
        details: { validator: ValidDetailPic.bind(this), trigger: "blur" },
        maxPrice: [
          { required: true, message: "请输入最高价", trigger: "blur" },
          { validator: this.handleValidPrice, trigger: "blur" }
        ],
        minPrice: [
          { required: true, message: "请输入最低价", trigger: "blur" },
          { validator: this.handleValidPrice, trigger: "blur" }
        ]
      },
      flData: [], // 商品分类的数据
      // areaOption: regionData, // 省市区的数据
      ggOptions: [], // 规格模板的数据
      ggTableForm: {
        tableData: [], // 规格值的表格数据
      }, // 规格值的表格校验值
      ggColumn: [], // 新增的表头和列表
      ggValue: "", // 当前选中规格值
      templateTableOption: {}, // 根据不同模板组成的新增对象
      showDialog: false,
      formData: {},
      index: ""
    };
  },
  beforeCreate() {
    // 判断是否是刷新
    if (this.$route.params.id) {
      sessionStorage.setItem("goodId", this.$route.params.id);
    }
  },
  created() {
    this.handleIsSetMemberCard();
    this.id = sessionStorage.getItem("goodId");
    // 获取商品分类列表
    this.handleGetflData();
    // 获取规格模板
    this.handleGetModelData().then(() => {
      if (this.id) {
        this.handleGetProductData();
      }
    });
  },
  methods: {
    handleIsSetMemberCard() {
      flagShopCard().then(res => {
        this.isSetMemberCard = res.tableData;
      })
    },
    handleOnDetailPicChange(file) {
      if (this.$checkFile(file.raw)) {
        this.$bus.emit('send-file', { file: file.raw,  ratio: 1/1 });
        this.$bus.once('set-file', val => {
          let data = new FormData();
          data.append("filePicture", val);
          saveImages(data).then(res => {
            this.data.details.push(res.tableData)
          })
          this.$forceUpdate();
        });
      }
    },
    // 首图
    handleOnFilePictureChange(file) {
      if (this.$checkFile(file.raw)) {
        this.$bus.emit('send-file', { file: file.raw,  ratio: 1/1 });
        this.$bus.once('set-file', val => {
          this.data.filePicture = val;
          this.$forceUpdate();
        });
      }
    },
    // 轮播图1
    handleOnfilePic1Change(file) {
      if (this.$checkFile(file.raw)) {
        this.$bus.emit('send-file', { file: file.raw,  ratio: 1/1 });
        this.$bus.once('set-file', val => {
          this.data.filePic1 = val;
          this.$forceUpdate();
        });
      }
    },
    // 轮播图2
    handleOnfilePic2Change(file) {
      if (this.$checkFile(file.raw)) {
        this.$bus.emit('send-file', { file: file.raw,  ratio: 1/1 });
        this.$bus.once('set-file', val => {
          this.data.filePic2 = val;
          this.$forceUpdate();
        });
      }
    },
    // 轮播图3
    handleOnfilePic3Change(file) {
      if (this.$checkFile(file.raw)) {
        this.$bus.emit('send-file', { file: file.raw,  ratio: 1/1 });
        this.$bus.once('set-file', val => {
          this.data.filePic3 = val;
          this.$forceUpdate();
        });
      }
    },
    // 获取商品分类数据
    handleGetflData() {
      getProductListAsync({}).then(res => {
        if(res.tableData) {
          res.tableData.forEach(item => {
            if (!item.list.length) {
              delete item.list;
            } else {
              item.list.forEach(cItem => {
                if (!cItem.list.length) {
                  delete cItem.list;
                }
              })
            }
          });
          this.flData = res.tableData;
        }
      });
    },
    // 获取规格模板
    handleGetModelData() {
      return new Promise((resolve, reject) => {
        getProductModelList({}).then(res => {
          res.tableData.forEach(item => {
            item.label = item.modelName;
            item.value = item.id;
            item.modelContext = JSON.parse(item.modelContext);
          });
          this.ggOptions = res.tableData;
          resolve();
        });
      })
      
    },
    // 价格验证
    handleValidPrice(rule, value, callback) {
      if (!value && rule["field"] == "memberPrice") {
        callback();
        return false;
      }
      if (value === "0" && rule["field"] == "memberPrice") {
        callback(new Error("请输入合理的价格"));
        return false;
      }
      if (isValidPrice(value)) {
        callback();
      } else {
        callback(new Error("请输入合理的价格"));
      }
    },
    // 获取商品信息
    handleGetProductData() {
      getProductById({ id: this.id }).then(res => {
        this.data = {
          title: res.tableData.title,
          moudelId: res.tableData.modelId,
          isCampaign: res.tableData.isCampaign,
          isHot: res.tableData.isHot,
          filePicture: res.tableData.picture,
          maxPrice: res.tableData.maxPrice,
          minPrice: res.tableData.minPrice,
          departure: res.tableData.departure,
          filePic1: res.tableData.pic1,
          filePic2: res.tableData.pic2,
          filePic3:  res.tableData.pic3,
          dsc:  res.tableData.dsc,
          details:  res.tableData.details.split(","),
          content: decodeURIComponent(res.tableData.content)
        }
        // 处理规格模板删除
        if (this.ggOptions.filter( item => item.id == res.tableData.modelId ).length == 0) {
          this.data.moudelId = "";
          this.$forceUpdate();
        }
        // 获取当前模板
        let isExitColumn = false;
        res.businessData.forEach(item => {
          let option = {
            id: item.id,
            formatPrice: item.price,
            formatMemberPrice: item.memberPrice,
            formatNum: item.num,
            formatPicture: item.picture
          };
          
          JSON.parse(item.formatContext).forEach(item => {
            option[item.key] = item.val;
          });
          this.ggTableForm.tableData.push(option);
        });
        if (res.businessData[0]) {
          let param = {
            formatPrice: '',
            formatMemberPrice: "",
            formatNum: '',
            formatPicture: ''
          };
          JSON.parse(res.businessData[0].formatContext).forEach(item => {
            this.ggColumn.push(item.key);
            param[item.key] = '';
          });
          this.ggValue = res.tableData.modelId;
          this.templateTableOption = JSON.parse(JSON.stringify(param));
        }
        // this.handleSetCloumnData(res.tableData.modelId);
        // 获取分类
        this.flData.forEach(item => {
          if (item.id == res.tableData.categoryId) {
            this.data.classifyId = [item.id];
            return false;
          } else {
            if (item.list && item.list.length) {
              item.list.forEach(item1 => {
                if (item1.id == res.tableData.categoryId) {
                  this.data.classifyId = [item.id, item1.id];
                  return false;
                } else {
                  if (item1.list && item1.list.length) {
                    item1.list.forEach(item2 => {
                      if (item2.id == res.tableData.categoryId) {
                        this.data.classifyId = [item.id, item1.id, item2.id];
                        return false;
                      }
                    })
                  }
                }
              })
            }
          }
        })
        // 规格表格赋值
        this.ggTableForm.tableData = res.businessData.map(item => {
          JSON.parse(item.formatContext).forEach(format_item => {
            item[format_item.key] = format_item.val;
          });
          return item;
        });
      })
    },
    // 递归获取所选节点
    handleGetSelectNode(id, arr, item) {
      for (var i = 0; i < arr.length; i++) {
        if(arr[i].id == id) {
          arr[i].children = item;
          break;
        } else {
          if(arr[i]["children"]) {
            this.handleGetSelectNode(id, arr[i]["children"], item);
          }
        }
      }
    },
    // 选择节点
    handleOnItemChange(data) {
      getProductListAsync({ parentId: data[data.length - 1] }).then(res => {
        let childItem = res.tableData.map(item => {
          if (item.hasChild && item.childCount) {
            item.hasChildren = true;
            item.children = [];
          }
          return item;
        });
        this.handleGetSelectNode(data[data.length - 1], this.flData, childItem);
      });
    },
    // 设置列信息
    handleSetCloumnData(value) {
      this.ggTableForm.tableData = [];
      this.ggColumn = [];
      this.ggOptions.forEach(item => {
        if (item.id === value) {
          let optionObject = {
            formatPrice: "",
            formatMemberPrice: "",
            formatNum: "",
            formatPicture: ""
          };
          item.modelContext.forEach(model_item => {
            this.ggColumn.push(model_item);
            optionObject[model_item] = "";
          });
          this.$nextTick(() => {
            this.templateTableOption = optionObject;
          })
        }
      });
      this.ggValue = value;
    },
    // 选择规格模板模板
    handleOnGgChange(value) {
      if (this.ggValue != value) {
        this.$confirm(`切换模板时，会清空之前设置的信息，您确认要切换吗?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.handleSetCloumnData(value);
        }).catch(() => {
          this.data.moudelId = this.ggValue;
        });
      } else {
        this.handleSetCloumnData(value);
      }
    },
    isInteger(rule, value, callback) {
      if (!isValidNumber(value) || value == "0") {
        callback(new Error("请输入合理的库存数量, 不能为0"));
      } else {
        callback();
      }
    },
    // 添加规格值中表格增加一条数据
    handleAddTempRow() {
      this.showDialog = true;
    },
    // 编辑规格信息
    handleEditGgCloumn(i) {
      this.formData = {...this.ggTableForm.tableData[i]};
      this.index = i;
      this.showDialog = true;
    },
    /*竖立形的手机图片压缩到高度为1000px，横幅型的图片压缩到宽度为1024px*/
    calcWH(ow, oh) {
      if (ow<1024 && oh<1000) {
        return {width: ow, height: oh};
      }
      if (ow>oh) { //横幅型 >1024px
        var height = Math.ceil(1024 / ow * oh); //向上取整
        return {width: 1024, height: height};
      }else{	//竖立型或正方形 >1000px
        var width = Math.ceil(1000 / oh * ow);
        return {width: width, height: 1000};
      }
    },
    // 图片转Base64
    handleGetBase64URL(file) {
      return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onload = () => {
          resolve(reader.result);
        }
      })
    },
    // 规格图片变化
    handleOnFormPicChange(file) {
      if (this.$checkFile(file.raw)) {
        this.handleGetBase64URL(file.raw).then(res => {
          var img = new Image();
          var quality = 1;//定义默认图片压缩后的质量（0~1）
          if ((file.raw.size / 1024 / 1024) > 0.5) {
            quality = 0.2;
          }
          img.src = res;
          img.onload =  () => {
            var oWidth = img.width;
            var oHeight = img.height;
            var Size = this.calcWH(oWidth, oHeight); //调整为合适的尺寸
            //开始进行转换到canvas再压缩操作
            var canvas = document.createElement("canvas");
            canvas.width = Size.width;	//设置画布的宽度
            canvas.height = Size.height;//设置画布的高度
            var ctx = canvas.getContext("2d");
            //ctx.drawImage(图像对象,画点起始Y,画点起始Y,画出宽度,画出高度)//画出宽度和高度决定了你复刻了多少像素，和是画布宽高度是两回事
            ctx.drawImage(img, 0, 0, Size.width, Size.height);
            this.formData.picture = canvas.toDataURL('image/jpeg', quality);//canvas转成新的base64数据，第二个参数为保存质量
            this.$forceUpdate();
          };
        })
      }
    },
    // 判断规格是否重复
    isExistData(arr, obj) {
      let data = Object.keys(obj).filter(item => item != "num" && item != "price" && item != "picture" && item != "memberPrice" && item != "createBy" && item != "createDate" && item != "filePictureStr" && item != "formatContext" && item != "productId" && item != "status");
      let obj_item = [], compare_item = [];

      for (let i = 0; i < data.length; i++) {
        if (data[i] == "id") {
          continue;
        }
        obj_item.push(obj[data[i]]);
      }
      obj_item = obj_item.join(",");

      for (let i = 0; i < arr.length; i++) {
        compare_item[i] = { 
          id: arr[i].id, 
          data: [] 
        };
        for (let j = 0; j < data.length; j++) {
          if (data[j] == "id") {
            continue;
          }
          compare_item[i]["data"].push(arr[i][data[j]]);
        }
        compare_item[i]["data"] = compare_item[i]["data"].join(",");
      }

      let exist_arr = compare_item.filter(item => item.data == obj_item);
      // 添加规格
      if (!data.includes("id") && exist_arr.length > 0) {
        return true;
      }
      // 编辑规格
      if (data.includes("id") && exist_arr.length > 0 && exist_arr.filter(item => item.id != obj.id).length > 0) {
        return true;
      }

      return false;
    },
    // 规格信息保存
    handleSubmitGgInfoForm() {
      this.$refs["ggInfoForm"].validate(valid => {
        if (valid) {
          this.showDialog = false;
          if (this.index !== "") {
            // 判断是否重复
            if (this.isExistData(this.ggTableForm.tableData, this.formData)) {
              this.$message({ type: "error", message: "规格重复, 请重新添加" });
              return false;
            }
            this.ggTableForm.tableData.splice(this.index, 1, {...this.formData});
          } else {
            // 判断是否重复
            if (this.isExistData(this.ggTableForm.tableData, this.formData)) {
              this.$message({ type: "error", message: "规格重复, 请重新添加" });
              return false;
            }
            this.ggTableForm.tableData.push({...this.formData});
          }
          this.formData = {};
          this.index = "";
        }
      })
    },
    // 保存商品
    handleSubmitForm() {
      this.$refs["GoodInfoForm"].validate(valid => {
        if (valid) {
          let formData = new FormData();
          if (this.id) {
            formData.append("id", this.id);
          }
          // 标记审核
          formData.append("examine", 1);
          // 商品名称
          formData.append("title", this.data.title);
          // 商品分类
          formData.append("categoryId", this.data.classifyId[this.data.classifyId.length - 1]);
          // 活动商品
          formData.append("isCampaign", this.data.isCampaign);
          // 热卖商品
          formData.append("isHot", this.data.isHot);
          // 商品图片
          if (typeof this.data.filePicture != "string") {
            formData.append("filePicture", this.data.filePicture);
          }
          // 规格
          formData.append("modelId", this.data.moudelId);
          // 发货地址
          formData.append("departure", this.data.departure);
          // 简介
          formData.append("dsc", this.data.dsc);
          // 详情
          formData.append("details", this.data.details.join(","));
          // 轮播图
          if (typeof this.data.filePic1 != "string") {
            formData.append("filePic1", this.data.filePic1);
          } else {
            formData.append("pic1", this.data.filePic1);
          }
          if (typeof this.data.filePic2 != "string" ) {
            formData.append("filePic2", this.data.filePic2);
          } else {
            formData.append("pic2", this.data.filePic2);
          }
          if (typeof this.data.filePic3 != "string") {
            formData.append("filePic3", this.data.filePic3);
          } else {
            formData.append("pic3", this.data.filePic3);
          }
          // 商品详情
          formData.append("content", encodeURIComponent(this.data.content));
          // 规格信息
          if (this.ggTableForm.tableData.length === 0) {
            this.$message({
              type: "error",
              message: '请添加规格'
            });
            return false;
          }
          let productFormat = [];
          let picNum = 0;
          this.ggTableForm.tableData.forEach((item, i) => {
            productFormat[i] = {};
            productFormat[i].Id = item.id ? item.id : '';
            productFormat[i].productId = this.id ? this.id : '';
            productFormat[i].price = parseFloat(item.price);
            productFormat[i].memberPrice = item.memberPrice;
            productFormat[i].num = item.num;
            if (item.picture && item.picture.indexOf(";base64,") != -1) {
              productFormat[i].filePictureStr = item.picture;
            } else if(item.picture && item.picture.indexOf("http") != -1) {
              productFormat[i].picture = item.picture;
            }
            productFormat[i].formatContext = [];
            this.ggColumn.forEach((cItem, j) => {
              productFormat[i].formatContext[j] = {};
              productFormat[i].formatContext[j].key = cItem;
              productFormat[i].formatContext[j].val = item[cItem];
            })
          })
          formData.append("productFormat", JSON.stringify(productFormat));
          // 最高价
          formData.append("maxPrice", _.maxBy(productFormat, item => item.price).price);
          // 最低价
          formData.append("minPrice", _.minBy(productFormat, item => item.price).price);
          this.isSubmit = true;
          addProduct(formData).then( res => {
            this.$message({
              type: "success",
              message: "保存成功"
            });
            this.isSubmit = false;
            this.$router.push({ path: '/marketManage/goodManage_view' });
          }).catch(() => {
            this.isSubmit = false;
          })
        }
      })
    },
    // 返回商品列表
    handleGoBack() {
      this.$router.push({ path: '/marketManage/goodManage_view' });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.el-form-item__label::before {
  display: none;
}
#add-goods-order {
  .add-goods-search {
    margin-top: 5px;
    margin-left: 15px;
    .el-main {
      padding: 0;
    }
    .el-main:nth-child(2) {
      margin-bottom: 10px;
    }
  }
  #ggInfoForm .el-dialog__body {
    max-height: 600px;
    overflow-y: auto;
  }
  .add-goods-form,
  .add-goods-template,
  .add-goods-template-value,
  .add-goods-upload {
    margin-left: 10px;
  }
  .add-goods-title {
    font-weight: bold;
    margin: 10px 0;
    text-indent: 10px;
  }
  .add-goods-small-title {
    font-weight: normal;
    color: #f00;
  }
  .el-input {
    width: 420px;
  }
  .add-goods-caption {
    width: 80px;
    color: #606266;
    font-size: 14px;
    line-height: 32px;
    font-weight: 700;
    display: inline-block;
    text-align: right;
  }
  .add-goods-table-uploader .el-upload {
    width: 100%;
  }
  .add-goods-uploader {
    position: relative;
  }
  .add-goods-uploader .el-upload,
  .add-goods-table-uploader .el-upload {
    cursor: pointer;
    overflow: hidden;
  }
  .add-goods-uploader .el-upload:hover,
  .add-goods-table-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .add-goods-uploader .add-goods-uploader-icon,
  .add-goods-table-uploader .add-goods-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 300px;
    height: 150px;
    line-height: 150px;
    background: #E8E8E8;
    text-align: center;
  }
  .add-goods-table-uploader .add-goods-uploader-icon {
    width: 100%;
    height: 64px;
    line-height: 64px;
    font-size: 18px;
  }
  .add-goods-uploader {
    position: relative;
    float: left;
    margin-top: 10px;
  }
  .add-goods-close {
    position: absolute;
    top: -5px;
    right: -5px;
    color: #fff;
    font-weight: 500;
    background: #f00;
    border-radius: 50%;
    padding: 2px;
    font-size: 1px;
  }
  .add-goods-uploader .add-goods-img,
  .add-goods-table-uploader .add-goods-img {
    width: 150px;
    height: 150px;
    display: block;
  }
  .add-goods-table-uploader .add-goods-img {
    width: 100%;
    height: 64px;
  }
  .add-goods-template-value {
    margin-top: 10px;
  }
  .template-input.el-input:not(.is-in-pagination) {
    width: 100%;
  }
  .add-goods-button {
    margin-top: 24px;
    margin-left: 20%;
  }
  .add-goods-template-value .el-form-item__content {
    margin-left: 0 !important;
  }
}
.mce-tinymce.mce-container {
  width: auto!important;
}
</style>