<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <app-header></app-header>
    </el-header>

    <el-container>
      <!-- 导航 -->
      <app-nav></app-nav>
      <!-- 主区域 -->
      <app-main></app-main>
    </el-container>
  </el-container>
</template>  

<script>
import appHeader from "@/components/app-header";
import appNav from "@/components/app-nav";
import appMain from "@/components/app-main";
export default {
  components: {
    appHeader,
    appNav,
    appMain
  }
};
</script>




<style scoped>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
  padding: 0
}

.el-aside {
  background-color:rgb(84, 92, 100);
  color: #333;
  text-align: center;
  line-height: 200px;
  height:661px
}


.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

</style>