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
      <el-form-item prop="username">
        <el-input v-model="searchMap.username" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAdd('pojoForm')">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('searchForm')">重置</el-button>
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
    >
      <el-table-column align="center" type="index" label="序号" width="50px"></el-table-column>
      <el-table-column align="center" prop="username" label="账号" width="150px"></el-table-column>
      <el-table-column align="center" prop="name" label="姓名" width="120px"></el-table-column>
      <el-table-column align="center" prop="age" label="年龄" width="120px"></el-table-column>
      <el-table-column align="center" prop="mobile" label="电话" width="280px"></el-table-column>
      <el-table-column align="center" prop="salary" label="薪酬" width="150px"></el-table-column>
      <el-table-column align="center" prop="entryDate" label="入职时间" width="150px"></el-table-column>
      <el-table-column align="center" label="操作">
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
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="height:10px; margin-top:5px"
      align="left"
    ></el-pagination>

    <!-- 新增供货商dialog -->
    <el-dialog title="员工信息" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        ref="pojoForm"
        :rules="rules"
        label-position="right"
        :model="form"
        style="width:400px; line-height:20px"
      >
        <el-form-item label="账号" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="年龄" :label-width="formLabelWidth" prop="age">
          <el-input v-model="form.age"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item label="薪酬" :label-width="formLabelWidth" prop="salary">
          <el-input v-model="form.salary"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" :label-width="formLabelWidth" prop="entryDate">
          <el-input v-model="form.entryDate"></el-input>
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
import staff from "@/api/staff";

export default {
  data() {
    return {
      dialogFormVisible: false,
      formLabelWidth: "100px",
      form: {
        id: "",
        username: "",
        name: "",
        mobile: "",
        salary: "",
        age: "",
        entryDate: ""
      },
      total: 0,
      tableData: [{}],
      currentPage: 1,
      pageSize: 10,
      searchMap: {
        username: "",
        name: ""
      },
      rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        mobile: [
          { required: true, message: "联系方式不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    //编辑提交
    updateMember(pojo) {
      this.$refs[pojo].validate(valid => {
        if (valid) {
          staff.updataStaff(this.form).then(response => {
            const resp = response.data;
            console.log(resp);
            if (resp.flag) {
              this.$message({
                message: resp.message,
                type: "success"
              });
              this.fetchData();
            } else {
              this.$maeeage({
                message: resp.message,
                type: "error"
              });
            }
          });
          this.dialogFormVisible = false;
        }
      });
    },
    //新增提交
    addMember(pojoForm) {
      this.$refs[pojoForm].validate(valid => {
        if (valid) {
          staff.addStaff(this.form).then(response => {
            const resp = response.data;
            this.fetchData();
            if (resp.flag) {
              this.$message({
                message: resp.message,
                type: "success"
              });
            } else {
              this.$message({
                message: resp.message,
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
      staff
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
          console.log("获取员工数据成功", resp.data);
          if (resp.flag) {
            this.tableData = resp.data.rows;
            this.total = resp.data.total;
          } else {
            this.$message({
              message: "获取员工数据失败",
              type: "error"
            });
          }
        });
    },
    //打开编辑
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      staff.getStaff(row.id).then(response => {
        const resp = response.data;
        console.log(resp);
        if (resp.flag) {
          this.form = resp.data;
        } else {
          this.$message({
            message: "获取员工数据失败",
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
          staff.deleteStaff(row.id).then(response => {
            const resp = response.data;
            if (resp.flag) {
              this.fetchData();
              this.$message({
                message: resp.message,
                type: "success"
              });
            } else {
              this.$message({
                message: "删除员工失败",
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