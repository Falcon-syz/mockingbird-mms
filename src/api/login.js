import request from "@/utils/request"

export function login(username, password) {
    return request({
        url: "/user/login",
        method: 'post',
        data: {
            username,
            password
        }
    })
}

export function getUser(token) {
    return request({
        url: `/user/info/${token}`,
        method: "get"
    })
}

export function logout(token) {
    // console.log(111)
    return request({
        url: "/user/logout",
        method: "post",
        data: {
            token
        }
    })
}