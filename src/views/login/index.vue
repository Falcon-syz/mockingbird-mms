<template>
  <div id="form">
    <div id="icon"></div>
    <el-form ref="form" :rules="rules" :model="form" label-width="80px" class="loginForm">
      <h3>Mockingbird会员管理系统</h3>
      <el-form-item prop="username">
        <el-input v-model="form.username" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="pwd">
        <el-input v-model="form.pwd" type="password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')" class="subBtn">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login, getUser } from "@/api/login";
export default {
  data() {
    return {
      form: {
        username: "",
        pwd: ""
      },
      rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        pwd: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(form) {
      //判断输入为空不允许提交
      this.$refs[form].validate(valid => {
        if (valid) {
          login(this.form.username, this.form.pwd).then(resp => {
            console.log(resp.data);
            if (resp.data.flag) {
              //登陆验证成功
              //根据返回的token请求用户信息
              getUser(resp.data.data.token).then(respUser => {
                console.log(respUser);
                if (respUser.data.flag) {
                  //获取成功将用户信息存入本地
                  localStorage.setItem(
                    "mocking-user",
                    JSON.stringify(respUser.data.data)
                  );
                  localStorage.setItem(
                    "mocking-user-token",
                    resp.data.data.token
                  );
                  //跳转到首页
                  this.$router.push("/home");
                } else {
                  this.$message({
                    message: "获取用户信息失败",
                    type: "warning"
                  });
                }
              });
            } else {
              //登陆验证失败
              this.$message({
                message: "登陆验证失败",
                type: "warning"
              });
            }
          });
        } else {
          this.$message({
            message: "账号或密码不能为空！",
            type: "warning"
          });
          return false;
        }
      });
    }
  },
  beforeCreate() {
    document
      .querySelector("html")
      .setAttribute("style", "background-color:rgb(245,245,245)");
  },
  beforeDestroy() {
    document.querySelector("html").removeAttribute("style");
  }
};
</script>

<style scoped>
#form {
  width: 100%;
  height: 100%;
  position: relative;
}
.loginForm {
  width: 400px;
  text-align: center;
  padding-right: 80px;
  margin: 200px auto;
}

.subBtn {
  width: 100%;
}
h3 {
  margin-left: 75px;
  color: rgb(84, 152, 205);
  margin-bottom: 30px;
}
#icon {
  width: 128px;
  height: 128px;
  background-image: url("../../assets/icon.png");
  position: absolute;
  top: -40%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>