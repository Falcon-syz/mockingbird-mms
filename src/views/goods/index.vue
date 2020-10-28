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
        <el-input v-model="searchMap.name" placeholder="商品名称"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="searchMap.code" placeholder="商品编号"></el-input>
      </el-form-item>
      <el-form-item prop="optionSupplier">
        <el-input
          v-model="searchMap.optionSupplier"
          placeholder="选择供应商"
          readonly
          @click.native="optionSupplier"
        ></el-input>
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
      <el-table-column align="center" prop="name" label="商品名称" width="180px"></el-table-column>
      <el-table-column align="center" prop="code" label="商品编号" width="120px"></el-table-column>
      <el-table-column align="center" prop="spec" label="商品规格" width="120px"></el-table-column>
      <el-table-column align="center" prop="retailPrice" label="零售价" width="120px"></el-table-column>
      <el-table-column align="center" prop="purchasePrice" label="进货价" width="120px"></el-table-column>
      <el-table-column align="center" prop="storageNum" label="库存数量" width="120px"></el-table-column>
      <el-table-column align="center" prop="supplierName" label="供应商" width="300px"></el-table-column>

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

    <!-- 新增商品dialog -->
    <el-dialog title="商品信息" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        ref="pojoForm"
        :rules="rules"
        label-position="right"
        :model="form"
        style="width:400px; line-height:20px"
      >
        <el-form-item label="商品名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="商品编码" :label-width="formLabelWidth" prop="code">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item label="商品规格" :label-width="formLabelWidth" prop="spec">
          <el-input v-model="form.spec"></el-input>
        </el-form-item>
        <el-form-item label="零售价" :label-width="formLabelWidth" prop="retailPrice">
          <el-input v-model="form.retailPrice"></el-input>
        </el-form-item>
        <el-form-item label="进货价" :label-width="formLabelWidth" prop="purchasePrice">
          <el-input v-model="form.purchasePrice"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" :label-width="formLabelWidth" prop="storageNum">
          <el-input v-model="form.storageNum"></el-input>
        </el-form-item>
        <el-form-item label="供应商" :label-width="formLabelWidth" prop="supplierName">
          <el-input v-model="form.supplierName" readonly @click.native="pojoOptionSupplier"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="form.id==''? addGoods('pojoForm'): updataGoods('pojoForm')"
        >确 定</el-button>
      </div>
    </el-dialog>

    <!-- 选择供货商dialog -->
    <el-dialog title="选择供货商" :visible.sync="dialogOptionVisible" width="500px">
      <supplier :isDialog="true" @optionSupplier="options"></supplier>
    </el-dialog>
  </div>
</template>

<script>
import goods from "@/api/goods";
import Supplier from "@/views/supplier";

export default {
  data() {
    return {
      pojoOption: false,
      dialogOptionVisible: false,
      dialogFormVisible: false,
      formLabelWidth: "100px",
      form: {
        id: "",
        name: "",
        code: "",
        spec: "",
        retailPrice: "",
        purchasePrice: "",
        storageNum: "",
        supplierName: "",
        supplierID: ""
      },
      total: 0,
      tableData: [{}],
      currentPage: 1,
      pageSize: 10,
      searchMap: {
        id: "",
        name: "",
        code: "",
        optionSupplier: ""
      },
      rules: {
        name: [{ required: true, message: "商品名不能为空", trigger: "blur" }],
        code: [{ required: true, message: "编码不能为空", trigger: "blur" }],
        retailPrice: [
          { required: true, message: "零售价不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    //pojo选择供应商
    pojoOptionSupplier() {
      this.pojoOption = true;
      this.dialogOptionVisible = true;
    },
    //回传供应商name
    options(val) {
      if (this.pojoOption) {
        this.form.supplierName = val.name;
        this.form.supplierID = val.id;
      } else {
        this.searchMap.optionSupplier = val.name;
        this.searchMap.id = val.id;
      }
      this.pojoOption = false;
      this.dialogOptionVisible = false;
    },
    //选择供应商
    optionSupplier() {
      this.dialogOptionVisible = true;
    },
    //编辑提交
    updataGoods(pojo) {
      this.$refs[pojo].validate(valid => {
        if (valid) {
          goods.updataGoods(this.form).then(response => {
            const resp = response.data;
            console.log(resp);
            if (resp.flag) {
              this.$message({
                message: "编辑商品成功",
                type: "success"
              });
              this.fetchData();
            } else {
              this.$maeeage({
                message: "编辑商品失败",
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
    addGoods(pojoForm) {
      this.$refs[pojoForm].validate(valid => {
        if (valid) {
          goods.addGoods(this.form).then(response => {
            const resp = response.data;
            this.fetchData();
            if (resp.flag) {
              this.$message({
                message: "新增商品成功",
                type: "success"
              });
            } else {
              this.$message({
                message: "新增商品失败",
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
      goods
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
          console.log("获取商品数据成功", resp.data);
          if (resp.flag) {
            this.tableData = resp.data.rows;
            this.total = resp.data.total;
          } else {
            this.$message({
              message: "获取商品数据失败",
              type: "error"
            });
          }
        });
    },
    //打开编辑
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      goods.getGoods(row.id).then(response => {
        const resp = response.data;
        console.log(resp);
        if (resp.flag) {
          this.form = resp.data;
        } else {
          this.$message({
            message: "获取商品数据失败",
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
          goods.deleteGoods(row.id).then(response => {
            const resp = response.data;
            if (resp.flag) {
              this.fetchData();
              this.$message({
                message: "删除商品成功",
                type: "success"
              });
            } else {
              this.$message({
                message: "删除商品失败",
                type: "error"
              });
            }
          });
        })
        .catch(() => {});
    }
  },
  components: {
    Supplier
  }
  //   watch: {
  //     form: {
  //       handler: function(val, oldVal) {
  //        console.log(val)
  //       },
  //       deep: true
  //     }
  //   }
};
</script>