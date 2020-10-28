<template>
  <el-aside width="200px">
    <el-menu
      default-active="/home"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :router='true'
    >
      <el-menu-item index="/home">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/home/user">
        <i class="el-icon-user-solid"></i>
        <span slot="title">会员管理</span>
      </el-menu-item>
      <el-menu-item index="/home/supplier">
        <i class="el-icon-s-shop"></i>
        <span slot="title">供应商管理</span>
      </el-menu-item>
      <el-menu-item index="/home/goods">
        <i class="el-icon-s-goods"></i>
        <span slot="title">商品管理</span>
      </el-menu-item>
      <el-menu-item index="/home/member">
        <i class="el-icon-s-custom"></i>
        <span slot="title">员工管理</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>


<style scoped>
.el-menu {
  border-right: 0px !important;
}
.el-aside{
    padding-left: 0
}
.el-menu-item{
    text-align: left
}
</style>