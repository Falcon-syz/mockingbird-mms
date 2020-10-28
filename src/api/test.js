import request from "@/utils/request"

// const BASE_URL = process.env.VUE_APP_BASE_API

//测试请求
// request({
//     method: 'get',
//     url: '/api/test.json',
// }).then(response => {
//     console.log(response.data)
// })

export default {
    getlist() {
        const req = request({
            method: 'get',
            url:'/test.json',
        });
        return req
    }
}