import request from "@/utils/request"

export default {
    search(page, size, searchMap) {
        return request({
            url: `/supplier/list/search/${page}/${size}`,
            method: "post",
            data: searchMap
        })
    },
    addSupplier(from) {
        return request({
            url: "/supplier",
            method: "post",
            data: from
        })
    },
    getSupplier(id) {
        return request({
            url: `/supplier/${id}`,
            method: "get",
        })
    },
    updataSupplier(pojo) {
        return request({
            url: `/supplier/${pojo.id}`,
            method: "put",
            data: pojo
        })
    },
    deleteSupplier(id) {
        return request({
            url: `/supplier/${id}`,
            method: "delete",
        })
    }
}