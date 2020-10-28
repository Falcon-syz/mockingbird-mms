//权限校验
import router from "./router"
import { getUser } from "@/api/login"

router.beforeEach((to, from, next) => {
    // 1.获取token
    console.log("开始获取")
    const token = localStorage.getItem("mocking-user-token")
    if (!token) {
        // 1.1如果没有获取到，不让访问非登陆页面，转到/login
        console.log('没获取到token')
        if (to.path === '/login'||to.path==='/') { //这就是跳出循环的关键
            next()
        } else {
            next('/login')
        }

    } else {
        // 1.2如果获取到token
        console.log("获取到token")
        if (to.path === "/login" || to.path === "/") {
            // 1.2.1要访问login,则直接转到login
            next()
        } else {
            // 1.2.2要访问非登录页
            // 1.2.2.1拿token去本地找用户信息
            const user = localStorage.getItem("mocking-user")
            if (user) {
                // 1.2.2.1.1有用户信息，则直接转到目标页面
                next()
            } else {
                // 1.2.2.1.2没有用户信息，发送token到服务器获取对应用户信息
                getUser(token).then(resp => {
                    if (resp.data.flag) {
                        // 1.2.2.1.2.1获取到用户信息,存到本地,转到目标页面
                        localStorage.setItem("mocking-user", JSON.stringify(resp.data))
                        next()
                    } else {
                        // 1.2.2.1.2.2没有获取到用户信息,返回login页
                        next({ path: "/login" })
                    }
                })
            }

        }
    }
})