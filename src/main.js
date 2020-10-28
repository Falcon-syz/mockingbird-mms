import Vue from "vue";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from "./App.vue";
import router from "./router";
import "./permission"

// import response from "./utils/request"
// import test from "./api/test"

Vue.use(ElementUI);

//控制台错误日志
Vue.config.productionTip = process.env.NODE_ENV === "production";

console.log(process.env.VUE_APP_SERVICE_URL)
console.log(process.env.VUE_APP_BASE_API)

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
