import Vue from "vue";
import VueRouter from "vue-router";
import login from "../views/login/index"
import layout from "@/components/layout"

import home from "@/views/home"
import user from "@/views/user"
import supplier from "@/views/supplier"
import goods from "@/views/goods"
import member from "@/views/member"

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: '/login'
  },
  {
    path: "/login",
    name: "login",
    component: login
  },
  {
    path:"/home",
    component:layout,
    children:[
      {
        path:"",
        name:"homePage",
        meta:{
          title:"首页"
        },
        component:home
      },
      {
        path:"user",
        name:"user",
        meta:{
          title:"会员管理"
        },
        component:user
      },
      {
        path:"supplier",
        name:"supplier",
        meta:{
          title:"供应商管理"
        },
        component:supplier
      },
      {
        path:"goods",
        name:"goods",
        meta:{
          title:"商品管理"
        },
        component:goods
      },
      {
        path:"member",
        name:"member",
        meta:{
          title:"员工管理"
        },
        component:member
      }
    ]
  }
];

const router = new VueRouter({
  // mode: "history",
  // base: process.env.BASE_URL,
  routes
});

export default router;
