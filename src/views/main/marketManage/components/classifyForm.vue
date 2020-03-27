<template>
  <el-form :model="formData" ref="productForm" :rules="formRules" class="product-form" label-width="120px">
    <el-form-item label="名称：" prop="title">
      <el-input v-model.trim="formData.title" placeholder="请输入分类名称" maxlength="20"></el-input>
    </el-form-item>

    <el-form-item label="父节点：">
      <treeselect v-model="formData.parentId" :disabled="this.id ? true : false" :load-options="handleLoadNextLevel" @select="handleOpenNode" noOptionsText="未查询到商品分类" noChildrenText="未查询到子商品分类" noResultsText="未查询到商品分类" placeholder="请选择商品分类" :options="nodeOptions" />
    </el-form-item>

    <el-form-item label="分类图片：">
      <el-upload action :show-file-list="false" :on-change="handleFileChange" :auto-upload="false">
        <img v-if="formData.picture" :src="typeof formData.picture == 'string' ? formData.picture : URL.createObjectURL(formData.picture)" width="220" />
        <i v-else class="el-icon-plus"></i>
      </el-upload>
    </el-form-item>

    <el-form-item label="优先级：" prop="priority" required>
      <el-input v-model.trim="formData.priority" maxlength="5"></el-input>
    </el-form-item>

    <el-form-item label="是否有子节点：" prop="hasChild" required>
      <el-radio-group v-model="formData.hasChild" :disabled="id ? true : (formData.parentLevel && formData.parentLevel  > 2 ? true : false)">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>
<script>
import { getProductList, getProduct, saveProduct, findProductName } from "@/api/marketCommodity";
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { isValidInteger } from "@/utils/validate";

export default {
  props: ["id"],
  components: { Treeselect },
  data() {
    const validInteger = (rule, value, callback) => {
      if (isValidInteger(value)) {
        callback();
      } else {
        callback(new Error("请输入大于0的整数"));
      }
    };
    const checkTitle = (rule, value, callback) => {
      // 根据名字和父级id判断是否名称已存在
      findProductName({ id: this.formData.id, parentId: this.formData.parentId, produceClass: value }).then(res => {
        callback();
      });
    };
    return {
      URL: URL,
      formData: {
        hasChild: 0,
        // hasDiscount: 0
      },
      formRules: {
        title: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { validator: checkTitle.bind(this), trigger: "blur" }
        ],
        priority: [
          { validator: validInteger, trigger: "change" },
          { validator: validInteger, trigger: "blur" },
        ]
      },
      nodeOptions: [],
    }
  },
  created() {
    this.handleGetNodeOption();
    if (this.id) {
      this.handleGetProduct();
    }
  },
  methods: {
    handleGetNodeOption() {
      getProductList({}).then(res => {
        res.tableData.forEach(item => {
          item.label = item.title;
          item.level = 1;
          item.isDisabled = item.hasChild ? false : true;
          if (item.hasChild && item.childCount) {
            item.hasChildren = true;
            item.children = null;
          }
        });
        this.nodeOptions = res.tableData
      });
    },
    // 懒加载下拉树形
    handleLoadNextLevel({ action, parentNode, callback }) {
      if (parentNode.level < 2) {
        getProductList({ parentId: parentNode.id }).then(res => {
          res.tableData.forEach(citem => {
            citem.label = citem.title;
            citem.level = parentNode.level + 1;
          });
          this.nodeOptions.forEach(item => {
            if (item.id === parentNode.id) {
              parentNode.children = res.tableData;
            }
          });
          callback();
        });
      }
    },
    handleGetProduct() {
      getProduct({ id: this.id }).then(res => {
        res.tableData.parentId = res.tableData.parentId ? res.tableData.parentId : null;
        this.formData = res.tableData;
      });
    },
    handleFileChange(file) {
      if (this.$checkFile(file.raw)) {
        this.$bus.emit('send-file', { file: file.raw,  ratio: 1/1 });
        this.$bus.once('set-file', val => {
          this.formData.picture = val;
          this.$forceUpdate();
        });
      }
    },
    // 选择节点
    handleOpenNode(node) {
      this.formData.parentLevel = node.level;
    },
    // 保存商品分类
    handleSubmitForm() {
      this.$refs.productForm.validate(valid => {
        if (valid) {
          let formData = new FormData();
          formData.append("title", this.formData.title);
          formData.append("hasChild", this.formData.hasChild);
          // formData.append("hasDiscount", this.formData.hasDiscount);
          if (this.formData.parentId) {
            formData.append("parentId", this.formData.parentId);
          }
          if (this.formData.picture && typeof this.formData.picture != "string") {
            formData.append("filePicture", this.formData.picture);
          }
          // 优先级
          if (this.formData.priority === 0 || this.formData.priority) {
            formData.append("priority", this.formData.priority);
          }
          if (this.id) {
            formData.append("id", this.id);
          }
          this.$parent.$parent.isSubmit = true;
          saveProduct(formData).then(res => {
            this.$message({
              type: "success",
              message: "保存成功"
            });
            this.$parent.$parent.isSubmit = false;
            this.$parent.$parent.showDialog = false;
            this.$parent.$parent.handleGetTableData();
          }).catch(() => {
            this.$parent.$parent.isSubmit = false;
          });
        }
      });
    },
  }
}
</script>
<style lang="scss" scoped>
.product-form {
  .el-input, .vue-treeselect {
    width: 70%;
  }
  .el-upload i {
    width: 220px;
    height: 130px;
    font-size: 28px;
    color: #8c939d;
    line-height: 130px;
    background: #E8E8E8;
    text-align: center;
  }
}
</style>