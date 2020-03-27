
<template>
  <div class="main-content">
    <!-- 操作 -->
    <div style="margin-bottom:10px;">
      <el-button type="primary" icon="el-icon-plus" @click="handleOpenDialog">录入</el-button>
    </div>
    <!-- table -->
    <el-table :data="tableData">
      <el-table-column type="index" label="序号" width="100px"></el-table-column>

      <el-table-column prop="modelName" label="规格模板"></el-table-column>

      <el-table-column label="规格">
        <template slot-scope="scope">
          <el-tag type="info" v-for="(item, i) in JSON.parse(scope.row.modelContext)" :key="i" style="margin:0 5px 5px 0;">{{ item }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button class="table_operate" @click="handleOpenEditDialog(scope.row.id)" type="primary">编辑</el-button>
          <el-button class="table_operate" @click="handleDeleteTemplate(scope.row)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 规格模板录入 -->
    <el-dialog title="规格模板设置" :visible.sync="showDialog" width="500px" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="templateForm" ref="templateForm" label-width="100px">
        <el-form-item label="规格模板：" prop="name" :rules="{ required: true, message: '请输入规格模板名称', trigger: 'blur'}">
          <el-input v-model.trim="templateForm.name" maxlength="10"></el-input>
        </el-form-item>

        <el-form-item v-for="(item, index) in templateForm.template" :label="'规格' + (index + 1) + '：'" :key="index" :prop="'template.' + index + '.value'" :rules="[{required: true, message: '所添加的规格不能为空', trigger: 'blur'},{validator: isRepeat.bind(this), trigger: 'change'}]">
          <el-input v-model.trim="item.value" maxlength="10" style="width:75%;"></el-input>
          <el-button type="small" v-if="templateForm.template.length > 1" @click.prevent="handleRemoveTempItem(item)" style="margin-left:10px;">删除</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleAddTempItem">添加规格</el-button>
          <el-button type="danger" @click="handleResetTempForm('templateForm')">重置</el-button>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" :disabled="isSubmit ? true : false" @click="handleSubmitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getProductModelList, getProductModel, saveProductModel, deleteProductModel } from "@/api/marketCommodity";

export default {
  created() {
    this.handleGetTableData();
  },
  data() {
    return {
      tableData: [],
      isSubmit: false,
      showDialog: false,
      templateForm: {
        name: "",
        template: [{ value: "" }],
        status: "",
        id: ""
      }
    };
  },
  methods: {
    // 重复规则判断
    isRepeat (rule, value, callback) {
      let l = rule["field"].split(".");
      for (let i = 0; i < l[1]; i++) {
        if (this.templateForm.template[i]["value"] == value) {
          callback(new Error("规格重复"));
          return false;
        }
      }
      callback();
    },
    // 获取规格模板列表
    handleGetTableData() {
      getProductModelList({}).then(res => {
        this.tableData = res.tableData;
      });
    },
    // 添加模板
    handleOpenDialog() {
      this.showDialog = true;
      this.templateForm = {
        name: "",
        template: [{ value: "" }],
        status: "new",
        id: ""
      };
      setTimeout(() => {
        this.$refs.templateForm.clearValidate();
      }, 100);
    },
    // 编辑
    handleOpenEditDialog(id) {
      setTimeout(() => {
        this.$refs.templateForm.clearValidate();
      }, 100);
      getProductModel({ id: id }).then(res => {
        this.showDialog = true; // 打开对话框
        this.templateForm = {
          name: res.tableData.modelName,
          template: [],
          status: "edit",
          id: res.tableData.id
        };
        JSON.parse(res.tableData.modelContext).forEach(item => {
          this.templateForm.template.push({
            value: item
          });
        });
      });
    },
    // 新增/编辑产品模板规格
    handleSubmitForm() {
      this.$refs.templateForm.validate(valid => {
        if (valid) {
          let templateArray = [];
          this.templateForm.template.forEach(item => {
            templateArray.push(item.value);
          });
          let option = {
            modelName: this.templateForm.name,
            modelContext: JSON.stringify(templateArray)
          };
          if (this.templateForm.id) {
            option.id = this.templateForm.id;
          }
          this.isSubmit = true;
          saveProductModel(option).then(res => {
            this.isSubmit = false;
            this.showDialog = false;
            this.handleGetTableData();
            this.$message.success("保存成功");
          }).catch(() => {
            this.isSubmit = false;
          })
        }
      });
    },
    // 新增/编辑对话框--新增规格
    handleAddTempItem() {
      this.$refs["templateForm"].validateField([`template.${this.templateForm.template.length - 1}.value`], valid => {
        if (valid === "") {
          this.templateForm.template.push({
            value: ""
          });
        }
      })
    },
    // 新增/编辑对话框--删除某个规格
    handleRemoveTempItem(item) {
      let i = this.templateForm.template.indexOf(item);
      if (i !== -1) {
        this.templateForm.template.splice(i, 1);
      }
    },
    // 新增/编辑对话框--重置规格
    handleResetTempForm(el) {
      this.$refs[el].resetFields();
    },
    // 删除模板
    handleDeleteTemplate(row) {
      this.$confirm(`确定删除<span style="color:#F56C6C;">${row.modelName}</span>的规格信息吗?`, "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteProductModel({ id: row.id }).then(res => {
          this.$message.success("删除成功");
          this.handleGetTableData();
        });
      }).catch(() => {});
    }
  }
};
</script>