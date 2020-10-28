<template>
  <div id="header">
    <a href="javascript:;">
      <img src="@/assets/icon.png" style="width:45px" class="icon" />
      <span class="title">Mockingbird会员管理系统</span>
    </a>

    <!-- 头像 -->
    <div @click="changeHead">
      <el-avatar shape="square" :size="40" :src="url"></el-avatar>
    </div>

    <!-- 下拉列表 -->
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        {{user.name}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a">
          <i class="el-icon-edit"></i>修改密码
        </el-dropdown-item>
        <el-dropdown-item command="b">
          <i class="el-icon-s-fold"></i>退出系统
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        ref="pojoForm"
        :rules="rules"
        label-position="right"
        :model="form"
        style="width:400px; line-height:20px"
      >
        <el-form-item label="原密码" :label-width="formLabelWidth" prop="oldPwd">
          <el-input v-model="form.oldPwd"></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPwd">
          <el-input v-model="form.newPwd"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth" prop="confirmPwd">
          <el-input v-model="form.confirmPwd"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="restForm">重 置</el-button>
        <el-button type="primary" @click="revisePwd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import randomHead from "@/api/randomHead";
import { logout } from "@/api/login";
import password from "@/api/revisePwd";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("原密码不能为空"));
      } else {
        const userId = JSON.parse(localStorage.getItem("mocking-user"));
        password.checkPwd(userId, value).then(response => {
          const resp = response.data;
          console.log(resp);
          if (resp.flag) {
            callback();
          } else {
            callback(new Error("密码不正确"));
          }
        });
      }
    };

    var confirmPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请确认密码"));
      } else {
        if (this.form.newPwd == this.form.confirmPwd) {
          callback();
        } else {
          callback(new Error("两次输入密码不一致"));
        }
      }
    };

    return {
      formLabelWidth: "100px",
      form: {
        oldPwd: "",
        newPwd: "",
        confirmPwd: ""
      },
      rules: {
        oldPwd: [
          { required: true, message: "原密码不能为空", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ],
        newPwd: [
          { required: true, message: "新密码不能为空", trigger: "blur" }
        ],
        confirmPwd: [
          { required: true, message: "请确认密码", trigger: "blur" },
          { validator: confirmPass, trigger: "change" }
        ]
      },
      dialogFormVisible: false,
      user: null,
      url:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
    };
  },
  created() {
    var userMsg = localStorage.getItem("mocking-user");
    console.log(userMsg);
    console.log(JSON.parse(userMsg));
    this.user = JSON.parse(userMsg);
  },
  methods: {
    //重置表单
    restForm(){
      this.$refs["pojoForm"].resetFields()
    },
    //修改密码
    revisePwd() {
      this.$refs["pojoForm"].validate(valid => {
        if (valid) {
          const userId = JSON.parse(localStorage.getItem("mocking-user"));
          password.changePwd(userId, this.form.newPwd).then(response => {
            const resp = response.data;
            console.log(resp);
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
          this.userLogout();
        } else {
          return false;
        }
      });
    },

    changeHead() {
      //随机头像
      console.log("换不了");
    },

    handleCommand(command) {
      switch (command) {
        case "a":
          //修改密码
          // this.$message("click on item " + command);
          this.dialogFormVisible = true;
          this.$nextTick(() => {
            this.$refs["pojoForm"].resetFields();
          });
          break;
        case "b":
          //退出登录
          this.userLogout();
          break;

        default:
          break;
      }
    },

    //退出登录
    userLogout() {
      //退出登录
      // console.log(localStorage.getItem("mocking-user-token"))
      logout(localStorage.getItem("mocking-user-token")).then(resp => {
        console.log(resp);
        if (resp.data.flag) {
          localStorage.removeItem("mocking-user-token");
          localStorage.removeItem("mocking-user");
          this.$router.push("/");
        } else {
          this.$message({
            message: "退出失败",
            type: "warning"
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.el-avatar {
  position: absolute;
  right: 120px;
  top: 9px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #ffffff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.el-dropdown {
  position: absolute;
  right: 40px;
}

#header {
  width: 100%;
  height: 60px;
  background-color: rgb(45, 58, 75);
}
a {
  position: absolute;
  left: 30px;
  top: 0px;
  text-decoration: none;
  color: aliceblue;
  width: 300px;
  height: 60px;
  margin: 0;
  padding: 0;
  display: inline-block;
  line-height: 60px;
}
.icon {
  position: absolute;
  display: inline-block;
  top: 5px;
  left: 5px;
}
.title {
  color: rgb(84, 152, 205);
  font-family: "微软雅黑";
  font-weight: bold;
}
</style>
    