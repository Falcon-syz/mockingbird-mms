<template>
  <el-main class="main">
    <div class="card" v-show="$route.name!='homePage'"><label>{{$route.meta.title}}</label></div>
    <router-view></router-view>
  </el-main>
</template>

<style scoped>
.card {
  width: 98%;
  height: 50px;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.2);
  line-height: 50px;
  margin-top: 0;
  text-align: left;
  padding-left: 20px;
}
.card>label{
    border-left:   3px solid  cornflowerblue;
    padding-left: 8px;
    font-size: 14px
}
.el-main{
    padding: 10px
}
</style>