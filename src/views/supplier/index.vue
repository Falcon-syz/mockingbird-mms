<template>
  <div>
    <!-- 查询表单 -->
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      style="line-height:10px;padding-top:20px"
      align="left"
    >
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="供应商"></el-input>
      </el-form-item>
      <el-form-item prop="linkman">
        <el-input v-model="searchMap.linkman" placeholder="联系人" v-if="!isDialog"></el-input>
      </el-form-item>
      <el-form-item prop="mobile">
        <el-input v-model="searchMap.mobile" placeholder="联系电话" v-if="!isDialog"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAdd('pojoForm')" v-if="!isDialog">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('searchForm')" v-if="!isDialog">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      size="medium"
      height="390"
      stripe
      border
      style="width: 100% ;line-height:20px; border:1px solid rgba(0,0,0,0.1)"
      :highlight-current-row="isDialog"
      @current-change="handleSupplierChange"
    >
      <el-table-column align="center" type="index" label="序号" width="50px"></el-table-column>
      <el-table-column align="center" prop="name" label="供应商名称" width="250px"></el-table-column>
      <el-table-column align="center" prop="linkman" label="联系人" width="150px"></el-table-column>
      <el-table-column align="center" prop="mobile" label="联系电话" width="200px" v-if="!isDialog"></el-table-column>
      <el-table-column align="center" prop="remark" label="备注" width="380px" v-if="!isDialog"></el-table-column>
      <el-table-column align="center" label="操作" v-if="!isDialog">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10,20,50]"
      :page-size="pageSize"
      :layout="!isDialog?'total, sizes, prev, pager, next, jumper':'prev, pager, next'"
      :total="total"
      style="height:10px; margin-top:5px"
      align="left"
    ></el-pagination>

    <!-- 新增供货商dialog -->
    <el-dialog title="供货商信息" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        ref="pojoForm"
        :rules="rules"
        label-position="right"
        :model="form"
        style="width:400px; line-height:20px"
      >
        <el-form-item label="供应商名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="联系人" :label-width="formLabelWidth" prop="linkman">
          <el-input v-model="form.linkman"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="form.id==''? addMember('pojoForm'): updateMember('pojoForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import supplier from "@/api/supplier";

export default {
  props: {
    isDialog: Boolean
  },
  data() {
    return {
      dialogFormVisible: false,
      formLabelWidth: "100px",
      form: {
        id: "",
        name: "",
        mobile: "",
        linkman: "",
        remark: ""
      },
      total: 0,
      tableData: [{}],
      currentPage: 1,
      pageSize: 10,
      searchMap: {
        name: "",
        linkman: "",
        mobile: ""
      },
      rules: {
        name: [{ required: true, message: "供应商不能为空", trigger: "blur" }],
        linkman: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    //选中供应商
    handleSupplierChange(val) {
      console.log(val);
      this.$emit('optionSupplier',val)
    },
    //编辑提交
    updateMember(pojo) {
      this.$refs[pojo].validate(valid => {
        if (valid) {
          supplier.updataSupplier(this.form).then(response => {
            const resp = response.data;
            console.log(resp);
            if (resp.flag) {
              this.$message({
                message: "编辑成功",
                type: "success"
              });
              this.fetchData();
            } else {
              this.$maeeage({
                message: "编辑失败",
                type: "error"
              });
            }
          });
          this.form.id = "";
          this.dialogFormVisible = false;
        }
      });
    },
    //新增提交
    addMember(pojoForm) {
      this.$refs[pojoForm].validate(valid => {
        if (valid) {
          supplier.addSupplier(this.form).then(response => {
            const resp = response.data;
            this.fetchData();
            if (resp.flag) {
              this.$message({
                message: "新增成功",
                type: "success"
              });
            } else {
              this.$message({
                message: "新增失败",
                type: "error"
              });
            }
          });
          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    },
    //新增打开pojo
    handleAdd(pojoForm) {
      this.form.id = "";
      this.dialogFormVisible = true;
      //异步重置
      this.$nextTick(() => {
        this.$refs[pojoForm].resetFields();
      });
    },
    //重置search
    resetForm(searchForm) {
      this.$refs[searchForm].resetFields();
    },
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    //获取数据
    fetchData() {
      supplier
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
          console.log("获取供应商数据成功", resp.data);
          if (resp.flag) {
            this.tableData = resp.data.rows;
            this.total = resp.data.total;
          } else {
            this.$message({
              message: "获取数据失败",
              type: "error"
            });
          }
        });
    },
    //打开编辑
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      supplier.getSupplier(row.id).then(response => {
        const resp = response.data;
        console.log(resp);
        if (resp.flag) {
          this.form = resp.data;
        } else {
          this.$message({
            message: "获取数据失败",
            type: "error"
          });
        }
      });
    },
    //删除
    handleDelete(index, row) {
      this.$confirm("将删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          supplier.deleteSupplier(row.id).then(response => {
            const resp = response.data;
            if (resp.flag) {
              this.fetchData();
              this.$message({
                message: resp.message,
                type: "success"
              });
            } else {
              this.$message({
                message: "删除失败",
                type: "error"
              });
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>