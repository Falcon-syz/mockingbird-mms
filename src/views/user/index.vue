<template>
  <div id="memberDiv">
    <!-- 查询表单 -->
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      style="line-height:10px;padding-top:20px"
      align="left"
    >
      <el-form-item prop="cardNum">
        <el-input v-model="searchMap.cardNum" placeholder="会员卡号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="会员姓名"></el-input>
      </el-form-item>
      <el-form-item prop="payType">
        <el-select v-model="searchMap.payType" placeholder="支付类型">
          <el-option
            v-for="item in payTypeOption"
            :key="item.type"
            :label="item.name"
            :value="item.type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="birthday">
        <el-date-picker
          type="date"
          placeholder="出生日期"
          v-model="searchMap.birthday"
          value-format="yyyy-MM-dd"
          style="width: 100%;"
        ></el-date-picker>
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
      <el-table-column align="center" prop="cardNum" label="会员卡号" width="160px"></el-table-column>
      <el-table-column align="center" prop="name" label="会员姓名" width="80px"></el-table-column>
      <el-table-column align="center" prop="birthday" label="会员生日" width="120px"></el-table-column>
      <el-table-column align="center" prop="phone" label="手机号码" width="140px"></el-table-column>
      <el-table-column align="center" prop="integral" label="可用积分" width="100px"></el-table-column>
      <el-table-column align="center" prop="money" label="开卡金额" width="100px"></el-table-column>
      <el-table-column align="center" prop="payType" label="支付类型" width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.payType| payTypeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="address" label="会员地址" width="300px"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="address" label="地址"></el-table-column> -->
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
    <!-- 新增会员dialog -->
    <el-dialog title="会员信息" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        ref="pojoForm"
        :rules="rules"
        label-position="right"
        :model="form"
        style="width:400px; line-height:20px"
      >
        <el-form-item label="会员卡号" :label-width="formLabelWidth" prop="cardNum">
          <el-input v-model="form.cardNum"></el-input>
        </el-form-item>
        <el-form-item label="会员姓名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="会员生日" :label-width="formLabelWidth" prop="birthday">
          <el-date-picker
            type="date"
            placeholder="出生日期"
            v-model="form.birthday"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码" :label-width="formLabelWidth" prop="telNum">
          <el-input v-model="form.telNum"></el-input>
        </el-form-item>
        <el-form-item label="开卡金额" :label-width="formLabelWidth" prop="money">
          <el-input v-model="form.money"></el-input>
        </el-form-item>
        <el-form-item label="可用积分" :label-width="formLabelWidth" prop="integral">
          <el-input v-model="form.integral"></el-input>
        </el-form-item>

        <el-form-item label="支付类型" :label-width="formLabelWidth" style="width:280px" prop="payType">
          <el-select v-model="form.payType" placeholder="支付类型">
            <el-option
              v-for="item in payTypeOption"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员地址" :label-width="formLabelWidth" prop="address">
          <el-input type="textarea" v-model="form.address"></el-input>
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
import member from "@/api/member";

const payTypeOption = [
  {
    type: "1",
    name: "微信"
  },
  {
    type: "2",
    name: "支付宝"
  },
  {
    type: "3",
    name: "银行卡"
  },
  {
    type: "4",
    name: "现金"
  }
];

export default {
  data() {
    return {
      tableData: [{}],
      total: 0, //总记录数
      currentPage: 1, //当前页码
      pageSize: 10, //每页显示十条数据
      searchMap: {
        //条件查询绑定的条件值
        cardNum: "",
        name: "",
        payType: "",
        birthday: ""
      },
      payTypeOption,
      formLabelWidth: "100px",
      dialogFormVisible: false,
      form: {
        id: "",
        cardNum: "",
        name: "",
        birthday: "",
        telNum: "",
        money: "",
        integral: "",
        payType: "",
        address: ""
      },
      //校验规则
      rules: {
        cardNum: [{ required: true, message: "卡号不能为空", trigger: "blur" }],
        telNum: [
          { required: true, message: "手机号不能为空", trigger: "blur" }
        ],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        payType: [
          { required: true, message: "支付类型不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    //更新数据
    updateMember(pojo) {
      this.$refs[pojo].validate(valid => {
        if (valid) {
          member.updateMember(this.form).then(response => {
            const resp = response.data;
            console.log(resp);
            this.form.id = "";
            this.dialogFormVisible = false;
            if (resp.flag) {
              this.fetchData();
              this.$message({
                message: "修改成功",
                type: "success"
              });
            } else {
              this.$message({
                message: "修改失败",
                type: "error"
              });
            }
          });
        }
        console.log(this.form.id, "formid");
      });
    },
    //打开新增
    handleAdd(pojo) {
      this.form = {
        id: "",
        cardNum: "",
        name: "",
        birthday: "",
        telNum: "",
        money: "",
        integral: "",
        payType: "",
        address: ""
      };
      // this.$nextTick(() => {
      //   this.$refs[pojo].resetFields();
      //   console.log("pojo已重置");
      // });
      //重置时表单还没creat，调用异步方法nextTick
      this.dialogFormVisible = true;
    },
    //新增提交
    addMember(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          member.addMeb(this.form).then(response => {
            const resp = response.data;
            this.fetchData();
            this.dialogFormVisible = false;
            console.log(resp);
            if (resp.flag) {
              this.$message({
                message: "新增会员成功",
                type: "success"
              });
            } else {
              this.$message({
                message: "新增会员失败",
                type: "error"
              });
            }
          });
        }
      });
    },
    //获取数据
    fetchData() {
      member
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
          console.log(resp);
          this.total = resp.data.total;
          this.tableData = resp.data.rows;
        });
    },
    //编辑操作
    handleEdit(index, row) {
      console.log(index, row);
      member.getMember(row.id).then(response => {
        const resp = response.data;
        console.log(resp);
        if (resp.flag) {
          this.dialogFormVisible = true;
          this.form = resp.data;
        } else {
          this.$message({
            message: "获取数据失败",
            type: "error"
          });
        }
      });
    },
    //删除操作
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm("将删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          member.deleteMember(row.id).then(response => {
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
    },
    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.fetchData();
    },
    //重置搜索表单
    resetForm(formName) {
      console.log("重置", formName);
      //el-form-item上指定了prop属性重置才能生效
      this.$refs[formName].resetFields();
    }
  },
  filters: {
    payTypeFilter(type) {
      const payObj = payTypeOption.find(item => item.type == type);
      return payObj ? payObj.name : null;
    }
  }
};
</script>
<style scoped>
#memberDiv {
  overflow: hidden;
  height: 510px;
}
</style>
