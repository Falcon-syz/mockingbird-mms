import request from "@/utils/request"

export default {
    search(page, size, searchMap) {
        return request({
            url: `/goods/list/search/${page}/${size}`,
            method: "post",
            data: searchMap
        })
    },
    addGoods(from) {
        return request({
            url: "/goods",
            method: "post",
            data: from
        })
    },
    getGoods(id) {
        return request({
            url: `/goods/${id}`,
            method: "get",
        })
    },
    updataGoods(pojo) {
        return request({
            url: `/goods/${pojo.id}`,
            method: "put",
            data: pojo
        })
    },
    deleteGoods(id) {
        return request({
            url: `/goods/${id}`,
            method: "delete",
        })
    }
}